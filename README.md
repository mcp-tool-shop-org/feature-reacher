# Feature-Reacher

**Surface underutilized features before they become technical debt.**

Feature-Reacher analyzes your product artifacts (release notes, documentation, FAQs) and produces an **Adoption Risk Audit**—a ranked, evidence-backed list of features that users may never discover.

---

## What This Is

A diagnostic tool that:
- Ingests product documentation and release notes
- Extracts feature mentions with evidence
- Scores features on recency, visibility, and documentation density
- Produces actionable adoption risk diagnoses

## What This Is NOT

- An analytics platform (no usage data ingestion)
- A feature flag system
- A dashboard connected to your codebase
- Magic AI that guesses what users want

This is **explainable intelligence**—every diagnosis comes with cited evidence and clear reasoning.

---

## What Phase 1 Delivers

- **Artifact Upload**: Paste text or upload .txt/.md files
- **Feature Extraction**: Headings, bullet lists, repeated phrases
- **Scoring Heuristics**: Recency decay, visibility signals, documentation density
- **Diagnosis Engine**: 6 diagnosis types with triggering signals and evidence
- **Ranked Audit**: Features ordered by adoption risk
- **Action Recommendations**: Copyable actions per diagnosis
- **Export**: Plain text and printable HTML reports

## What Phase 1 Intentionally Does NOT Do

- Connect to analytics platforms
- Integrate with GitHub, Jira, or other tools
- Use ML models for feature detection
- Provide real-time monitoring
- Require authentication or accounts

This is by design. Phase 1 proves the diagnostic model works before adding complexity.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Quick Test

1. Paste some release notes or documentation
2. Click "Run Audit"
3. Review the ranked feature list
4. Expand features to see evidence and recommendations
5. Export the report

---

## Project Structure

```
/src/app       # Next.js app router pages
/src/domain    # Core feature model and business logic
/src/analysis  # Diagnostics, heuristics, scoring
/src/ui        # Reusable UI components
/docs          # Project documentation
```

### Key Files

- `src/domain/feature.ts` - Canonical Feature model
- `src/domain/diagnosis.ts` - Diagnosis types and severity
- `src/analysis/extractor.ts` - Feature extraction heuristics
- `src/analysis/scoring.ts` - Recency/visibility scoring
- `src/analysis/diagnose.ts` - Diagnosis engine
- `src/analysis/ranking.ts` - Risk ranking and audit generation
- `src/analysis/actions.ts` - Action recommendations
- `src/analysis/export.ts` - Report generation

---

## Architecture

```
Artifact Upload → Text Normalization → Feature Extraction
                                              ↓
                                       Evidence Linking
                                              ↓
                                    Heuristic Scoring
                                              ↓
                                    Diagnosis Generation
                                              ↓
                                      Risk Ranking
                                              ↓
                                    Audit Report + Actions
```

### Design Principles

1. **No magic**: Every diagnosis is explainable with cited evidence
2. **Heuristics first**: No ML until heuristics prove insufficient
3. **Deterministic**: Same input always produces same output
4. **Transparent**: Users can trace any conclusion back to source

---

## License

MIT

---

## Phase 1 Tag

This release is tagged as `phase-1-foundation`.

```bash
git checkout phase-1-foundation
```
