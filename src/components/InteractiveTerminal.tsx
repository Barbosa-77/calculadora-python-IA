import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Trash2, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'output' | 'input' | 'error' | 'success' | 'system';
  text: string;
}

type StepState = 'SELECT_OPTION' | 'INPUT_NUM1' | 'INPUT_NUM2' | 'EXITED';

const INITIAL_LINES: TerminalLine[] = [
  { id: '1', type: 'system', text: '$ python calculadora.py' },
  { id: '2', type: 'output', text: 'Bem-vindo à Calculadora Python!' },
  { id: '3', type: 'output', text: '========================================' },
  { id: '4', type: 'output', text: '         CALCULADORA EM PYTHON         ' },
  { id: '5', type: 'output', text: '========================================' },
  { id: '6', type: 'output', text: ' 1. Adição (+)' },
  { id: '7', type: 'output', text: ' 2. Subtração (-)' },
  { id: '8', type: 'output', text: ' 3. Multiplicação (*)' },
  { id: '9', type: 'output', text: ' 4. Divisão (/)' },
  { id: '10', type: 'output', text: ' 5. Sair' },
  { id: '11', type: 'output', text: '========================================' },
  { id: '12', type: 'output', text: 'Selecione uma opção (1-5): ' },
];

export const InteractiveTerminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>(INITIAL_LINES);
  const [currentInput, setCurrentInput] = useState('');
  const [stepState, setStepState] = useState<StepState>('SELECT_OPTION');
  const [selectedOp, setSelectedOp] = useState<string>('');
  const [num1, setNum1] = useState<number | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addLine = (type: TerminalLine['type'], text: string) => {
    setLines((prev) => [...prev, { id: Math.random().toString(), type, text }]);
  };

  const getOpSymbol = (op: string) => {
    switch (op) {
      case '1': return '+';
      case '2': return '-';
      case '3': return '*';
      case '4': return '/';
      default: return '?';
    }
  };

  const showMenuLines = () => {
    addLine('output', '');
    addLine('output', '========================================');
    addLine('output', '         CALCULADORA EM PYTHON         ');
    addLine('output', '========================================');
    addLine('output', ' 1. Adição (+)');
    addLine('output', ' 2. Subtração (-)');
    addLine('output', ' 3. Multiplicação (*)');
    addLine('output', ' 4. Divisão (/)');
    addLine('output', ' 5. Sair');
    addLine('output', '========================================');
    addLine('output', 'Selecione uma opção (1-5): ');
  };

  const handleProcessInput = (rawValue: string) => {
    const value = rawValue.trim();
    if (!value && stepState !== 'EXITED') return;

    addLine('input', `> ${value}`);
    setCurrentInput('');

    if (stepState === 'SELECT_OPTION') {
      if (value === '5') {
        addLine('output', '\nEncerrando a calculadora. Até logo!');
        addLine('system', '[Processo finalizado com código 0]');
        setStepState('EXITED');
        return;
      }

      if (!['1', '2', '3', '4'].includes(value)) {
        addLine('error', '\n❌ Opção inexistente. Por favor, escolha um número de 1 a 5.');
        showMenuLines();
        return;
      }

      setSelectedOp(value);
      setStepState('INPUT_NUM1');
      addLine('output', 'Digite o primeiro número: ');
      return;
    }

    if (stepState === 'INPUT_NUM1') {
      const sanitized = value.replace(',', '.');
      const parsed = parseFloat(sanitized);

      if (isNaN(parsed)) {
        addLine('error', '❌ Entrada inválida! Digite apenas números reais (ex: 10, -5 ou 3.14).');
        addLine('output', 'Digite o primeiro número: ');
        return;
      }

      setNum1(parsed);
      setStepState('INPUT_NUM2');
      addLine('output', 'Digite o segundo número: ');
      return;
    }

    if (stepState === 'INPUT_NUM2') {
      const sanitized = value.replace(',', '.');
      const parsed = parseFloat(sanitized);

      if (isNaN(parsed)) {
        addLine('error', '❌ Entrada inválida! Digite apenas números reais (ex: 10, -5 ou 3.14).');
        addLine('output', 'Digite o segundo número: ');
        return;
      }

      const n1 = num1 ?? 0;
      const n2 = parsed;
      const symbol = getOpSymbol(selectedOp);

      // Perform calculation simulating python functions
      if (selectedOp === '4' && n2 === 0) {
        // ZeroDivisionError simulation
        addLine('error', '\n⚠️  Erro matemático: Não é possível dividir por zero (0).');
      } else {
        let result = 0;
        if (selectedOp === '1') result = n1 + n2;
        else if (selectedOp === '2') result = n1 - n2;
        else if (selectedOp === '3') result = n1 * n2;
        else if (selectedOp === '4') result = n1 / n2;

        const resStr = Number.isInteger(result) ? result.toString() : result.toFixed(4).replace(/\.?0+$/, '');
        addLine('success', `\n✅ Resultado: ${n1} ${symbol} ${n2} = ${resStr}`);
      }

      // Reset for next operation
      setNum1(null);
      setSelectedOp('');
      setStepState('SELECT_OPTION');
      showMenuLines();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleProcessInput(currentInput);
    }
  };

  const handleRestart = () => {
    setLines(INITIAL_LINES);
    setCurrentInput('');
    setStepState('SELECT_OPTION');
    setSelectedOp('');
    setNum1(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClear = () => {
    setLines([
      { id: Math.random().toString(), type: 'system', text: '$ python calculadora.py' },
      { id: Math.random().toString(), type: 'output', text: 'Selecione uma opção (1-5): ' },
    ]);
    setStepState('SELECT_OPTION');
    setSelectedOp('');
    setNum1(null);
  };

  const runPreset = (sequence: string[]) => {
    handleRestart();
    let currentLines = [...INITIAL_LINES];

    setTimeout(() => {
      let state: StepState = 'SELECT_OPTION';
      let op = '';
      let n1 = 0;

      sequence.forEach((val) => {
        currentLines.push({ id: Math.random().toString(), type: 'input', text: `> ${val}` });

        if (state === 'SELECT_OPTION') {
          if (val === '5') {
            currentLines.push({ id: Math.random().toString(), type: 'output', text: '\nEncerrando a calculadora. Até logo!' });
            currentLines.push({ id: Math.random().toString(), type: 'system', text: '[Processo finalizado com código 0]' });
            state = 'EXITED';
          } else {
            op = val;
            state = 'INPUT_NUM1';
            currentLines.push({ id: Math.random().toString(), type: 'output', text: 'Digite o primeiro número: ' });
          }
        } else if (state === 'INPUT_NUM1') {
          n1 = parseFloat(val);
          state = 'INPUT_NUM2';
          currentLines.push({ id: Math.random().toString(), type: 'output', text: 'Digite o segundo número: ' });
        } else if (state === 'INPUT_NUM2') {
          const n2 = parseFloat(val);
          if (op === '4' && n2 === 0) {
            currentLines.push({
              id: Math.random().toString(),
              type: 'error',
              text: '\n⚠️  Erro matemático: Não é possível dividir por zero (0).',
            });
          } else {
            let res = 0;
            let sym = '+';
            if (op === '1') { res = n1 + n2; sym = '+'; }
            if (op === '2') { res = n1 - n2; sym = '-'; }
            if (op === '3') { res = n1 * n2; sym = '*'; }
            if (op === '4') { res = n1 / n2; sym = '/'; }
            const resStr = Number.isInteger(res) ? res.toString() : res.toFixed(4).replace(/\.?0+$/, '');
            currentLines.push({
              id: Math.random().toString(),
              type: 'success',
              text: `\n✅ Resultado: ${n1} ${sym} ${n2} = ${resStr}`,
            });
          }
          currentLines.push({ id: Math.random().toString(), type: 'output', text: '' });
          currentLines.push({ id: Math.random().toString(), type: 'output', text: 'Selecione uma opção (1-5): ' });
          state = 'SELECT_OPTION';
        }
      });

      setLines([...currentLines]);
      setStepState(state);
      setSelectedOp(op);
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Top Description & Quick Simulation Buttons */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TerminalIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span>Simulador de Terminal Python Interativo</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Execute o script como se estivesse no seu terminal local com suporte a entradas e validações.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reiniciar Script</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Limpar Tela</span>
            </button>
          </div>
        </div>

        {/* Quick Test Presets */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Cenários de Teste Rápido:</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => runPreset(['1', '125.5', '74.5'])}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 transition-colors dark:bg-slate-800 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-300 font-mono"
            >
              Adição: 125.5 + 74.5
            </button>

            <button
              onClick={() => runPreset(['2', '50', '18.75'])}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 transition-colors dark:bg-slate-800 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-300 font-mono"
            >
              Subtração: 50 - 18.75
            </button>

            <button
              onClick={() => runPreset(['3', '8.5', '4'])}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 transition-colors dark:bg-slate-800 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-300 font-mono"
            >
              Multiplicação: 8.5 * 4
            </button>

            <button
              onClick={() => runPreset(['4', '100', '0'])}
              className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 font-mono"
            >
              Divisão por Zero: 100 / 0 ⚠️
            </button>

            <button
              onClick={() => runPreset(['5'])}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 font-mono"
            >
              Opção 5: Sair
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Screen Container */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="cursor-text rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-xs shadow-lg"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 font-semibold text-slate-300">bash — python3 calculadora.py</span>
          </div>
          <span className="text-[11px] text-slate-500">UTF-8 · Interactive TTY</span>
        </div>

        {/* Terminal Body */}
        <div className="space-y-1 max-h-[480px] overflow-y-auto leading-relaxed">
          {lines.map((line) => {
            if (line.type === 'system') {
              return (
                <div key={line.id} className="text-slate-500 font-semibold">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'input') {
              return (
                <div key={line.id} className="text-emerald-400 font-bold">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={line.id} className="text-rose-400 font-semibold whitespace-pre-wrap">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'success') {
              return (
                <div key={line.id} className="text-emerald-300 font-bold whitespace-pre-wrap">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={line.id} className="text-slate-200 whitespace-pre-wrap">
                {line.text}
              </div>
            );
          })}

          {/* Active Input Line */}
          {stepState !== 'EXITED' ? (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-emerald-500 font-bold">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  stepState === 'SELECT_OPTION'
                    ? 'Digite 1, 2, 3, 4 ou 5 e pressione Enter...'
                    : 'Digite um número e pressione Enter...'
                }
                className="w-full bg-transparent text-emerald-300 placeholder-slate-600 outline-none border-none font-mono text-xs focus:ring-0"
                autoFocus
              />
              <button
                onClick={() => handleProcessInput(currentInput)}
                className="flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300 hover:bg-slate-700"
              >
                <span>Enter</span>
                <CornerDownLeft className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="pt-2 text-slate-500 italic">
              Terminal ocioso. Clique em &quot;Reiniciar Script&quot; para iniciar uma nova sessão.
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
