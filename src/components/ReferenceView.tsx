import React, { useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Search } from 'lucide-react';
import type { AppRoute } from '../types/chemistry';
import { GLOSSARY_TERMS, INORGANIC_GENETIC_ROWS, TABLE_USAGE_GUIDES } from '../data/tablesData';
import { getTopicById } from '../data/topics';
import { FormulaText } from './FormulaText';
import { OrganicGeneticGraph } from './OrganicGeneticGraph';

interface ReferenceViewProps {
  initialAnchor?: 'guides' | 'schemes' | 'glossary';
  onNavigate: (route: AppRoute) => void;
}

export const ReferenceView: React.FC<ReferenceViewProps> = ({ initialAnchor, onNavigate }) => {
  const [termQuery, setTermQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('Все');
  const [expandedId, setExpandedId] = useState<string | null>(GLOSSARY_TERMS[0]?.id || null);

  const letters = useMemo(() => {
    const uniq = Array.from(new Set(GLOSSARY_TERMS.map((g) => g.letter))).sort((a, b) => a.localeCompare(b, 'ru'));
    return ['Все', ...uniq];
  }, []);

  const filteredTerms = useMemo(() => {
    const q = termQuery.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((g) => {
      if (selectedLetter !== 'Все' && g.letter !== selectedLetter) return false;
      if (!q) return true;
      return (
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q) ||
        (g.formula && g.formula.toLowerCase().includes(q))
      );
    });
  }, [termQuery, selectedLetter]);

  return (
    <div className="space-y-8">
      {/* Header + Term Search */}
      <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2E3B36]">Справочник и глоссарий</h1>
          <p className="text-sm text-[#52635C] mt-1">
            Пояснения к таблицам, визуальные схемы превращений «класс → класс» и словарь химических терминов.
          </p>
        </div>

        <div className="relative max-w-xl">
          <label htmlFor="glossary-search" className="sr-only">
            Поиск по терминам глоссария
          </label>
          <input
            id="glossary-search"
            type="search"
            value={termQuery}
            onChange={(e) => setTermQuery(e.target.value)}
            placeholder="Поиск по терминам (например, амфотерность, изомеры, Ле Шателье)..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:bg-white focus:border-[#4F8A6E]"
          />
          <Search className="w-4 h-4 text-[#52635C] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Block 1: Table Usage Guides */}
      <section aria-labelledby="guides-heading" className={initialAnchor === 'guides' ? 'scroll-mt-24' : ''}>
        <h2 id="guides-heading" className="font-display text-xl font-semibold text-[#2E3B36] mb-4">
          Пояснения к справочным таблицам
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TABLE_USAGE_GUIDES.map((guide) => (
            <article key={guide.id} className="bg-white border border-[#DDE3DF] rounded-xl p-5 flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <h3 className="font-display text-base font-bold text-[#2E3B36]">{guide.title}</h3>
                <p className="text-sm text-[#52635C]">{guide.purpose}</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#2E3B36] leading-relaxed">
                  {guide.howTo.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <div className="bg-[#F5F7F4] rounded-lg p-3 text-xs text-[#2E3B36]">
                  <span className="font-semibold text-[#3A6E56]">Пример: </span>
                  {guide.example}
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onNavigate({
                    page: 'tables',
                    tab: guide.targetTab,
                    subTab: guide.subTab,
                  })
                }
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#3A6E56] hover:underline cursor-pointer self-start"
              >
                Открыть таблицу <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Block 2: Visual Schemes Class -> Class */}
      <section aria-labelledby="schemes-ref-heading" className="space-y-4">
        <h2 id="schemes-ref-heading" className="font-display text-xl font-semibold text-[#2E3B36]">
          Визуальные схемы превращений «класс → класс»
        </h2>

        <OrganicGeneticGraph
          onOpenTopic={(id) => onNavigate({ page: 'topic', section: 'organic', topicId: id, level: 'base', tab: 'theory' })}
          onOpenReaction={(rxId) => onNavigate({ page: 'constructor', reactionId: rxId })}
        />

        <div className="bg-white border border-[#DDE3DF] rounded-xl p-5 space-y-4">
          <h3 className="font-display font-semibold text-base text-[#2E3B36]">
            Генетические ряды неорганической химии
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INORGANIC_GENETIC_ROWS.map((row, idx) => (
              <div key={idx} className="bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl p-4 space-y-2.5">
                <div className="text-xs font-semibold text-[#44658A]">{row.title}</div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {row.chain.map((node, i) => (
                    <React.Fragment key={i}>
                      <span className="px-2.5 py-1 bg-white border border-[#DDE3DF] rounded-md font-medium text-[#2E3B36]">
                        <FormulaText text={node} />
                      </span>
                      {row.steps[i] && <span className="text-[#52635C]">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Block 3: Alphabetical Expandable Glossary */}
      <section aria-labelledby="glossary-heading" className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="glossary-heading" className="font-display text-xl font-semibold text-[#2E3B36]">
            Глоссарий терминов
          </h2>
          <span className="text-xs text-[#52635C] tabular-nums">Терминов: {filteredTerms.length}</span>
        </div>

        {/* Alphabet Filter */}
        <div className="flex flex-wrap gap-1" role="group" aria-label="Алфавитный фильтр">
          {letters.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => setSelectedLetter(letter)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedLetter === letter
                  ? 'bg-[#437265] text-white'
                  : 'bg-[#F5F7F4] text-[#2E3B36] hover:bg-[#EBF0EC]'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {filteredTerms.length === 0 ? (
          <p className="text-sm text-[#52635C] py-4">Термины по вашему запросу не найдены.</p>
        ) : (
          <div className="divide-y divide-[#DDE3DF] border border-[#DDE3DF] rounded-xl overflow-hidden">
            {filteredTerms.map((item) => {
              const isOpen = expandedId === item.id;
              const topic = item.relatedTopicId ? getTopicById(item.relatedTopicId) : undefined;
              return (
                <div key={item.id} className="bg-white">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpandedId(isOpen ? null : item.id)}
                    className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-[#FAFBF9] cursor-pointer"
                  >
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <span className="font-display font-semibold text-sm text-[#2E3B36]">{item.term}</span>
                      {item.formula && <FormulaText text={item.formula} className="text-xs text-[#3A6E56]" />}
                      <span className="text-xs text-[#52635C]">
                        · {item.section === 'organic' ? 'Органика' : item.section === 'inorganic' ? 'Неорганика' : 'Общая химия'}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#52635C] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#52635C] shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 bg-[#FAFBF9] border-t border-[#DDE3DF] space-y-2.5">
                      <p className="text-sm text-[#2E3B36] leading-relaxed">{item.definition}</p>
                      {topic && (
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate({
                              page: 'topic',
                              section: topic.section,
                              topicId: topic.id,
                              level: topic.level,
                              tab: 'theory',
                            })
                          }
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#3A6E56] hover:underline cursor-pointer"
                        >
                          Изучить тему «{topic.title}» <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
