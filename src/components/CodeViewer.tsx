import React, { useState } from 'react';
import { Copy, Check, Download, Terminal, Sparkles, FileCode2, Layers } from 'lucide-react';
import { FUNCTIONAL_PYTHON_CODE, OOP_PYTHON_CODE } from '../data/pythonCode';

interface CodeViewerProps {
  onRunInTerminal: () => void;
  onDownload: (version: 'functional' | 'oop') => void;
  onSelectArchitecture: (sectionId: string) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  onRunInTerminal,
  onDownload,
  onSelectArchitecture,
}) => {
  const [codeType, setCodeType] = useState<'functional' | 'oop'>('functional');
  const [copied, setCopied] = useState(false);

  const activeCode = codeType === 'functional' ? FUNCTIONAL_PYTHON_CODE : OOP_PYTHON_CODE;
  const fileName = codeType === 'functional' ? 'calculadora.py' : 'calculadora_oop.py';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = activeCode.trim().split('\n');

  // Syntax highlighting helper for Python
  const formatPythonLine = (line: string) => {
    if (line.trim().startsWith('#')) {
      return <span className="text-emerald-600 dark:text-emerald-400 italic">{line}</span>;
    }
    if (line.trim().startsWith('"""') || line.trim().startsWith("'''") || line.includes('"""')) {
      return <span className="text-amber-600 dark:text-amber-400">{line}</span>;
    }

    // Tokenize roughly for keywords, strings, functions, and numbers
    const parts = line.split(/(\bdef\b|\bclass\b|\breturn\b|\braise\b|\bif\b|\belif\b|\belse\b|\bwhile\b|\bfor\b|\bin\b|\bnot\b|\band\b|\bor\b|\bbreak\b|\bcontinue\b|\btry\b|\bexcept\b|\bas\b|\bimport\b|\bfrom\b|".*?"|'.*?'|\bfloat\b|\bint\b|\bstr\b|\bNone\b|\bTrue\b|\bFalse\b|\bZeroDivisionError\b|\bValueError\b)/g);

    return parts.map((part, idx) => {
      if (
        [
          'def',
          'class',
          'return',
          'raise',
          'if',
          'elif',
          'else',
          'while',
          'for',
          'in',
          'not',
          'and',
          'or',
          'break',
          'continue',
          'try',
          'except',
          'as',
          'import',
          'from',
        ].includes(part)
      ) {
        return (
          <span key={idx} className="text-purple-600 dark:text-purple-400 font-semibold">
            {part}
          </span>
        );
      }
      if (['float', 'int', 'str', 'None', 'True', 'False', 'Numero'].includes(part)) {
        return (
          <span key={idx} className="text-cyan-600 dark:text-cyan-400 font-medium">
            {part}
          </span>
        );
      }
      if (['ZeroDivisionError', 'ValueError'].includes(part)) {
        return (
          <span key={idx} className="text-rose-600 dark:text-rose-400 font-bold">
            {part}
          </span>
        );
      }
      if (part.startsWith('"') || part.startsWith("'")) {
        return (
          <span key={idx} className="text-emerald-700 dark:text-emerald-300">
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span>Código Python Completo & Organizado</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Estrutura limpa (Clean Code), tipada com PEP 484, modular e com tratamento de erros.
          </p>
        </div>

        {/* Style Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg dark:bg-slate-800 shrink-0">
          <button
            onClick={() => setCodeType('functional')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              codeType === 'functional'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Abordagem Funcional / Modular
          </button>
          <button
            onClick={() => setCodeType('oop')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              codeType === 'oop'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Abordagem POO (Classes)
          </button>
        </div>
      </div>

      {/* Code Window Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 text-slate-100 shadow-sm dark:border-slate-800">
        {/* Editor Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 font-medium text-slate-200">{fileName}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{lines.length} linhas</span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400">Python 3.10+</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            <button
              onClick={() => onDownload(codeType)}
              className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Baixar</span>
            </button>

            <button
              onClick={onRunInTerminal}
              className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Executar no Terminal</span>
            </button>
          </div>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed max-h-[640px] select-text">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, index) => {
                const lineNum = index + 1;
                return (
                  <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                    <td className="w-12 text-right pr-4 text-slate-600 select-none align-top tabular-nums">
                      {lineNum}
                    </td>
                    <td className="text-slate-200 whitespace-pre">
                      {formatPythonLine(line)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Architecture Navigation Pills */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Pontos Chave da Arquitetura neste Código</span>
          </h3>
          <span className="text-xs text-slate-500">Clique para ver a explicação aprofundada</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          <button
            onClick={() => onSelectArchitecture('modularity')}
            className="flex items-start gap-2.5 text-left p-2.5 rounded-lg border border-slate-200 bg-white text-xs hover:border-emerald-500 transition-colors dark:border-slate-800 dark:bg-slate-800/80"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Modularidade & SRP</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Funções puras separadas por operação</div>
            </div>
          </button>

          <button
            onClick={() => onSelectArchitecture('typing')}
            className="flex items-start gap-2.5 text-left p-2.5 rounded-lg border border-slate-200 bg-white text-xs hover:border-emerald-500 transition-colors dark:border-slate-800 dark:bg-slate-800/80"
          >
            <div className="h-2 w-2 rounded-full bg-cyan-500 mt-1 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Tipagem Estática</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">PEP 484 com Union[int, float]</div>
            </div>
          </button>

          <button
            onClick={() => onSelectArchitecture('exception_handling')}
            className="flex items-start gap-2.5 text-left p-2.5 rounded-lg border border-slate-200 bg-white text-xs hover:border-emerald-500 transition-colors dark:border-slate-800 dark:bg-slate-800/80"
          >
            <div className="h-2 w-2 rounded-full bg-rose-500 mt-1 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">ZeroDivisionError & ValueError</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Tratamento defensivo de exceções</div>
            </div>
          </button>

          <button
            onClick={() => onSelectArchitecture('dispatch_table')}
            className="flex items-start gap-2.5 text-left p-2.5 rounded-lg border border-slate-200 bg-white text-xs hover:border-emerald-500 transition-colors dark:border-slate-800 dark:bg-slate-800/80"
          >
            <div className="h-2 w-2 rounded-full bg-purple-500 mt-1 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Tabela de Dispatch</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Dicionário mapeando opções para funções</div>
            </div>
          </button>

          <button
            onClick={() => onSelectArchitecture('main_guard')}
            className="flex items-start gap-2.5 text-left p-2.5 rounded-lg border border-slate-200 bg-white text-xs hover:border-emerald-500 transition-colors dark:border-slate-800 dark:bg-slate-800/80"
          >
            <div className="h-2 w-2 rounded-full bg-amber-500 mt-1 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Guarda __name__ == '__main__'</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Isola execução direta vs. importação</div>
            </div>
          </button>

          <button
            onClick={() => onSelectArchitecture('pep8_docstrings')}
            className="flex items-start gap-2.5 text-left p-2.5 rounded-lg border border-slate-200 bg-white text-xs hover:border-emerald-500 transition-colors dark:border-slate-800 dark:bg-slate-800/80"
          >
            <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">PEP 8 & Docstrings</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Padrão da comunidade e help()</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
