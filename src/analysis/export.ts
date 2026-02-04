/**
 * Export Module
 *
 * Generates shareable audit summaries in various formats.
 */

import type { AdoptionRiskAudit, RankedFeature } from "./ranking";
import { generateHeadline } from "./ranking";
import { getActionsForDiagnosis, formatActionAsText } from "./actions";

/**
 * Generates a plain text summary of the audit.
 */
export function generateTextSummary(audit: AdoptionRiskAudit): string {
  const lines: string[] = [];
  const { summary, rankedFeatures } = audit;

  // Header
  lines.push("═".repeat(60));
  lines.push("FEATURE ADOPTION RISK AUDIT");
  lines.push(`Audit ID: ${summary.auditId}`);
  lines.push("═".repeat(60));
  lines.push("");

  // Scope disclaimer
  lines.push("SCOPE: This audit is based on provided artifacts only");
  lines.push("       (no live usage telemetry).");
  lines.push("");

  // Headline
  lines.push(generateHeadline(audit).toUpperCase());
  lines.push("");

  // Summary stats
  lines.push("SUMMARY");
  lines.push("─".repeat(40));
  lines.push(`Audit ID: ${summary.auditId}`);
  lines.push(`Features Analyzed: ${summary.totalFeatures}`);
  lines.push(`Artifacts Analyzed: ${summary.artifactsAnalyzed}`);
  lines.push(`Evidence Points: ${summary.totalEvidence}`);
  lines.push("");
  lines.push("Risk Breakdown:");
  lines.push(`  Critical: ${summary.byRiskLevel.critical}`);
  lines.push(`  High: ${summary.byRiskLevel.high}`);
  lines.push(`  Medium: ${summary.byRiskLevel.medium}`);
  lines.push(`  Low: ${summary.byRiskLevel.low}`);
  lines.push("");

  // Top risk factors
  if (summary.topRiskFactors.length > 0) {
    lines.push("Top Risk Factors:");
    for (const factor of summary.topRiskFactors) {
      lines.push(`  • ${factor}`);
    }
    lines.push("");
  }

  // At-risk features
  const atRiskFeatures = rankedFeatures.filter((rf) => rf.riskLevel !== "low");

  if (atRiskFeatures.length > 0) {
    lines.push("═".repeat(60));
    lines.push("AT-RISK FEATURES");
    lines.push("═".repeat(60));
    lines.push("");

    for (const rf of atRiskFeatures) {
      lines.push(formatFeatureSection(rf));
      lines.push("");
    }
  }

  // Footer
  lines.push("─".repeat(60));
  lines.push(`Generated: ${new Date(summary.analyzedAt).toLocaleString()}`);
  lines.push("");
  lines.push("HOW TO INTERPRET THIS REPORT");
  lines.push("─".repeat(40));
  lines.push("• Risk scores combine recency, visibility, and documentation signals");
  lines.push("• Higher risk = feature is likely undiscoverable by users");
  lines.push("• Each diagnosis includes cited evidence from your artifacts");
  lines.push("• Recommended actions are suggestions—use your judgment");
  lines.push("");
  lines.push("CONFIDENCE DISCLAIMER");
  lines.push("─".repeat(40));
  lines.push("This analysis is based on text patterns in your documentation.");
  lines.push("It does not have access to actual usage analytics.");
  lines.push("Combine these insights with real user data when available.");

  return lines.join("\n");
}

/**
 * Formats a single feature section for text export.
 */
function formatFeatureSection(rf: RankedFeature): string {
  const lines: string[] = [];
  const { feature, primaryDiagnosis, riskLevel, riskScore, evidence } = rf;

  // Feature header
  lines.push(`[${riskLevel.toUpperCase()}] ${feature.name}`);
  lines.push(`Risk Score: ${Math.round(riskScore * 100)}%`);
  lines.push("");

  // Diagnosis
  if (primaryDiagnosis) {
    lines.push(`Diagnosis: ${primaryDiagnosis.title}`);
    lines.push(`${primaryDiagnosis.explanation}`);
    lines.push("");

    // Why flagged
    if (primaryDiagnosis.triggeringSignals.length > 0) {
      lines.push("Why Flagged:");
      for (const signal of primaryDiagnosis.triggeringSignals) {
        lines.push(`  • ${signal}`);
      }
      lines.push("");
    }

    // Actions
    const actions = getActionsForDiagnosis(
      primaryDiagnosis.type,
      primaryDiagnosis.severity
    ).slice(0, 2);

    if (actions.length > 0) {
      lines.push("Recommended Actions:");
      for (const action of actions) {
        lines.push(`  [${action.priority.toUpperCase()}] ${action.title}`);
        lines.push(`    ${action.description}`);
      }
      lines.push("");
    }
  }

  // Evidence
  if (evidence.length > 0) {
    lines.push(`Evidence (${evidence.length} total):`);
    for (const e of evidence.slice(0, 2)) {
      const location = e.location ?? e.signalType;
      lines.push(`  [${location}]`);
      lines.push(`  "${truncate(e.excerpt, 100)}"`);
    }
  }

  lines.push("─".repeat(40));

  return lines.join("\n");
}

/**
 * Generates an HTML report for printing.
 */
