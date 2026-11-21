import type { GlossaryTerm } from '../types/chemistry';

export type SolubilityCode = 'Р' | 'М' | 'Н' | '—' | '?';

export const SOLUBILITY_CATIONS = [
  'H+', 'K+', 'Na+', 'NH4+', 'Ba2+', 'Ca2+', 'Mg2+', 'Al3+', 'Zn2+', 'Fe2+', 'Fe3+', 'Cu2+', 'Ag+', 'Pb2+',
];

export const SOLUBILITY_ANIONS: {
  formula: string;
  name: string;
  values: SolubilityCode[];
}[] = [
  { formula: 'OH-', name: 'Гидроксид', values: ['Р', 'Р', 'Р', 'Р', 'Р', 'М', 'Н', 'Н', 'Н', 'Н', 'Н', 'Н', '—', 'Н'] },
  { formula: 'Cl-', name: 'Хлорид', values: ['Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Н', 'М'] },
  { formula: 'Br-', name: 'Бромид', values: ['Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Н', 'М'] },
  { formula: 'I-', name: 'Иодид', values: ['Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', '—', '—', 'Н', 'Н'] },
  { formula: 'S2-', name: 'Сульфид', values: ['Р', 'Р', 'Р', 'Р', 'Р', 'М', '—', '—', 'Н', 'Н', '—', 'Н', 'Н', 'Н'] },
  { formula: 'SO3^2-', name: 'Сульфит', values: ['Р', 'Р', 'Р', 'Р', 'Н', 'Н', 'М', '—', 'М', 'Н', '—', '—', 'Н', 'Н'] },
  { formula: 'SO4^2-', name: 'Сульфат', values: ['Р', 'Р', 'Р', 'Р', 'Н', 'М', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'М', 'Н'] },
  { formula: 'NO3-', name: 'Нитрат', values: ['Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р'] },
  { formula: 'CO3^2-', name: 'Карбонат', values: ['Р', 'Р', 'Р', 'Р', 'Н', 'Н', 'Н', '—', 'Н', 'Н', '—', '—', 'Н', 'Н'] },
  { formula: 'SiO3^2-', name: 'Силикат', values: ['Н', 'Р', 'Р', '—', 'Н', 'Н', 'Н', 'Н', 'Н', 'Н', 'Н', 'Н', '—', 'Н'] },
  { formula: 'PO4^3-', name: 'Фосфат', values: ['Р', 'Р', 'Р', 'Р', 'Н', 'Н', 'Н', 'Н', 'Н', 'Н', 'Н', 'Н', 'Н', 'Н'] },
  { formula: 'CH3COO-', name: 'Ацетат', values: ['Р', 'Р', 'Р', 'Р', 'Р', 'Р', 'Р', '—', 'Р', 'Р', '—', 'Р', 'Р', 'Р'] },
];

