/**
 * Artifact Ingestion Pipeline
 *
 * Handles the intake of raw artifacts and prepares them for analysis.
 */

import {
  type Artifact,
  type ArtifactId,
  type ArtifactType,
  createArtifact,
  inferArtifactType,
} from "@/domain";
import {
  normalizeText,
  extractHeadings,
  detectTimestamp,
} from "./normalizer";

/**
 * Generates a unique artifact ID.
 */
function generateArtifactId(): ArtifactId {
  return `artifact_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Input for ingesting a pasted text artifact.
 */
export interface PastedTextInput {
  content: string;
  name?: string;
  type?: ArtifactType;
}

/**
 * Input for ingesting an uploaded file artifact.
 */
export interface FileUploadInput {
  content: string;
  filename: string;
  type?: ArtifactType;
}

/**
 * Result of artifact ingestion.
 */
export interface IngestResult {
  artifact: Artifact;
  warnings: string[];
}

/**
 * Ingests pasted text content.
 */
export function ingestPastedText(input: PastedTextInput): IngestResult {
  const warnings: string[] = [];

  const rawContent = input.content;

  // Validate content
  if (!rawContent.trim()) {
    throw new Error("Content cannot be empty");
  }

  // Warn about very short content
  const wordCount = rawContent.split(/\s+/).filter(Boolean).length;
  if (wordCount < 20) {
    warnings.push(
      "Content is very short. Analysis may be limited."
    );
  }

  // Normalize content
  const normalizedContent = normalizeText(rawContent);

  // Extract headings
  const headings = extractHeadings(normalizedContent);

  // Detect timestamp
  const contentTimestamp = detectTimestamp(normalizedContent);

  // Infer or use provided type
  const type =
    input.type ?? inferArtifactType(input.name ?? "untitled", normalizedContent);

  // Create artifact
  const artifact = createArtifact(
    generateArtifactId(),
    input.name ?? "Pasted content",
    type,
    rawContent,
    normalizedContent,
    {
      contentTimestamp,
      headings,
    }
  );

  return { artifact, warnings };
}

/**
 * Ingests an uploaded file.
 */
export function ingestUploadedFile(input: FileUploadInput): IngestResult {
  const warnings: string[] = [];

  const rawContent = input.content;

  // Validate content
  if (!rawContent.trim()) {
    throw new Error("File content cannot be empty");
  }

  // Check file extension
  const extension = input.filename.split(".").pop()?.toLowerCase();
  if (extension && !["txt", "md", "markdown"].includes(extension)) {
    warnings.push(
      `File type .${extension} may not be fully supported. Best results with .txt or .md files.`
    );
  }

  // Warn about very short content
  const wordCount = rawContent.split(/\s+/).filter(Boolean).length;
  if (wordCount < 20) {
    warnings.push(
      "File content is very short. Analysis may be limited."
    );
  }

  // Normalize content
  const normalizedContent = normalizeText(rawContent);

  // Extract headings
  const headings = extractHeadings(normalizedContent);

  // Detect timestamp
  const contentTimestamp = detectTimestamp(normalizedContent);

  // Infer or use provided type
  const type =
    input.type ?? inferArtifactType(input.filename, normalizedContent);

  // Create artifact
  const artifact = createArtifact(
    generateArtifactId(),
    input.filename,
    type,
    rawContent,
    normalizedContent,
    {
      contentTimestamp,
      headings,
    }
  );

  return { artifact, warnings };
}

/**
 * Validates artifact content quality.
 */
export function validateArtifact(artifact: Artifact): string[] {
  const issues: string[] = [];

  if (artifact.wordCount < 10) {
    issues.push("Content is too short for meaningful analysis");
  }

  if (artifact.headings.length === 0 && artifact.wordCount > 100) {
    issues.push(
      "No headings detected. Consider adding section headers for better analysis."
    );
  }

  if (artifact.type === "unknown") {
    issues.push(
      "Could not determine content type. Manual classification may improve results."
    );
  }

  return issues;
}
