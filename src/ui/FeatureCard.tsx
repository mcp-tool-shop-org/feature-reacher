"use client";

/**
 * Feature Card Component
 *
 * Displays a single feature with its diagnosis and supporting evidence.
 */

import type { RankedFeature } from "@/analysis";
import { RiskBadge } from "./RiskBadge";

interface FeatureCardProps {
  rankedFeature: RankedFeature;
  expanded?: boolean;
  onToggle?: () => void;
}

export function FeatureCard({
  rankedFeature,
  expanded = false,
  onToggle,
}: FeatureCardProps) {
  const { feature, primaryDiagnosis, score, evidence, riskLevel, riskScore } =
    rankedFeature;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {feature.name}
            </h3>
            <RiskBadge level={riskLevel} />
          </div>
          {primaryDiagnosis && (
            <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {primaryDiagnosis.title}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {Math.round(riskScore * 100)}%
          </div>
          <div className="text-xs text-zinc-500">Risk Score</div>
        </div>
      </div>

      {/* Diagnosis explanation */}
      {primaryDiagnosis && (
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {primaryDiagnosis.explanation}
        </p>
      )}

      {/* Toggle button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {expanded ? "Show less" : "Show details"}
        </button>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="mt-4 space-y-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
          {/* Score breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Score Breakdown
            </h4>
            <div className="mt-2 grid grid-cols-3 gap-3">
              <ScoreBar
                label="Recency"
                value={score.recency.score}
                inverted
              />
              <ScoreBar
                label="Visibility"
                value={score.visibility.score}
                inverted
              />
              <ScoreBar
                label="Docs Density"
                value={score.documentationDensity.score}
                inverted
              />
            </div>
          </div>

          {/* Triggering signals */}
          {primaryDiagnosis && primaryDiagnosis.triggeringSignals.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Why Flagged
              </h4>
              <ul className="mt-2 space-y-1">
                {primaryDiagnosis.triggeringSignals.map((signal, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400" />
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Supporting evidence */}
          {evidence.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Evidence ({evidence.length})
              </h4>
              <div className="mt-2 space-y-2">
                {evidence.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    className="rounded bg-zinc-50 p-2 text-sm dark:bg-zinc-800"
                  >
                    <div className="text-xs text-zinc-500 dark:text-zinc-500">
                      {e.location ?? e.signalType}
                    </div>
                    <div className="mt-1 text-zinc-700 dark:text-zinc-300">
                      &ldquo;{truncate(e.excerpt, 150)}&rdquo;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreBar({
  label,
  value,
  inverted = false,
}: {
  label: string;
  value: number;
  inverted?: boolean;
}) {
  // For inverted bars, low values are bad (red), high values are good (green)
  const percentage = Math.round(value * 100);
  const displayValue = inverted ? value : 1 - value;

  const getColor = (v: number) => {
    if (v >= 0.7) return "bg-green-500";
    if (v >= 0.4) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-zinc-500">{label}</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {percentage}%
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-1.5 rounded-full ${getColor(displayValue)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
