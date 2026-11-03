import React, { useState } from 'react';
import { BookOpen, CheckCircle, ShieldAlert, Cpu, GitBranch, Terminal, FileCode2, ArrowRight } from 'lucide-react';
import { ARCHITECTURE_SECTIONS } from '../data/pythonCode';

interface ArchitectureGuideProps {
  initialSectionId?: string;
  onGoToTerminal: () => void;
  onGoToCode: () => void;
}

export const ArchitectureGuide: React.FC<ArchitectureGuideProps> = ({
  initialSectionId,
  onGoToTerminal,
  onGoToCode,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    initialSectionId || ARCHITECTURE_SECTIONS[0].id
  );

  const activeSection =
    ARCHITECTURE_SECTIONS.find((s) => s.id === selectedId) || ARCHITECTURE_SECTIONS[0];

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Engenharia de Software em Python
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Estrutura Arquitetural & Princípios de Código Limpo
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
              Entenda em detalhes cada decisão de design tomada na construção da calculadora,
              desde a separação das operações puras até a proteção contra entradas incorretas e divisões por zero.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onGoToCode}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <FileCode2 className="h-4 w-4" />
              <span>Ver no Código</span>
            </button>
            <button
              onClick={onGoToTerminal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Terminal className="h-4 w-4" />
              <span>Testar no Terminal</span>
            </button>
          </div>
        </div>

        {/* High-level Pillars Summary */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Operações Puras</span>
            <span className="text-slate-500 dark:text-slate-400">Adição, subtração, produto e quociente isolados sem efeitos colaterais.</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Zero Crashes</span>
            <span className="text-slate-500 dark:text-slate-400">Tratamento de ZeroDivisionError e ValueError em loops defensivos.</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Tipagem Estática</span>
            <span className="text-slate-500 dark:text-slate-400">Type Hints completos com Union[int, float] e retornos float.</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Padrão Dispatch</span>
            <span className="text-slate-500 dark:text-slate-400">Dicionário de funções substituindo árvores prolixas de if/elif.</span>
          </div>
        </div>
      </div>

      {/* Interactive Two-Column Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 block mb-1">
            Tópicos de Arquitetura
          </span>

          {ARCHITECTURE_SECTIONS.map((section, index) => {
            const isSelected = section.id === selectedId;
            return (
              <button
                key={section.id}
                onClick={() => setSelectedId(section.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-sm dark:border-emerald-500 dark:bg-emerald-950/30'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>{section.category}</span>
                  <span className="font-mono text-[11px]">{section.lineRange}</span>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    isSelected ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {section.title}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {section.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Detailed Focus Card */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {activeSection.category}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {activeSection.title}
              </h3>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {activeSection.lineRange}
            </span>
          </div>

          <div className="mt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Resumo Conceitual
              </h4>
              <p className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 font-medium">
                {activeSection.summary}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Explicação Técnica Detalhada
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                {activeSection.details}
              </p>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Principais Benefícios para o Projeto
              </h4>
              <ul className="space-y-2">
                {activeSection.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Matrix: Functional vs Object Oriented */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Comparativo de Paradigmas: Estruturado/Funcional vs. Orientado a Objetos (POO)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Qual estilo escolher dependendo dos requisitos do seu projeto:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Abordagem Modular / Funcional (calculadora.py)
              </h4>
            </div>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <li>• Funções soltas e puras sem estado interno.</li>
              <li>• Perfeito para scripts CLI, utilitários rápidos e aprendizado sólido de sintaxe.</li>
              <li>• Baixa complexidade: sem necessidade de instanciar classes ou gerenciar <code className="font-mono text-emerald-600">self</code>.</li>
              <li>• Facilmente combinável com pipelines funcionais de dados.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Abordagem Orientada a Objetos (calculadora_oop.py)
              </h4>
            </div>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <li>• Encapsula estado interno, como lista de histórico de cálculos em memória.</li>
              <li>• Ideal para sistemas maiores (ex: integrações com GUIs como Tkinter, PyQt ou APIs Flask/FastAPI).</li>
              <li>• Permite herança (ex: criar uma subclasse <code className="font-mono text-purple-600">CalculadoraCientifica</code> herdando as 4 operações básicas).</li>
              <li>• Métodos privados auxiliares (como <code className="font-mono text-purple-600">_registrar_historico</code>).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
