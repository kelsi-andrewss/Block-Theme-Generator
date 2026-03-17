"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";

export interface PlaygroundHandle {
  /** Write a file into the running WordPress instance */
  writeFile(path: string, content: string | Uint8Array): Promise<void>;
  /** Run arbitrary PHP in the WordPress instance */
  runPHP(code: string): Promise<{ text: string; exitCode: number } | undefined>;
  /** Refresh the current page in the Playground */
  refresh(): Promise<void>;
  /** Navigate to a path */
  goTo(path: string): Promise<void>;
  /** True when WordPress has booted and is ready for file writes */
  isReady(): boolean;
}

interface WpPlaygroundProps {
  themeName: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

type ViewportSize = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTHS: Record<ViewportSize, number> = {
  desktop: 1200,
  tablet: 768,
  mobile: 375,
};

const VIEWPORT_HEIGHTS: Record<ViewportSize, number> = {
  desktop: 600,
  tablet: 600,
  mobile: 667,
};

const WpPlayground = forwardRef<PlaygroundHandle, WpPlaygroundProps>(
  function WpPlayground({ themeName, onReady, onError }, ref) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientRef = useRef<any>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [statusMessage, setStatusMessage] = useState("Starting WordPress...");
    const [errorMessage, setErrorMessage] = useState("");
    const [viewport, setViewport] = useState<ViewportSize>("desktop");
    const bootedRef = useRef(false);
    const readyRef = useRef(false);

    useImperativeHandle(ref, () => ({
      async writeFile(path: string, content: string | Uint8Array) {
        if (!clientRef.current) return;
        const data =
          typeof content === "string"
            ? new TextEncoder().encode(content)
            : content;
        await clientRef.current.writeFile(path, data);
      },
      async runPHP(code: string) {
        if (!clientRef.current) return undefined;
        return await clientRef.current.run({ code });
      },

      async refresh() {
        if (!clientRef.current) return;
        const url = await clientRef.current.getCurrentURL();
        await clientRef.current.goTo(url || "/");
      },
      async goTo(path: string) {
        if (!clientRef.current) return;
        await clientRef.current.goTo(path);
      },
      isReady() {
        return readyRef.current;
      },
    }));

    const boot = useCallback(async () => {
      if (bootedRef.current || !iframeRef.current) return;
      bootedRef.current = true;

      try {
        const { startPlaygroundWeb } = await import("@wp-playground/client");

        setStatusMessage("Booting WordPress...");
        const client = await startPlaygroundWeb({
          iframe: iframeRef.current,
          remoteUrl: "https://playground.wordpress.net/remote.html",
        });

        clientRef.current = client;
        readyRef.current = true;
        setStatus("ready");
        setStatusMessage("");
        onReady?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Preview failed");
        setStatus("error");
        setErrorMessage(error.message);
        onError?.(error);
      }
    }, [onReady, onError]);

    useEffect(() => {
      boot();
    }, [boot]);

    return (
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1">
            {(Object.keys(VIEWPORT_WIDTHS) as ViewportSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setViewport(size)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewport === size
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="relative rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          {status === "loading" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm">
              <div className="w-8 h-8 border-3 border-zinc-200 dark:border-zinc-700 border-t-blue-600 rounded-full animate-spin" />
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                {statusMessage}
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 p-8">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Preview unavailable
              </p>
              <p className="mt-1 text-xs text-zinc-400 text-center max-w-sm">
                {errorMessage}
              </p>
            </div>
          )}

          <div className="flex justify-center bg-zinc-50 dark:bg-zinc-950">
            <iframe
              ref={iframeRef}
              title={`Preview of ${themeName} theme`}
              className="border-0 bg-white transition-[width] duration-300 ease-in-out"
              style={{
                width: VIEWPORT_WIDTHS[viewport],
                maxWidth: "100%",
                height: VIEWPORT_HEIGHTS[viewport],
              }}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default WpPlayground;
