import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeViewer } from './components/CodeViewer';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { VisualCalculator } from './components/VisualCalculator';
import { UnitTestsViewer } from './components/UnitTestsViewer';
import { FUNCTIONAL_PYTHON_CODE, OOP_PYTHON_CODE } from './data/pythonCode';
import { Terminal, ShieldCheck, Cpu, Code2, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'code' | 'architecture' | 'terminal' | 'visual' | 'tests'>('code');
  const [targetArchitectureId, setTargetArchitectureId] = useState<string>('modularity');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(FUNCTIONAL_PYTHON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadFile = (version: 'functional' | 'oop' = 'functional') => {
    const code = version === 'functional' ? FUNCTIONAL_PYTHON_CODE : OOP_PYTHON_CODE;
    const filename = version === 'functional' ? 'calculadora.py' : 'calculadora_oop.py';
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleJumpToArchitecture = (sectionId: string) => {
    setTargetArchitectureId(sectionId);
    setActiveTab('architecture');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      {/* Navigation Header adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        onDownload={() => handleDownloadFile('functional')}
        onCopy={handleCopyCode}
        copied={copied}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Subtle Hero Breadcrumb / Quick Banner */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Python 3.10+</span>
              <span aria-hidden="true">·</span>
              <span>Clean Code</span>
              <span aria-hidden="true">·</span>
              <span>Tratamento de Exceções</span>
              <span aria-hidden="true">·</span>
              <span>6 Operações Matemáticas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Calculadora Python Modular &amp; Robusta
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Implementação organizada com adição, subtração, multiplicação, divisão protegida, potência e porcentagem,
              com arquitetura detalhada e simulador interativo de linha de comando.
            </p>
          </div>

          {/* Quick Segmented Nav for direct tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'code'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Código .py
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'architecture'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Estrutura Explicada
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'terminal'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Terminal CLI
            </button>
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'visual'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Calculadora
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'tests'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Testes
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'code' && (
          <CodeViewer
            onRunInTerminal={() => setActiveTab('terminal')}
            onDownload={handleDownloadFile}
            onSelectArchitecture={handleJumpToArchitecture}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureGuide
            initialSectionId={targetArchitectureId}
            onGoToTerminal={() => setActiveTab('terminal')}
            onGoToCode={() => setActiveTab('code')}
          />
        )}

        {activeTab === 'terminal' && <InteractiveTerminal />}

        {activeTab === 'visual' && <VisualCalculator />}

        {activeTab === 'tests' && <UnitTestsViewer />}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900 mt-12 transition-colors">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Calculadora Python Clean Code
            </span>
            <span>·</span>
            <span>Adição, Subtração, Multiplicação e Divisão</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleDownloadFile('functional')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Baixar calculadora.py
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('architecture')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Documentação da Arquitetura
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
