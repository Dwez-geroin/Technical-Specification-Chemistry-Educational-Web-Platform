import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckSquare,
  FlaskConical,
  Search,
  Table2,
  UserPlus,
} from 'lucide-react';
import type { AppRoute, UserProfile } from '../types/chemistry';
import { MOLECULES } from '../data/molecules';
import { REACTIONS } from '../data/reactions';
import { TASKS } from '../data/tasks';
import { TOPICS } from '../data/topics';
import { MoleculeViewer3D } from './MoleculeViewer3D';

interface HomeViewProps {
  user: UserProfile | null;
  onNavigate: (route: AppRoute) => void;
}

const FEATURED_MOL_IDS = ['benzene', 'ethanol', 'sulfuric-acid', 'tetraamminecopper'];

export const HomeView: React.FC<HomeViewProps> = ({ user, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredIdx, setFeaturedIdx] = useState(0);

  const featuredMols = FEATURED_MOL_IDS.map((id) => MOLECULES.find((m) => m.id === id)!).filter(Boolean);
  const currentMol = featuredMols[featuredIdx] || MOLECULES[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate({ page: 'search', query: searchQuery.trim() });
    }
  };

  const organicTopics = TOPICS.filter((t) => t.section === 'organic');
  const inorganicTopics = TOPICS.filter((t) => t.section === 'inorganic');

  return (
    <div className="space-y-10">
      {/* Hero Section: Two-column balanced split with live 3D Molecule showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-[#DDE3DF] rounded-2xl p-6 sm:p-8">
          <div className="space-y-4">
            <p className="text-xs font-medium text-[#52635C]">
              10–11 классы · СПО (техникумы) · База и углублённый уровень
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#2E3B36] leading-tight">
              Химия: органика и неорганика
            </h1>
            <p className="text-base text-[#52635C] leading-relaxed max-w-2xl">
              Структурированная теория по двум уровням сложности, интерактивные задания с проверкой и разбором,
              справочные таблицы, 3D-модели молекул и пошаговый конструктор химических реакций.
            </p>

            {/* Global Search Bar */}
            <form onSubmit={handleSearch} className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <label htmlFor="home-global-search" className="sr-only">
                  Поиск по темам, формулам и терминам
                </label>
                <input
                  id="home-global-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Найти тему, формулу или термин (например, алканы, H2SO4, изомерия)..."
                  className="w-full pl-10 pr-4 py-3 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] placeholder:text-[#6B7C75] focus:bg-white focus:border-[#4F8A6E]"
                />
                <Search className="w-4 h-4 text-[#52635C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="px-5 py-3 text-sm font-medium bg-[#437265] text-white rounded-xl hover:bg-[#355D52] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Найти
              </button>
            </form>
          </div>

          <div className="pt-6 mt-6 border-t border-[#DDE3DF] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#52635C] tabular-nums">
              <span>
                <strong className="text-sm font-semibold text-[#2E3B36]">{TOPICS.length}</strong> тем теории
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-sm font-semibold text-[#2E3B36]">{TASKS.length}</strong> заданий 4 типов
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-sm font-semibold text-[#2E3B36]">{REACTIONS.length}+</strong> реакций в конструкторе
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-sm font-semibold text-[#2E3B36]">118</strong> элементов в таблице
              </span>
            </div>

            {!user && (
              <button
                type="button"
                onClick={() => onNavigate({ page: 'auth', mode: 'register' })}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#3A6E56] hover:text-[#2E3B36] cursor-pointer whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" />
                Создать аккаунт для прогресса
              </button>
            )}
          </div>
        </div>

        {/* Right Hero Panel: Interactive 3D Molecule Preview */}
        <div className="lg:col-span-5 flex flex-col gap-2.5 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-xs font-medium text-[#52635C]">Интерактивная 3D-визуализация</span>
            <div className="flex flex-wrap items-center gap-1 bg-[#EDF1EC] p-0.5 rounded-lg">
              {featuredMols.map((m, idx) => {
                const shortLabel = m.id === 'tetraamminecopper' ? 'Комплекс Cu' : m.name.split(' ')[0];
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setFeaturedIdx(idx)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      idx === featuredIdx ? 'bg-white text-[#2E3B36] shadow-xs' : 'text-[#52635C] hover:text-[#2E3B36]'
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex-1">
            <MoleculeViewer3D molecule={currentMol} heightClass="h-64 sm:h-72" compact />
          </div>
        </div>
      </section>

      {/* Primary Section Choice: Organic vs Inorganic */}
      <section aria-labelledby="sections-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 sm:gap-4">
          <h2 id="sections-heading" className="font-display text-2xl font-semibold text-[#2E3B36]">
            Выберите раздел химии
          </h2>
          <span className="text-xs text-[#52635C]">Переключатель «База / Углублённый» доступен внутри каждого раздела</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organic Chemistry Card */}
          <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6 hover:border-[#4F8A6E] transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#3A6E56] font-medium">
                <span>Раздел 01 · Соединения углерода</span>
                <span className="tabular-nums">{organicTopics.length} тем</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2E3B36]">Органическая химия</h3>
              <p className="text-sm text-[#52635C] leading-relaxed">
                От алканов, алкенов и спиртов до механизмов SN1/SN2, стереохимии, ароматических систем и полимеров.
                Схемы генетических связей и сравнение изомеров в 3D.
              </p>
              <p className="text-xs text-[#52635C] pt-1">
                База: 10 тем (алканы — аминокислоты) · Углублённый: 5 тем (механизмы, стереохимия, полимеры)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#DDE3DF]">
              <button
                type="button"
                onClick={() => onNavigate({ page: 'section', section: 'organic', level: 'base' })}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#3A6E56] text-white rounded-xl hover:bg-[#2F5B47] transition-colors cursor-pointer whitespace-nowrap"
              >
                Открыть «Органику» (База)
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ page: 'section', section: 'organic', level: 'advanced' })}
                className="px-4 py-2.5 text-sm font-medium bg-[#EBF3EE] text-[#2F5B47] rounded-xl hover:bg-[#DCEBE2] transition-colors cursor-pointer whitespace-nowrap"
              >
                Углублённый
              </button>
            </div>
          </div>

          {/* Inorganic Chemistry Card */}
          <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6 hover:border-[#5B7FA6] transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#44658A] font-medium">
                <span>Раздел 02 · Элементы и неорганические классы</span>
                <span className="tabular-nums">{inorganicTopics.length} тем</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2E3B36]">Неорганическая химия</h3>
              <p className="text-sm text-[#52635C] leading-relaxed">
                Оксиды, кислоты, основания, соли, ОВР и электролиз на базовом уровне; комплексные соединения,
                термодинамика, кинетика, равновесия и электрохимия на углублённом.
              </p>
              <p className="text-xs text-[#52635C] pt-1">
                База: 6 тем (классы, ОВР, электролиз) · Углублённый: 5 тем (комплексы, ΔG, равновесия)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#DDE3DF]">
              <button
                type="button"
                onClick={() => onNavigate({ page: 'section', section: 'inorganic', level: 'base' })}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#44658A] text-white rounded-xl hover:bg-[#375372] transition-colors cursor-pointer whitespace-nowrap"
              >
                Открыть «Неорганику» (База)
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ page: 'section', section: 'inorganic', level: 'advanced' })}
                className="px-4 py-2.5 text-sm font-medium bg-[#ECF2F7] text-[#375372] rounded-xl hover:bg-[#DCE7F0] transition-colors cursor-pointer whitespace-nowrap"
              >
                Углублённый
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tools Row: Задания · Таблицы · Конструктор · Справочник */}
      <section aria-labelledby="tools-heading" className="space-y-4">
        <h2 id="tools-heading" className="font-display text-2xl font-semibold text-[#2E3B36]">
          Интерактивные инструменты
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onNavigate({ page: 'tasks' })}
            className="text-left bg-white border border-[#DDE3DF] rounded-xl p-5 hover:border-[#4F8A6E] transition-colors flex flex-col justify-between gap-4 cursor-pointer"
          >
            <div className="space-y-2">
              <CheckSquare className="w-5 h-5 text-[#4F8A6E]" />
              <h3 className="font-display font-semibold text-base text-[#2E3B36]">Задания и проверка</h3>
              <p className="text-sm text-[#52635C]">
                Тесты, ввод формул, цепочки реакций и расчётные задачи с подсказками и разбором ошибок.
              </p>
            </div>
            <span className="text-xs font-medium text-[#3A6E56] inline-flex items-center gap-1">
              Перейти к заданиям <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ page: 'tables', tab: 'periodic' })}
            className="text-left bg-white border border-[#DDE3DF] rounded-xl p-5 hover:border-[#5B7FA6] transition-colors flex flex-col justify-between gap-4 cursor-pointer"
          >
            <div className="space-y-2">
              <Table2 className="w-5 h-5 text-[#5B7FA6]" />
              <h3 className="font-display font-semibold text-base text-[#2E3B36]">Таблицы и Менделеев</h3>
              <p className="text-sm text-[#52635C]">
                118 элементов с 3D-атомами, таблица растворимости, ряд напряжений металлов и схемы органики.
              </p>
            </div>
            <span className="text-xs font-medium text-[#44658A] inline-flex items-center gap-1">
              Открыть таблицы <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ page: 'constructor' })}
            className="text-left bg-white border border-[#DDE3DF] rounded-xl p-5 hover:border-[#437265] transition-colors flex flex-col justify-between gap-4 cursor-pointer"
          >
            <div className="space-y-2">
              <FlaskConical className="w-5 h-5 text-[#437265]" />
              <h3 className="font-display font-semibold text-base text-[#2E3B36]">Конструктор реакций</h3>
              <p className="text-sm text-[#52635C]">
                Подбор реагентов и условий, уравнение, 3D-продукт и пошаговый показ изменения структуры.
              </p>
            </div>
            <span className="text-xs font-medium text-[#437265] inline-flex items-center gap-1">
              Собрать реакцию <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ page: 'reference' })}
            className="text-left bg-white border border-[#DDE3DF] rounded-xl p-5 hover:border-[#4F8A6E] transition-colors flex flex-col justify-between gap-4 cursor-pointer"
          >
            <div className="space-y-2">
              <BookOpen className="w-5 h-5 text-[#4F8A6E]" />
              <h3 className="font-display font-semibold text-base text-[#2E3B36]">Справочник и глоссарий</h3>
              <p className="text-sm text-[#52635C]">
                Пояснения к каждой таблице, визуальные схемы «класс → класс» и алфавитный глоссарий терминов.
              </p>
            </div>
            <span className="text-xs font-medium text-[#3A6E56] inline-flex items-center gap-1">
              Открыть справочник <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
