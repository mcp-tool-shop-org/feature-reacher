/**
 * Analysis Layer
 *
 * Diagnostics, heuristics, and scoring logic.
 * Feature extraction, risk assessment, and evidence gathering live here.
 */

// Text normalization
export {
  normalizeText,
  extractHeadings,
  chunkContent,
  detectTimestamp,
} from "./normalizer";

// Artifact ingestion
export type { PastedTextInput, FileUploadInput, IngestResult } from "./ingest";
export {
  ingestPastedText,
  ingestUploadedFile,
  validateArtifact,
} from "./ingest";

// Feature extraction
export type { ExtractionResult } from "./extractor";
export {
  extractFeaturesFromArtifact,
  mergeExtractionResults,
} from "./extractor";

// Scoring heuristics
export type {
  ScoreBreakdown,
  ScoreFactor,
  FeatureScore,
  ScoringConfig,
} from "./scoring";
export {
  calculateRecencyScore,
  calculateVisibilityScore,
  calculateDensityScore,
  calculateAdoptionRisk,
  scoreFeature,
  scoreAllFeatures,
} from "./scoring";

// Diagnosis engine
export {
  diagnoseFeature,
  diagnoseAllFeatures,
  getPrimaryDiagnosis,
} from "./diagnose";
