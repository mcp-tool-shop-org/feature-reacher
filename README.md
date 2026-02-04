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

## Phase 1 Scope

Phase 1 delivers:
- Manual artifact upload (paste or file)
- Feature extraction from text
- Recency and visibility scoring
- Adoption risk diagnoses with evidence
- Ranked audit report
- Exportable summary

Phase 1 intentionally does NOT:
- Connect to analytics platforms
- Integrate with GitHub, Jira, or other tools
- Use ML models for feature detection
- Provide real-time monitoring

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
/src/app       # Next.js app router pages
/src/domain    # Core feature model and business logic
/src/analysis  # Diagnostics, heuristics, scoring
/src/ui        # Reusable UI components
/docs          # Project documentation
```

---

## License

MIT