export const REACTIVITY_SERIES: {
  symbol: string;
  name: string;
  potential: number;
  zone: 'active' | 'medium' | 'hydrogen' | 'noble';
  waterReaction: string;
  acidReaction: string;
}[] = [
  { symbol: 'Li', name: 'Литий', potential: -3.04, zone: 'active', waterReaction: 'Реагирует при 20 °C с образованием щёлочи и H₂', acidReaction: 'Бурно вытесняет H₂' },
  { symbol: 'K', name: 'Калий', potential: -2.93, zone: 'active', waterReaction: 'Реагирует при 20 °C с образованием KOH и H₂', acidReaction: 'Бурно вытесняет H₂' },
  { symbol: 'Ba', name: 'Барий', potential: -2.91, zone: 'active', waterReaction: 'Реагирует при 20 °C с образованием Ba(OH)₂ и H₂', acidReaction: 'Активно вытесняет H₂' },
  { symbol: 'Ca', name: 'Кальций', potential: -2.87, zone: 'active', waterReaction: 'Реагирует при 20 °C с образованием Ca(OH)₂ и H₂', acidReaction: 'Активно вытесняет H₂' },
  { symbol: 'Na', name: 'Натрий', potential: -2.71, zone: 'active', waterReaction: 'Реагирует при 20 °C с образованием NaOH и H₂', acidReaction: 'Бурно вытесняет H₂' },
  { symbol: 'Mg', name: 'Магний', potential: -2.37, zone: 'active', waterReaction: 'Реагирует с горячей водой и паром', acidReaction: 'Вытесняет H₂ из разбавленных кислот' },
  { symbol: 'Al', name: 'Алюминий', potential: -1.66, zone: 'medium', waterReaction: 'После снятия оксидной плёнки реагирует с водой', acidReaction: 'Вытесняет H₂ (в конц. HNO₃/H₂SO₄ пассивируется)' },
  { symbol: 'Zn', name: 'Цинк', potential: -0.76, zone: 'medium', waterReaction: 'Реагирует с водяным паром при нагревании (ZnO + H₂)', acidReaction: 'Вытесняет H₂ из разбавленных кислот' },
  { symbol: 'Cr', name: 'Хром', potential: -0.74, zone: 'medium', waterReaction: 'Реагирует с паром при высокой температуре', acidReaction: 'Вытесняет H₂ при нагревании' },
  { symbol: 'Fe', name: 'Железо', potential: -0.44, zone: 'medium', waterReaction: 'С паром при 600 °C даёт Fe₃O₄ и H₂', acidReaction: 'Вытесняет H₂ (даёт соли Fe²⁺)' },
  { symbol: 'Ni', name: 'Никель', potential: -0.25, zone: 'medium', waterReaction: 'С паром только при сильном нагреве', acidReaction: 'Медленно вытесняет H₂' },
  { symbol: 'Sn', name: 'Олово', potential: -0.14, zone: 'medium', waterReaction: 'Не реагирует в обычных условиях', acidReaction: 'Медленно вытесняет H₂ при нагревании' },
  { symbol: 'Pb', name: 'Свинец', potential: -0.13, zone: 'medium', waterReaction: 'Не реагирует', acidReaction: 'Реагирует слабо из-за нерастворимой плёнки солей' },
  { symbol: 'H2', name: 'Водород (ориентир)', potential: 0.0, zone: 'hydrogen', waterReaction: 'Граница активности металлов', acidReaction: 'Металлы левее вытесняют H₂, правее — нет' },
  { symbol: 'Cu', name: 'Медь', potential: 0.34, zone: 'noble', waterReaction: 'Не реагирует', acidReaction: 'H₂ не вытесняет; реагирует с HNO₃ и конц. H₂SO₄' },
  { symbol: 'Hg', name: 'Ртуть', potential: 0.85, zone: 'noble', waterReaction: 'Не реагирует', acidReaction: 'H₂ не вытесняет; растворяется в HNO₃' },
  { symbol: 'Ag', name: 'Серебро', potential: 0.8, zone: 'noble', waterReaction: 'Не реагирует', acidReaction: 'H₂ не вытесняет; реагирует с HNO₃ и конц. H₂SO₄' },
  { symbol: 'Pt', name: 'Платина', potential: 1.18, zone: 'noble', waterReaction: 'Не реагирует', acidReaction: 'Растворяется только в «царской водке»' },
  { symbol: 'Au', name: 'Золото', potential: 1.5, zone: 'noble', waterReaction: 'Не реагирует', acidReaction: 'Растворяется только в «царской водке»' },
];

export const PHYSICAL_PROPERTIES: {
  name: string;
  formula: string;
  section: 'Органика' | 'Неорганика';
  density: string;
  meltingPoint: string;
  boilingPoint: string;
  solubility: string;
}[] = [
  { name: 'Вода', formula: 'H2O', section: 'Неорганика', density: '1,000 г/см³', meltingPoint: '0,0 °C', boilingPoint: '100,0 °C', solubility: 'Растворитель' },
  { name: 'Серная кислота (100%)', formula: 'H2SO4', section: 'Неорганика', density: '1,830 г/см³', meltingPoint: '10,3 °C', boilingPoint: '337,0 °C', solubility: 'Смешивается ∞' },
  { name: 'Азотная кислота (100%)', formula: 'HNO3', section: 'Неорганика', density: '1,513 г/см³', meltingPoint: '-42,0 °C', boilingPoint: '83,0 °C', solubility: 'Смешивается ∞' },
  { name: 'Хлорид натрия', formula: 'NaCl', section: 'Неорганика', density: '2,165 г/см³', meltingPoint: '801,0 °C', boilingPoint: '1465,0 °C', solubility: '35,9 г / 100 г' },
  { name: 'Гидроксид натрия', formula: 'NaOH', section: 'Неорганика', density: '2,130 г/см³', meltingPoint: '323,0 °C', boilingPoint: '1388,0 °C', solubility: '109 г / 100 г' },
  { name: 'Аммиак (газ)', formula: 'NH3', section: 'Неорганика', density: '0,771 г/л', meltingPoint: '-77,7 °C', boilingPoint: '-33,3 °C', solubility: '700 л / 1 л воды' },
  { name: 'Метан', formula: 'CH4', section: 'Органика', density: '0,717 г/л', meltingPoint: '-182,5 °C', boilingPoint: '-161,5 °C', solubility: 'Малорастворим' },
  { name: 'Этилен', formula: 'C2H4', section: 'Органика', density: '1,260 г/л', meltingPoint: '-169,2 °C', boilingPoint: '-103,7 °C', solubility: 'Малорастворим' },
  { name: 'Бензол', formula: 'C6H6', section: 'Органика', density: '0,879 г/см³', meltingPoint: '5,5 °C', boilingPoint: '80,1 °C', solubility: 'Нерастворим' },
  { name: 'Метанол', formula: 'CH3OH', section: 'Органика', density: '0,792 г/см³', meltingPoint: '-97,6 °C', boilingPoint: '64,7 °C', solubility: 'Смешивается ∞' },
  { name: 'Этанол', formula: 'C2H5OH', section: 'Органика', density: '0,789 г/см³', meltingPoint: '-114,1 °C', boilingPoint: '78,3 °C', solubility: 'Смешивается ∞' },
  { name: 'Уксусная кислота', formula: 'CH3COOH', section: 'Органика', density: '1,049 г/см³', meltingPoint: '16,6 °C', boilingPoint: '118,1 °C', solubility: 'Смешивается ∞' },
  { name: 'Этилацетат', formula: 'CH3COOC2H5', section: 'Органика', density: '0,902 г/см³', meltingPoint: '-83,6 °C', boilingPoint: '77,1 °C', solubility: '8,3 г / 100 г' },
  { name: 'Глицин', formula: 'NH2CH2COOH', section: 'Органика', density: '1,607 г/см³', meltingPoint: '233 °C (разл.)', boilingPoint: 'Разлагается', solubility: '25 г / 100 г' },
];

