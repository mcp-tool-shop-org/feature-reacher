/**
 * Feature Extractor
 *
 * Extracts candidate features from artifacts using deterministic heuristics.
 * No ML—just clear, explainable patterns.
 */

import type { Artifact, ArtifactId } from "@/domain";
import {
  type Feature,
  type FeatureId,
  type Evidence,
  createFeature,
  createEvidence,
  mergeFeatureMention,
} from "@/domain";
import type { SignalType } from "@/domain";

/**
 * A candidate feature mention extracted from text.
 */
interface FeatureMention {
  name: string;
  excerpt: string;
  location: string;
  confidence: number;
  signalType: SignalType;
}

/**
 * Result of feature extraction from an artifact.
 */
export interface ExtractionResult {
  features: Feature[];
  evidence: Evidence[];
  ambiguities: string[];
}

/**
 * Generates a unique feature ID from a name.
 */
function generateFeatureId(name: string): FeatureId {
  return `feature_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
}

/**
 * Extracts feature mentions from headings.
 * Headings are high-confidence feature indicators.
 */
function extractFromHeadings(artifact: Artifact): FeatureMention[] {
  const mentions: FeatureMention[] = [];

  for (const heading of artifact.headings) {
    // Skip generic headings
    if (isGenericHeading(heading)) continue;

    // Skip very long headings (likely sentences, not feature names)
    if (heading.split(/\s+/).length > 6) continue;

    mentions.push({
      name: normalizeFeatureName(heading),
      excerpt: heading,
      location: `Heading: "${heading}"`,
      confidence: 0.85,
      signalType: "documentation",
    });
  }

  return mentions;
}

/**
 * Extracts feature mentions from bullet lists.
 * Bullet points often enumerate features.
 */
function extractFromBullets(artifact: Artifact): FeatureMention[] {
  const mentions: FeatureMention[] = [];
  const content = artifact.normalizedContent;

  // Match bullet points (-, *, •, or numbered)
  const bulletPattern = /^[\s]*[-*•]\s+(.+)$|^[\s]*\d+[.)]\s+(.+)$/gm;
  const matches = content.matchAll(bulletPattern);

  for (const match of matches) {
    const bulletText = (match[1] || match[2]).trim();

    // Skip very long bullets (sentences, not features)
    if (bulletText.length > 100) continue;

    // Skip bullets that look like descriptions
    if (bulletText.includes(" is ") || bulletText.includes(" are ")) continue;

    // Look for feature-like patterns
    const featureName = extractFeatureFromBullet(bulletText);
    if (featureName) {
      mentions.push({
        name: featureName,
        excerpt: bulletText,
        location: `Bullet: "${bulletText.slice(0, 50)}..."`,
        confidence: 0.7,
        signalType: inferSignalType(artifact.type, bulletText),
      });
    }
  }

  return mentions;
}

/**
 * Extracts feature mentions from repeated noun phrases.
 * If something is mentioned multiple times, it's likely important.
 */
function extractFromRepeatedPhrases(artifact: Artifact): FeatureMention[] {
  const mentions: FeatureMention[] = [];
  const content = artifact.normalizedContent.toLowerCase();

  // Find capitalized phrases (likely proper nouns / feature names)
  const capitalizedPattern = /\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\b/g;
  const originalContent = artifact.normalizedContent;
  const matches = originalContent.matchAll(capitalizedPattern);

  const phraseCounts = new Map<string, { count: number; excerpts: string[] }>();

  for (const match of matches) {
    const phrase = match[1];

    // Skip common words
    if (isCommonWord(phrase)) continue;

    // Skip very short or very long phrases
    if (phrase.length < 3 || phrase.split(/\s+/).length > 4) continue;

    const key = phrase.toLowerCase();
    const existing = phraseCounts.get(key) ?? { count: 0, excerpts: [] };
    existing.count++;

    // Capture context around the mention
    const startIdx = Math.max(0, (match.index ?? 0) - 30);
    const endIdx = Math.min(originalContent.length, (match.index ?? 0) + phrase.length + 30);
    const excerpt = originalContent.slice(startIdx, endIdx).trim();
    if (existing.excerpts.length < 3) {
      existing.excerpts.push(excerpt);
    }

    phraseCounts.set(key, existing);
  }

  // Only consider phrases mentioned 2+ times
  for (const [phrase, data] of phraseCounts) {
    if (data.count >= 2) {
      mentions.push({
        name: normalizeFeatureName(phrase),
        excerpt: data.excerpts.join(" | "),
        location: `Repeated ${data.count} times`,
        confidence: Math.min(0.6 + data.count * 0.05, 0.8),
        signalType: "documentation",
      });
    }
  }

  return mentions;
}

/**
 * Checks if a heading is generic (Introduction, Overview, etc.)
 */
function isGenericHeading(heading: string): boolean {
  const generic = [
    "introduction",
    "overview",
    "getting started",
    "quick start",
    "installation",
    "setup",
    "requirements",
    "prerequisites",
    "contents",
    "table of contents",
    "summary",
    "conclusion",
    "appendix",
    "references",
    "changelog",
    "release notes",
    "version history",
    "about",
    "license",
    "contributing",
    "support",
    "contact",
    "faq",
    "frequently asked questions",
  ];

  return generic.includes(heading.toLowerCase().trim());
}

/**
 * Normalizes a feature name for consistent comparison.
 */
function normalizeFeatureName(name: string): string {
  return name
    .trim()
    .replace(/^(the|a|an)\s+/i, "") // Remove articles
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/[^\w\s-]/g, ""); // Remove special chars
}

/**
 * Checks if a word is too common to be a feature name.
 */
function isCommonWord(word: string): boolean {
  const common = [
    "the",
    "and",
    "for",
    "with",
    "you",
    "your",
    "this",
    "that",
    "from",
    "have",
    "will",
    "can",
    "more",
    "new",
    "now",
    "see",
    "use",
    "using",
    "used",
    "also",
    "just",
    "like",
    "make",
    "made",
    "when",
    "what",
    "how",
    "why",
    "all",
    "any",
    "some",
    "each",
    "other",
    "here",
    "there",
    "note",
    "important",
    "example",
    "examples",
    "version",
    "please",
    "learn",
    "read",
    "check",
  ];

  return common.includes(word.toLowerCase());
}

/**
 * Extracts a feature name from a bullet point text.
 */
function extractFeatureFromBullet(text: string): string | null {
  // Pattern: "Feature Name - description" or "Feature Name: description"
  const colonPattern = /^([^:-]+)[-:]\s+/;
  const match = text.match(colonPattern);
  if (match) {
    const name = match[1].trim();
    if (name.length >= 3 && name.split(/\s+/).length <= 4) {
      return normalizeFeatureName(name);
    }
  }

  // Pattern: Short phrase that starts with a capital letter
  if (text.length <= 40 && /^[A-Z]/.test(text)) {
    // Remove trailing punctuation
    const name = text.replace(/[.!?]+$/, "").trim();
    if (name.split(/\s+/).length <= 4) {
      return normalizeFeatureName(name);
    }
  }

  return null;
}

/**
 * Infers the signal type based on artifact type and context.
 */
function inferSignalType(
  artifactType: string,
  text: string
): SignalType {
  const lowerText = text.toLowerCase();

  if (artifactType === "release_notes") {
    if (lowerText.includes("new") || lowerText.includes("added")) {
      return "update";
    }
    if (lowerText.includes("deprecated") || lowerText.includes("removed")) {
      return "deprecation";
    }
    return "release_note";
  }

  if (artifactType === "faq") {
    return "faq";
  }

  if (artifactType === "onboarding") {
    return "onboarding";
  }

  return "documentation";
}

/**
 * Deduplicates feature mentions by name similarity.
 */
function deduplicateMentions(mentions: FeatureMention[]): FeatureMention[] {
  const seen = new Map<string, FeatureMention>();

  for (const mention of mentions) {
    const key = mention.name.toLowerCase();

    const existing = seen.get(key);
    if (!existing || mention.confidence > existing.confidence) {
      seen.set(key, mention);
    }
  }

  return Array.from(seen.values());
}

/**
 * Extracts features from a single artifact.
 */
export function extractFeaturesFromArtifact(
  artifact: Artifact
): ExtractionResult {
  const ambiguities: string[] = [];

  // Extract mentions using different strategies
  const headingMentions = extractFromHeadings(artifact);
  const bulletMentions = extractFromBullets(artifact);
  const repeatedMentions = extractFromRepeatedPhrases(artifact);

  // Combine and deduplicate
  const allMentions = [
    ...headingMentions,
    ...bulletMentions,
    ...repeatedMentions,
  ];

  const dedupedMentions = deduplicateMentions(allMentions);

  // Log ambiguities
  if (dedupedMentions.length === 0) {
    ambiguities.push(
      `No features extracted from "${artifact.name}". Content may be too generic or unstructured.`
    );
  }

  // Convert to Feature and Evidence objects
  const features: Feature[] = [];
  const evidence: Evidence[] = [];

  for (const mention of dedupedMentions) {
    const featureId = generateFeatureId(mention.name);
    const timestamp = artifact.contentTimestamp ?? artifact.uploadedAt;

    // Create or find existing feature
    let feature = features.find((f) => f.id === featureId);
    if (!feature) {
      feature = createFeature(featureId, mention.name, artifact.id, timestamp);
      features.push(feature);
    } else {
      const idx = features.indexOf(feature);
      features[idx] = mergeFeatureMention(feature, artifact.id, timestamp);
    }

    // Create evidence
    const evidenceId = `evidence_${featureId}_${artifact.id}_${Date.now()}`;
    evidence.push(
      createEvidence(
        evidenceId,
        artifact.id,
        featureId,
        mention.excerpt,
        mention.signalType,
        timestamp,
        {
          location: mention.location,
          confidence: mention.confidence,
        }
      )
    );
  }

  return { features, evidence, ambiguities };
}

/**
 * Merges extraction results from multiple artifacts.
 */
export function mergeExtractionResults(
  results: ExtractionResult[]
): ExtractionResult {
  const featureMap = new Map<FeatureId, Feature>();
  const allEvidence: Evidence[] = [];
  const allAmbiguities: string[] = [];

  for (const result of results) {
    allAmbiguities.push(...result.ambiguities);
    allEvidence.push(...result.evidence);

    for (const feature of result.features) {
      const existing = featureMap.get(feature.id);
      if (existing) {
        // Merge features with same ID
        featureMap.set(feature.id, {
          ...existing,
          aliases: [...new Set([...existing.aliases, ...feature.aliases])],
          sourceArtifacts: [
            ...new Set([...existing.sourceArtifacts, ...feature.sourceArtifacts]),
          ],
          firstSeen:
            feature.firstSeen < existing.firstSeen
              ? feature.firstSeen
              : existing.firstSeen,
          lastSeen:
            feature.lastSeen > existing.lastSeen
              ? feature.lastSeen
              : existing.lastSeen,
        });
      } else {
        featureMap.set(feature.id, feature);
      }
    }
  }

  return {
    features: Array.from(featureMap.values()),
    evidence: allEvidence,
    ambiguities: allAmbiguities,
  };
}
