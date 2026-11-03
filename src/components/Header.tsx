import React from 'react';
import { Download, Terminal, Code2, BookOpen, Calculator, CheckSquare, Sun, Moon, Copy, Check } from 'lucide-react';

interface HeaderProps {
  activeTab: 'code' | 'architecture' | 'terminal' | 'visual' | 'tests';
  setActiveTab: (tab: 'code' | 'architecture' | 'terminal' | 'visual' | 'tests') => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onDownload: () => void;
  onCopy: () => void;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  onDownload,
  onCopy,
  copied,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <Terminal className="h-5 w-5" />
          </div>
          <button
            onClick={() => setActiveTab('code')}
            className="text-left text-base font-bold tracking-tight text-slate-900 transition-colors hover:text-emerald-600 dark:text-white dark:hover:text-emerald-400 whitespace-nowrap shrink-0"
          >
            Python Calc Studio
          </button>
        </div>

        {/* Zone 2: Navigation Links (5 single-line clean links) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'code'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="h-4 w-4" />
            <span>Código Limpo</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'architecture'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Explicação da Estrutura</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'terminal'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>Terminal Interativo</span>
          </button>

          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'visual'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>Calculadora Visual</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'tests'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            <span>Testes Unitários</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Alternar tema claro e escuro"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={onCopy}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar .py</span>
              </>
            )}
          </button>

          <button
            onClick={onDownload}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 whitespace-nowrap shrink-0"
          >
            <Download className="h-4 w-4" />
            <span>Baixar calculadora.py</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar for smaller screens */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-200 px-4 py-2 text-xs font-medium gap-2 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <button
          onClick={() => setActiveTab('code')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'code' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Código
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'architecture' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Estrutura & Explicação
        </button>
        <button
          onClick={() => setActiveTab('terminal')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'terminal' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Terminal
        </button>
        <button
          onClick={() => setActiveTab('visual')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'visual' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Calculadora
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'tests' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Testes
        </button>
      </div>
    </header>
  );
};
