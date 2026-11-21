import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, FlaskConical, Search, Table2 } from 'lucide-react';
import type { AppRoute, ChemSection, DifficultyLevel, UserProfile } from '../types/chemistry';
import { TOPICS } from '../data/topics';
import { TASKS } from '../data/tasks';
import { FormulaText } from './FormulaText';

interface SectionViewProps {
  section: ChemSection;
  level: DifficultyLevel;
  user: UserProfile | null;
  onNavigate: (route: AppRoute) => void;
}

export const SectionView: React.FC<SectionViewProps> = ({ section, level, user, onNavigate }) => {
  const isOrganic = section === 'organic';
  const filteredTopics = TOPICS.filter((t) => t.section === section && t.level === level);
  const completedSet = new Set(user?.completedTopicIds || []);

  const accentText = isOrganic ? 'text-[#3A6E56]' : 'text-[#44658A]';
  const accentBg = isOrganic ? 'bg-[#3A6E56] hover:bg-[#2F5B47]' : 'bg-[#44658A] hover:bg-[#375372]';
  const accentSoftBg = isOrganic ? 'bg-[#EBF3EE]' : 'bg-[#ECF2F7]';
  const accentBorderHover = isOrganic ? 'hover:border-[#4F8A6E]' : 'hover:border-[#5B7FA6]';

  return (
    <div className="space-y-6">
      {/* Header + Prominent Section & Level Switchers */}
      <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-[#52635C]">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'section', section: 'organic', level })}
              className={`font-medium cursor-pointer ${isOrganic ? 'text-[#3A6E56] underline underline-offset-4' : 'hover:text-[#2E3B36]'}`}
            >
              Органическая химия
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'section', section: 'inorganic', level })}
              className={`font-medium cursor-pointer ${!isOrganic ? 'text-[#44658A] underline underline-offset-4' : 'hover:text-[#2E3B36]'}`}
            >
              Неорганическая химия
            </button>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2E3B36]">
            {isOrganic ? 'Органическая химия' : 'Неорганическая химия'}
          </h1>
          <p className="text-sm text-[#52635C] leading-relaxed">
            {isOrganic
              ? 'Изучайте классы органических соединений, строение молекул в 3D, механизмы реакций и генетические цепочки превращений.'
              : 'Классы неорганических веществ, окислительно-восстановительные процессы, электролиз, комплексы, термодинамика и равновесия.'}
          </p>
        </div>

        {/* Always-visible Base / Advanced Level Switcher */}
        <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0">
          <span className="text-xs font-medium text-[#52635C]">Уровень сложности</span>
          <div
            className="inline-flex items-center p-1 bg-[#EDF1EC] border border-[#DDE3DF] rounded-xl"
            role="tablist"
            aria-label="Переключатель уровня сложности"
          >
            <button
              type="button"
              role="tab"
              aria-selected={level === 'base'}
              onClick={() => onNavigate({ page: 'section', section, level: 'base' })}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                level === 'base'
                  ? `${isOrganic ? 'bg-[#3A6E56]' : 'bg-[#44658A]'} text-white`
                  : 'text-[#52635C] hover:text-[#2E3B36]'
              }`}
            >
              База
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={level === 'advanced'}
              onClick={() => onNavigate({ page: 'section', section, level: 'advanced' })}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                level === 'advanced'
                  ? `${isOrganic ? 'bg-[#3A6E56]' : 'bg-[#44658A]'} text-white`
                  : 'text-[#52635C] hover:text-[#2E3B36]'
              }`}
            >
              Углублённый
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid + Right Reference Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between text-sm text-[#52635C]">
            <span>
              Темы уровня «<strong className="text-[#2E3B36]">{level === 'base' ? 'База' : 'Углублённый'}</strong>» ·{' '}
              <span className="tabular-nums">{filteredTopics.length}</span>
            </span>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'tasks', section, level })}
              className={`text-xs font-medium ${accentText} hover:underline cursor-pointer`}
            >
              Все задания этого уровня →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTopics.map((topic, idx) => {
              const isDone = completedSet.has(topic.id);
              const taskCount = TASKS.filter((t) => t.topicId === topic.id).length;

              return (
                <article
                  key={topic.id}
                  className={`bg-white border border-[#DDE3DF] rounded-xl p-5 flex flex-col justify-between gap-4 transition-colors ${accentBorderHover}`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#52635C]">
                      <span className="tabular-nums">
                        {String(idx + 1).padStart(2, '0')}. {level === 'base' ? 'База' : 'Углублённый'}
                      </span>
                      {isDone && (
                        <span className="inline-flex items-center gap-1 text-[#4E6D35] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Изучено
                        </span>
                      )}
                    </div>

                    <h2 className="font-display text-lg font-semibold text-[#2E3B36] leading-snug">{topic.title}</h2>

                    {topic.generalFormula && (
                      <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${accentSoftBg} ${accentText}`}>
                        <FormulaText text={topic.generalFormula} />
                      </div>
                    )}

                    <p className="text-sm text-[#52635C] leading-relaxed">{topic.shortDesc}</p>
                  </div>

                  <div className="pt-3 border-t border-[#DDE3DF] flex items-center justify-between gap-2">
                    <span className="text-xs text-[#52635C] tabular-nums">
                      ~{topic.estimatedMinutes} мин · {taskCount} зад. · {topic.moleculeIds.length} 3D
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate({ page: 'topic', section, topicId: topic.id, level, tab: 'theory' })}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap ${accentBg}`}
                    >
                      Открыть
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Tables · Reference · Glossary · Constructor */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-[#DDE3DF] rounded-xl p-5 space-y-3">
            <h2 className="font-display text-base font-semibold text-[#2E3B36]">Быстрые материалы</h2>
            <p className="text-xs text-[#52635C]">Открываются из любого раздела без потери контекста.</p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate({ page: 'tables', tab: 'periodic' })}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm font-medium bg-[#F5F7F4] hover:bg-[#EBF3EE] text-[#2E3B36] rounded-lg transition-colors cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <Table2 className="w-4 h-4 text-[#5B7FA6]" />
                  Таблицы и Менделеев
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#52635C]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate({ page: 'reference', anchor: 'guides' })}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm font-medium bg-[#F5F7F4] hover:bg-[#EBF3EE] text-[#2E3B36] rounded-lg transition-colors cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#4F8A6E]" />
                  Справочник и схемы
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#52635C]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate({ page: 'reference', anchor: 'glossary' })}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm font-medium bg-[#F5F7F4] hover:bg-[#EBF3EE] text-[#2E3B36] rounded-lg transition-colors cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#4F8A6E]" />
                  Глоссарий терминов
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#52635C]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate({ page: 'constructor' })}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm font-medium bg-[#F5F7F4] hover:bg-[#EBF3EE] text-[#2E3B36] rounded-lg transition-colors cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-[#437265]" />
                  Конструктор реакций
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#52635C]" />
              </button>
            </div>
          </div>

          <div className={`border border-[#DDE3DF] rounded-xl p-5 space-y-2 ${accentSoftBg}`}>
            <h3 className="font-display text-sm font-semibold text-[#2E3B36]">
              {isOrganic ? 'Схемы органики' : 'Таблица растворимости'}
            </h3>
            <p className="text-xs text-[#52635C] leading-relaxed">
              {isOrganic
                ? 'Визуальная карта переходов «класс → класс» помогает быстро повторять цепочки превращений.'
                : 'Проверяйте выпадение осадков и активность металлов в один клик.'}
            </p>
            <button
              type="button"
              onClick={() =>
                onNavigate(
                  isOrganic
                    ? { page: 'tables', tab: 'schemes' }
                    : { page: 'tables', tab: 'general', subTab: 'solubility' },
                )
              }
              className={`text-xs font-medium ${accentText} hover:underline cursor-pointer`}
            >
              Открыть сейчас →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
