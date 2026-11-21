import React, { useMemo, useState } from 'react';
import { ArrowRight, FlaskConical, HelpCircle, Search } from 'lucide-react';
import type { AppRoute, ElementData } from '../types/chemistry';
import { ELEMENT_CATEGORY_META, ELEMENTS } from '../data/elements';
import {
  ACID_BASE_INDICATORS,
  ACID_STRENGTH_TABLE,
  ORGANIC_REACTION_SCHEMES,
  PHYSICAL_PROPERTIES,
  REACTIVITY_SERIES,
  SOLUBILITY_ANIONS,
  SOLUBILITY_CATIONS,
  TABLE_USAGE_GUIDES,
} from '../data/tablesData';
import { FormulaText } from './FormulaText';
import { AtomViewer3D } from './MoleculeViewer3D';
import { OrganicGeneticGraph } from './OrganicGeneticGraph';

interface TablesViewProps {
  initialTab?: 'periodic' | 'general' | 'schemes';
  initialSubTab?: 'solubility' | 'reactivity' | 'physical' | 'acidbase';
  onNavigate: (route: AppRoute) => void;
}

export const TablesView: React.FC<TablesViewProps> = ({
  initialTab = 'periodic',
  initialSubTab = 'solubility',
  onNavigate,
}) => {
  const [tab, setTab] = useState<'periodic' | 'general' | 'schemes'>(initialTab);
  const [subTab, setSubTab] = useState<'solubility' | 'reactivity' | 'physical' | 'acidbase'>(initialSubTab);
  const [selectedEl, setSelectedEl] = useState<ElementData>(ELEMENTS[5]); // Carbon C by default
  const [elQuery, setElQuery] = useState('');
  const [showHowTo, setShowHowTo] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ cation: string; anion: string; code: string } | null>(null);
  const [physQuery, setPhysQuery] = useState('');

  const mainGridElements = useMemo(
    () => ELEMENTS.filter((e) => !(e.number >= 57 && e.number <= 71) && !(e.number >= 89 && e.number <= 103)),
    [],
  );
  const lanthanides = useMemo(() => ELEMENTS.filter((e) => e.number >= 57 && e.number <= 71), []);
  const actinides = useMemo(() => ELEMENTS.filter((e) => e.number >= 89 && e.number <= 103), []);

  const gridMap = useMemo(() => {
    const map = new Map<string, ElementData>();
    for (const e of mainGridElements) {
      map.set(`${e.period}-${e.group}`, e);
    }
    return map;
  }, [mainGridElements]);

  const matchesElSearch = (e: ElementData) => {
    const q = elQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      e.name.toLowerCase().includes(q) ||
      e.symbol.toLowerCase().includes(q) ||
      String(e.number) === q
    );
  };

  const activeGuide = useMemo(() => {
    if (tab === 'periodic') return TABLE_USAGE_GUIDES[0];
    if (tab === 'schemes') return TABLE_USAGE_GUIDES[3];
    if (subTab === 'reactivity') return TABLE_USAGE_GUIDES[2];
    return TABLE_USAGE_GUIDES[1];
  }, [tab, subTab]);

  const filteredPhysical = useMemo(() => {
    const q = physQuery.trim().toLowerCase();
    if (!q) return PHYSICAL_PROPERTIES;
    return PHYSICAL_PROPERTIES.filter(
      (p) => p.name.toLowerCase().includes(q) || p.formula.toLowerCase().includes(q),
    );
  }, [physQuery]);

  return (
    <div className="space-y-6">
      {/* Header + Top Tabs + How-to button */}
      <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2E3B36]">Справочные таблицы</h1>
            <p className="text-sm text-[#52635C] mt-1">
              Интерактивная таблица Менделеева, растворимость, ряд напряжений металлов, физические константы и схемы органики.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowHowTo((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#EDF1EC] text-[#2E3B36] rounded-xl hover:bg-[#DCE5DF] transition-colors cursor-pointer whitespace-nowrap"
          >
            <HelpCircle className="w-4 h-4 text-[#437265]" />
            {showHowTo ? 'Скрыть пояснение' : 'Как пользоваться'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#DDE3DF]" role="tablist">
          {(
            [
              { id: 'periodic', label: 'Таблица Менделеева' },
              { id: 'general', label: 'Общие таблицы' },
              { id: 'schemes', label: 'Схемы реакций (органика)' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                tab === t.id ? 'bg-[#437265] text-white' : 'bg-[#F5F7F4] text-[#2E3B36] hover:bg-[#EBF0EC]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {showHowTo && activeGuide && (
          <div className="bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl p-4 space-y-2 text-sm">
            <div className="font-display font-semibold text-[#2E3B36]">{activeGuide.title}</div>
            <p className="text-[#52635C]">{activeGuide.purpose}</p>
            <ul className="list-disc pl-5 space-y-1 text-[#2E3B36]">
              {activeGuide.howTo.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
            <p className="text-xs text-[#3A6E56] font-medium pt-1">Пример: {activeGuide.example}</p>
          </div>
        )}
      </div>

      {/* TAB 3.1: PERIODIC TABLE */}
      {tab === 'periodic' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#DDE3DF] rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <label htmlFor="periodic-search" className="sr-only">
                  Поиск элемента
                </label>
                <input
                  id="periodic-search"
                  type="search"
                  value={elQuery}
                  onChange={(e) => setElQuery(e.target.value)}
                  placeholder="Найти элемент (например, Fe, Углерод, 29)..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-lg text-[#2E3B36]"
                />
                <Search className="w-4 h-4 text-[#52635C] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#52635C]">
                {(['alkali', 'transition', 'nonmetal', 'halogen', 'noble'] as const).map((cat) => (
                  <span key={cat} className="inline-flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-xs border inline-block"
                      style={{
                        backgroundColor: ELEMENT_CATEGORY_META[cat].bg,
                        borderColor: ELEMENT_CATEGORY_META[cat].border,
                      }}
                    />
                    {ELEMENT_CATEGORY_META[cat].label}
                  </span>
                ))}
              </div>
            </div>

            {/* 18-Column Periodic Table Grid */}
            <div className="overflow-x-auto chem-scroll pb-2">
              <div className="min-w-[920px] space-y-1">
                <div className="grid grid-cols-18 gap-1 text-[10px] text-center text-[#52635C] font-mono">
                  {Array.from({ length: 18 }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {[1, 2, 3, 4, 5, 6, 7].map((period) => (
                  <div key={period} className="grid grid-cols-18 gap-1">
                    {Array.from({ length: 18 }, (_, gIdx) => {
                      const group = gIdx + 1;
                      if (period === 6 && group === 3) {
                        return (
                          <div
                            key="la-marker"
                            className="h-12 rounded-md bg-[#F3EFEA] border border-[#DBCFC2] flex items-center justify-center text-[10px] text-[#5E4B39] font-mono"
                          >
                            57–71
                          </div>
                        );
                      }
                      if (period === 7 && group === 3) {
                        return (
                          <div
                            key="ac-marker"
                            className="h-12 rounded-md bg-[#F5ECEC] border border-[#DFC7C7] flex items-center justify-center text-[10px] text-[#6A4040] font-mono"
                          >
                            89–103
                          </div>
                        );
                      }
                      const el = gridMap.get(`${period}-${group}`);
                      if (!el) return <div key={`${period}-${group}`} className="h-12" />;
                      const style = ELEMENT_CATEGORY_META[el.category];
                      const isSel = selectedEl.number === el.number;
                      const match = matchesElSearch(el);

                      return (
                        <button
                          key={el.number}
                          type="button"
                          onClick={() => setSelectedEl(el)}
                          aria-label={`${el.name}, символ ${el.symbol}, атомный номер ${el.number}`}
                          className={`h-12 rounded-md border px-1 py-0.5 flex flex-col justify-between text-left transition-all cursor-pointer ${
                            isSel ? 'ring-2 ring-[#3A6E56] z-10' : ''
                          } ${match ? 'opacity-100' : 'opacity-25'}`}
                          style={{
                            backgroundColor: style.bg,
                            borderColor: isSel ? '#3A6E56' : style.border,
                            color: style.text,
                          }}
                        >
                          <span className="text-[9px] font-mono leading-none tabular-nums">{el.number}</span>
                          <span className="font-display font-bold text-sm leading-none">{el.symbol}</span>
                          <span className="text-[8px] leading-none truncate w-full">{el.name}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}

                {/* Lanthanides & Actinides */}
                <div className="pt-3 space-y-1">
                  {[
                    { label: 'Лантаноиды', items: lanthanides },
                    { label: 'Актиноиды', items: actinides },
                  ].map((row) => (
                    <div key={row.label} className="grid grid-cols-18 gap-1 items-center">
                      <div className="col-span-3 text-[11px] text-[#52635C] text-right pr-2">{row.label}</div>
                      {row.items.map((el) => {
                        const style = ELEMENT_CATEGORY_META[el.category];
                        const isSel = selectedEl.number === el.number;
                        const match = matchesElSearch(el);
                        return (
                          <button
                            key={el.number}
                            type="button"
                            onClick={() => setSelectedEl(el)}
                            aria-label={`${el.name}, символ ${el.symbol}, атомный номер ${el.number}`}
                            className={`h-12 rounded-md border px-1 py-0.5 flex flex-col justify-between text-left cursor-pointer ${
                              isSel ? 'ring-2 ring-[#3A6E56]' : ''
                            } ${match ? 'opacity-100' : 'opacity-25'}`}
                            style={{
                              backgroundColor: style.bg,
                              borderColor: isSel ? '#3A6E56' : style.border,
                              color: style.text,
                            }}
                          >
                            <span className="text-[9px] font-mono leading-none tabular-nums">{el.number}</span>
                            <span className="font-display font-bold text-sm leading-none">{el.symbol}</span>
                            <span className="text-[8px] leading-none truncate w-full">{el.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Element Detail Card + 3D Bohr Atom */}
          <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-[#DDE3DF] pb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl border flex flex-col items-center justify-center shrink-0"
                    style={{
                      backgroundColor: ELEMENT_CATEGORY_META[selectedEl.category].bg,
                      borderColor: ELEMENT_CATEGORY_META[selectedEl.category].border,
                      color: ELEMENT_CATEGORY_META[selectedEl.category].text,
                    }}
                  >
                    <span className="text-xs font-mono leading-none tabular-nums">{selectedEl.number}</span>
                    <span className="font-display text-2xl font-bold leading-tight">{selectedEl.symbol}</span>
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#2E3B36]">{selectedEl.name}</h2>
                    <p className="text-sm text-[#52635C]">
                      {selectedEl.latinName} · {ELEMENT_CATEGORY_META[selectedEl.category].label}
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="text-xs text-[#52635C]">Атомная масса</div>
                  <div className="text-lg font-semibold text-[#2E3B36]">{selectedEl.mass}</div>
                </div>
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div className="bg-[#F5F7F4] rounded-xl p-3">
                  <dt className="text-xs text-[#52635C]">Период / Группа</dt>
                  <dd className="font-semibold text-[#2E3B36] mt-0.5 tabular-nums">
                    {selectedEl.period} период · {selectedEl.group} группа
                  </dd>
                </div>
                <div className="bg-[#F5F7F4] rounded-xl p-3">
                  <dt className="text-xs text-[#52635C]">Электронная конфигурация</dt>
                  <dd className="font-mono font-medium text-[#2E3B36] mt-0.5">{selectedEl.electronConfig}</dd>
                </div>
                <div className="bg-[#F5F7F4] rounded-xl p-3">
                  <dt className="text-xs text-[#52635C]">Степени окисления</dt>
                  <dd className="font-mono font-medium text-[#2E3B36] mt-0.5">{selectedEl.oxidationStates}</dd>
                </div>
                <div className="bg-[#F5F7F4] rounded-xl p-3">
                  <dt className="text-xs text-[#52635C]">Электроотрицательность</dt>
                  <dd className="font-mono font-medium text-[#2E3B36] mt-0.5 tabular-nums">
                    {selectedEl.electronegativity ?? '—'}
                  </dd>
                </div>
                <div className="bg-[#F5F7F4] rounded-xl p-3">
                  <dt className="text-xs text-[#52635C]">t° плавления / кипения</dt>
                  <dd className="font-mono font-medium text-[#2E3B36] mt-0.5 tabular-nums">
                    {selectedEl.meltingPoint !== null ? `${selectedEl.meltingPoint} °C` : '—'} /{' '}
                    {selectedEl.boilingPoint !== null ? `${selectedEl.boilingPoint} °C` : '—'}
                  </dd>
                </div>
                <div className="bg-[#F5F7F4] rounded-xl p-3">
                  <dt className="text-xs text-[#52635C]">Плотность / Состояние</dt>
                  <dd className="font-medium text-[#2E3B36] mt-0.5 tabular-nums">
                    {selectedEl.density !== null ? `${selectedEl.density} г/см³` : '—'} · {selectedEl.state}
                  </dd>
                </div>
              </dl>

              <div className="bg-[#FAFBF9] border border-[#DDE3DF] rounded-xl p-3.5 text-sm">
                <span className="text-[#52635C]">Характер оксидов и соединений: </span>
                <strong className="text-[#2E3B36] font-medium">{selectedEl.oxideCharacter}</strong>
              </div>
            </div>

            <div className="lg:col-span-5">
              <AtomViewer3D element={selectedEl} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3.2: GENERAL TABLES */}
      {tab === 'general' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-1.5 bg-white border border-[#DDE3DF] rounded-xl p-2">
            {(
              [
                { id: 'solubility', label: 'Таблица растворимости' },
                { id: 'reactivity', label: 'Ряд напряжений металлов' },
                { id: 'physical', label: 'Плотности и t° плавл./кип.' },
                { id: 'acidbase', label: 'Кислотно-основные свойства' },
              ] as const
            ).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSubTab(st.id)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  subTab === st.id ? 'bg-[#44658A] text-white' : 'text-[#52635C] hover:bg-[#F5F7F4] hover:text-[#2E3B36]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {subTab === 'solubility' && (
            <div className="bg-white border border-[#DDE3DF] rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-semibold text-[#2E3B36]">
                  Растворимость кислот, оснований и солей в воде
                </h2>
                <div className="flex items-center gap-4 text-xs text-[#52635C]">
                  <span><strong className="text-[#3A6E56]">Р</strong> — растворимо</span>
                  <span><strong className="text-[#64582A]">М</strong> — малорастворимо</span>
                  <span><strong className="text-[#8F4F39]">Н</strong> — нерастворимо (↓)</span>
                  <span><strong>—</strong> — разлагается водой</span>
                </div>
              </div>

              <div className="overflow-x-auto chem-scroll">
                <table className="w-full min-w-[740px] border-collapse text-xs text-center">
                  <thead>
                    <tr className="bg-[#F5F7F4]">
                      <th className="border border-[#DDE3DF] p-2 text-left text-[#52635C]">Анион \ Катион</th>
                      {SOLUBILITY_CATIONS.map((cat) => (
                        <th key={cat} className="border border-[#DDE3DF] p-2 font-mono font-semibold text-[#2E3B36]">
                          <FormulaText text={cat} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SOLUBILITY_ANIONS.map((row) => (
                      <tr key={row.formula}>
                        <td className="border border-[#DDE3DF] p-2 text-left bg-[#FAFBF9] font-medium whitespace-nowrap">
                          <FormulaText text={row.formula} className="text-[#2E3B36]" />{' '}
                          <span className="text-[#52635C] text-[11px]">({row.name})</span>
                        </td>
                        {row.values.map((val, cIdx) => {
                          const bg =
                            val === 'Р'
                              ? 'bg-[#EFF5EA] text-[#3E5D28]'
                              : val === 'М'
                              ? 'bg-[#F5F1E2] text-[#64582A]'
                              : val === 'Н'
                              ? 'bg-[#F9EFEA] text-[#8F4F39]'
                              : 'bg-[#F3F4F3] text-[#52635C]';
                          return (
                            <td key={cIdx} className={`border border-[#DDE3DF] p-0 ${bg}`}>
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedCell({
                                    cation: SOLUBILITY_CATIONS[cIdx],
                                    anion: row.formula,
                                    code: val,
                                  })
                                }
                                className="w-full h-full py-2 font-semibold cursor-pointer hover:opacity-80"
                              >
                                {val}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedCell && (
                <div className="bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl p-3.5 text-sm">
                  Сочетание <FormulaText text={selectedCell.cation} className="font-semibold" /> +{' '}
                  <FormulaText text={selectedCell.anion} className="font-semibold" />:{' '}
                  <strong>
                    {selectedCell.code === 'Р'
                      ? 'Растворимое вещество — в растворе полностью распадается на ионы.'
                      : selectedCell.code === 'М'
                      ? 'Малорастворимое вещество — при концентрированных растворах выпадает в осадок.'
                      : selectedCell.code === 'Н'
                      ? 'Нерастворимое вещество (осадок ↓) — обеспечивает необратимость реакции ионного обмена.'
                      : 'В водной среде подвергается полному необратимому гидролизу или не существует.'}
                  </strong>
                </div>
              )}
            </div>
          )}

          {subTab === 'reactivity' && (
            <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#2E3B36]">
                  Электрохимический ряд напряжений металлов
                </h2>
                <p className="text-sm text-[#52635C] mt-0.5">
                  Восстановительная активность металлов убывает слева направо (по росту стандартного потенциала E°).
                </p>
              </div>
              <div className="overflow-x-auto chem-scroll">
                <table className="w-full min-w-[680px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#F5F7F4] text-left text-xs text-[#52635C]">
                      <th className="border-b border-[#DDE3DF] py-2.5 px-3">Металл</th>
                      <th className="border-b border-[#DDE3DF] py-2.5 px-3">E°, В</th>
                      <th className="border-b border-[#DDE3DF] py-2.5 px-3">Отношение к воде</th>
                      <th className="border-b border-[#DDE3DF] py-2.5 px-3">Отношение к кислотам</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDE3DF]">
                    {REACTIVITY_SERIES.map((item) => (
                      <tr
                        key={item.symbol}
                        className={item.zone === 'hydrogen' ? 'bg-[#ECF2F7] font-medium' : 'hover:bg-[#FAFBF9]'}
                      >
                        <td className="py-2.5 px-3 font-medium text-[#2E3B36] whitespace-nowrap">
                          <span className="font-mono font-bold mr-2">{item.symbol}</span>
                          {item.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-[#52635C]">
                          {item.potential > 0 ? `+${item.potential.toFixed(2)}` : item.potential.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-[#2E3B36]">{item.waterReaction}</td>
                        <td className="py-2.5 px-3 text-xs text-[#2E3B36]">{item.acidReaction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {subTab === 'physical' && (
            <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-lg font-semibold text-[#2E3B36]">
                  Плотности и температуры плавления / кипения веществ
                </h2>
                <input
                  type="search"
                  value={physQuery}
                  onChange={(e) => setPhysQuery(e.target.value)}
                  placeholder="Фильтр по веществу или формуле..."
                  className="px-3 py-1.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-lg text-[#2E3B36] w-64"
                />
              </div>
              <div className="overflow-x-auto chem-scroll">
                <table className="w-full min-w-[680px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#F5F7F4] text-left text-xs text-[#52635C]">
                      <th className="border-b border-[#DDE3DF] py-2.5 px-3">Вещество</th>
                      <th className="border-b border-[#DDE3DF] py-2.5 px-3">Формула</th>
                      <th className="border-b border-[#DDE3DF] py-2.5 px-3">Раздел</th>
                      <th className="border-b border-[#DDE3DF] py-2.5 px-3">Плотность</th>
                      <th className="border-b border-[#DDE3DF] py-2.5 px-3">t° плавл.</th>
                      <th className="border-b border-[#DDE3DF] py-2.5 px-3">t° кип.</th>
                      <th className="border-b border-[#DDE3DF] py-2.5 px-3">Растворимость</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDE3DF]">
                    {filteredPhysical.map((p) => (
                      <tr key={p.name} className="hover:bg-[#FAFBF9]">
                        <td className="py-2.5 px-3 font-medium text-[#2E3B36]">{p.name}</td>
                        <td className="py-2.5 px-3">
                          <FormulaText text={p.formula} className="text-[#3A6E56] font-medium" />
                        </td>
                        <td className="py-2.5 px-3 text-xs text-[#52635C]">{p.section}</td>
                        <td className="py-2.5 px-3 font-mono text-xs tabular-nums">{p.density}</td>
                        <td className="py-2.5 px-3 font-mono text-xs tabular-nums">{p.meltingPoint}</td>
                        <td className="py-2.5 px-3 font-mono text-xs tabular-nums">{p.boilingPoint}</td>
                        <td className="py-2.5 px-3 text-xs text-[#52635C]">{p.solubility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {subTab === 'acidbase' && (
            <div className="space-y-5">
              <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
                <h2 className="font-display text-lg font-semibold text-[#2E3B36]">
                  Кислотно-основные индикаторы
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[540px] border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#F5F7F4] text-left text-xs text-[#52635C]">
                        <th className="border-b border-[#DDE3DF] py-2.5 px-3">Индикатор</th>
                        <th className="border-b border-[#DDE3DF] py-2.5 px-3">Кислая среда (pH &lt; 7)</th>
                        <th className="border-b border-[#DDE3DF] py-2.5 px-3">Нейтральная (pH = 7)</th>
                        <th className="border-b border-[#DDE3DF] py-2.5 px-3">Щелочная среда (pH &gt; 7)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DDE3DF]">
                      {ACID_BASE_INDICATORS.map((ind) => (
                        <tr key={ind.indicator}>
                          <td className="py-2.5 px-3 font-medium text-[#2E3B36]">{ind.indicator}</td>
                          <td className="py-2.5 px-3 text-[#8F4F39]">{ind.acidic}</td>
                          <td className="py-2.5 px-3 text-[#52635C]">{ind.neutral}</td>
                          <td className="py-2.5 px-3 text-[#44658A]">{ind.alkaline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-3">
                <h2 className="font-display text-lg font-semibold text-[#2E3B36]">
                  Сила кислот, оснований и амфотерных гидроксидов
                </h2>
                <div className="divide-y divide-[#DDE3DF]">
                  {ACID_STRENGTH_TABLE.map((row) => (
                    <div key={row.group} className="py-3 grid grid-cols-1 md:grid-cols-12 gap-2">
                      <div className="md:col-span-4 font-semibold text-sm text-[#2E3B36]">{row.group}</div>
                      <div className="md:col-span-4 text-sm text-[#3A6E56]">
                        <FormulaText text={row.examples} />
                      </div>
                      <div className="md:col-span-4 text-xs text-[#52635C]">{row.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3.3: ORGANIC REACTION SCHEMES & GENETIC GRAPH */}
      {tab === 'schemes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ORGANIC_REACTION_SCHEMES.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white border border-[#DDE3DF] rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="text-xs font-medium text-[#3A6E56]">{scheme.shortTag}</div>
                  <h3 className="font-display text-lg font-bold text-[#2E3B36]">{scheme.name}</h3>
                  <p className="text-sm text-[#52635C] leading-relaxed">{scheme.description}</p>
                  <div className="bg-[#F5F7F4] rounded-lg p-3 space-y-1 text-xs">
                    <div className="text-[#52635C]">Общая схема:</div>
                    <div className="font-medium text-[#2E3B36]">
                      <FormulaText text={scheme.generalPattern} />
                    </div>
                    <div className="text-[#52635C] pt-1">Пример:</div>
                    <div className="font-medium text-[#3A6E56]">
                      <FormulaText text={scheme.exampleEquation} />
                    </div>
                    <div className="text-[#52635C] pt-1">Условия: {scheme.conditions}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'constructor', reactionId: scheme.targetReactionId })}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#EBF3EE] text-[#2F5B47] rounded-lg hover:bg-[#DCEBE2] transition-colors cursor-pointer"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  Разобрать в конструкторе
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <OrganicGeneticGraph
            onOpenTopic={(id) => onNavigate({ page: 'topic', section: 'organic', topicId: id, level: 'base', tab: 'theory' })}
            onOpenReaction={(rxId) => onNavigate({ page: 'constructor', reactionId: rxId })}
          />
        </div>
      )}
    </div>
  );
};
