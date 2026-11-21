import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Box,
  FlaskConical,
  Search,
  ShieldCheck,
  Table2,
} from 'lucide-react';
import type { AppRoute } from '../types/chemistry';
import { ELEMENTS } from '../data/elements';
import { MOLECULES } from '../data/molecules';
import { REACTIONS } from '../data/reactions';
import { GLOSSARY_TERMS } from '../data/tablesData';
import { TOPICS } from '../data/topics';
import { searchAllContent } from '../utils/chemistryLogic';
import { FormulaText } from './FormulaText';

interface GlobalSearchViewProps {
  query: string;
  onNavigate: (route: AppRoute) => void;
}

export const GlobalSearchView: React.FC<GlobalSearchViewProps> = ({ query, onNavigate }) => {
  const [input, setInput] = useState(query);

  const results = useMemo(
    () =>
      searchAllContent(query, {
        topics: TOPICS,
        molecules: MOLECULES,
        reactions: REACTIONS,
        elements: ELEMENTS,
        glossary: GLOSSARY_TERMS,
      }),
    [query],
  );

  const totalCount =
    results.topics.length +
    results.molecules.length +
    results.reactions.length +
    results.elements.length +
    results.glossary.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      onNavigate({ page: 'search', query: trimmed });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#2E3B36]">Поиск по порталу</h1>
          <p className="text-sm text-[#52635C] mt-1">
            Ищите темы, формулы веществ (например, H2SO4, C6H6), реакции, химические элементы и термины глоссария.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#52635C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введите запрос: алкены, бензол, H2SO4, медь, гидролиз…"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:outline-none focus:bg-white focus:border-[#4F8A6E]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#437265] hover:bg-[#365D52] text-white text-sm font-medium transition-colors cursor-pointer shrink-0"
          >
            Найти
          </button>
        </form>

        {query && (
          <div className="text-sm text-[#52635C]">
            По запросу <strong className="text-[#2E3B36]">«{query}»</strong> найдено совпадений:{' '}
            <strong className="text-[#2E3B36] tabular-nums">{totalCount}</strong>
          </div>
        )}
      </div>

      {query && totalCount === 0 && (
        <div className="bg-white border border-[#DDE3DF] rounded-2xl p-8 text-center space-y-3">
          <p className="text-base font-semibold text-[#2E3B36]">Ничего не найдено</p>
          <p className="text-sm text-[#52635C] max-w-md mx-auto">
            Попробуйте ввести формулу латинскими буквами (например, <span className="font-mono">C2H5OH</span> или{' '}
            <span className="font-mono">NaOH</span>), название класса веществ или химический термин.
          </p>
        </div>
      )}

      {/* Topics */}
      {results.topics.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-[#2E3B36] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#3A6E56]" />
            <span>Темы ({results.topics.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {results.topics.map((topic) => (
              <button
                key={topic.id}
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
                className="text-left bg-white border border-[#DDE3DF] hover:border-[#4F8A6E] rounded-xl p-4 transition-colors cursor-pointer flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs text-[#52635C]">
                    {topic.section === 'organic' ? 'Органическая химия' : 'Неорганическая химия'} ·{' '}
                    {topic.level === 'base' ? 'База' : 'Углублённый'}
                  </div>
                  <div className="font-semibold text-[#2E3B36]">{topic.title}</div>
                  <p className="text-xs text-[#52635C] line-clamp-2">{topic.shortDesc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#52635C] shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Molecules */}
      {results.molecules.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-[#2E3B36] flex items-center gap-2">
            <Box className="w-5 h-5 text-[#3A6E56]" />
            <span>3D-молекулы ({results.molecules.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {results.molecules.map((mol) => {
              const linkedTopic = TOPICS.find((t) => t.moleculeIds.includes(mol.id));
              return (
                <button
                  key={mol.id}
                  type="button"
                  onClick={() =>
                    linkedTopic
                      ? onNavigate({
                          page: 'topic',
                          section: linkedTopic.section,
                          topicId: linkedTopic.id,
                          level: linkedTopic.level,
                          tab: 'examples',
                        })
                      : onNavigate({ page: 'constructor' })
                  }
                  className="text-left bg-white border border-[#DDE3DF] hover:border-[#4F8A6E] rounded-xl p-4 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#2E3B36]">{mol.name}</span>
                    <span className="font-mono text-xs text-[#3A6E56]">
                      <FormulaText text={mol.formula} />
                    </span>
                  </div>
                  <div className="text-xs text-[#52635C]">
                    {mol.className} · {mol.geometry}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Reactions */}
      {results.reactions.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-[#2E3B36] flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#44658A]" />
            <span>Реакции из конструктора ({results.reactions.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {results.reactions.map((rx) => (
              <button
                key={rx.id}
                type="button"
                onClick={() => onNavigate({ page: 'constructor', reactionId: rx.id })}
                className="text-left bg-white border border-[#DDE3DF] hover:border-[#5B7FA6] rounded-xl p-4 transition-colors cursor-pointer space-y-1.5"
              >
                <div className="text-xs text-[#52635C]">
                  {rx.reactionType} · {rx.condition}
                </div>
                <div className="font-mono text-sm text-[#2E3B36] break-words">
                  <FormulaText text={rx.equation} />
                </div>
                <div className="text-xs text-[#52635C]">
                  {rx.startName} → {rx.productName}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Elements */}
      {results.elements.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-[#2E3B36] flex items-center gap-2">
            <Table2 className="w-5 h-5 text-[#44658A]" />
            <span>Химические элементы ({results.elements.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {results.elements.map((el) => (
              <button
                key={el.number}
                type="button"
                onClick={() => onNavigate({ page: 'tables', tab: 'periodic' })}
                className="text-left bg-white border border-[#DDE3DF] hover:border-[#5B7FA6] rounded-xl p-4 transition-colors cursor-pointer flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-xl bg-[#ECF2F7] text-[#44658A] font-display font-bold text-lg flex items-center justify-center shrink-0">
                  {el.symbol}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#2E3B36]">
                    {el.number}. {el.name}
                  </div>
                  <div className="text-xs text-[#52635C] font-mono">
                    {el.latinName} · Ar = {el.mass}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Glossary */}
      {results.glossary.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-[#2E3B36]">
            Термины глоссария ({results.glossary.length})
          </h2>
          <div className="space-y-2.5">
            {results.glossary.map((term) => (
              <div key={term.id} className="bg-white border border-[#DDE3DF] rounded-xl p-4 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-[#2E3B36]">{term.term}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate({ page: 'reference', anchor: 'glossary' })}
                    className="text-xs text-[#3A6E56] hover:underline cursor-pointer"
                  >
                    Открыть в глоссарии
                  </button>
                </div>
                <p className="text-xs text-[#52635C] leading-relaxed">{term.definition}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

interface NotFoundViewProps {
  onNavigate: (route: AppRoute) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-lg mx-auto bg-white border border-[#DDE3DF] rounded-2xl p-8 text-center space-y-4">
      <div className="font-mono text-4xl font-bold text-[#52635C]">404</div>
      <h1 className="font-display text-2xl font-bold text-[#2E3B36]">Страница не найдена</h1>
      <p className="text-sm text-[#52635C] leading-relaxed">
        Запрашиваемый раздел или тема перемещены или не существуют. Вернитесь на главную страницу или откройте нужный
        раздел курса.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onNavigate({ page: 'home' })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#437265] hover:bg-[#365D52] text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>На главную</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'section', section: 'organic', level: 'base' })}
          className="px-4 py-2.5 rounded-xl bg-[#F5F7F4] hover:bg-[#EBF3EE] border border-[#DDE3DF] text-sm font-medium text-[#2E3B36] transition-colors cursor-pointer"
        >
          Перейти к разделам
        </button>
      </div>
    </div>
  );
};

interface PrivacyPolicyViewProps {
  onNavigate: (route: AppRoute) => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white border border-[#DDE3DF] rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-[#3A6E56] shrink-0 mt-0.5" />
        <div>
          <h1 className="font-display text-2xl font-bold text-[#2E3B36]">
            Политика обработки персональных данных (152-ФЗ)
          </h1>
          <p className="text-xs text-[#52635C] mt-1">
            Образовательный портал «Химия: органика и неорганика» · редакция 2026 года
          </p>
        </div>
      </div>

      <div className="space-y-4 text-sm text-[#2E3B36] leading-relaxed">
        <section className="space-y-1.5">
          <h2 className="font-display text-base font-bold text-[#2E3B36]">1. Общие положения</h2>
          <p className="text-[#52635C]">
            Настоящая Политика определяет порядок обработки и защиты персональных данных пользователей образовательного
            веб-портала «Химия: органика и неорганика» в соответствии с Федеральным законом Российской Федерации от
            27.07.2006 № 152-ФЗ «О персональных данных».
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-display text-base font-bold text-[#2E3B36]">2. Состав обрабатываемых данных</h2>
          <p className="text-[#52635C]">
            При добровольной регистрации личного кабинета портал запрашивает минимально необходимый объём данных:
            фамилию, имя, отчество (ФИО), адрес электронной почты (email) и учебную роль (ученик/студент СПО или
            преподаватель), а также хранит учебную статистику (отмеченные темы, результаты выполненных заданий и
            избранные реакции). Доступ к теории, 3D-моделям, таблицам и справочнику предоставляется без регистрации.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-display text-base font-bold text-[#2E3B36]">3. Цели обработки</h2>
          <p className="text-[#52635C]">
            Персональные данные используются исключительно для идентификации пользователя в личном кабинете,
            подтверждения электронной почты, восстановления доступа к аккаунту и сохранения индивидуального прогресса
            обучения. Данные не передаются третьим лицам и не используются в рекламных целях.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-display text-base font-bold text-[#2E3B36]">4. Меры защиты и хранение</h2>
          <p className="text-[#52635C]">
            Пароли пользователей не хранятся в открытом виде — применяется криптографическое хэширование с
            индивидуальной солью (scrypt). Защита форм регистрации от автоматизированных атак обеспечивается
            арифметической проверкой и ограничением частоты запросов. Сессии защищены одноразовыми токенами.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-display text-base font-bold text-[#2E3B36]">5. Права субъекта персональных данных</h2>
          <p className="text-[#52635C]">
            Пользователь вправе в любой момент запросить сведения об обрабатываемых данных, уточнить их или отозвать
            согласие на обработку с полным удалением учётной записи.
          </p>
        </section>
      </div>

      <div className="pt-4 border-t border-[#DDE3DF] flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onNavigate({ page: 'auth', mode: 'register' })}
          className="px-4 py-2 rounded-xl bg-[#437265] hover:bg-[#365D52] text-white text-sm font-medium transition-colors cursor-pointer"
        >
          К регистрации
        </button>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'home' })}
          className="px-4 py-2 rounded-xl bg-[#F5F7F4] hover:bg-[#EBF3EE] border border-[#DDE3DF] text-sm font-medium text-[#2E3B36] transition-colors cursor-pointer"
        >
          На главную
        </button>
      </div>
    </div>
  );
};