export const ACID_BASE_INDICATORS = [
  { indicator: 'Лакмус', acidic: 'Красный (pH < 5)', neutral: 'Фиолетовый (pH ≈ 7)', alkaline: 'Синий (pH > 8)' },
  { indicator: 'Метиловый оранжевый', acidic: 'Красный (pH < 3,1)', neutral: 'Оранжевый (pH 4,4–7)', alkaline: 'Жёлтый (pH > 4,4)' },
  { indicator: 'Фенолфталеин', acidic: 'Бесцветный', neutral: 'Бесцветный', alkaline: 'Малиновый (pH > 8,2)' },
  { indicator: 'Универсальный индикатор', acidic: 'Красный → оранжевый', neutral: 'Зелёный', alkaline: 'Синий → фиолетовый' },
];

export const ACID_STRENGTH_TABLE = [
  { group: 'Сильные кислоты (α ≈ 100%)', examples: 'HCl, HBr, HI, HNO3, H2SO4, HClO4, HMnO4', note: 'Полностью диссоциируют в водных растворах.' },
  { group: 'Кислоты средней силы', examples: 'H3PO4, HF, H2SO3, HCOOH', note: 'Диссоциируют ступенчато и обратимо.' },
  { group: 'Слабые кислоты', examples: 'H2CO3, H2S, H2SiO3, CH3COOH, HCN', note: 'Соли этих кислот подвергаются гидролизу по аниону.' },
  { group: 'Сильные основания (щёлочи)', examples: 'LiOH, NaOH, KOH, RbOH, CsOH, Ca(OH)2, Sr(OH)2, Ba(OH)2', note: 'Растворимы в воде, окрашивают фенолфталеин в малиновый.' },
  { group: 'Амфотерные гидроксиды', examples: 'Be(OH)2, Zn(OH)2, Al(OH)3, Cr(OH)3, Pb(OH)2', note: 'Реагируют и с кислотами, и со щелочами.' },
];

export interface OrganicReactionScheme {
  id: string;
  name: string;
  shortTag: string;
  mechanism: string;
  generalPattern: string;
  exampleEquation: string;
  conditions: string;
  targetReactionId: string;
  description: string;
}

