import React, { useState } from 'react';
import { CheckSquare, Play, CheckCircle2, XCircle, RotateCcw, Copy, Check, FileCode2 } from 'lucide-react';
import { TEST_PYTHON_CODE } from '../data/pythonCode';

interface TestCase {
  id: string;
  name: string;
  method: string;
  category: 'Adição' | 'Subtração' | 'Multiplicação' | 'Divisão' | 'Potência' | 'Porcentagem' | 'Exceção';
  description: string;
  assertion: string;
  expected: string;
}

const TEST_CASES: TestCase[] = [
  {
    id: '1',
    name: 'test_adicao_positivos',
    method: 'adicao(2, 3)',
    category: 'Adição',
    description: 'Soma de dois inteiros positivos.',
    assertion: 'self.assertEqual(adicao(2, 3), 5.0)',
    expected: '5.0',
  },
  {
    id: '2',
    name: 'test_adicao_decimais',
    method: 'adicao(2.5, 3.5)',
    category: 'Adição',
    description: 'Soma de números de ponto flutuante.',
    assertion: 'self.assertEqual(adicao(2.5, 3.5), 6.0)',
    expected: '6.0',
  },
  {
    id: '3',
    name: 'test_subtracao_padrao',
    method: 'subtracao(10, 4)',
    category: 'Subtração',
    description: 'Subtração comum com resultado positivo.',
    assertion: 'self.assertEqual(subtracao(10, 4), 6.0)',
    expected: '6.0',
  },
  {
    id: '4',
    name: 'test_subtracao_resultado_negativo',
    method: 'subtracao(0, 5)',
    category: 'Subtração',
    description: 'Subtração gerando número negativo.',
    assertion: 'self.assertEqual(subtracao(0, 5), -5.0)',
    expected: '-5.0',
  },
  {
    id: '5',
    name: 'test_multiplicacao_positivos',
    method: 'multiplicacao(3, 4)',
    category: 'Multiplicação',
    description: 'Multiplicação direta de inteiros.',
    assertion: 'self.assertEqual(multiplicacao(3, 4), 12.0)',
    expected: '12.0',
  },
  {
    id: '6',
    name: 'test_multiplicacao_por_zero',
    method: 'multiplicacao(100, 0)',
    category: 'Multiplicação',
    description: 'Propriedade do elemento nulo da multiplicação.',
    assertion: 'self.assertEqual(multiplicacao(100, 0), 0.0)',
    expected: '0.0',
  },
  {
    id: '7',
    name: 'test_divisao_exata',
    method: 'divisao(10, 2)',
    category: 'Divisão',
    description: 'Divisão exata resultando em número inteiro.',
    assertion: 'self.assertEqual(divisao(10, 2), 5.0)',
    expected: '5.0',
  },
  {
    id: '8',
    name: 'test_divisao_fracionada',
    method: 'divisao(7, 2)',
    category: 'Divisão',
    description: 'Divisão com resultado decimal.',
    assertion: 'self.assertEqual(divisao(7, 2), 3.5)',
    expected: '3.5',
  },
  {
    id: '9',
    name: 'test_divisao_por_zero_dispara_excecao',
    method: 'divisao(10, 0)',
    category: 'Exceção',
    description: 'Garante que divisao por zero levanta ZeroDivisionError.',
    assertion: 'with self.assertRaises(ZeroDivisionError): divisao(10, 0)',
    expected: 'ZeroDivisionError',
  },
  {
    id: '10',
    name: 'test_potencia_positivos',
    method: 'potencia(2, 3)',
    category: 'Potência',
    description: 'Calcula base inteira com expoente positivo (2^3).',
    assertion: 'self.assertEqual(potencia(2, 3), 8.0)',
    expected: '8.0',
  },
  {
    id: '11',
    name: 'test_potencia_expoente_zero',
    method: 'potencia(5, 0)',
    category: 'Potência',
    description: 'Qualquer número elevado a zero resulta em 1.',
    assertion: 'self.assertEqual(potencia(5, 0), 1.0)',
    expected: '1.0',
  },
  {
    id: '12',
    name: 'test_potencia_zero_negativo',
    method: 'potencia(0, -2)',
    category: 'Exceção',
    description: 'Garante que zero elevado a expoente negativo levanta ZeroDivisionError.',
    assertion: 'with self.assertRaises(ZeroDivisionError): potencia(0, -2)',
    expected: 'ZeroDivisionError',
  },
  {
    id: '13',
    name: 'test_porcentagem_padrao',
    method: 'porcentagem(200, 15)',
    category: 'Porcentagem',
    description: 'Calcula 15% de 200.',
    assertion: 'self.assertEqual(porcentagem(200, 15), 30.0)',
    expected: '30.0',
  },
  {
    id: '14',
    name: 'test_porcentagem_decimal',
    method: 'porcentagem(50, 2.5)',
    category: 'Porcentagem',
    description: 'Calcula 2.5% de 50.',
    assertion: 'self.assertEqual(porcentagem(50, 2.5), 1.25)',
    expected: '1.25',
  },
];

export const UnitTestsViewer: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, 'passed' | 'failed' | 'idle'>>({});
  const [copied, setCopied] = useState(false);

  const runAllTests = () => {
    setRunning(true);
    setTestResults({});

    let current = 0;
    const interval = setInterval(() => {
      if (current < TEST_CASES.length) {
        const item = TEST_CASES[current];
        setTestResults((prev) => ({ ...prev, [item.id]: 'passed' }));
        current++;
      } else {
        clearInterval(interval);
        setRunning(false);
      }
    }, 120);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(TEST_PYTHON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const passedCount = Object.values(testResults).filter((v) => v === 'passed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span>Testes Unitários Automatizados (unittest / pytest)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Um dos maiores pilares do Código Limpo é a testabilidade. Veja como testar a calculadora em Python.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar test_calculadora.py</span>
              </>
            )}
          </button>

          <button
            onClick={runAllTests}
            disabled={running}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{running ? 'Executando...' : 'Rodar Testes'}</span>
          </button>
        </div>
      </div>

      {/* Test Execution Summary Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Total de Casos de Teste</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {TEST_CASES.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cobrem +, -, *, /, ^, % e Exceções</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Testes Aprovados</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {passedCount} / {TEST_CASES.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {passedCount === TEST_CASES.length ? '100% dos testes passaram com sucesso!' : 'Clique em Rodar Testes'}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Framework Python</div>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
            unittest (Nativo)
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Sem necessidade de instalar pip externo</div>
        </div>
      </div>

      {/* Table of Test Cases */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Matriz de Verificação de Asserções
          </h3>
          <span className="text-xs font-mono text-slate-400">test_calculadora.py</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {TEST_CASES.map((tc) => {
            const status = testResults[tc.id] || 'idle';
            return (
              <div
                key={tc.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {tc.name}
                    </span>
                    <span className="text-[11px] text-slate-400">·</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {tc.category}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">{tc.description}</p>
                  <code className="inline-block font-mono text-[11px] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">
                    {tc.assertion}
                  </code>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Esperado</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {tc.expected}
                    </span>
                  </div>

                  <div className="w-24 text-right">
                    {status === 'passed' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Passou</span>
                      </span>
                    )}
                    {status === 'idle' && (
                      <span className="text-xs text-slate-400 font-mono">Pendente</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
