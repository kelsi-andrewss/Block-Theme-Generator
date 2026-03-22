import { useState, useRef, useEffect } from "react";

export interface SelectedBlockEvent {
  blockName: string;
  blockId: string;
  content: string;
  html: string;
  uid: string | null;
  location?: string;
}

interface IterationChatProps {
  onSendMessage: (message: string, selectedBlock?: SelectedBlockEvent) => Promise<string>;
  onRegenerateLayout: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
  onRedo?: () => void;
  canRedo?: boolean;
  onImageUpload?: (file: File) => void;
  isProcessing?: boolean;
  selectedBlock?: SelectedBlockEvent | null;
  onClearSelection: () => void;
  onApplySitewide?: () => void;
  showGlobalBadge?: boolean;
  isGlobalMode?: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  targetBlock?: string;
  isPromotionPrompt?: boolean;
}

export default function IterationChat({
  onSendMessage,
  onRegenerateLayout,
  onUndo,
  canUndo = false,
  onRedo,
  canRedo = false,
  onImageUpload,
  isProcessing = false,
  selectedBlock,
  onClearSelection,
  onApplySitewide,
  showGlobalBadge = false,
  isGlobalMode = false,
}: IterationChatProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUndoTooltip, setShowUndoTooltip] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "ai",
      content: "I've generated your initial block theme layout! What would you like to tweak? You can ask me to adjust global styles (like colors and typography) or click any block on the right to edit its specific design and content.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  useEffect(() => {
    if (showUndoTooltip) {
      const timer = setTimeout(() => setShowUndoTooltip(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showUndoTooltip]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const messageText = input.trim();
    const currentBlock = selectedBlock ?? undefined;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
      targetBlock: currentBlock?.blockName || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Call parent handler and wait for AI response
    const response = await onSendMessage(messageText, currentBlock);

    // Add AI response to chat
    setMessages((prev) => {
      const newMessages = [...prev, {
        id: (Date.now() + 1).toString(),
        role: "ai" as const,
        content: response,
        timestamp: new Date(),
      }];
      return newMessages;
    });
  }

  const handleInternalUndo = () => {
    if (onUndo) {
      onUndo();
      setShowUndoTooltip(true);
    }
  };

  // Helper to format block names cleanly (e.g. "core/heading" -> "Heading Block")
  function formatBlockName(name: string) {
    if (!name) return "Selected Block";
    const parts = name.split("/");
    const suffix = parts.length > 1 ? parts[1] : name;
    return suffix
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") + " Block";
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex-1">
      {/* Header & Regenerate Action */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0 font-sans">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Iterate Design
        </h3>
        
        <div className="flex items-center gap-2 relative">
          {canUndo && (
            <button
              onClick={handleInternalUndo}
              disabled={isProcessing}
              className="text-xs font-medium px-3 py-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors border border-transparent hover:border-amber-300 dark:hover:border-amber-700 focus:ring-2 focus:ring-amber-400 focus:outline-none disabled:opacity-50 font-sans"
            >
              Undo
            </button>
          )}
          {canRedo && (
            <button
              onClick={onRedo}
              disabled={isProcessing}
              className="text-xs font-medium px-3 py-1.5 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors border border-transparent hover:border-indigo-300 dark:hover:border-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-50 font-sans"
            >
              Redo
            </button>
          )}
          {showUndoTooltip && (
            <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 font-sans">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 font-sans">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white leading-tight">
                    Not what you wanted?
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                    Check out our design tips to learn how to guide the AI better.
                  </p>
                  <a 
                    href="/design-tips" 
                    target="_blank"
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-flex items-center gap-1 font-sans"
                    onClick={() => setShowUndoTooltip(false)}
                  >
                    See tips and tricks
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <button 
                  onClick={() => setShowUndoTooltip(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="absolute -top-1 right-8 w-2 h-2 bg-white dark:bg-zinc-800 border-l border-t border-zinc-200 dark:border-zinc-700 rotate-45"></div>
            </div>
          )}
          <button
            onClick={onRegenerateLayout}
            className="text-xs font-medium px-3 py-1.5 rounded-md bg-zinc-200/50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 focus:ring-2 focus:ring-zinc-400 focus:outline-none font-sans"
          >
            Regenerate Layout
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-50/30 dark:bg-zinc-950/30 font-sans">
        {messages.map((ms, idx) => (
          <div key={ms.id} className={`flex flex-col max-w-[85%] ${ms.role === "user" ? "ml-auto" : "mr-auto"}`}>
            
            <div className={`
              px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative group
              ${ms.role === "user" 
                ? "bg-blue-600 text-white rounded-br-sm" 
                : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 border text-zinc-900 dark:text-zinc-100 rounded-bl-sm"}
            `}>
              {/* Target block context badge if it was a targeted prompt */}
              {ms.targetBlock && ms.role === "user" && (
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-black text-blue-200 mb-1.5 font-sans">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  Target: {formatBlockName(ms.targetBlock)}
                </div>
              )}
              {ms.content}

              {/* One-Click Global Promotion Badge */}
              {idx === messages.length - 1 && ms.role === "ai" && showGlobalBadge && onApplySitewide && (
                <button
                  onClick={onApplySitewide}
                  className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-orange-200 dark:border-orange-800/50 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all font-sans"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Apply to all pages?
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="max-w-[85%] mr-auto font-sans">
             <div className="px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 border text-zinc-500 rounded-bl-sm shadow-sm flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shrink-0 font-sans">
        
        {/* Context Banners */}
        <div className="flex flex-col gap-1.5 mb-2">
          {isGlobalMode && (
            <div className="mx-1 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-700 dark:text-orange-400 font-sans">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Sitewide Edit Mode
            </div>
          )}
          
          {selectedBlock && (
            <div className="mx-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-bottom-2 font-sans">
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 font-sans">
                <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span className="font-semibold font-sans">{formatBlockName(selectedBlock.blockName)}</span> selected
              </div>
              <div className="flex items-center gap-1">
                {onImageUpload && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden font-sans"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onImageUpload(file);
                        e.target.value = "";
                      }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors font-sans"
                      title="Replace with image"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </>
                )}
                <button
                  onClick={onClearSelection}
                  className="text-blue-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors font-sans"
                  title="Clear selection"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="relative flex items-end font-sans">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder={
              isGlobalMode
                ? "Tweak styles across the entire site..."
                : selectedBlock 
                  ? "Describe how to change this block..." 
                  : "Type here to tweak colors, fonts, or copy..."
            }
            className="w-full bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-xl pl-4 pr-20 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent dark:border-zinc-800 custom-scrollbar shadow-inner text-sm disabled:opacity-50 transition-all placeholder:text-zinc-400 font-sans"
            rows={Math.min(Math.max(input.split('\n').length, 1), 4)}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1.5 font-sans">
            <a
              href="/design-tips"
              target="_blank"
              title="Design Tips & Tricks"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-sans"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm font-sans"
            >
              <svg className="w-4 h-4 translate-x-px translate-y-px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
