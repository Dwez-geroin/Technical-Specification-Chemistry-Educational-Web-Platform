import React, { useState } from 'react';
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Circle,
  Columns2,
  GitBranch,
  Info,
  ListChecks,
  Table2,
} from 'lucide-react';
import type { AppRoute, DifficultyLevel, Molecule3D, TopicData, UserProfile } from '../types/chemistry';
import { getMoleculeById } from '../data/molecules';
import { TASKS } from '../data/tasks';
import { INORGANIC_GENETIC_ROWS } from '../data/tablesData';
import { FormulaText } from './FormulaText';
import { MoleculeViewer3D } from './MoleculeViewer3D';
import { OrganicGeneticGraph } from './OrganicGeneticGraph';

interface TopicDetailViewProps {
  topic: TopicData;
  level: DifficultyLevel;
  initialTab?: 'theory' | 'examples' | 'schemes' | 'tasks';
  user: UserProfile | null;
  onNavigate: (route: AppRoute) => void;
  onToggleTopicComplete: (topicId: string) => void;
  onToggleSaveMolecule: (molecule: Molecule3D) => void;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topic,
  level,
  initialTab = 'theory',
  user,
  onNavigate,
  onToggleTopicComplete,
  onToggleSaveMolecule,
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'examples' | 'schemes' | 'tasks'>(initialTab);
  const [activeLevel, setActiveLevel] = useState<DifficultyLevel>(level);
  const [selectedMolId, setSelectedMolId] = useState<string>(topic.moleculeIds[0] || 'methane');
  const [compareIsomers, setCompareIsomers] = useState(false);

  const isOrganic = topic.section === 'organic';
  const isCompleted = user?.completedTopicIds.includes(topic.id) || false;
  const savedMolIds = new Set(user?.savedMolecules.map((m) => m.moleculeId) || []);

  const molecules = topic.moleculeIds.map((id) => getMoleculeById(id)).filter((m): m is Molecule3D => Boolean(m));
  const selectedMol = molecules.find((m) => m.id === selectedMolId) || molecules[0];
  const topicTasks = TASKS.filter((t) => t.topicId === topic.id);

  const isomerA = topic.isomerPair ? getMoleculeById(topic.isomerPair[0]) : undefined;
  const isomerB = topic.isomerPair ? getMoleculeById(topic.isomerPair[1]) : undefined;

  const theoryBlocks = activeLevel === 'base' ? topic.theoryBase : [...topic.theoryBase, ...topic.theoryAdvanced];
  const accentBtn = isOrganic ? 'bg-[#3A6E56] hover:bg-[#2F5B47]' : 'bg-[#44658A] hover:bg-[#375372]';
  const accentText = isOrganic ? 'text-[#3A6E56]' : 'text-[#44658A]';

