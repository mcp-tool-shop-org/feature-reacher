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
