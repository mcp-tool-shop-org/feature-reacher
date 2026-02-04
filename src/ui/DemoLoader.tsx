"use client";

/**
 * Demo Loader Component
 *
 * Loads curated demo artifacts for instant "wow" experience.
 */

import { useState } from "react";

interface DemoLoaderProps {
  onLoad: (artifacts: { content: string; name: string }[]) => void;
  disabled?: boolean;
}

const DEMO_FILES = [
  { path: "/demo/saas-changelog.md", name: "Acme Changelog (v2.0-3.2)" },
  { path: "/demo/help-center.md", name: "Acme Help Center" },
  { path: "/demo/faq.txt", name: "Acme FAQ" },
];

export function DemoLoader({ onLoad, disabled }: DemoLoaderProps) {
  const [loading, setLoading] = useState(false);

  const handleLoadDemo = async () => {
    setLoading(true);

    try {
      const artifacts = await Promise.all(
        DEMO_FILES.map(async (file) => {
          const response = await fetch(file.path);
          const content = await response.text();
          return { content, name: file.name };
        })
      );

      onLoad(artifacts);
    } catch (error) {
      console.error("Failed to load demo data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-medium text-blue-900 dark:text-blue-100">
            Try with demo data
          </h3>
          <p className="mt-0.5 text-sm text-blue-700 dark:text-blue-300">
            Load sample SaaS product docs to see Feature-Reacher in action
          </p>
        </div>
        <button
          onClick={handleLoadDemo}
          disabled={loading || disabled}
          className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </span>
          ) : (
            "Load Demo Data"
          )}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {DEMO_FILES.map((file) => (
          <span
            key={file.path}
            className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-800 dark:text-blue-200"
          >
            {file.name}
          </span>
        ))}
      </div>
    </div>
  );
}