  return (
    <div className="space-y-6">
      {/* Topic Header with Level Switcher (available in every topic!) */}
      <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#52635C]">
              <span className={`font-semibold ${accentText}`}>
                {isOrganic ? 'Органическая химия' : 'Неорганическая химия'}
              </span>
              <span aria-hidden="true">·</span>
              <span>Уровень: {activeLevel === 'base' ? 'База' : 'Углублённый'}</span>
              {topic.generalFormula && (
                <>
                  <span aria-hidden="true">·</span>
                  <FormulaText text={topic.generalFormula} className="text-[#2E3B36] font-medium" />
                </>
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2E3B36]">{topic.title}</h1>
            <p className="text-sm text-[#52635C] max-w-3xl">{topic.shortDesc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div
              className="inline-flex items-center p-1 bg-[#EDF1EC] border border-[#DDE3DF] rounded-xl"
              role="group"
              aria-label="Уровень изложения темы"
            >
              <button
                type="button"
                onClick={() => setActiveLevel('base')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeLevel === 'base' ? `${accentBtn} text-white` : 'text-[#52635C] hover:text-[#2E3B36]'
                }`}
              >
                База
              </button>
              <button
                type="button"
                onClick={() => setActiveLevel('advanced')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeLevel === 'advanced' ? `${accentBtn} text-white` : 'text-[#52635C] hover:text-[#2E3B36]'
                }`}
              >
                Углублённый
              </button>
            </div>

            <button
              type="button"
              onClick={() => onToggleTopicComplete(topic.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
                isCompleted
                  ? 'bg-[#EFF5EA] border-[#7BA05B] text-[#4E6D35]'
                  : 'bg-white border-[#DDE3DF] text-[#2E3B36] hover:border-[#4F8A6E]'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-[#8FA199]" />}
              {isCompleted ? 'Тема изучена' : 'Отметить изученной'}
            </button>
          </div>
        </div>

        {/* Topic Tabs */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#DDE3DF]"
          role="tablist"
          aria-label="Разделы темы"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'theory', label: 'Теория', icon: Info },
                { id: 'examples', label: `Примеры и 3D (${molecules.length})`, icon: Box },
                { id: 'schemes', label: 'Схемы', icon: GitBranch },
                { id: 'tasks', label: `Задания (${topicTasks.length})`, icon: ListChecks },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    active ? `${accentBtn} text-white` : 'bg-[#F5F7F4] text-[#2E3B36] hover:bg-[#EBF0EC]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onNavigate({ page: 'tables', tab: 'periodic' })}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52635C] hover:text-[#2E3B36] cursor-pointer whitespace-nowrap"
          >
            <Table2 className="w-4 h-4 text-[#5B7FA6]" />
            Открыть таблицы
          </button>
        </div>
      </div>

      {/* TAB 1: THEORY */}
      {activeTab === 'theory' && (
        <div className="space-y-5">
          {theoryBlocks.map((block, idx) => (
            <section key={idx} className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-display text-xl font-semibold text-[#2E3B36]">{block.heading}</h2>
                {idx >= topic.theoryBase.length && (
                  <span className={`text-xs font-medium ${accentText}`}>Углублённый блок</span>
                )}
              </div>

              <div className="space-y-3 text-base text-[#2E3B36] leading-relaxed max-w-4xl">
                {block.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {block.definition && (
                <div className="bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl p-4 space-y-1">
                  <div className="text-xs font-semibold text-[#3A6E56]">Определение · {block.definition.term}</div>
                  <p className="text-sm text-[#2E3B36] leading-relaxed">{block.definition.text}</p>
                </div>
              )}

              {block.formulas && block.formulas.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h3 className="text-xs font-semibold text-[#52635C]">Ключевые уравнения и формулы</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {block.formulas.map((f, fIdx) => (
                      <div key={fIdx} className="bg-[#FAFBF9] border border-[#DDE3DF] rounded-xl px-4 py-3 space-y-1">
                        <div className="text-xs text-[#52635C]">{f.label}</div>
                        <div className="text-sm text-[#2E3B36] font-medium">
                          <FormulaText text={f.equation} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {block.important && (
                <div className="bg-[#EBF3EE] border border-[#BDD4C6] rounded-xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#3A6E56] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-[#2F5B47]">Важно запомнить</div>
                    <p className="text-sm text-[#2E3B36] leading-relaxed">{block.important}</p>
                  </div>
                </div>
              )}
            </section>
          ))}

          {activeLevel === 'base' && topic.theoryAdvanced.length > 0 && (
            <div className="bg-white border border-[#DDE3DF] rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold text-base text-[#2E3B36]">
                  Хотите разобрать тему глубже?
                </h3>
                <p className="text-sm text-[#52635C]">
                  Переключите уровень на «Углублённый», чтобы открыть механизмы, исключения и расчётные закономерности.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveLevel('advanced')}
                className="px-4 py-2 text-sm font-medium bg-[#EDF1EC] text-[#2E3B36] rounded-lg hover:bg-[#DCE5DF] transition-colors cursor-pointer whitespace-nowrap"
              >
                Показать углублённый материал
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EXAMPLES & 3D */}
      {activeTab === 'examples' && (
        <div className="space-y-5">
          {isomerA && isomerB && (
            <div className="bg-white border border-[#DDE3DF] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-[#2E3B36]">
                  Доступно сравнение изомеров в 3D: {isomerA.name} и {isomerB.name}
                </div>
                <p className="text-xs text-[#52635C] mt-0.5">{isomerA.isomerNote}</p>
              </div>
              <button
                type="button"
                onClick={() => setCompareIsomers((v) => !v)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  compareIsomers
                    ? 'bg-[#3A6E56] text-white'
                    : 'bg-[#EBF3EE] text-[#2F5B47] hover:bg-[#DCEBE2]'
                }`}
              >
                <Columns2 className="w-4 h-4" />
                {compareIsomers ? 'Вернуться к одной модели' : 'Сравнить изомеры рядом'}
              </button>
            </div>
          )}

          {compareIsomers && isomerA && isomerB ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <MoleculeViewer3D
                molecule={isomerA}
                isSaved={savedMolIds.has(isomerA.id)}
                onToggleSave={onToggleSaveMolecule}
              />
              <MoleculeViewer3D
                molecule={isomerB}
                isSaved={savedMolIds.has(isomerB.id)}
                onToggleSave={onToggleSaveMolecule}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* List of example molecules */}
              <div className="lg:col-span-5 space-y-2.5">
                {molecules.map((mol) => {
                  const active = selectedMol?.id === mol.id;
                  return (
                    <div
                      key={mol.id}
                      className={`bg-white border rounded-xl p-4 transition-colors space-y-2 ${
                        active ? 'border-[#4F8A6E] bg-[#FAFDFB]' : 'border-[#DDE3DF]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-display font-semibold text-[#2E3B36] text-base">{mol.name}</div>
                          <div className="text-xs text-[#52635C] mt-0.5">
                            <FormulaText text={mol.formula} className="text-[#3A6E56] font-medium" /> · {mol.geometry}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedMolId(mol.id)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-[#3A6E56] text-white'
                              : 'bg-[#EDF1EC] text-[#2E3B36] hover:bg-[#DCE5DF]'
                          }`}
                        >
                          {active ? 'Показано' : 'Показать 3D'}
                        </button>
                      </div>
                      <p className="text-xs text-[#52635C] leading-relaxed">{mol.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Active 3D Viewport */}
              <div className="lg:col-span-7">
                {selectedMol && (
                  <MoleculeViewer3D
                    molecule={selectedMol}
                    heightClass="h-80 sm:h-96"
                    isSaved={savedMolIds.has(selectedMol.id)}
                    onToggleSave={onToggleSaveMolecule}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SCHEMES */}
      {activeTab === 'schemes' && (
        <div className="space-y-5">
          {isOrganic ? (
            <OrganicGeneticGraph
              highlightNodeId={topic.schemeNodeId}
              onOpenTopic={(id) => onNavigate({ page: 'topic', section: 'organic', topicId: id, level: activeLevel, tab: 'theory' })}
              onOpenReaction={(rxId) => onNavigate({ page: 'constructor', reactionId: rxId })}
            />
          ) : (
            <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-5">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#2E3B36]">
                  Генетические ряды неорганических соединений
                </h2>
                <p className="text-sm text-[#52635C] mt-1">
                  Основные переходы между простыми веществами, оксидами, гидроксидами и солями.
                </p>
              </div>
              <div className="space-y-4">
                {INORGANIC_GENETIC_ROWS.map((row, rIdx) => (
                  <div key={rIdx} className="bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl p-4 space-y-3">
                    <div className="text-sm font-semibold text-[#2E3B36]">{row.title}</div>
                    <div className="flex flex-wrap items-center gap-2">
                      {row.chain.map((node, nIdx) => (
                        <React.Fragment key={nIdx}>
                          <span className="px-3 py-1.5 bg-white border border-[#DDE3DF] rounded-lg text-sm font-medium text-[#2E3B36]">
                            <FormulaText text={node} />
                          </span>
                          {row.steps[nIdx] && (
                            <span className="inline-flex items-center gap-1 text-xs text-[#44658A] font-medium">
                              <ArrowRight className="w-3.5 h-3.5" />
                              <FormulaText text={row.steps[nIdx]} />
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TOPIC TASKS PREVIEW */}
      {activeTab === 'tasks' && (
        <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#2E3B36]">Задания по теме «{topic.title}»</h2>
              <p className="text-sm text-[#52635C]">
                Закрепите материал на практике — результаты автоматически сохранятся в личном кабинете.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'tasks', section: topic.section, topicId: topic.id })}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors cursor-pointer ${accentBtn}`}
            >
              Открыть тренажёр
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {topicTasks.length === 0 ? (
            <p className="text-sm text-[#52635C] py-4">
              Для этой темы перейдите в общий раздел заданий, чтобы тренироваться по всему разделу.
            </p>
          ) : (
            <div className="divide-y divide-[#DDE3DF] border border-[#DDE3DF] rounded-xl overflow-hidden">
              {topicTasks.map((t) => (
                <div key={t.id} className="p-4 bg-[#FAFBF9] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-[#52635C]">
                      №{t.number} ·{' '}
                      {t.type === 'test'
                        ? 'Тест'
                        : t.type === 'formula'
                        ? 'Ввод формулы'
                        : t.type === 'chain'
                        ? 'Цепочка реакций'
                        : 'Расчётная задача'}{' '}
                      · {t.level === 'base' ? 'База' : 'Углублённый'}
                    </div>
                    <div className="font-medium text-[#2E3B36] mt-0.5">{t.title}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate({ page: 'tasks', section: topic.section, topicId: topic.id })}
                    className="px-3.5 py-2 text-xs font-medium bg-white border border-[#DDE3DF] text-[#2E3B36] rounded-lg hover:border-[#4F8A6E] cursor-pointer"
                  >
                    Начать
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Large Bottom CTA: Go to Topic Tasks */}
      <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-[#2E3B36]">Готовы проверить знания?</h2>
          <p className="text-sm text-[#52635C]">
            Перейдите к интерактивным заданиям по теме «{topic.title}» с подсказками и разбором решений.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'tasks', section: topic.section, topicId: topic.id })}
          className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl transition-colors cursor-pointer whitespace-nowrap ${accentBtn}`}
        >
          Перейти к заданиям по теме
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
