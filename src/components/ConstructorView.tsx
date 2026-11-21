import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Search,
  Sparkles,
} from 'lucide-react';
import type { ChemSection, DifficultyLevel, Molecule3D, ReactionData, UserProfile } from '../types/chemistry';
import { REACTIONS, getReactionById } from '../data/reactions';
import { getMoleculeById, MOLECULES } from '../data/molecules';
import { findMatchingReactions } from '../utils/chemistryLogic';
import { FormulaText } from './FormulaText';
import { MoleculeViewer3D } from './MoleculeViewer3D';

interface ConstructorViewProps {
  initialReactionId?: string;
  user: UserProfile | null;
  onToggleSaveReaction: (rx: ReactionData) => void;
  onToggleSaveMolecule: (mol: Molecule3D) => void;
}

export const ConstructorView: React.FC<ConstructorViewProps> = ({
  initialReactionId,
  user,
  onToggleSaveReaction,
  onToggleSaveMolecule,
}) => {
  const initialRx = initialReactionId ? getReactionById(initialReactionId) : REACTIONS[2]; // Ethene + H2O default

  const [sectionFilter, setSectionFilter] = useState<ChemSection | 'all'>('all');
  const [levelFilter, setLevelFilter] = useState<DifficultyLevel | 'all'>('all');

  const [startFormula, setStartFormula] = useState<string>(initialRx?.startFormula || 'C2H4');
  const [manualFormula, setManualFormula] = useState<string>('');
  const [selectedReagent, setSelectedReagent] = useState<string>(initialRx?.reagent || 'H2O');
  const [conditionInput, setConditionInput] = useState<string>('');
  const [activeReaction, setActiveReaction] = useState<ReactionData | null>(initialRx || REACTIONS[0]);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [catalogQuery, setCatalogQuery] = useState('');

  // Unique starting formulas for Step 1 dropdown
  const uniqueStarts = useMemo(() => {
    const map = new Map<string, { formula: string; name: string; section: ChemSection }>();
    for (const r of REACTIONS) {
      if (sectionFilter !== 'all' && r.section !== sectionFilter) continue;
      if (levelFilter !== 'all' && r.level !== levelFilter) continue;
      if (!map.has(r.startFormula)) {
        map.set(r.startFormula, { formula: r.startFormula, name: r.startName, section: r.section });
      }
    }
    return Array.from(map.values());
  }, [sectionFilter, levelFilter]);

  const effectiveStart = manualFormula.trim() || startFormula;

  // Compatible reagents for Step 2 given Step 1
  const compatibleReactions = useMemo(() => {
    return findMatchingReactions(REACTIONS, {
      startFormula: effectiveStart,
      section: sectionFilter,
      level: levelFilter,
    });
  }, [effectiveStart, sectionFilter, levelFilter]);

  const handleSelectStart = (formula: string) => {
    setStartFormula(formula);
    setManualFormula('');
    const matches = findMatchingReactions(REACTIONS, {
      startFormula: formula,
      section: sectionFilter,
      level: levelFilter,
    });
    if (matches.length > 0) {
      setSelectedReagent(matches[0].reagent);
      setActiveReaction(matches[0]);
      setActiveStepIdx(0);
    }
  };

  const handleBuildReaction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const exact = findMatchingReactions(REACTIONS, {
      startFormula: effectiveStart,
      reagent: selectedReagent,
      condition: conditionInput,
    });
    if (exact.length > 0) {
      setActiveReaction(exact[0]);
      setActiveStepIdx(0);
      return;
    }
    const byStart = findMatchingReactions(REACTIONS, {
      startFormula: effectiveStart,
      reagent: selectedReagent,
    });
    if (byStart.length > 0) {
      setActiveReaction(byStart[0]);
      setActiveStepIdx(0);
      return;
    }
    if (compatibleReactions.length > 0) {
      setActiveReaction(compatibleReactions[0]);
      setActiveStepIdx(0);
    } else {
      setActiveReaction(null);
    }
  };

  const catalogList = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase();
    return REACTIONS.filter((r) => {
      if (sectionFilter !== 'all' && r.section !== sectionFilter) return false;
      if (levelFilter !== 'all' && r.level !== levelFilter) return false;
      if (!q) return true;
      return (
        r.equation.toLowerCase().includes(q) ||
        r.startName.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.reactionType.toLowerCase().includes(q)
      );
    }).slice(0, 24);
  }, [catalogQuery, sectionFilter, levelFilter]);

  const productMol = activeReaction
    ? getMoleculeById(activeReaction.productMoleculeId) || MOLECULES[0]
    : MOLECULES[0];

  const savedReactionIds = new Set(user?.savedReactions.map((r) => r.reactionId) || []);
  const savedMolIds = new Set(user?.savedMolecules.map((m) => m.moleculeId) || []);
  const isRxSaved = activeReaction ? savedReactionIds.has(activeReaction.id) : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2E3B36]">Конструктор реакций</h1>
          <p className="text-sm text-[#52635C] mt-1">
            Выберите исходное вещество и реагент — получите уравнение, структурную формулу, 3D-модель продукта и пошаговый механизм.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="inline-flex p-1 bg-[#EDF1EC] rounded-lg text-xs" role="group" aria-label="Раздел реакций">
            {(
              [
                { id: 'all', label: 'Все' },
                { id: 'organic', label: 'Органика' },
                { id: 'inorganic', label: 'Неорганика' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSectionFilter(s.id)}
                className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                  sectionFilter === s.id ? 'bg-white text-[#2E3B36] shadow-xs' : 'text-[#52635C]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="inline-flex p-1 bg-[#EDF1EC] rounded-lg text-xs" role="group" aria-label="Уровень реакций">
            {(
              [
                { id: 'all', label: 'Все уровни' },
                { id: 'base', label: 'База' },
                { id: 'advanced', label: 'Углублённый' },
              ] as const
            ).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLevelFilter(l.id)}
                className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                  levelFilter === l.id ? 'bg-white text-[#2E3B36] shadow-xs' : 'text-[#52635C]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Step Constructor Workflow */}
      <form onSubmit={handleBuildReaction} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Step 1: Starting Formula */}
        <div className="lg:col-span-5 bg-white border border-[#DDE3DF] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-base text-[#2E3B36]">Шаг 1. Исходная формула</h2>
            <span className="text-xs text-[#52635C] tabular-nums">{uniqueStarts.length} веществ</span>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="rx-start-select" className="block text-xs font-medium text-[#52635C] mb-1">
                Выбрать из базы
              </label>
              <select
                id="rx-start-select"
                value={startFormula}
                onChange={(e) => handleSelectStart(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36]"
              >
                {uniqueStarts.map((item) => (
                  <option key={item.formula} value={item.formula}>
                    {item.formula} — {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rx-manual-input" className="block text-xs font-medium text-[#52635C] mb-1">
                Или ввести формулу вручную
              </label>
              <input
                id="rx-manual-input"
                type="text"
                value={manualFormula}
                onChange={(e) => setManualFormula(e.target.value)}
                placeholder="Например: C2H4, CH4, CuO, SO3, NaOH..."
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:bg-white focus:border-[#4F8A6E]"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Reagent & Condition */}
        <div className="lg:col-span-7 bg-white border border-[#DDE3DF] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-base text-[#2E3B36]">Шаг 2. Реагент и условия</h2>
            <span className="text-xs text-[#52635C] tabular-nums">
              Совместимых реакций: <strong className="text-[#2E3B36]">{compatibleReactions.length}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="rx-reagent-select" className="block text-xs font-medium text-[#52635C] mb-1">
                Реагент для <FormulaText text={effectiveStart} className="font-semibold text-[#2E3B36]" />
              </label>
              <select
                id="rx-reagent-select"
                value={selectedReagent}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedReagent(val);
                  const found = compatibleReactions.find((r) => r.reagent === val);
                  if (found) {
                    setActiveReaction(found);
                    setActiveStepIdx(0);
                  }
                }}
                className="w-full px-3 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36]"
              >
                {compatibleReactions.length === 0 ? (
                  <option value="">Нет реакций для этой формулы</option>
                ) : (
                  compatibleReactions.map((r) => (
                    <option key={r.id} value={r.reagent}>
                      + {r.reagent} ({r.reagentName})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="rx-cond-input" className="block text-xs font-medium text-[#52635C] mb-1">
                Условия (t°, катализатор, среда)
              </label>
              <input
                id="rx-cond-input"
                type="text"
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                placeholder={activeReaction?.condition || 'Например: t°, H2SO4, свет hν'}
                className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:bg-white focus:border-[#4F8A6E]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {compatibleReactions.slice(0, 5).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSelectedReagent(r.reagent);
                    setActiveReaction(r);
                    setActiveStepIdx(0);
                  }}
                  className={`px-2.5 py-1 text-xs rounded-lg border cursor-pointer transition-colors ${
                    activeReaction?.id === r.id
                      ? 'bg-[#3A6E56] text-white border-[#3A6E56]'
                      : 'bg-[#F5F7F4] text-[#2E3B36] border-[#DDE3DF] hover:border-[#4F8A6E]'
                  }`}
                >
                  + <FormulaText text={r.reagent} />
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#437265] text-white rounded-xl hover:bg-[#355D52] transition-colors cursor-pointer whitespace-nowrap"
            >
              <FlaskConical className="w-4 h-4" />
              Построить реакцию
            </button>
          </div>
        </div>
      </form>

      {/* Step 3: Result — Equation, Structural Formula, 3D Model & Step-by-step Structure Change */}
      {activeReaction ? (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs text-[#52635C]">
                    Шаг 3. Результат ·{' '}
                    <span className={activeReaction.section === 'organic' ? 'text-[#3A6E56] font-medium' : 'text-[#44658A] font-medium'}>
                      {activeReaction.section === 'organic' ? 'Органическая химия' : 'Неорганическая химия'}
                    </span>{' '}
                    · {activeReaction.level === 'base' ? 'База' : 'Углублённый'} · {activeReaction.reactionType}
                  </div>
                  <h2 className="font-display text-xl font-bold text-[#2E3B36]">{activeReaction.productName}</h2>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleSaveReaction(activeReaction)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
                    isRxSaved
                      ? 'bg-[#EBF3EE] border-[#4F8A6E] text-[#3A6E56]'
                      : 'bg-white border-[#DDE3DF] text-[#2E3B36] hover:border-[#4F8A6E]'
                  }`}
                >
                  {isRxSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {isRxSaved ? 'Сохранено в профиле' : 'Сохранить в профиль'}
                </button>
              </div>

              {/* Balanced Equation Box */}
              <div className="bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl p-4 space-y-2">
                <div className="text-xs text-[#52635C]">Уравнение реакции</div>
                <div className="text-lg sm:text-xl font-semibold text-[#2E3B36]" data-testid="constructor-equation">
                  <FormulaText text={activeReaction.equation} />
                </div>
                <div className="text-xs text-[#52635C]">
                  Условия: <strong className="text-[#2E3B36] font-medium">{activeReaction.condition}</strong>
                </div>
              </div>

              {/* Structural Product Formula */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#FAFBF9] border border-[#DDE3DF] rounded-xl p-3.5">
                  <div className="text-xs text-[#52635C]">Структурная формула продукта</div>
                  <div className="text-base font-medium text-[#3A6E56] mt-1">
                    <FormulaText text={activeReaction.structuralProduct} />
                  </div>
                </div>
                <div className="bg-[#FAFBF9] border border-[#DDE3DF] rounded-xl p-3.5">
                  <div className="text-xs text-[#52635C]">Пояснение</div>
                  <p className="text-xs text-[#2E3B36] mt-1 leading-relaxed">{activeReaction.summary}</p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Structural Transformation */}
            <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display font-semibold text-base text-[#2E3B36]">
                  Пошаговый показ изменения структуры
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={activeStepIdx === 0}
                    onClick={() => setActiveStepIdx((i) => Math.max(0, i - 1))}
                    aria-label="Предыдущий шаг"
                    className="p-1.5 rounded-lg border border-[#DDE3DF] text-[#2E3B36] disabled:opacity-35 hover:bg-[#F5F7F4] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono tabular-nums text-[#52635C] px-1">
                    {activeStepIdx + 1} / {activeReaction.steps.length}
                  </span>
                  <button
                    type="button"
                    disabled={activeStepIdx === activeReaction.steps.length - 1}
                    onClick={() => setActiveStepIdx((i) => Math.min(activeReaction.steps.length - 1, i + 1))}
                    aria-label="Следующий шаг"
                    className="p-1.5 rounded-lg border border-[#DDE3DF] text-[#2E3B36] disabled:opacity-35 hover:bg-[#F5F7F4] cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {activeReaction.steps.map((st, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStepIdx(idx)}
                    className={`p-2.5 text-left rounded-xl border text-xs transition-colors cursor-pointer ${
                      idx === activeStepIdx
                        ? 'bg-[#EBF3EE] border-[#4F8A6E] text-[#2E3B36] font-semibold'
                        : 'bg-[#FAFBF9] border-[#DDE3DF] text-[#52635C] hover:border-[#A9BCB2]'
                    }`}
                  >
                    {st.title}
                  </button>
                ))}
              </div>

              {activeReaction.steps[activeStepIdx] && (
                <div className="bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl p-4 space-y-2">
                  <div className="font-display font-semibold text-sm text-[#2E3B36]">
                    {activeReaction.steps[activeStepIdx].title}
                  </div>
                  <div className="text-base font-medium text-[#3A6E56]">
                    <FormulaText text={activeReaction.steps[activeStepIdx].stateFormula} />
                  </div>
                  <p className="text-sm text-[#2E3B36] leading-relaxed">
                    {activeReaction.steps[activeStepIdx].description}
                  </p>
                  <div className="text-xs text-[#52635C] pt-1">
                    Изменение связей: <strong className="text-[#2E3B36]">{activeReaction.steps[activeStepIdx].bondChange}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: 3D Product Molecule */}
          <div className="lg:col-span-5">
            <MoleculeViewer3D
              molecule={productMol}
              heightClass="h-80 sm:h-96"
              isSaved={savedMolIds.has(productMol.id)}
              onToggleSave={onToggleSaveMolecule}
            />
          </div>
        </section>
      ) : (
        <div className="bg-white border border-[#DDE3DF] rounded-2xl p-8 text-center space-y-2">
          <Sparkles className="w-6 h-6 text-[#52635C] mx-auto" />
          <p className="font-medium text-[#2E3B36]">
            Реакция для комбинации «{effectiveStart} + {selectedReagent}» не найдена в базе.
          </p>
          <p className="text-sm text-[#52635C]">
            Выберите исходное вещество из списка выше или воспользуйтесь каталогом ниже.
          </p>
        </div>
      )}

      {/* Browsable Reaction Database Catalog */}
      <section className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#2E3B36]">
              Каталог базы реакций ({REACTIONS.length} реакций)
            </h2>
            <p className="text-xs text-[#52635C]">Нажмите на любую реакцию, чтобы загрузить её в конструктор и 3D-просмотр.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <label htmlFor="rx-catalog-search" className="sr-only">
              Поиск по базе реакций
            </label>
            <input
              id="rx-catalog-search"
              type="search"
              value={catalogQuery}
              onChange={(e) => setCatalogQuery(e.target.value)}
              placeholder="Поиск: этанол, BaSO4, электролиз..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-lg text-[#2E3B36]"
            />
            <Search className="w-4 h-4 text-[#52635C] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {catalogList.map((rx) => (
            <button
              key={rx.id}
              type="button"
              onClick={() => {
                setStartFormula(rx.startFormula);
                setManualFormula('');
                setSelectedReagent(rx.reagent);
                setActiveReaction(rx);
                setActiveStepIdx(0);
              }}
              className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer space-y-1 ${
                activeReaction?.id === rx.id
                  ? 'bg-[#FAFDFB] border-[#4F8A6E]'
                  : 'bg-[#FAFBF9] border-[#DDE3DF] hover:border-[#9EB3A8]'
              }`}
            >
              <div className="text-[11px] text-[#52635C]">
                {rx.section === 'organic' ? 'Органика' : 'Неорганика'} · {rx.level === 'base' ? 'База' : 'Угл.'} · {rx.reactionType}
              </div>
              <div className="text-sm font-medium text-[#2E3B36] truncate">
                <FormulaText text={rx.equation} />
              </div>
              <div className="text-xs text-[#52635C] flex items-center justify-between gap-2">
                <span className="truncate">{rx.productName}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
