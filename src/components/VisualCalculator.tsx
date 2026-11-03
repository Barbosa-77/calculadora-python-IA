import React, { useState } from 'react';
import { Calculator as CalcIcon, AlertTriangle, CheckCircle, ArrowRight, RotateCcw, Copy, Check } from 'lucide-react';

interface HistoryEntry {
  id: string;
  expression: string;
  pythonCall: string;
  result: string;
  isError: boolean;
  errorMessage?: string;
}

export const VisualCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<'+' | '-' | '*' | '/' | '^' | '%' | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [lastTrace, setLastTrace] = useState<{
    funcName: string;
    argA: number;
    argB: number;
    result: number | null;
    error?: string;
    errorType?: 'ZeroDivisionError' | 'ValueError';
  } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator: '+' | '-' | '*' | '/' | '^' | '%') => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = compute(firstOperand, inputValue, operator);
      if (result !== null) {
        setDisplay(String(result));
        setFirstOperand(result);
      }
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const compute = (a: number, b: number, op: '+' | '-' | '*' | '/' | '^' | '%'): number | null => {
    let res: number | null = null;
    let funcName = '';

    if (op === '+') {
      funcName = 'adicao';
      res = a + b;
    } else if (op === '-') {
      funcName = 'subtracao';
      res = a - b;
    } else if (op === '*') {
      funcName = 'multiplicacao';
      res = a * b;
    } else if (op === '/') {
      funcName = 'divisao';
      if (b === 0) {
        setLastTrace({
          funcName,
          argA: a,
          argB: b,
          result: null,
          error: 'Não é possível dividir por zero (0)',
          errorType: 'ZeroDivisionError',
        });

        const entry: HistoryEntry = {
          id: Math.random().toString(),
          expression: `${a} / ${b}`,
          pythonCall: `divisao(${a}, ${b})`,
          result: 'ZeroDivisionError',
          isError: true,
          errorMessage: 'Erro matemático: Não é possível dividir por zero (0).',
        };
        setHistory((prev) => [entry, ...prev.slice(0, 9)]);
        return null;
      }
      res = a / b;
    } else if (op === '^') {
      funcName = 'potencia';
      if (a === 0 && b < 0) {
        setLastTrace({
          funcName,
          argA: a,
          argB: b,
          result: null,
          error: 'Não é possível elevar zero (0) a um expoente negativo.',
          errorType: 'ZeroDivisionError',
        });

        const entry: HistoryEntry = {
          id: Math.random().toString(),
          expression: `${a} ^ ${b}`,
          pythonCall: `potencia(${a}, ${b})`,
          result: 'ZeroDivisionError',
          isError: true,
          errorMessage: 'Erro matemático: Não é possível elevar zero (0) a um expoente negativo.',
        };
        setHistory((prev) => [entry, ...prev.slice(0, 9)]);
        return null;
      }
      if (a < 0 && !Number.isInteger(b)) {
        setLastTrace({
          funcName,
          argA: a,
          argB: b,
          result: null,
          error: 'O resultado é um número complexo (base negativa com expoente fracionário).',
          errorType: 'ValueError',
        });

        const entry: HistoryEntry = {
          id: Math.random().toString(),
          expression: `${a} ^ ${b}`,
          pythonCall: `potencia(${a}, ${b})`,
          result: 'ValueError',
          isError: true,
          errorMessage: 'Erro matemático: Número complexo não suportado.',
        };
        setHistory((prev) => [entry, ...prev.slice(0, 9)]);
        return null;
      }
      res = Math.pow(a, b);
    } else if (op === '%') {
      funcName = 'porcentagem';
      res = (a * b) / 100;
    }

    if (res !== null) {
      // Clean display
      const formattedRes = Number.isInteger(res) ? res : parseFloat(res.toFixed(6));
      setLastTrace({
        funcName,
        argA: a,
        argB: b,
        result: formattedRes,
      });

      const entry: HistoryEntry = {
        id: Math.random().toString(),
        expression: `${a} ${op} ${b}`,
        pythonCall: `${funcName}(${a}, ${b})`,
        result: String(formattedRes),
        isError: false,
      };
      setHistory((prev) => [entry, ...prev.slice(0, 9)]);
      return formattedRes;
    }

    return null;
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (operator && firstOperand !== null) {
      const result = compute(firstOperand, inputValue, operator);
      if (result !== null) {
        setDisplay(String(result));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
      } else {
        // Zero division error case
        setDisplay('Erro: Zero');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(true);
      }
    }
  };

  const copyCall = (entry: HistoryEntry) => {
    navigator.clipboard.writeText(`${entry.pythonCall} # -> ${entry.result}`);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalcIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span>Calculadora Visual com Trace de Execução Python</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Cada cálculo no teclado executa a função correspondente em Python e demonstra como a exceção é tratada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Keypad Calculator */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
          {/* Display */}
          <div className="mb-6 rounded-xl bg-slate-900 p-4 text-right shadow-inner">
            <div className="min-h-5 text-xs font-mono text-emerald-400/80">
              {firstOperand !== null && operator ? `${firstOperand} ${operator}` : 'python 3.x'}
            </div>
            <div className="truncate text-3xl font-bold font-mono tracking-tight text-white mt-1">
              {display}
            </div>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {/* Row 1 */}
            <button
              onClick={clearAll}
              className="rounded-xl bg-slate-100 p-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-200 active:scale-95 transition-all dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              AC
            </button>
            <button
              onClick={() => performOperation('^')}
              className={`rounded-xl p-3.5 text-base font-bold font-mono active:scale-95 transition-all ${
                operator === '^'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
              }`}
              title="Potência (a ^ b)"
            >
              ^
            </button>
            <button
              onClick={() => performOperation('%')}
              className={`rounded-xl p-3.5 text-base font-bold font-mono active:scale-95 transition-all ${
                operator === '%'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
              }`}
              title="Porcentagem (b% de a)"
            >
              %
            </button>
            <button
              onClick={() => performOperation('/')}
              className={`rounded-xl p-3.5 text-base font-bold font-mono active:scale-95 transition-all ${
                operator === '/'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
              }`}
            >
              ÷
            </button>

            {/* Row 2 */}
            <button
              onClick={() => inputDigit('7')}
              className="rounded-xl bg-slate-50 p-3.5 text-lg font-semibold text-slate-900 hover:bg-slate-100 active:scale-95 transition-all dark:bg-slate-800/60 dark:text-white dark:hover:bg-slate-800 font-mono"
            >
              7
            </button>
            <button
              onClick={() => inputDigit('8')}
              className="rounded-xl bg-slate-50 p-3.5 text-lg font-semibold text-slate-900 hover:bg-slate-100 active:scale-95 transition-all dark:bg-slate-800/60 dark:text-white dark:hover:bg-slate-800 font-mono"
            >
              8
            </button>
            <button
              onClick={() => inputDigit('9')}
              className="rounded-xl bg-slate-50 p-3.5 text-lg font-semibold text-slate-900 hover:bg-slate-100 active:scale-95 transition-all dark:bg-slate-800/60 dark:text-white dark:hover:bg-slate-800 font-mono"
            >
              9
            </button>
            <button
              onClick={() => performOperation('*')}
              className={`rounded-xl p-3.5 text-base font-bold font-mono active:scale-95 transition-all ${
                operator === '*'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
              }`}
            >
              ×
            </button>

            {/* Row 3 */}
            <button
              onClick={() => inputDigit('4')}
              className="rounded-xl bg-slate-50 p-3.5 text-lg font-semibold text-slate-900 hover:bg-slate-100 active:scale-95 transition-all dark:bg-slate-800/60 dark:text-white dark:hover:bg-slate-800 font-mono"
            >
              4
            </button>
            <button
              onClick={() => inputDigit('5')}
              className="rounded-xl bg-slate-50 p-3.5 text-lg font-semibold text-slate-900 hover:bg-slate-100 active:scale-95 transition-all dark:bg-slate-800/60 dark:text-white dark:hover:bg-slate-800 font-mono"
            >
              5
            </button>
            <button
              onClick={() => inputDigit('6')}
              className="rounded-xl bg-slate-50 p-3.5 text-lg font-semibold text-slate-900 hover:bg-slate-100 active:scale-95 transition-all dark:bg-slate-800/60 dark:text-white dark:hover:bg-slate-800 font-mono"
            >
              6
            </button>
            <button
              onClick={() => performOperation('-')}
              className={`rounded-xl p-3.5 text-base font-bold font-mono active:scale-95 transition-all ${
                operator === '-'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
              }`}
            >
              -
            </button>

            {/* Row 4 */}
            <button
              onClick={() => inputDigit('1')}
              className="rounded-xl bg-slate-50 p-3.5 text-lg font-semibold text-slate-900 hover:bg-slate-100 active:scale-95 transition-all dark:bg-slate-800/60 dark:text-white dark:hover:bg-slate-800 font-mono"
            >
              1
            </button>
            <button
              onClick={() => inputDigit('2')}
              className="rounded-xl bg-slate-50 p-3.5 text-lg font-semibold text-slate-900 hover:bg-slate-100 active:scale-95 transition-all dark:bg-slate-800/60 dark:text-white dark:hover:bg-slate-800 font-mono"
            >
              2
            </button>
            <button
              onClick={() => inputDigit('3')}
              className="rounded-xl bg-slate-50 p-3.5 text-lg font-semibold text-slate-900 hover:bg-slate-100 active:scale-95 transition-all dark:bg-slate-800/60 dark:text-white dark:hover:bg-slate-800 font-mono"
            >
              3
            </button>
            <button
              onClick={() => performOperation('+')}
              className={`rounded-xl p-3.5 text-base font-bold font-mono active:scale-95 transition-all ${
                operator === '+'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
              }`}
            >
              +
            </button>

            {/* Row 5 */}
            <button
              onClick={() => {
                const val = parseFloat(display);
                setDisplay(String(-val));
              }}
              className="rounded-xl bg-slate-100 p-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-200 active:scale-95 transition-all dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 font-mono"
            >
              +/-
            </button>
            <button
              onClick={() => inputDigit('0')}
              className="rounded-xl bg-slate-50 p-3.5 text-lg font-semibold text-slate-900 hover:bg-slate-100 active:scale-95 transition-all dark:bg-slate-800/60 dark:text-white dark:hover:bg-slate-800 font-mono"
            >
              0
            </button>
            <button
              onClick={inputDecimal}
              className="rounded-xl bg-slate-50 p-3.5 text-lg font-semibold text-slate-900 hover:bg-slate-100 active:scale-95 transition-all dark:bg-slate-800/60 dark:text-white dark:hover:bg-slate-800 font-mono"
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className="rounded-xl bg-emerald-600 p-3.5 text-lg font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all font-mono"
            >
              =
            </button>
          </div>
        </div>

        {/* Right Column: Realtime Python Trace and History */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Python Execution Inspector */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Inspeção da Chamada Python em Tempo Real</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">calculadora.py</span>
            </h3>

            {lastTrace ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-slate-950 font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800">
                  <div className="text-purple-400 font-semibold">
                    def {lastTrace.funcName}(a: Numero, b: Numero) -&gt; float:
                  </div>
                  <div className="pl-4 text-slate-400">
                    # Valores passados em tempo de execução:
                  </div>
                  <div className="pl-4 text-cyan-300">
                    a = {lastTrace.argA} <span className="text-slate-500"># (tipo: {Number.isInteger(lastTrace.argA) ? 'int' : 'float'})</span>
                  </div>
                  <div className="pl-4 text-cyan-300">
                    b = {lastTrace.argB} <span className="text-slate-500"># (tipo: {Number.isInteger(lastTrace.argB) ? 'int' : 'float'})</span>
                  </div>

                  {lastTrace.error ? (
                    <div className="pl-4 pt-1 text-rose-400 font-semibold">
                      raise {lastTrace.errorType ?? 'ZeroDivisionError'}(&quot;{lastTrace.error}&quot;)
                    </div>
                  ) : (
                    <div className="pl-4 pt-1 text-emerald-400 font-bold">
                      return {lastTrace.result} <span className="text-slate-500"># (float)</span>
                    </div>
                  )}
                </div>

                {lastTrace.error ? (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Proteção de Exceção Ativada ({lastTrace.errorType ?? 'ZeroDivisionError'}):</span>
                      {lastTrace.error} O bloco <code className="font-mono bg-rose-100 dark:bg-rose-900/60 px-1 py-0.5 rounded">try/except ({lastTrace.errorType ?? 'ZeroDivisionError'}, ValueError)</code> interceptou a exceção e manteve o sistema estável!
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-300 flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Execução com Sucesso:</span> Função pura executada sem efeitos colaterais. O resultado retornado é um valor numérico válido.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800">
                Pressione os botões da calculadora ao lado para ver a invocação das funções Python em tempo real.
              </div>
            )}
          </div>

          {/* History List */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Histórico de Operações (Últimos 10 Cálculos)
              </h3>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Limpar histórico
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs dark:border-slate-800 dark:bg-slate-800/50 font-mono"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {entry.pythonCall}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Expressão: {entry.expression}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-bold ${
                          entry.isError
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        = {entry.result}
                      </span>
                      <button
                        onClick={() => copyCall(entry)}
                        title="Copiar chamada Python"
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        {copiedId === entry.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
                Nenhum cálculo registrado ainda nesta sessão.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