export const ORGANIC_REACTION_SCHEMES: OrganicReactionScheme[] = [
  {
    id: 'substitution',
    name: 'Замещение',
    shortTag: 'SR / SE / SN',
    mechanism: 'Радикальное (алканы), электрофильное (арены), нуклеофильное (галогеналканы)',
    generalPattern: 'R—H + X—Y → R—X + H—Y',
    exampleEquation: 'CH4 + Cl2 → CH3Cl + HCl',
    conditions: 'УФ-свет (hν) для алканов; FeBr₃ / AlCl₃ для аренов',
    targetReactionId: 'rx-org-ch4-cl2',
    description: 'Один атом или группа атомов в молекуле замещается другим атомом без изменения кратности связей углеродного скелета.',
  },
  {
    id: 'addition',
    name: 'Присоединение',
    shortTag: 'AdE / Гидрирование',
    mechanism: 'Электрофильное присоединение по правилу Марковникова (для алкенов и алкинов)',
    generalPattern: 'R—CH=CH2 + H—X → R—CH(X)—CH3',
    exampleEquation: 'C2H4 + H2O → C2H5OH',
    conditions: 'H₃PO₄, 300 °C, p (гидратация); Ni, t° (гидрирование)',
    targetReactionId: 'rx-org-ethene-h2o',
    description: 'Разрыв π-связи кратной связи (C=C или C≡C) с образованием двух новых σ-связей.',
  },
  {
    id: 'elimination',
    name: 'Отщепление (элиминирование)',
    shortTag: 'E1 / E2',
    mechanism: 'Дегидратация, дегидрирование, дегидрогалогенирование по правилу Зайцева',
    generalPattern: 'R—CH2—CH2—X → R—CH=CH2 + H—X',
    exampleEquation: 'C2H5OH → C2H4 + H2O',
    conditions: 'H₂SO₄ (конц.), t > 140 °C; или KOH (спирт.) для галогеналканов',
    targetReactionId: 'rx-org-ethanol-dehyd',
    description: 'Отрыв двух атомов или групп от соседних атомов углерода с образованием двойной или тройной связи.',
  },
  {
    id: 'oxidation',
    name: 'Окисление',
    shortTag: 'Мягкое / Жёсткое / Горение',
    mechanism: 'Повышение степени окисления атомов углерода (CuO, KMnO₄, [Ag(NH₃)₂]OH)',
    generalPattern: 'R—CH2OH → R—CHO → R—COOH',
    exampleEquation: 'C2H5OH + CuO → CH3CHO + Cu + H2O',
    conditions: 'Нагревание с CuO; KMnO₄/H⁺; аммиачный раствор Ag₂O',
    targetReactionId: 'rx-org-ethanol-cuo',
    description: 'Последовательный переход от спиртов к альдегидам и карбоновым кислотам или полное сгорание до CO₂ и H₂O.',
  },
  {
    id: 'polymerization',
    name: 'Полимеризация',
    shortTag: 'Высокомолекулярные соединения',
    mechanism: 'Последовательное соединение мономеров за счёт раскрытия кратных связей',
    generalPattern: 'n CH2=CH—R → (—CH2—CH(R)—)n',
    exampleEquation: 'n C2H4 → (—CH2—CH2—)n',
    conditions: 'Высокое давление, катализатор Циглера — Натта, t°',
    targetReactionId: 'rx-org-ethene-poly',
    description: 'Образование макромолекулы полимера из множества одинаковых молекул мономера без выделения побочных продуктов.',
  },
];

export interface GeneticNode {
  id: string;
  label: string;
  formula: string;
  topicId: string;
  x: number;
  y: number;
}

export interface GeneticEdge {
  from: string;
  to: string;
  reagent: string;
  condition: string;
  equation: string;
  reactionId?: string;
}

