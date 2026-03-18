import { useState, useRef, useEffect } from "react";

export interface SelectedBlockEvent {
  blockName: string;
  clientId: string;
  content: string;
  html: string;
}

interface IterationChatProps {
  onSendMessage: (message: string, selectedBlock?: SelectedBlockEvent) => void;
  onRegenerateLayout: () => void;
  isProcessing?: boolean;
  selectedBlock?: SelectedBlockEvent | null;
  onClearSelection: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  targetBlock?: string;
}

export default function IterationChat({
  onSendMessage,
  onRegenerateLayout,
  isProcessing = false,
  selectedBlock,
  onClearSelection,
}: IterationChatProps) {
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

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      targetBlock: selectedBlock?.blockName || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Call parent handler (which will talk to the API)
    onSendMessage(input.trim(), selectedBlock ?? undefined);
    
    setInput("");
  }

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
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Iterate Design
        </h3>
        
        <button
          onClick={onRegenerateLayout}
          className="text-xs font-medium px-3 py-1.5 rounded-md bg-zinc-200/50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 focus:ring-2 focus:ring-zinc-400 focus:outline-none"
        >
          Regenerate Layout
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-50/30 dark:bg-zinc-950/30">
        {messages.map((ms) => (
          <div key={ms.id} className={`flex flex-col max-w-[85%] ${ms.role === "user" ? "ml-auto" : "mr-auto"}`}>
            
            <div className={`
              px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
              ${ms.role === "user" 
                ? "bg-blue-600 text-white rounded-br-sm" 
                : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 border text-zinc-900 dark:text-zinc-100 rounded-bl-sm"}
            `}>
              {/* Target block context badge if it was a targeted prompt */}
              {ms.targetBlock && ms.role === "user" && (
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-blue-200 mb-1.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  Target: {formatBlockName(ms.targetBlock)}
                </div>
              )}
              {ms.content}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="max-w-[85%] mr-auto">
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
      <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
        
        {/* Selected Block Context Banner */}
        {selectedBlock && (
          <div className="mb-2 mx-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span className="font-semibold">{formatBlockName(selectedBlock.blockName)}</span> selected
            </div>
            <button 
              onClick={onClearSelection}
              className="text-blue-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
              title="Clear selection"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="relative flex items-end">
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
              selectedBlock 
                ? "Describe how to change this block..." 
                : "Type here to tweak colors, fonts, or copy..."
            }
            className="w-full bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-xl pl-4 pr-12 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent dark:border-zinc-800 custom-scrollbar shadow-inner text-sm disabled:opacity-50 transition-all placeholder:text-zinc-400"
            rows={Math.min(Math.max(input.split('\n').length, 1), 4)}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 translate-x-px translate-y-px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
