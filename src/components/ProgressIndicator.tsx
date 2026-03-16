"use client";

interface Step {
  name: string;
  status: "pending" | "active" | "done" | "error";
}

interface ProgressIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export default function ProgressIndicator({
  currentStep,
  steps,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <div key={step.name} className="flex gap-4">
              {/* Circle and connector line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                    step.status === "done"
                      ? "bg-green-500 text-white"
                      : step.status === "active"
                        ? "bg-blue-600 text-white animate-pulse"
                        : step.status === "error"
                          ? "bg-red-500 text-white"
                          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {step.status === "done" ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : step.status === "error" ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-8 ${
                      step.status === "done"
                        ? "bg-green-500"
                        : "bg-zinc-200 dark:bg-zinc-700"
                    }`}
                  />
                )}
              </div>

              {/* Label */}
              <div className="pt-1 pb-4">
                <p
                  className={`text-sm font-medium ${
                    step.status === "done"
                      ? "text-green-600 dark:text-green-400"
                      : step.status === "active"
                        ? "text-blue-600 dark:text-blue-400"
                        : step.status === "error"
                          ? "text-red-600 dark:text-red-400"
                          : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {step.name}
                </p>
                {step.status === "active" && (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                    Processing...
                  </p>
                )}
                {step.status === "error" && (
                  <p className="text-xs text-red-500 mt-0.5">
                    Failed
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