export const ORGANIC_GENETIC_GRAPH: { nodes: GeneticNode[]; edges: GeneticEdge[] } = {
  nodes: [
    { id: 'alkanes', label: 'Алканы', formula: 'CnH2n+2', topicId: 'org-alkanes', x: 80, y: 70 },
    { id: 'alkenes', label: 'Алкены', formula: 'CnH2n', topicId: 'org-alkenes', x: 290, y: 70 },
    { id: 'alkynes', label: 'Алкины', formula: 'CnH2n-2', topicId: 'org-alkynes', x: 500, y: 70 },
    { id: 'arenes', label: 'Арены', formula: 'C6H6', topicId: 'org-arenes', x: 710, y: 70 },
    { id: 'alcohols', label: 'Спирты', formula: 'R—OH', topicId: 'org-alcohols', x: 290, y: 210 },
    { id: 'aldehydes', label: 'Альдегиды', formula: 'R—CHO', topicId: 'org-aldehydes', x: 500, y: 210 },
    { id: 'acids', label: 'Карбоновые кислоты', formula: 'R—COOH', topicId: 'org-acids', x: 500, y: 340 },
    { id: 'esters', label: 'Сложные эфиры', formula: 'R—COOR′', topicId: 'org-esters', x: 290, y: 340 },
    { id: 'amines', label: 'Амины', formula: 'R—NH2', topicId: 'org-amines', x: 710, y: 210 },
    { id: 'aminoacids', label: 'Аминокислоты', formula: 'H2N—R—COOH', topicId: 'org-aminoacids', x: 710, y: 340 },
  ],
  edges: [
    { from: 'alkanes', to: 'alkenes', reagent: 'Дегидрирование (−H2)', condition: 'Pt/Cr2O3, 500 °C', equation: 'C2H6 → C2H4 + H2', reactionId: 'rx-org-ethane-dehydro' },
    { from: 'alkenes', to: 'alkanes', reagent: '+ H2', condition: 'Ni, t°', equation: 'C2H4 + H2 → C2H6', reactionId: 'rx-org-ethene-h2' },
    { from: 'alkenes', to: 'alkynes', reagent: '−H2 / через дибромид', condition: 'KOH (спирт.), t°', equation: 'C2H4 → C2H2 + H2' },
    { from: 'alkynes', to: 'arenes', reagent: 'Тримеризация (Зелинский)', condition: 'C (акт.), 600 °C', equation: '3 C2H2 → C6H6', reactionId: 'rx-org-ethyne-benzene' },
    { from: 'alkenes', to: 'alcohols', reagent: '+ H2O (гидратация)', condition: 'H3PO4, 300 °C', equation: 'C2H4 + H2O → C2H5OH', reactionId: 'rx-org-ethene-h2o' },
    { from: 'alcohols', to: 'alkenes', reagent: '− H2O (дегидратация)', condition: 'H2SO4 (конц.), >140 °C', equation: 'C2H5OH → C2H4 + H2O', reactionId: 'rx-org-ethanol-dehyd' },
    { from: 'alkynes', to: 'aldehydes', reagent: '+ H2O (Кучеров)', condition: 'Hg2+, H+', equation: 'C2H2 + H2O → CH3CHO', reactionId: 'rx-org-ethyne-h2o' },
    { from: 'alcohols', to: 'aldehydes', reagent: '+ CuO (окисление)', condition: 't°', equation: 'C2H5OH + CuO → CH3CHO + Cu + H2O', reactionId: 'rx-org-ethanol-cuo' },
    { from: 'aldehydes', to: 'acids', reagent: '+ Ag2O (NH3) / Cu(OH)2', condition: 't°', equation: 'CH3CHO + 2Cu(OH)2 → CH3COOH + Cu2O + 2H2O', reactionId: 'rx-org-ethanal-cuoh2' },
    { from: 'acids', to: 'esters', reagent: '+ R′—OH (этерификация)', condition: 'H2SO4 (конц.), t°', equation: 'CH3COOH + C2H5OH ⇄ CH3COOC2H5 + H2O', reactionId: 'rx-org-ester' },
    { from: 'arenes', to: 'amines', reagent: 'HNO3 → [H] (Зинин)', condition: 'H2SO4; затем Fe/HCl', equation: 'C6H5NO2 + 6[H] → C6H5NH2 + 2H2O', reactionId: 'rx-org-nitro-aniline' },
    { from: 'acids', to: 'aminoacids', reagent: 'Cl2/P → + 2 NH3', condition: 'Красный фосфор, затем NH3', equation: 'ClCH2COOH + 2NH3 → H2NCH2COOH + NH4Cl' },
  ],
};

export const INORGANIC_GENETIC_ROWS = [
  {
    title: 'Генетический ряд активного металла (щёлочь)',
    chain: ['Na (металл)', 'Na2O (основный оксид)', 'NaOH (щёлочь)', 'Na2SO4 (соль)'],
    steps: ['+ O2 (контролируемо)', '+ H2O', '+ H2SO4'],
  },
  {
    title: 'Генетический ряд малоактивного металла (нерастворимое основание)',
    chain: ['Cu (металл)', 'CuO (основный оксид)', 'CuCl2 (соль)', 'Cu(OH)2 (основание)', 'CuO (оксид)'],
    steps: ['+ O2, t°', '+ 2 HCl', '+ 2 NaOH', 'Нагревание (−H2O)'],
  },
  {
    title: 'Генетический ряд неметалла',
    chain: ['S (неметалл)', 'SO2 (кислотный оксид)', 'SO3 (оксид VI)', 'H2SO4 (кислота)', 'BaSO4 (соль ↓)'],
    steps: ['+ O2, t°', '+ O2 (V2O5, t°)', '+ H2O', '+ BaCl2'],
  },
  {
    title: 'Генетический ряд амфотерного элемента',
    chain: ['Al', 'Al2O3 (амфотерный оксид)', 'AlCl3', 'Al(OH)3 (амфотерный гидроксид)', 'Na[Al(OH)4] (комплекс)'],
    steps: ['+ O2', '+ 6 HCl', '+ 3 NaOH (недостаток)', '+ NaOH (избыток)'],
  },
];