export function generateHtmlReport(audit: AdoptionRiskAudit): string {
  const { summary, rankedFeatures } = audit;
  const headline = generateHeadline(audit);
  const atRiskFeatures = rankedFeatures.filter((rf) => rf.riskLevel !== "low");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Adoption Risk Audit - Feature-Reacher</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    h2 { font-size: 1.25rem; margin: 2rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e5e5; }
    h3 { font-size: 1rem; margin-bottom: 0.5rem; }
    .headline { font-size: 1.5rem; font-weight: bold; margin: 1rem 0; }
    .headline.critical { color: #dc2626; }
    .headline.high { color: #ea580c; }
    .headline.medium { color: #ca8a04; }
    .headline.low { color: #16a34a; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 1rem 0; }
    .stat { background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; text-align: center; }
    .stat-value { font-size: 1.5rem; font-weight: bold; }
    .stat-label { font-size: 0.75rem; color: #666; }
    .feature { background: #fff; border: 1px solid #e5e5e5; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem; }
    .feature-header { display: flex; justify-content: space-between; align-items: start; }
    .feature-name { font-weight: 600; }
    .risk-badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .risk-badge.critical { background: #fee2e2; color: #991b1b; }
    .risk-badge.high { background: #ffedd5; color: #9a3412; }
    .risk-badge.medium { background: #fef9c3; color: #854d0e; }
    .risk-badge.low { background: #dcfce7; color: #166534; }
    .diagnosis { margin-top: 0.5rem; color: #666; }
    .signals { margin-top: 0.5rem; padding-left: 1rem; }
    .signal { font-size: 0.875rem; color: #666; }
    .evidence { background: #f9fafb; padding: 0.5rem; border-radius: 0.25rem; margin-top: 0.5rem; font-size: 0.875rem; }
    .evidence-location { font-size: 0.75rem; color: #999; }
    .action { background: #f0fdf4; padding: 0.5rem; border-radius: 0.25rem; margin-top: 0.5rem; }
    .action-title { font-weight: 500; }
    .action-desc { font-size: 0.875rem; color: #666; margin-top: 0.25rem; }
    .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e5e5; font-size: 0.75rem; color: #666; }
    .disclaimer { background: #fef3c7; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; font-size: 0.875rem; }
    @media print { body { padding: 0; } .feature { break-inside: avoid; } }
  </style>
</head>
<body>
  <h1>Feature Adoption Risk Audit</h1>
  <p style="color: #666; font-size: 0.875rem;">Generated by Feature-Reacher</p>

  <div class="headline ${getHeadlineClass(summary)}">${headline}</div>

  <div class="stats">
    <div class="stat">
      <div class="stat-value">${summary.totalFeatures}</div>
      <div class="stat-label">Features Analyzed</div>
    </div>
    <div class="stat">
      <div class="stat-value" style="color: #dc2626;">${summary.byRiskLevel.critical}</div>
      <div class="stat-label">Critical Risk</div>
    </div>
    <div class="stat">
      <div class="stat-value" style="color: #ea580c;">${summary.byRiskLevel.high}</div>
      <div class="stat-label">High Risk</div>
    </div>
    <div class="stat">
      <div class="stat-value" style="color: #ca8a04;">${summary.byRiskLevel.medium}</div>
      <div class="stat-label">Medium Risk</div>
    </div>
  </div>

  ${atRiskFeatures.length > 0 ? `
  <h2>At-Risk Features</h2>
  ${atRiskFeatures.map((rf) => formatFeatureHtml(rf)).join("\n")}
  ` : `
  <div style="text-align: center; padding: 2rem; background: #f0fdf4; border-radius: 0.5rem; margin: 1rem 0;">
    <p style="color: #166534; font-weight: 500;">No significant adoption risks detected.</p>
  </div>
  `}

  <div class="disclaimer">
    <strong>Confidence Disclaimer:</strong> This analysis is based on text patterns in your documentation.
    It does not have access to actual usage analytics. Combine these insights with real user data when available.
  </div>

  <div class="footer">
    <p>Analyzed: ${new Date(summary.analyzedAt).toLocaleString()}</p>
    <p>${summary.artifactsAnalyzed} artifacts • ${summary.totalEvidence} evidence points</p>
  </div>
</body>
</html>`;
}

function getHeadlineClass(summary: AdoptionRiskAudit["summary"]): string {
  if (summary.byRiskLevel.critical > 0) return "critical";
  if (summary.byRiskLevel.high > 0) return "high";
  if (summary.byRiskLevel.medium > 0) return "medium";
  return "low";
}

function formatFeatureHtml(rf: RankedFeature): string {
  const { feature, primaryDiagnosis, riskLevel, riskScore, evidence } = rf;

  let html = `<div class="feature">
    <div class="feature-header">
      <div>
        <span class="feature-name">${escapeHtml(feature.name)}</span>
        <span class="risk-badge ${riskLevel}">${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}</span>
      </div>
      <div style="font-weight: bold;">${Math.round(riskScore * 100)}%</div>
    </div>`;

  if (primaryDiagnosis) {
    html += `<div class="diagnosis"><strong>${escapeHtml(primaryDiagnosis.title)}</strong>: ${escapeHtml(primaryDiagnosis.explanation)}</div>`;

    if (primaryDiagnosis.triggeringSignals.length > 0) {
      html += `<div class="signals">`;
      for (const signal of primaryDiagnosis.triggeringSignals.slice(0, 3)) {
        html += `<div class="signal">• ${escapeHtml(signal)}</div>`;
      }
      html += `</div>`;
    }

    const actions = getActionsForDiagnosis(
      primaryDiagnosis.type,
      primaryDiagnosis.severity
    ).slice(0, 1);

    if (actions.length > 0) {
      const action = actions[0];
      html += `<div class="action">
        <div class="action-title">[${action.priority.toUpperCase()}] ${escapeHtml(action.title)}</div>
        <div class="action-desc">${escapeHtml(action.description)}</div>
      </div>`;
    }
  }

  if (evidence.length > 0) {
    const e = evidence[0];
    html += `<div class="evidence">
      <div class="evidence-location">${escapeHtml(e.location ?? e.signalType)}</div>
      <div>"${escapeHtml(truncate(e.excerpt, 100))}"</div>
    </div>`;
  }

  html += `</div>`;
  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
