import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Box,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import type {
  ChemSection,
  DifficultyLevel,
  Molecule3D,
  TaskAttempt,
  TaskData,
  TaskType,
  UserProfile,
} from '../types/chemistry';
import { TASKS } from '../data/tasks';
import { TOPICS, getTopicById } from '../data/topics';
import { getMoleculeById } from '../data/molecules';
import { checkTaskAnswer, type GradeResult } from '../utils/chemistryLogic';
import { FormulaText } from './FormulaText';
import { MoleculeViewer3D } from './MoleculeViewer3D';

interface TasksViewProps {
  initialSection?: ChemSection;
  initialTopicId?: string;
  initialLevel?: DifficultyLevel;
  initialType?: TaskType;
  user: UserProfile | null;
  onRecordAttempt: (attempt: Omit<TaskAttempt, 'id' | 'timestamp'>) => void;
  onToggleSaveMolecule: (mol: Molecule3D) => void;
}

const TYPE_LABELS: Record<TaskType, string> = {
  test: 'Тест',
  formula: 'Ввод формулы',
  chain: 'Цепочка реакций',
  calculation: 'Расчётная задача',
};

export const TasksView: React.FC<TasksViewProps> = ({
  initialSection,
  initialTopicId,
  initialLevel,
  initialType,
  user,
  onRecordAttempt,
  onToggleSaveMolecule,
}) => {
  const [sectionFilter, setSectionFilter] = useState<ChemSection | 'all'>(initialSection || 'all');
  const [topicFilter, setTopicFilter] = useState<string>(initialTopicId || 'all');
  const [levelFilter, setLevelFilter] = useState<DifficultyLevel | 'all'>(initialLevel || 'all');
  const [typeFilter, setTypeFilter] = useState<TaskType | 'all'>(initialType || 'all');

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [formulaInput, setFormulaInput] = useState('');
  const [chainInputs, setChainInputs] = useState<string[]>([]);
  const [numericInput, setNumericInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [grade, setGrade] = useState<GradeResult | null>(null);

  const availableTopics = useMemo(() => {
    return TOPICS.filter((t) => sectionFilter === 'all' || t.section === sectionFilter);
  }, [sectionFilter]);

  const filteredTasks = useMemo(() => {
    return TASKS.filter((t) => {
      if (sectionFilter !== 'all' && t.section !== sectionFilter) return false;
      if (topicFilter !== 'all' && t.topicId !== topicFilter) return false;
      if (levelFilter !== 'all' && t.level !== levelFilter) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      return true;
    });
  }, [sectionFilter, topicFilter, levelFilter, typeFilter]);

  const activeTask: TaskData | undefined = useMemo(() => {
    if (activeTaskId) {
      return filteredTasks.find((t) => t.id === activeTaskId) || TASKS.find((t) => t.id === activeTaskId);
    }
    return filteredTasks[0];
  }, [activeTaskId, filteredTasks]);

  const solvedIds = useMemo(() => {
    return new Set((user?.attempts || []).filter((a) => a.correct).map((a) => a.taskId));
  }, [user]);

  const resetInputsForTask = (task: TaskData) => {
    setActiveTaskId(task.id);
    setSelectedOption(null);
    setFormulaInput('');
    setChainInputs((task.chainSteps?.blanks || []).map(() => ''));
    setNumericInput('');
    setShowHint(false);
    setShow3D(false);
    setGrade(null);
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;
    const result = checkTaskAnswer(activeTask, {
      selectedOption,
      formulaInput,
      chainInputs:
        activeTask.type === 'chain'
          ? (activeTask.chainSteps?.blanks || []).map((_, idx) => chainInputs[idx] || '')
          : undefined,
      numericInput,
    });
    setGrade(result);
    if (result.normalizedUserAnswer) {
      onRecordAttempt({
        taskId: activeTask.id,
        topicId: activeTask.topicId,
        section: activeTask.section,
        level: activeTask.level,
        type: activeTask.type,
        taskTitle: activeTask.title,
        correct: result.correct,
        userAnswer: result.normalizedUserAnswer,
      });
    }
  };

  const handleNextTask = () => {
    if (!activeTask || filteredTasks.length === 0) return;
    const idx = filteredTasks.findIndex((t) => t.id === activeTask.id);
    const next = filteredTasks[(idx + 1) % filteredTasks.length];
    if (next) resetInputsForTask(next);
  };

  const linkedMol = activeTask?.moleculeId ? getMoleculeById(activeTask.moleculeId) : undefined;
  const savedMolIds = new Set(user?.savedMolecules.map((m) => m.moleculeId) || []);

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2E3B36]">Задания</h1>
            <p className="text-sm text-[#52635C] mt-1">
              Фильтруйте по разделу, теме, уровню и формату. Результаты автоматически сохраняются в профиль.
            </p>
          </div>
          <span className="text-xs text-[#52635C] tabular-nums">
            Найдено заданий: <strong className="text-[#2E3B36]">{filteredTasks.length}</strong> · Решено вами:{' '}
            <strong className="text-[#4E6D35]">{solvedIds.size}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div>
            <label htmlFor="filter-section" className="block text-xs font-medium text-[#52635C] mb-1">
              Раздел
            </label>
            <select
              id="filter-section"
              value={sectionFilter}
              onChange={(e) => {
                const next = e.target.value as ChemSection | 'all';
                setSectionFilter(next);
                setTopicFilter('all');
              }}
              className="w-full px-3 py-2 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-lg text-[#2E3B36]"
            >
              <option value="all">Все разделы</option>
              <option value="organic">Органическая химия</option>
              <option value="inorganic">Неорганическая химия</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-topic" className="block text-xs font-medium text-[#52635C] mb-1">
              Тема
            </label>
            <select
              id="filter-topic"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-lg text-[#2E3B36]"
            >
              <option value="all">Все темы</option>
              {availableTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.level === 'base' ? 'База' : 'Угл.'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-level" className="block text-xs font-medium text-[#52635C] mb-1">
              Уровень
            </label>
            <select
              id="filter-level"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as DifficultyLevel | 'all')}
              className="w-full px-3 py-2 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-lg text-[#2E3B36]"
            >
              <option value="all">Все уровни</option>
              <option value="base">База</option>
              <option value="advanced">Углублённый</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-type" className="block text-xs font-medium text-[#52635C] mb-1">
              Тип задания
            </label>
            <select
              id="filter-type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TaskType | 'all')}
              className="w-full px-3 py-2 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-lg text-[#2E3B36]"
            >
              <option value="all">Все типы</option>
              <option value="test">Тест</option>
              <option value="formula">Ввод формулы</option>
              <option value="chain">Цепочка реакций</option>
              <option value="calculation">Расчётная задача</option>
            </select>
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white border border-[#DDE3DF] rounded-2xl p-8 text-center space-y-3">
          <p className="text-base font-medium text-[#2E3B36]">По выбранным фильтрам заданий не найдено.</p>
          <button
            type="button"
            onClick={() => {
              setSectionFilter('all');
              setTopicFilter('all');
              setLevelFilter('all');
              setTypeFilter('all');
            }}
            className="px-4 py-2 text-sm font-medium bg-[#437265] text-white rounded-lg hover:bg-[#355D52] cursor-pointer"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Task Cards List */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[680px] overflow-y-auto chem-scroll pr-1">
            {filteredTasks.map((task) => {
              const isSelected = activeTask?.id === task.id;
              const isSolved = solvedIds.has(task.id);
              const topic = getTopicById(task.topicId);
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => resetInputsForTask(task)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-[#FAFDFB] border-[#4F8A6E]'
                      : 'bg-white border-[#DDE3DF] hover:border-[#9EB3A8]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-[#52635C]">
                    <span className="tabular-nums">
                      №{task.number} · {TYPE_LABELS[task.type]} · {task.level === 'base' ? 'База' : 'Углублённый'}
                    </span>
                    {isSolved && (
                      <span className="inline-flex items-center gap-1 text-[#4E6D35] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Решено
                      </span>
                    )}
                  </div>
                  <div className="font-display font-semibold text-sm text-[#2E3B36]">{task.title}</div>
                  <div className="text-xs text-[#52635C]">
                    {task.section === 'organic' ? 'Органика' : 'Неорганика'} · {topic?.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Task Runner */}
          {activeTask && (
            <div className="lg:col-span-7 space-y-4">
              <form
                onSubmit={handleCheck}
                className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-5"
              >
                <div className="space-y-1.5 border-b border-[#DDE3DF] pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#52635C]">
                    <span>
                      Задание №{activeTask.number} · {TYPE_LABELS[activeTask.type]} ·{' '}
                      {activeTask.level === 'base' ? 'База' : 'Углублённый'}
                    </span>
                    {linkedMol && (
                      <button
                        type="button"
                        onClick={() => setShow3D((v) => !v)}
                        className="inline-flex items-center gap-1 text-[#3A6E56] font-medium hover:underline cursor-pointer"
                      >
                        <Box className="w-3.5 h-3.5" />
                        {show3D ? 'Скрыть 3D-модель' : `3D-модель: ${linkedMol.name}`}
                      </button>
                    )}
                  </div>
                  <h2 className="font-display text-xl font-bold text-[#2E3B36]">{activeTask.title}</h2>
                </div>

                <p className="text-base text-[#2E3B36] leading-relaxed">{activeTask.prompt}</p>

                {/* Input UI per Task Type */}
                {activeTask.type === 'test' && activeTask.options && (
                  <fieldset className="space-y-2.5">
                    <legend className="sr-only">Варианты ответа</legend>
                    {activeTask.options.map((opt, idx) => {
                      const picked = selectedOption === idx;
                      return (
                        <label
                          key={idx}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                            picked
                              ? 'bg-[#EBF3EE] border-[#4F8A6E] text-[#2E3B36]'
                              : 'bg-[#FAFBF9] border-[#DDE3DF] hover:border-[#A8BDB2]'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`task-${activeTask.id}`}
                            checked={picked}
                            onChange={() => setSelectedOption(idx)}
                            className="accent-[#3A6E56] w-4 h-4 shrink-0"
                          />
                          <span className="text-sm text-[#2E3B36]">{opt}</span>
                        </label>
                      );
                    })}
                  </fieldset>
                )}

                {activeTask.type === 'formula' && (
                  <div className="space-y-1.5">
                    <label htmlFor="task-formula-input" className="block text-sm font-medium text-[#2E3B36]">
                      Введите химическую формулу
                    </label>
                    <input
                      id="task-formula-input"
                      type="text"
                      value={formulaInput}
                      onChange={(e) => setFormulaInput(e.target.value)}
                      placeholder="Например: C2H5OH или SO3"
                      className="w-full px-4 py-3 text-base font-mono bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:bg-white focus:border-[#4F8A6E]"
                    />
                    <p className="text-xs text-[#52635C]">
                      Индексы можно вводить обычными цифрами (например, H2SO4 или CH3Cl).
                    </p>
                  </div>
                )}

                {activeTask.type === 'chain' && activeTask.chainSteps && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-base font-medium text-[#2E3B36]">
                      <FormulaText text={activeTask.chainSteps.sequence} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeTask.chainSteps.blanks.map((blank, idx) => (
                        <div key={idx} className="space-y-1">
                          <label htmlFor={`chain-blank-${idx}`} className="block text-xs font-medium text-[#52635C]">
                            {blank.label}
                          </label>
                          <input
                            id={`chain-blank-${idx}`}
                            type="text"
                            value={chainInputs[idx] || ''}
                            onChange={(e) => {
                              const next = [...chainInputs];
                              next[idx] = e.target.value;
                              setChainInputs(next);
                            }}
                            placeholder={blank.placeholder}
                            className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:bg-white focus:border-[#4F8A6E]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTask.type === 'calculation' && activeTask.calculationAnswer && (
                  <div className="space-y-1.5">
                    <label htmlFor="task-calc-input" className="block text-sm font-medium text-[#2E3B36]">
                      Числовой ответ ({activeTask.calculationAnswer.unit})
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="task-calc-input"
                        type="text"
                        inputMode="decimal"
                        value={numericInput}
                        onChange={(e) => setNumericInput(e.target.value)}
                        placeholder="Введите число..."
                        className="flex-1 px-4 py-3 text-base font-mono tabular-nums bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:bg-white focus:border-[#4F8A6E]"
                      />
                      <span className="px-3.5 py-3 text-sm font-medium bg-[#EDF1EC] text-[#2E3B36] rounded-xl">
                        {activeTask.calculationAnswer.unit}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-sm font-semibold bg-[#437265] text-white rounded-xl hover:bg-[#355D52] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Проверить
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowHint((v) => !v)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-[#EDF1EC] text-[#2E3B36] rounded-xl hover:bg-[#DCE5DF] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <HelpCircle className="w-4 h-4" />
                      {showHint ? 'Скрыть подсказку' : 'Подсказка'}
                    </button>
                  </div>

                  {grade && (
                    <button
                      type="button"
                      onClick={handleNextTask}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-white border border-[#DDE3DF] text-[#2E3B36] rounded-xl hover:border-[#4F8A6E] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Следующее задание
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Hint Panel */}
                {showHint && (
                  <div className="bg-[#FAFBF9] border border-[#DDE3DF] rounded-xl p-4 text-sm text-[#2E3B36]">
                    <span className="font-semibold text-[#3A6E56]">Подсказка: </span>
                    {activeTask.hint}
                  </div>
                )}

                {/* Grading Result & Detailed Breakdown */}
                {grade && (
                  <div
                    role="status"
                    className={`rounded-xl p-4 border space-y-2 ${
                      grade.correct
                        ? 'bg-[#EFF5EA] border-[#7BA05B] text-[#2E3B36]'
                        : 'bg-[#F9EFEA] border-[#B8735A] text-[#2E3B36]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`inline-flex items-center gap-2 font-display font-semibold text-sm ${
                          grade.correct ? 'text-[#4E6D35]' : 'text-[#8F4F39]'
                        }`}
                      >
                        {grade.correct ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {grade.correct ? 'Верно' : 'Есть ошибка'}
                      </div>
                      {!grade.correct && (
                        <button
                          type="button"
                          onClick={() => setGrade(null)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#8F4F39] hover:underline cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Попробовать ещё раз
                        </button>
                      )}
                    </div>
                    <p className="text-sm">{grade.feedback}</p>
                    <div className="pt-2 border-t border-black/10 text-sm leading-relaxed">
                      <span className="font-semibold">Разбор решения: </span>
                      {activeTask.explanation}
                    </div>
                    {!user && (
                      <p className="text-xs text-[#52635C] pt-1">
                        Войдите в аккаунт, чтобы сохранять историю решений и прогресс по темам.
                      </p>
                    )}
                  </div>
                )}
              </form>

              {show3D && linkedMol && (
                <MoleculeViewer3D
                  molecule={linkedMol}
                  heightClass="h-72"
                  isSaved={savedMolIds.has(linkedMol.id)}
                  onToggleSave={onToggleSaveMolecule}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