export const TABLE_USAGE_GUIDES = [
  {
    id: 'guide-periodic',
    title: 'Как пользоваться таблицей Менделеева',
    targetTab: 'periodic' as const,
    purpose: 'Определение строения атома, валентности, степеней окисления, молярной массы и характера оксидов/гидроксидов.',
    howTo: [
      'Порядковый номер элемента равен заряду ядра (числу протонов) и общему числу электронов в нейтральном атоме.',
      'Номер периода показывает число электронных слоёв (энергетических уровней).',
      'Номер группы для элементов главных подгрупп равен числу валентных электронов и высшей степени окисления (кроме F и O).',
      'Слева направо в периоде усиливаются неметаллические свойства; сверху вниз в группе — металлические.',
    ],
    example: 'Сера (S, №16): 3-й период → 3 электронных слоя (2, 8, 6); VI группа → высшая степень окисления +6 (H₂SO₄), низшая 6 − 8 = −2 (H₂S).',
  },
  {
    id: 'guide-solubility',
    title: 'Как пользоваться таблицей растворимости',
    targetTab: 'general' as const,
    subTab: 'solubility' as const,
    purpose: 'Прогнозирование реакций ионного обмена (выпадение осадка) и составление формул солей по зарядам ионов.',
    howTo: [
      'Найдите катион в верхней строке и анион в левом столбце; на пересечении указана растворимость в воде.',
      '«Р» — растворимо, «М» — малорастворимо (в реакциях обмена часто выпадает в осадок), «Н» — нерастворимо (осадок ↓), «—» — разлагается водой или не существует.',
      'Реакция ионного обмена идёт до конца, если образуется осадок (Н), газ (CO₂, SO₂, H₂S, NH₃) или слабый электролит (H₂O).',
    ],
    example: 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2 NaCl. На пересечении Ba²⁺ и SO₄²⁻ стоит «Н» — реакция протекает необратимо.',
  },
  {
    id: 'guide-reactivity',
    title: 'Как пользоваться рядом напряжений металлов',
    targetTab: 'general' as const,
    subTab: 'reactivity' as const,
    purpose: 'Определение возможности вытеснения водорода из кислот, вытеснения одного металла другим из растворов солей и продуктов электролиза.',
    howTo: [
      'Металлы левее H₂ вытесняют водород из разбавленных кислот (кроме HNO₃); металлы правее H₂ (Cu, Ag, Hg, Pt, Au) — нет.',
      'Более активный металл (стоящий левее, кроме щелочных/щёлочноземельных, реагирующих с водой) вытесняет менее активный из раствора его соли.',
      'При электролизе водных растворов: до Al включительно на катоде выделяется H₂; от Al до H — металл и H₂; после H — только металл.',
    ],
    example: 'Fe + CuSO₄ → FeSO₄ + Cu (железо левее меди — реакция идёт), а Cu + FeSO₄ ≠ (медь правее железа).',
  },
  {
    id: 'guide-schemes',
    title: 'Как пользоваться схемами органических реакций',
    targetTab: 'schemes' as const,
    purpose: 'Быстрый подбор реагента и условий для цепочек превращений «класс → класс» в ЕГЭ и заданиях СПО.',
    howTo: [
      'Определите класс исходного вещества и целевого продукта по функциональной группе.',
      'Нажмите на стрелку между узлами на схеме генетических связей — откроются точный реагент, катализатор и пример уравнения.',
      'Используйте кнопку перехода в Конструктор реакций, чтобы увидеть 3D-структуру продукта и пошаговый разрыв связей.',
    ],
    example: 'Переход Спирты → Алкены: внутримолекулярная дегидратация с конц. H₂SO₄ при t > 140 °C.',
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { id: 'g-1', letter: 'А', term: 'Алканы', section: 'organic', formula: 'CnH2n+2', definition: 'Предельные (насыщенные) углеводороды, в молекулах которых все атомы углерода находятся в состоянии sp³-гибридизации и связаны только одинарными σ-связями.', relatedTopicId: 'org-alkanes' },
  { id: 'g-2', letter: 'А', term: 'Алкены', section: 'organic', formula: 'CnH2n', definition: 'Непредельные углеводороды, содержащие одну двойную связь C=C (одну σ- и одну π-связь).', relatedTopicId: 'org-alkenes' },
  { id: 'g-3', letter: 'А', term: 'Алкины', section: 'organic', formula: 'CnH2n-2', definition: 'Непредельные углеводороды с одной тройной связью C≡C и линейной геометрией фрагмента (sp-гибридизация).', relatedTopicId: 'org-alkynes' },
  { id: 'g-4', letter: 'А', term: 'Амфотерность', section: 'inorganic', formula: 'Al(OH)3, ZnO', definition: 'Способность вещества проявлять как кислотные, так и основные свойства в зависимости от природы партнёра по реакции.', relatedTopicId: 'inorg-oxides' },
  { id: 'g-5', letter: 'А', term: 'Ароматичность', section: 'organic', formula: '4n + 2 π-e⁻', definition: 'Повышенная термодинамическая устойчивость плоских циклических сопряжённых систем, удовлетворяющих правилу Хюккеля (4n + 2 π-электронов).', relatedTopicId: 'org-aromatics' },
  { id: 'g-6', letter: 'В', term: 'Водородная связь', section: 'general', formula: 'O—H···O', definition: 'Межмолекулярное (или внутримолекулярное) притяжение между атомом H, связанным с сильно электроотрицательным атомом (F, O, N), и неподелённой парой другого такого атома.' },
  { id: 'g-7', letter: 'Г', term: 'Гибридизация орбиталей', section: 'organic', formula: 'sp³, sp², sp', definition: 'Выравнивание разных по форме и энергии атомных орбиталей (s и p) при образовании ковалентных связей, определяющее 3D-геометрию молекулы.' },
  { id: 'g-8', letter: 'Г', term: 'Гидролиз солей', section: 'inorganic', definition: 'Взаимодействие ионов соли с водой, приводящее к образованию слабого электролита и изменению pH раствора.', relatedTopicId: 'inorg-salts' },
  { id: 'g-9', letter: 'Г', term: 'Гомологи', section: 'organic', formula: 'Разница —CH2—', definition: 'Вещества одного класса со сходным строением и свойствами, отличающиеся по составу на одну или несколько групп —CH₂— (гомологическая разность).' },
  { id: 'g-10', letter: 'Д', term: 'Дегидратация', section: 'organic', formula: '− H2O', definition: 'Отщепление молекулы воды. Для спиртов бывает внутримолекулярной (даёт алкен при t > 140 °C) и межмолекулярной (даёт простой эфир при t < 140 °C).', relatedTopicId: 'org-alcohols' },
  { id: 'g-11', letter: 'Д', term: 'Диссоциация электролитическая', section: 'inorganic', definition: 'Распад электролита на катионы и анионы при растворении в воде или расплавлении.', relatedTopicId: 'inorg-equilibria' },
  { id: 'g-12', letter: 'И', term: 'Изомеры', section: 'organic', definition: 'Вещества с одинаковым качественным и количественным составом (одинаковой молекулярной формулой), но разным строением и свойствами.', relatedTopicId: 'org-isomerism' },
  { id: 'g-13', letter: 'К', term: 'Катализатор', section: 'inorganic', definition: 'Вещество, ускоряющее химическую реакцию за счёт снижения энергии активации, но не расходуемое в ходе процесса.', relatedTopicId: 'inorg-kinetics' },
  { id: 'g-14', letter: 'К', term: 'Кислоты', section: 'inorganic', formula: 'HnAn', definition: 'Электролиты, при диссоциации которых в водных растворах в качестве катионов образуются только ионы водорода H⁺ (по Аррениусу) или доноры протонов (по Брёнстеду).', relatedTopicId: 'inorg-acids' },
  { id: 'g-15', letter: 'К', term: 'Комплексные соединения', section: 'inorganic', formula: '[MLn]q', definition: 'Соединения, содержащие центральный атом-комплексообразователь и связанные с ним по донорно-акцепторному механизму лиганды.', relatedTopicId: 'inorg-complexes' },
  { id: 'g-16', letter: 'К', term: 'Константа равновесия', section: 'inorganic', formula: 'K = [C]^c[D]^d / [A]^a[B]^b', definition: 'Величина, характеризующая соотношение концентраций продуктов и реагентов в состоянии химического равновесия при данной температуре.', relatedTopicId: 'inorg-equilibria' },
  { id: 'g-17', letter: 'Л', term: 'Лиганд', section: 'inorganic', formula: 'NH3, H2O, OH-, CN-', definition: 'Молекула или ион с неподелённой электронной парой, координированный вокруг центрального атома в комплексном соединении.', relatedTopicId: 'inorg-complexes' },
  { id: 'g-18', letter: 'М', term: 'Механизм SN1 и SN2', section: 'organic', definition: 'Мономолекулярное (двухстадийное, через карбокатион) и бимолекулярное (одностадийное, с обращением конфигурации) нуклеофильное замещение.', relatedTopicId: 'org-mechanisms' },
  { id: 'g-19', letter: 'М', term: 'Молярная масса', section: 'general', formula: 'M = m / n (г/моль)', definition: 'Масса одного моля вещества, численно равная относительной молекулярной массе Mr.' },
  { id: 'g-20', letter: 'Н', term: 'Нуклеофил', section: 'organic', formula: 'OH-, CN-, NH3, RO-', definition: 'Частица с избытком электронной плотности (анион или молекула с неподелённой парой), атакующая электронодефицитный центр (δ+).', relatedTopicId: 'org-mechanisms' },
  { id: 'g-21', letter: 'О', term: 'ОВР (Окислительно-восстановительные реакции)', section: 'inorganic', definition: 'Реакции, протекающие с изменением степеней окисления атомов за счёт перехода электронов от восстановителя к окислителю.', relatedTopicId: 'inorg-redox' },
  { id: 'g-22', letter: 'О', term: 'Оксиды', section: 'inorganic', formula: 'ExOy', definition: 'Бинарные соединения элементов с кислородом в степени окисления −2. Подразделяются на основные, кислотные, амфотерные и несолеобразующие.', relatedTopicId: 'inorg-oxides' },
  { id: 'g-23', letter: 'О', term: 'Основания', section: 'inorganic', formula: 'Me(OH)n', definition: 'Сложные вещества, состоящие из ионов металла (или аммония) и одной или нескольких гидроксильных групп OH⁻.', relatedTopicId: 'inorg-bases' },
  { id: 'g-24', letter: 'П', term: 'Пептидная связь', section: 'organic', formula: '—CO—NH—', definition: 'Амидная связь, образующаяся между карбоксильной группой одной аминокислоты и аминогруппой другой при образовании пептидов и белков.', relatedTopicId: 'org-aminoacids' },
  { id: 'g-25', letter: 'П', term: 'Полимеризация', section: 'organic', definition: 'Процесс образования высокомолекулярного соединения (полимера) путём последовательного присоединения молекул мономера.', relatedTopicId: 'org-polymers' },
  { id: 'g-26', letter: 'П', term: 'Правило Марковникова', section: 'organic', definition: 'При присоединении полярных молекул HX к несимметричным алкенам атом водорода присоединяется к наиболее гидрированному атому углерода у двойной связи.', relatedTopicId: 'org-alkenes' },
  { id: 'g-27', letter: 'П', term: 'Принцип Ле Шателье', section: 'inorganic', definition: 'Если на систему в равновесии оказать внешнее воздействие (температура, давление, концентрация), равновесие смещается в сторону ослабления этого воздействия.', relatedTopicId: 'inorg-equilibria' },
  { id: 'g-28', letter: 'С', term: 'Соли', section: 'inorganic', definition: 'Продукты полного или частичного замещения атомов водорода в кислоте на ионы металла или катион аммония.', relatedTopicId: 'inorg-salts' },
  { id: 'g-29', letter: 'С', term: 'Стереохимия', section: 'organic', definition: 'Раздел химии, изучающий пространственное расположение атомов в молекулах и его влияние на физические и биологические свойства (цис/транс, R/S, D/L).', relatedTopicId: 'org-isomerism' },
  { id: 'g-30', letter: 'Т', term: 'Термодинамика химическая', section: 'inorganic', formula: 'ΔG = ΔH − TΔS', definition: 'Изучает тепловые эффекты реакций (энтальпию ΔH), энтропию ΔS и критерий самопроизвольности процессов (энергию Гиббса ΔG).', relatedTopicId: 'inorg-thermodynamics' },
  { id: 'g-31', letter: 'Ф', term: 'Функциональная группа', section: 'organic', formula: '—OH, —CHO, —COOH, —NH2', definition: 'Атом или группа атомов, определяющая принадлежность органического соединения к определённому классу и его характерные химические свойства.' },
  { id: 'g-32', letter: 'Х', term: 'Хиральность', section: 'organic', definition: 'Свойство молекулы не совмещаться со своим зеркальным отражением (обычно при наличии атома углерода с четырьмя различными заместителями).', relatedTopicId: 'org-isomerism' },
  { id: 'g-33', letter: 'Э', term: 'Электролиз', section: 'inorganic', definition: 'Окислительно-восстановительные процессы, протекающие на электродах при пропускании постоянного электрического тока через расплав или раствор электролита.', relatedTopicId: 'inorg-electrolysis' },
  { id: 'g-34', letter: 'Э', term: 'Электрофил', section: 'organic', formula: 'H+, NO2+, Br+', definition: 'Частица с дефицитом электронной плотности (катион или полярная молекула), стремящаяся присоединить электронную пару.', relatedTopicId: 'org-mechanisms' },
  { id: 'g-35', letter: 'Э', term: 'Энтальпия реакции (ΔH)', section: 'inorganic', formula: 'ΔH < 0 (экзо), ΔH > 0 (эндо)', definition: 'Тепловой эффект химической реакции при постоянном давлении.', relatedTopicId: 'inorg-thermodynamics' },
  { id: 'g-36', letter: 'Э', term: 'Этерификация', section: 'organic', formula: 'RCOOH + R′OH ⇄ RCOOR′ + H2O', definition: 'Обратимая реакция образования сложного эфира (эстера) и воды из карбоновой кислоты и спирта в присутствии кислотного катализатора.', relatedTopicId: 'org-esters' },
];
