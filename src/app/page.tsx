"use client";

import { useState, useCallback } from "react";
import type { Artifact, ArtifactType } from "@/domain";
import {
  ingestPastedText,
  ingestUploadedFile,
  extractFeaturesFromArtifact,
  mergeExtractionResults,
  scoreAllFeatures,
  diagnoseAllFeatures,
  generateAudit,
  generateHeadline,
  type AdoptionRiskAudit,
} from "@/analysis";
import {
  ArtifactUpload,
  ArtifactList,
  AuditSummary,
  FeatureCard,
  ExportButtons,
} from "@/ui";

export default function Home() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [audit, setAudit] = useState<AdoptionRiskAudit | null>(null);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUpload = useCallback(
    (content: string, name: string, type?: ArtifactType) => {
      try {
        const result = name.includes(".")
          ? ingestUploadedFile({ content, filename: name, type })
          : ingestPastedText({ content, name, type });

        setArtifacts((prev) => [...prev, result.artifact]);
        setAudit(null); // Clear previous audit when new artifact added
      } catch (error) {
        console.error("Failed to ingest artifact:", error);
      }
    },
    []
  );

  const handleRemove = useCallback((id: string) => {
    setArtifacts((prev) => prev.filter((a) => a.id !== id));
    setAudit(null);
  }, []);

  const handleAnalyze = useCallback(() => {
    if (artifacts.length === 0) return;

    setIsAnalyzing(true);

    // Simulate async for UI feedback
    setTimeout(() => {
      try {
        // Extract features from all artifacts
        const extractionResults = artifacts.map((a) =>
          extractFeaturesFromArtifact(a)
        );
        const merged = mergeExtractionResults(extractionResults);

        // Score all features
        const scores = scoreAllFeatures(
          merged.features,
          merged.evidence,
          artifacts
        );

        // Generate diagnoses
        const diagnoses = diagnoseAllFeatures(
          merged.features,
          scores,
          merged.evidence
        );

        // Generate the audit
        const newAudit = generateAudit(
          merged.features,
          scores,
          diagnoses,
          merged.evidence,
          artifacts.length
        );

        setAudit(newAudit);
      } catch (error) {
        console.error("Analysis failed:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 100);
  }, [artifacts]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Feature-Reacher
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Surface underutilized features before they become technical debt
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main content */}
          <div className="space-y-6">
            {/* Audit results */}
            {audit && (
              <>
                <AuditSummary
                  summary={audit.summary}
                  headline={generateHeadline(audit)}
                />

                {/* Export options */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Export Report
                  </h2>
                  <ExportButtons audit={audit} />
                </div>

                <div>
                  <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    At-Risk Features
                  </h2>
                  <div className="space-y-4">
                    {audit.rankedFeatures
                      .filter((rf) => rf.riskLevel !== "low")
                      .map((rf) => (
                        <FeatureCard
                          key={rf.feature.id}
                          rankedFeature={rf}
                          expanded={expandedFeature === rf.feature.id}
                          onToggle={() =>
                            setExpandedFeature(
                              expandedFeature === rf.feature.id
                                ? null
                                : rf.feature.id
                            )
                          }
                        />
                      ))}
                    {audit.rankedFeatures.filter((rf) => rf.riskLevel !== "low")
                      .length === 0 && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-900/20">
                        <p className="text-green-700 dark:text-green-400">
                          No significant adoption risks detected. Your features
                          appear well-surfaced!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Low risk features (collapsed) */}
                {audit.rankedFeatures.filter((rf) => rf.riskLevel === "low")
                  .length > 0 && (
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                      {
                        audit.rankedFeatures.filter(
                          (rf) => rf.riskLevel === "low"
                        ).length
                      }{" "}
                      healthy features (low risk)
                    </summary>
                    <div className="mt-4 space-y-4">
                      {audit.rankedFeatures
                        .filter((rf) => rf.riskLevel === "low")
                        .map((rf) => (
                          <FeatureCard
                            key={rf.feature.id}
                            rankedFeature={rf}
                            expanded={expandedFeature === rf.feature.id}
                            onToggle={() =>
                              setExpandedFeature(
                                expandedFeature === rf.feature.id
                                  ? null
                                  : rf.feature.id
                              )
                            }
                          />
                        ))}
                    </div>
                  </details>
                )}
              </>
            )}

            {/* Empty state */}
            {!audit && artifacts.length === 0 && (
              <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
                <svg
                  className="mx-auto h-12 w-12 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  No artifacts yet
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Upload your product documentation, release notes, or FAQs to
                  get started.
                </p>
              </div>
            )}

            {/* Ready to analyze */}
            {!audit && artifacts.length > 0 && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-900 dark:bg-blue-900/20">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">
                  Ready to analyze
                </h3>
                <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  {artifacts.length} artifact{artifacts.length !== 1 ? "s" : ""}{" "}
                  uploaded. Click below to run the adoption risk audit.
                </p>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {isAnalyzing ? "Analyzing..." : "Run Audit"}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ArtifactUpload onUpload={handleUpload} />
            <ArtifactList artifacts={artifacts} onRemove={handleRemove} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <p className="text-center text-xs text-zinc-500">
            Feature-Reacher Phase 1 &mdash; Explainable intelligence for feature
            adoption
          </p>
        </div>
      </footer>
    </div>
  );
}
