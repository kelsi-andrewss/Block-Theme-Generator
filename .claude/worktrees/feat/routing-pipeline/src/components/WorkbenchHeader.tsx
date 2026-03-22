"use client";

import { useState } from "react";

export interface WorkbenchHeaderProps {
  files: string[];
  activeFile: string;
  openFiles: string[];
  onFileSelect: (fileName: string) => void;
  onFileClose: (fileName: string) => void;
  mode: 'edit' | 'preview';
  onModeChange: (mode: 'edit' | 'preview') => void;
  isGlobalScope?: boolean;
}

const PAGE_LABELS: Record<string, string> = {
  'front-page.html': 'Home',
  'index.html': 'Home',
  '404.html': '404',
};

function getPageLabel(f: string): string {
  if (PAGE_LABELS[f]) return PAGE_LABELS[f];
  if (f.startsWith('pages/')) {
    const slug = f.replace('pages/', '');
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  }
  return f.replace('.html', '');
}

export default function WorkbenchHeader({
  files,
  activeFile,
  openFiles,
  onFileSelect,
  onFileClose,
  mode,
  onModeChange,
  isGlobalScope = false,
}: WorkbenchHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pages = files.filter(f => !f.includes('parts/'));
  const globals = files.filter(f => f.includes('parts/'));

  return (
    <div className="flex flex-col w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0 relative z-40">
      {/* Top Bar: Dropdown, Mode Toggle, and Scope Indicator */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="flex items-center gap-3">
          {/* File Tree Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shadow-sm"
            >
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Site Pages
              <svg className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-100 overflow-hidden max-h-[60vh] overflow-y-auto">
                  {/* Pages */}
                  <div className="px-4 py-1 mb-1">
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Pages</p>
                  </div>
                  {pages.map(f => (
                    <button
                      key={f}
                      onClick={() => { onFileSelect(f); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2 ${activeFile === f ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-900/10' : 'text-zinc-600 dark:text-zinc-400'}`}
                    >
                      <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {getPageLabel(f)}
                    </button>
                  ))}

                  {/* Global Components */}
                  {globals.length > 0 && (
                    <>
                      <div className="px-4 py-1 mt-3 mb-1 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Global Components</p>
                      </div>
                      {globals.map(f => (
                        <button
                          key={f}
                          onClick={() => { onFileSelect(f); setIsDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 flex items-center gap-2 ${activeFile === f ? 'text-orange-600 dark:text-orange-400 font-bold bg-orange-50/50 dark:bg-orange-900/10' : 'text-zinc-500 dark:text-zinc-500'}`}
                        >
                          <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                          <span>{f.replace('parts/', '').replace('.html', '').charAt(0).toUpperCase() + f.replace('parts/', '').replace('.html', '').slice(1)}</span>
                          <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-orange-400 dark:text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-1.5 py-0.5 rounded">Global</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Global Scope Indicator */}
          {isGlobalScope && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider border border-orange-200 dark:border-orange-800/50 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
              Global Scope
            </div>
          )}
        </div>

        {/* Edit / Preview Toggle */}
        <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-inner">
          <button
            onClick={() => onModeChange('edit')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === 'edit' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-600' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onModeChange('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === 'preview' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-600' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Browse
          </button>
        </div>
      </div>

      {/* Tab Bar: Open Files */}
      <div className="flex items-center gap-px overflow-x-auto custom-scrollbar px-2 pt-2 bg-zinc-50/50 dark:bg-zinc-950/50">
        {openFiles.map(f => (
          <div
            key={f}
            className={`group flex items-center gap-2 px-4 py-2 text-xs font-medium border-t-2 border-x border-zinc-200 dark:border-zinc-800 transition-all rounded-t-lg shrink-0 cursor-pointer ${
              activeFile === f
                ? f.includes('parts/')
                  ? 'bg-white dark:bg-zinc-900 border-t-orange-500 text-orange-700 dark:text-orange-400 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]'
                  : 'bg-white dark:bg-zinc-900 border-t-blue-500 text-zinc-900 dark:text-white shadow-[0_-2px_10px_rgba(0,0,0,0.02)]'
                : 'bg-transparent border-t-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
            onClick={() => onFileSelect(f)}
          >
            <span className="opacity-50">
              {f.includes('parts/') ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
              ) : (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              )}
            </span>
            {getPageLabel(f)}
            <button
              onClick={(e) => { e.stopPropagation(); onFileClose(f); }}
              className={`p-0.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${activeFile === f ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
