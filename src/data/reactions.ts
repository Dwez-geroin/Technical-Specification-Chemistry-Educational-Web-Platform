import type { ReactionData } from '../types/chemistry';

const CURATED_REACTIONS: ReactionData[] = [
  {
    id: 'rx-org-ch4-cl2',
    section: 'organic',
    level: 'base',
    reactionType: 'Замещение (SR)',
    startFormula: 'CH4',
    startName: 'Метан',
    reagent: 'Cl2',
    reagentName: 'Хлор',
    condition: 'УФ-свет (hν)',
    equation: 'CH4 + Cl2 → CH3Cl + HCl',
    productFormula: 'CH3Cl',
    productName: 'Хлорметан',
    structuralProduct: 'H3C—Cl',
    productMoleculeId: 'chloromethane',
    topicId: 'org-alkanes',
    summary: 'Радикальное монохлорирование метана на свету с образованием хлорметана и хлороводорода.',
    steps: [
      {
        title: 'Шаг 1. Инициирование цепи',
        description: 'Под действием кванта УФ-света молекула Cl₂ гомолитически распадается на два активных радикала Cl•.',
        stateFormula: 'Cl—Cl → Cl• + Cl•',
        bondChange: 'Разрыв σ-связи Cl–Cl',
      },
      {
        title: 'Шаг 2. Атака метана',
        description: 'Радикал хлора отрывает атом водорода от метана с образованием метильного радикала •CH₃ и HCl.',
        stateFormula: 'H3C—H + Cl• → •CH3 + HCl',
        bondChange: 'Разрыв C–H, образование H–Cl',
      },
      {
        title: 'Шаг 3. Образование продукта',
        description: 'Метильный радикал взаимодействует с новой молекулой Cl₂, формируя хлорметан CH₃Cl и регенерируя радикал Cl•.',
        stateFormula: '•CH3 + Cl—Cl → CH3—Cl + Cl•',
        bondChange: 'Образование полярной связи C–Cl',
      },
    ],
  },
  {
    id: 'rx-org-ethane-dehydro',
    section: 'organic',
    level: 'base',
    reactionType: 'Отщепление (дегидрирование)',
    startFormula: 'C2H6',
    startName: 'Этан',
    reagent: 'Катализатор (дегидрирование)',
    reagentName: 'Отщепление H2',
    condition: 'Pt / Cr2O3, 500 °C',
    equation: 'C2H6 → C2H4 + H2',
    productFormula: 'C2H4',
    productName: 'Этилен (этен)',
    structuralProduct: 'CH2=CH2',
    productMoleculeId: 'ethene',
    topicId: 'org-alkanes',
    summary: 'Каталитическое дегидрирование этана переводит предельный углеводород в алкен с образованием π-связи.',
    steps: [
      {
        title: 'Шаг 1. Адсорбция на катализаторе',
        description: 'Молекула этана адсорбируется на поверхности платины или оксида хрома(III), ослабляя соседние связи C–H.',
        stateFormula: 'H—CH2—CH2—H (на Pt)',
        bondChange: 'Поляризация двух вицинальных связей C–H',
      },
      {
        title: 'Шаг 2. Отрыв атомов водорода',
        description: 'Два атома водорода переходят на активные центры катализатора и соединяются в молекулу H₂.',
        stateFormula: '•CH2—CH2• + H2↑',
        bondChange: 'Разрыв двух σ-связей C–H',
      },
      {
        title: 'Шаг 3. Замыкание π-связи',
        description: 'Атомы углерода переходят из sp³ в sp²-гибридизацию, образуя плоскую молекулу этилена CH₂=CH₂.',
        stateFormula: 'CH2=CH2 + H2↑',
        bondChange: 'Образование π-связи C=C',
      },
    ],
  },
  {
    id: 'rx-org-ethene-h2o',
    section: 'organic',
    level: 'base',
    reactionType: 'Присоединение (гидратация)',
    startFormula: 'C2H4',
    startName: 'Этилен',
    reagent: 'H2O',
    reagentName: 'Вода',
    condition: 'H3PO4, 300 °C, давление',
    equation: 'C2H4 + H2O → C2H5OH',
    productFormula: 'C2H5OH',
    productName: 'Этанол',
    structuralProduct: 'CH3—CH2—OH',
    productMoleculeId: 'ethanol',
    topicId: 'org-alkenes',
    summary: 'Промышленный способ синтеза этилового спирта путём электрофильной гидратации этилена.',
    steps: [
      {
        title: 'Шаг 1. Протонирование π-связи',
        description: 'Протон H⁺ от кислотного катализатора атакует электронное облако π-связи этилена, образуя этилкарбокатион.',
        stateFormula: 'CH2=CH2 + H+ → CH3—CH2+',
        bondChange: 'Разрыв π-связи C=C, образование C–H',
      },
      {
        title: 'Шаг 2. Присоединение молекулы воды',
        description: 'Нуклеофильный атом кислорода воды отдаёт неподелённую пару карбокатиону, формируя ион оксония.',
        stateFormula: 'CH3—CH2+ + H2O → CH3—CH2—O+H2',
        bondChange: 'Образование связи C–O',
      },
      {
        title: 'Шаг 3. Отщепление протона',
        description: 'Отщепление H⁺ регенерирует катализатор и даёт нейтральную молекулу этанола CH₃–CH₂–OH.',
        stateFormula: 'CH3—CH2—OH + H+',
        bondChange: 'Стабилизация гидроксильной группы –OH',
      },
    ],
  },
  {
    id: 'rx-org-ethene-h2',
    section: 'organic',
    level: 'base',
    reactionType: 'Присоединение (гидрирование)',
    startFormula: 'C2H4',
    startName: 'Этилен',
    reagent: 'H2',
    reagentName: 'Водород',
    condition: 'Ni / Pt, 150 °C',
    equation: 'C2H4 + H2 → C2H6',
    productFormula: 'C2H6',
    productName: 'Этан',
    structuralProduct: 'CH3—CH3',
    productMoleculeId: 'ethane',
    topicId: 'org-alkenes',
    summary: 'Каталитическое гидрирование этилена до этана с переходом гибридизации sp² → sp³.',
    steps: [
      {
        title: 'Шаг 1. Активация водорода на никеле',
        description: 'Молекула H₂ диссоциирует на поверхности никелевого катализатора.',
        stateFormula: 'H—H → 2 H(адс.)',
        bondChange: 'Разрыв связи H–H',
      },
      {
        title: 'Шаг 2. Раскрытие π-связи',
        description: 'Атомы водорода синхронно присоединяются к обоим атомам углерода с одной стороны плоскости (син-присоединение).',
        stateFormula: 'CH2=CH2 + 2H → CH3—CH3',
        bondChange: 'Разрыв π-связи, образование двух σ-связей C–H',
      },
      {
        title: 'Шаг 3. Десорбция этана',
        description: 'Тетраэдрическая молекула этана покидает поверхность катализатора.',
        stateFormula: 'CH3—CH3',
        bondChange: 'Переход геометрии 120° → 109,5°',
      },
    ],
  },
  {
    id: 'rx-org-ethene-poly',
    section: 'organic',
    level: 'advanced',
    reactionType: 'Полимеризация',
    startFormula: 'C2H4',
    startName: 'Этилен',
    reagent: 'Катализатор Циглера — Натта',
    reagentName: 'Полимеризация (n C2H4)',
    condition: 't°, p, TiCl4 + Al(C2H5)3',
    equation: 'n C2H4 → (—CH2—CH2—)n',
    productFormula: '(C2H4)n',
    productName: 'Полиэтилен',
    structuralProduct: '…—CH2—CH2—CH2—CH2—…',
    productMoleculeId: 'n-butane',
    topicId: 'org-polymers',
    summary: 'Координационно-ионная полимеризация этилена в линейный полиэтилен высокой плотности.',
    steps: [
      {
        title: 'Шаг 1. Координация мономера',
        description: 'Молекула этилена координируется π-связью с активным центром катализатора.',
        stateFormula: 'Cat—R + CH2=CH2',
        bondChange: 'Активация π-связи',
      },
      {
        title: 'Шаг 2. Внедрение в растущую цепь',
        description: 'Двойная связь раскрывается, и фрагмент —CH₂—CH₂— встраивается в макромолекулу.',
        stateFormula: 'Cat—CH2—CH2—R',
        bondChange: 'Образование новой σ-связи C–C',
      },
      {
        title: 'Шаг 3. Рост полимерной цепи',
        description: 'Процесс повторяется тысячи раз с образованием длинной предельной цепи полиэтилена.',
        stateFormula: '(—CH2—CH2—)n',
        bondChange: 'Переход всех атомов C в sp³',
      },
    ],
  },
  {
    id: 'rx-org-ethyne-benzene',
    section: 'organic',
    level: 'base',
    reactionType: 'Циклотримеризация',
    startFormula: 'C2H2',
    startName: 'Ацетилен',
    reagent: 'Активированный уголь',
    reagentName: 'Тримеризация (Зелинский)',
    condition: 'C (акт.), 600 °C',
    equation: '3 C2H2 → C6H6',
    productFormula: 'C6H6',
    productName: 'Бензол',
    structuralProduct: 'C6H6 (ароматическое кольцо)',
    productMoleculeId: 'benzene',
    topicId: 'org-alkynes',
    summary: 'Реакция Зелинского — Казанского: превращение трёх молекул ацетилена в бензол.',
    steps: [
      {
        title: 'Шаг 1. Сближение трёх молекул ацетилена',
        description: 'В порах активированного угля при 600 °C три молекулы HC≡CH ориентируются в плоский цикл.',
        stateFormula: '3 (H—C≡C—H)',
        bondChange: 'Синхронное сближение π-облаков',
      },
      {
        title: 'Шаг 2. Перераспределение π-связей',
        description: 'Три π-связи раскрываются с замыканием трёх новых σ-связей C–C между молекулами.',
        stateFormula: 'Цикл C6H6 (делокализация)',
        bondChange: 'Разрыв 3 π-связей → образование 3 σ-связей C–C',
      },
      {
        title: 'Шаг 3. Ароматическая стабилизация',
        description: 'Оставшиеся 6 π-электронов образуют единую сопряжённую ароматическую систему бензола.',
        stateFormula: 'C6H6',
        bondChange: 'Выравнивание всех связей до 0,140 нм',
      },
    ],
  },
  {
    id: 'rx-org-ethyne-h2o',
    section: 'organic',
    level: 'base',
    reactionType: 'Присоединение (реакция Кучерова)',
    startFormula: 'C2H2',
    startName: 'Ацетилен',
    reagent: 'H2O',
    reagentName: 'Вода',
    condition: 'HgSO4, H2SO4, t°',
    equation: 'C2H2 + H2O → CH3CHO',
    productFormula: 'CH3CHO',
    productName: 'Этаналь (уксусный альдегид)',
    structuralProduct: 'CH3—CH=O',
    productMoleculeId: 'ethanal',
    topicId: 'org-alkynes',
    summary: 'Гидратация ацетилена в присутствии солей ртути(II) через промежуточный виниловый спирт.',
    steps: [
      {
        title: 'Шаг 1. Присоединение воды по тройной связи',
        description: 'В присутствии ионов Hg²⁺ вода присоединяется к одной из π-связей ацетилена.',
        stateFormula: 'HC≡CH + H2O → [CH2=CH—OH]',
        bondChange: 'Разрыв π-связи C≡C, образование C–OH',
      },
      {
        title: 'Шаг 2. Кето-енольная изомеризация',
        description: 'Неустойчивый виниловый спирт (енол) самопроизвольно перегруппировывается: протон переходит к CH₂, а двойная связь — к кислороду.',
        stateFormula: '[CH2=CH—OH] → CH3—CH=O',
        bondChange: 'Миграция H⁺ и сдвиг π-связи (C=C → C=O)',
      },
      {
        title: 'Шаг 3. Продукт — этаналь',
        description: 'Образуется устойчивый уксусный альдегид с полярной карбонильной группой.',
        stateFormula: 'CH3—CH=O',
        bondChange: 'Формирование карбонильной группы –CHO',
      },
    ],
  },
  {
    id: 'rx-org-ethanol-dehyd',
    section: 'organic',
    level: 'base',
    reactionType: 'Отщепление (дегидратация)',
    startFormula: 'C2H5OH',
    startName: 'Этанол',
    reagent: 'H2SO4 (конц.)',
    reagentName: 'Водоотнимающий катализатор',
    condition: 't > 140 °C',
    equation: 'C2H5OH → C2H4 + H2O',
    productFormula: 'C2H4',
    productName: 'Этилен',
    structuralProduct: 'CH2=CH2',
    productMoleculeId: 'ethene',
    topicId: 'org-alcohols',
    summary: 'Внутримолекулярная дегидратация этанола с получением этилена.',
    steps: [
      {
        title: 'Шаг 1. Протонирование гидроксила',
        description: 'Группа –OH принимает протон от H₂SO₄, превращаясь в хорошую уходящую группу –OH₂⁺.',
        stateFormula: 'CH3—CH2—OH + H+ → CH3—CH2—O+H2',
        bondChange: 'Ослабление связи C–O',
      },
      {
        title: 'Шаг 2. Отрыв молекулы воды',
        description: 'Уход H₂O и отщепление соседнего протона H⁺ при нагревании > 140 °C.',
        stateFormula: 'H—CH2—CH2—O+H2 → CH2=CH2 + H2O + H+',
        bondChange: 'Разрыв C–O и C–H',
      },
      {
        title: 'Шаг 3. Формирование двойной связи',
        description: 'Образуется газообразный этилен CH₂=CH₂.',
        stateFormula: 'CH2=CH2 + H2O',
        bondChange: 'Образование π-связи C=C',
      },
    ],
  },
  {
    id: 'rx-org-ethanol-cuo',
    section: 'organic',
    level: 'base',
    reactionType: 'Окисление',
    startFormula: 'C2H5OH',
    startName: 'Этанол',
    reagent: 'CuO',
    reagentName: 'Оксид меди(II)',
    condition: 'Нагревание (t°)',
    equation: 'C2H5OH + CuO → CH3CHO + Cu + H2O',
    productFormula: 'CH3CHO',
    productName: 'Этаналь',
    structuralProduct: 'CH3—CH=O',
    productMoleculeId: 'ethanal',
    topicId: 'org-alcohols',
    summary: 'Мягкое окисление первичного спирта раскалённым оксидом меди(II) до альдегида и красной металлической меди.',
    steps: [
      {
        title: 'Шаг 1. Контакт паров спирта с CuO',
        description: 'Чёрный порошок CuO окисляет α-атом углерода, связанный с гидроксильной группой.',
        stateFormula: 'CH3—CH2—OH + CuO',
        bondChange: 'Активация связей α-C–H и O–H',
      },
      {
        title: 'Шаг 2. Перенос двух атомов водорода',
        description: 'Два атома водорода связываются с кислородом CuO в воду, а Cu²⁺ восстанавливается до Cu⁰.',
        stateFormula: 'CH3—CH=O + Cu + H2O',
        bondChange: 'Образование карбонильной связи C=O',
      },
      {
        title: 'Шаг 3. Визуальный признак',
        description: 'Чёрный налёт CuO превращается в блестящую розово-красную медь, появляется запах зелёных яблок (этаналь).',
        stateFormula: 'CH3—CH=O',
        bondChange: 'Степень окисления C: −1 → +1',
      },
    ],
  },
  {
    id: 'rx-org-ethanal-cuoh2',
    section: 'organic',
    level: 'base',
    reactionType: 'Окисление (качественная реакция)',
    startFormula: 'CH3CHO',
    startName: 'Этаналь',
    reagent: 'Cu(OH)2',
    reagentName: 'Гидроксид меди(II)',
    condition: 'Нагревание (t°)',
    equation: 'CH3CHO + 2Cu(OH)2 → CH3COOH + Cu2O↓ + 2H2O',
    productFormula: 'CH3COOH',
    productName: 'Уксусная кислота',
    structuralProduct: 'CH3—C(=O)—OH',
    productMoleculeId: 'acetic-acid',
    topicId: 'org-aldehydes',
    summary: 'Качественная реакция альдегидов: окисление до карбоновой кислоты с выпадением кирпично-красного осадка Cu₂O.',
    steps: [
      {
        title: 'Шаг 1. Окисление связи C–H альдегидной группы',
        description: 'Ионы Cu²⁺ окисляют карбонильный углерод от степени окисления +1 до +3.',
        stateFormula: 'CH3—CH=O + 2Cu(OH)2',
        bondChange: 'Разрыв альдегидной связи C–H',
      },
      {
        title: 'Шаг 2. Промежуточный жёлтый осадок CuOH',
        description: 'Образуется неустойчивый жёлтый CuOH, который при нагревании теряет воду до кирпично-красного Cu₂O.',
        stateFormula: '2CuOH → Cu2O↓ + H2O',
        bondChange: 'Восстановление Cu(+2) → Cu(+1)',
      },
      {
        title: 'Шаг 3. Образование уксусной кислоты',
        description: 'Альдегидная группа превращается в карбоксильную –COOH.',
        stateFormula: 'CH3—COOH + Cu2O↓ + 2H2O',
        bondChange: 'Формирование связи C–OH',
      },
    ],
  },
  {
    id: 'rx-org-ester',
    section: 'organic',
    level: 'base',
    reactionType: 'Этерификация',
    startFormula: 'CH3COOH',
    startName: 'Уксусная кислота',
    reagent: 'C2H5OH',
    reagentName: 'Этанол',
    condition: 'H2SO4 (конц.), t°',
    equation: 'CH3COOH + C2H5OH ⇄ CH3COOC2H5 + H2O',
    productFormula: 'CH3COOC2H5',
    productName: 'Этилацетат',
    structuralProduct: 'CH3—C(=O)—O—C2H5',
    productMoleculeId: 'ethyl-acetate',
    topicId: 'org-esters',
    summary: 'Обратимая реакция Фишера: получение сложного эфира из карбоновой кислоты и спирта.',
    steps: [
      {
        title: 'Шаг 1. Активация карбонильной группы',
        description: 'H₂SO₄ протонирует карбонильный кислород кислоты, усиливая δ+ на атоме углерода.',
        stateFormula: 'CH3—C(=O+H)—OH',
        bondChange: 'Поляризация связи C=O',
      },
      {
        title: 'Шаг 2. Нуклеофильная атака спирта',
        description: 'Кислород этанола атакует карбоксильный углерод с образованием тетраэдрического интермедиата.',
        stateFormula: 'CH3—C(OH)2—O—C2H5',
        bondChange: 'Образование новой связи C–O',
      },
      {
        title: 'Шаг 3. Отщепление воды',
        description: 'Отщепляется молекула H₂O (OH от кислоты + H от спирта) и образуется этилацетат.',
        stateFormula: 'CH3—C(=O)—O—C2H5 + H2O',
        bondChange: 'Формирование сложноэфирной группы –COO–',
      },
    ],
  },
  {
    id: 'rx-org-benzene-alkyl',
    section: 'organic',
    level: 'advanced',
    reactionType: 'Электрофильное замещение (SEAr)',
    startFormula: 'C6H6',
    startName: 'Бензол',
    reagent: 'CH3Cl',
    reagentName: 'Хлорметан',
    condition: 'AlCl3 (безв.)',
    equation: 'C6H6 + CH3Cl → C6H5CH3 + HCl',
    productFormula: 'C6H5CH3',
    productName: 'Толуол (метилбензол)',
    structuralProduct: 'C6H5—CH3',
    productMoleculeId: 'toluene',
    topicId: 'org-aromatics',
    summary: 'Алкилирование бензола по Фриделю — Крафтсу с получением толуола.',
    steps: [
      {
        title: 'Шаг 1. Генерация электрофила',
        description: 'Кислота Льюиса AlCl₃ поляризует связь C–Cl с образованием электрофильного комплекса [CH₃δ+…Cl–AlCl₃δ−].',
        stateFormula: 'CH3Cl + AlCl3 → CH3+[AlCl4]-',
        bondChange: 'Гетеролиз связи C–Cl',
      },
      {
        title: 'Шаг 2. Образование σ-комплекса',
        description: 'Метильный катион присоединяется к бензольному кольцу, временно нарушая ароматичность.',
        stateFormula: '[C6H6—CH3]+ (арениевый ион)',
        bondChange: 'Образование связи C(кольца)–CH₃',
      },
      {
        title: 'Шаг 3. Восстановление ароматичности',
        description: 'Отщепление протона H⁺ (уходит в виде HCl) восстанавливает замкнутую 6π-систему кольца.',
        stateFormula: 'C6H5—CH3 + HCl',
        bondChange: 'Разрыв C–H, восстановление ароматичности',
      },
    ],
  },
  {
    id: 'rx-org-nitro-aniline',
    section: 'organic',
    level: 'base',
    reactionType: 'Восстановление (реакция Зинина)',
    startFormula: 'C6H5NO2',
    startName: 'Нитробензол',
    reagent: 'Fe + HCl (или H2)',
    reagentName: 'Восстановитель [H]',
    condition: 't°, затем NaOH',
    equation: 'C6H5NO2 + 6[H] → C6H5NH2 + 2H2O',
    productFormula: 'C6H5NH2',
    productName: 'Анилин',
    structuralProduct: 'C6H5—NH2',
    productMoleculeId: 'methylamine',
    topicId: 'org-amines',
    summary: 'Классический синтез первичного ароматического амина восстановлением нитрогруппы.',
    steps: [
      {
        title: 'Шаг 1. Восстановление до нитрозобензола',
        description: 'Атомарный водород восстанавливает нитрогруппу –NO₂ с отщеплением первой молекулы воды.',
        stateFormula: 'C6H5—NO2 → C6H5—N=O + H2O',
        bondChange: 'Разрыв одной связи N–O',
      },
      {
        title: 'Шаг 2. Стадия фенилгидроксиламина',
        description: 'Дальнейшее присоединение водорода даёт промежуточный C₆H₅–NHOH.',
        stateFormula: 'C6H5—NHOH',
        bondChange: 'Присоединение H к N и O',
      },
      {
        title: 'Шаг 3. Образование анилина',
        description: 'Отщепление второй молекулы воды приводит к аминогруппе –NH₂.',
        stateFormula: 'C6H5—NH2 + 2H2O',
        bondChange: 'Степень окисления N: +3 → −3',
      },
    ],
  },
  // ==================== НЕОРГАНИКА (Флагманские) ====================
  {
    id: 'rx-inorg-so3-h2o',
    section: 'inorganic',
    level: 'base',
    reactionType: 'Соединение (гидратация оксида)',
    startFormula: 'SO3',
    startName: 'Оксид серы(VI)',
    reagent: 'H2O',
    reagentName: 'Вода',
    condition: 'Обычные условия (экзотерм.)',
    equation: 'SO3 + H2O → H2SO4',
    productFormula: 'H2SO4',
    productName: 'Серная кислота',
    structuralProduct: 'HO—S(=O)2—OH',
    productMoleculeId: 'sulfuric-acid',
    topicId: 'inorg-oxides',
    summary: 'Взаимодействие кислотного оксида SO₃ с водой с образованием сильной серной кислоты.',
    steps: [
      {
        title: 'Шаг 1. Нуклеофильная атака воды на серу',
        description: 'Атом серы в SO₃ несёт значительный δ+ и притягивает неподелённую пару кислорода воды.',
        stateFormula: 'O3S + :OH2 → [H2O+—SO3-]',
        bondChange: 'Образование донорно-акцепторной связи S–O',
      },
      {
        title: 'Шаг 2. Перенос протона',
        description: 'Протон H⁺ мигрирует на один из атомов кислорода оксида.',
        stateFormula: 'HO—S(=O)2—OH',
        bondChange: 'Перестройка π-связи S=O в две группы –OH',
      },
      {
        title: 'Шаг 3. Тетраэдрическая молекула H2SO4',
        description: 'Плоский треугольник SO₃ переходит в тетраэдрическую структуру серной кислоты.',
        stateFormula: 'H2SO4',
        bondChange: 'Геометрия 120° → 109,5°',
      },
    ],
  },
  {
    id: 'rx-inorg-naoh-hcl',
    section: 'inorganic',
    level: 'base',
    reactionType: 'Обмен (нейтрализация)',
    startFormula: 'NaOH',
    startName: 'Гидроксид натрия',
    reagent: 'HCl',
    reagentName: 'Соляная кислота',
    condition: 'Водный раствор',
    equation: 'NaOH + HCl → NaCl + H2O',
    productFormula: 'NaCl',
    productName: 'Хлорид натрия и вода',
    structuralProduct: 'Na⁺Cl⁻ + H—O—H',
    productMoleculeId: 'sodium-chloride',
    topicId: 'inorg-bases',
    summary: 'Классическая реакция нейтрализации сильной щёлочи сильной кислотой.',
    steps: [
      {
        title: 'Шаг 1. Электролитическая диссоциация',
        description: 'Оба сильных электролита полностью распадаются в воде на ионы.',
        stateFormula: 'Na+ + OH- + H+ + Cl-',
        bondChange: 'Разрыв ионных и полярных связей в растворе',
      },
      {
        title: 'Шаг 2. Связывание ионов H+ и OH-',
        description: 'Протон H⁺ и гидроксид-ион OH⁻ необратимо соединяются в молекулу слабого электролита — воды.',
        stateFormula: 'H+ + OH- → H2O',
        bondChange: 'Образование ковалентной связи O–H',
      },
      {
        title: 'Шаг 3. Итог в растворе',
        description: 'В растворе остаются ионы Na⁺ и Cl⁻ (нейтральная среда, pH = 7).',
        stateFormula: 'NaCl + H2O',
        bondChange: 'Выделение теплоты нейтрализации (~56 кДж/моль)',
      },
    ],
  },
  {
    id: 'rx-inorg-cu-hno3',
    section: 'inorganic',
    level: 'base',
    reactionType: 'ОВР (кислота-окислитель)',
    startFormula: 'Cu',
    startName: 'Медь',
    reagent: 'HNO3 (конц.)',
    reagentName: 'Азотная кислота (конц.)',
    condition: 'Обычные условия',
    equation: 'Cu + 4HNO3(конц.) → Cu(NO3)2 + 2NO2↑ + 2H2O',
    productFormula: 'Cu(NO3)2',
    productName: 'Нитрат меди(II) и бурый газ NO2',
    structuralProduct: 'Cu²⁺(NO3⁻)2 + 2 NO2↑',
    productMoleculeId: 'nitric-acid',
    topicId: 'inorg-acids',
    summary: 'Окисление малоактивного металла концентрированной азотной кислотой с выделением бурого газа NO₂.',
    steps: [
      {
        title: 'Шаг 1. Окисление меди',
        description: 'Атом меди отдаёт 2 электрона, переходя в голубой катион Cu²⁺.',
        stateFormula: 'Cu⁰ − 2e⁻ → Cu²⁺',
        bondChange: 'Разрушение металлической кристаллической решётки',
      },
      {
        title: 'Шаг 2. Восстановление нитрат-иона',
        description: 'Два иона NO₃⁻ принимают по 1 электрону, образуя бурый газ NO₂.',
        stateFormula: '2 N(+5) + 2e⁻ → 2 N(+4)O2↑',
        bondChange: 'Понижение степени окисления азота +5 → +4',
      },
      {
        title: 'Шаг 3. Связывание в соль и воду',
        description: 'Ещё две молекулы HNO₃ идут на образование соли Cu(NO₃)₂ и воды.',
        stateFormula: 'Cu(NO3)2 + 2NO2↑ + 2H2O',
        bondChange: 'Полный электронный баланс: 2e⁻ = 2e⁻',
      },
    ],
  },
  {
    id: 'rx-inorg-cuoh2-nh3',
    section: 'inorganic',
    level: 'advanced',
    reactionType: 'Комплексообразование',
    startFormula: 'Cu(OH)2',
    startName: 'Гидроксид меди(II)',
    reagent: 'NH3 (избыток)',
    reagentName: 'Раствор аммиака',
    condition: 'Водный раствор, 20 °C',
    equation: 'Cu(OH)2 + 4NH3 → [Cu(NH3)4](OH)2',
    productFormula: '[Cu(NH3)4](OH)2',
    productName: 'Гидроксид тетраамминмеди(II) (реактив Швейцера)',
    structuralProduct: '[Cu(NH3)4]²⁺ (OH⁻)2',
    productMoleculeId: 'tetraamminecopper',
    topicId: 'inorg-complexes',
    summary: 'Растворение голубого осадка Cu(OH)₂ в избытке аммиака с образованием тёмно-синего комплексного раствора.',
    steps: [
      {
        title: 'Шаг 1. Атака лигандов NH3',
        description: 'Молекулы аммиака с неподелённой электронной парой атакуют центральный ион Cu²⁺ в осадке.',
        stateFormula: 'Cu(OH)2↓ + 4 :NH3',
        bondChange: 'Вытеснение гидроксид-ионов во внешнюю сферу',
      },
      {
        title: 'Шаг 2. Координация по донорно-акцепторному типу',
        description: 'Четыре лиганда NH₃ располагаются в вершинах квадрата вокруг Cu²⁺ (КЧ = 4).',
        stateFormula: '[Cu(NH3)4]²⁺',
        bondChange: 'Образование 4 координационных связей Cu←N',
      },
      {
        title: 'Шаг 3. Растворение осадка',
        description: 'Осадок полностью исчезает, раствор приобретает насыщенный васильково-синий цвет.',
        stateFormula: '[Cu(NH3)4](OH)2',
        bondChange: 'Образование сильного растворимого комплексного основания',
      },
    ],
  },
  {
    id: 'rx-inorg-n2-h2',
    section: 'inorganic',
    level: 'advanced',
    reactionType: 'Обратимый синтез (Габер)',
    startFormula: 'N2',
    startName: 'Азот',
    reagent: 'H2',
    reagentName: 'Водород',
    condition: 'Fe (катализатор), 450 °C, 20 МПа',
    equation: 'N2 + 3H2 ⇄ 2NH3',
    productFormula: 'NH3',
    productName: 'Аммиак',
    structuralProduct: 'NH3 (тригональная пирамида)',
    productMoleculeId: 'ammonia',
    topicId: 'inorg-equilibria',
    summary: 'Промышленный синтез аммиака — классический пример управления химическим равновесием по принципу Ле Шателье.',
    steps: [
      {
        title: 'Шаг 1. Диссоциативная адсорбция N2',
        description: 'Очень прочная тройная связь N≡N разрывается на поверхности губчатого железа.',
        stateFormula: 'N≡N → 2 N(адс.)',
        bondChange: 'Разрыв тройной связи N≡N',
      },
      {
        title: 'Шаг 2. Ступенчатое гидрирование',
        description: 'Атомы азота последовательно присоединяют атомы водорода: NH → NH₂ → NH₃.',
        stateFormula: 'N + 3H → NH3',
        bondChange: 'Образование трёх полярных σ-связей N–H',
      },
      {
        title: 'Шаг 3. Равновесие системы',
        description: 'Высокое давление смещает равновесие в сторону NH₃ (4 моль газа → 2 моль газа).',
        stateFormula: 'N2 + 3H2 ⇄ 2NH3 + Q',
        bondChange: 'Экзотермический процесс (ΔH = −92 кДж)',
      },
    ],
  },
  {
    id: 'rx-inorg-caco3-heat',
    section: 'inorganic',
    level: 'base',
    reactionType: 'Разложение',
    startFormula: 'CaCO3',
    startName: 'Карбонат кальция',
    reagent: 'Нагревание (обжиг)',
    reagentName: 'Термическое разложение',
    condition: '900–1000 °C',
    equation: 'CaCO3 → CaO + CO2↑',
    productFormula: 'CO2',
    productName: 'Оксид кальция и углекислый газ',
    structuralProduct: 'CaO + O=C=O',
    productMoleculeId: 'co2',
    topicId: 'inorg-salts',
    summary: 'Обжиг известняка с получением негашёной извести CaO и углекислого газа CO₂.',
    steps: [
      {
        title: 'Шаг 1. Тепловое возбуждение кристаллической решётки',
        description: 'При 900 °C колебания карбонат-иона CO₃²⁻ ослабляют связь C–O.',
        stateFormula: 'Ca2+[CO3]2- (t°)',
        bondChange: 'Поляризация аниона CO₃²⁻ катионом Ca²⁺',
      },
      {
        title: 'Шаг 2. Отщепление молекулы CO2',
        description: 'Один атом кислорода остаётся с кальцием (CaO), а линейная молекула CO₂ удаляется в газовую фазу.',
        stateFormula: 'CaO + O=C=O↑',
        bondChange: 'Переход CO₃²⁻ (sp²) → CO₂ (sp)',
      },
      {
        title: 'Шаг 3. Необратимый сдвиг',
        description: 'Удаление газа CO₂ смещает равновесие до полного разложения известняка.',
        stateFormula: 'CaO + CO2↑',
        bondChange: 'Эндотермический процесс (ΔH > 0)',
      },
    ],
  },
];

// Systematic, chemically accurate generator expanding the constructor database to 340+ real reactions
function buildExpandedReactions(): ReactionData[] {
  const list: ReactionData[] = [...CURATED_REACTIONS];

  // 1. Homologous series of alkanes C1..C8 (combustion, cracking/dehydrogenation, halogenation, nitration)
  const alkanes = [
    { n: 1, f: 'CH4', name: 'Метан', rad: 'CH3', mol: 'methane' },
    { n: 2, f: 'C2H6', name: 'Этан', rad: 'C2H5', mol: 'ethane' },
    { n: 3, f: 'C3H8', name: 'Пропан', rad: 'C3H7', mol: 'propane' },
    { n: 4, f: 'C4H10', name: 'Бутан', rad: 'C4H9', mol: 'n-butane' },
    { n: 5, f: 'C5H12', name: 'Пентан', rad: 'C5H11', mol: 'n-butane' },
    { n: 6, f: 'C6H14', name: 'Гексан', rad: 'C6H13', mol: 'n-butane' },
    { n: 7, f: 'C7H16', name: 'Гептан', rad: 'C7H15', mol: 'n-butane' },
    { n: 8, f: 'C8H18', name: 'Октан', rad: 'C8H17', mol: 'n-butane' },
  ];

  for (const a of alkanes) {
    const o2Coeff = 3 * a.n + 1;
    const isEven = o2Coeff % 2 === 0;
    const alkC = isEven ? '' : '2 ';
    const o2C = isEven ? `${o2Coeff / 2} ` : `${o2Coeff} `;
    const co2C = isEven ? (a.n === 1 ? '' : `${a.n} `) : `${2 * a.n} `;
    const h2oC = isEven ? `${a.n + 1} ` : `${2 * (a.n + 1)} `;
    list.push({
      id: `rx-gen-alk-comb-${a.n}`,
      section: 'organic',
      level: 'base',
      reactionType: 'Горение (окисление)',
      startFormula: a.f,
      startName: a.name,
      reagent: 'O2',
      reagentName: 'Кислород (избыток)',
      condition: 'Поджигание (t°)',
      equation: `${alkC}${a.f} + ${o2C}O2 → ${co2C}CO2 + ${h2oC}H2O`,
      productFormula: 'CO2',
      productName: 'Углекислый газ и вода',
      structuralProduct: 'O=C=O + H—O—H',
      productMoleculeId: 'co2',
      topicId: 'org-alkanes',
      summary: `Полное сгорание (${a.name.toLowerCase()}) с выделением большого количества теплоты.`,
      steps: [
        { title: 'Шаг 1. Инициирование горения', description: `Нагрев смеси ${a.f} и O₂ до температуры воспламенения.`, stateFormula: `${a.f} + O2`, bondChange: 'Гомолиз связей C–H и C–C' },
        { title: 'Шаг 2. Цепное окисление', description: 'Последовательное окисление радикалов кислородом.', stateFormula: 'Интермедиаты ROO• → CO, H2O', bondChange: 'Образование связей C–O и O–H' },
        { title: 'Шаг 3. Полные продукты окисления', description: 'Формирование устойчивых молекул CO₂ и H₂O.', stateFormula: `${co2C}CO2 + ${h2oC}H2O`, bondChange: 'Окисление C до +4' },
      ],
    });

    if (a.n > 1) {
      list.push({
        id: `rx-gen-alk-cl2-${a.n}`,
        section: 'organic',
        level: 'base',
        reactionType: 'Замещение (SR)',
        startFormula: a.f,
        startName: a.name,
        reagent: 'Cl2',
        reagentName: 'Хлор',
        condition: 'УФ-свет (hν)',
        equation: `${a.f} + Cl2 → ${a.rad}Cl + HCl`,
        productFormula: `${a.rad}Cl`,
        productName: `Монохлорпроизводное (${a.name.toLowerCase()})`,
        structuralProduct: `${a.rad}—Cl`,
        productMoleculeId: 'chloromethane',
        topicId: 'org-alkanes',
        summary: `Радикальное хлорирование (${a.name.toLowerCase()}) при УФ-облучении.`,
        steps: [
          { title: 'Шаг 1. Гомолиз хлора', description: 'Образование радикалов Cl• под действием света.', stateFormula: 'Cl2 → 2Cl•', bondChange: 'Разрыв Cl–Cl' },
          { title: 'Шаг 2. Отрыв водорода', description: `Образование алкильного радикала •${a.rad} и HCl.`, stateFormula: `${a.f} + Cl• → •${a.rad} + HCl`, bondChange: 'Разрыв C–H' },
          { title: 'Шаг 3. Образование галогеналкана', description: 'Присоединение атома хлора к радикалу.', stateFormula: `${a.rad}Cl + HCl`, bondChange: 'Новая связь C–Cl' },
        ],
      });
    }

    list.push({
      id: `rx-gen-alk-br2-${a.n}`,
      section: 'organic',
      level: 'advanced',
      reactionType: 'Замещение (SR)',
      startFormula: a.f,
      startName: a.name,
      reagent: 'Br2',
      reagentName: 'Бром',
      condition: 'УФ-свет (hν), t°',
      equation: `${a.f} + Br2 → ${a.rad}Br + HBr`,
      productFormula: `${a.rad}Br`,
      productName: `Бромпроизводное (${a.name.toLowerCase()})`,
      structuralProduct: `${a.rad}—Br`,
      productMoleculeId: 'chloromethane',
      topicId: 'org-alkanes',
      summary: `Селективное радикальное бромирование (${a.name.toLowerCase()}).`,
      steps: [
        { title: 'Шаг 1. Фотолиз брома', description: 'Образование радикалов Br•.', stateFormula: 'Br2 → 2Br•', bondChange: 'Разрыв Br–Br' },
        { title: 'Шаг 2. Селективный отрыв H', description: 'Предпочтительное образование более стабильного радикала.', stateFormula: `•${a.rad} + HBr`, bondChange: 'Разрыв слабейшей C–H' },
        { title: 'Шаг 3. Продукт', description: 'Образование бромалкана.', stateFormula: `${a.rad}Br`, bondChange: 'Образование C–Br' },
      ],
    });

    list.push({
      id: `rx-gen-alk-hno3-${a.n}`,
      section: 'organic',
      level: 'advanced',
      reactionType: 'Нитрование (Коновалов)',
      startFormula: a.f,
      startName: a.name,
      reagent: 'HNO3 (разб.)',
      reagentName: 'Азотная кислота (10%)',
      condition: '140 °C, давление',
      equation: `${a.f} + HNO3 → ${a.rad}NO2 + H2O`,
      productFormula: `${a.rad}NO2`,
      productName: `Нитроалкан (${a.name.toLowerCase()})`,
      structuralProduct: `${a.rad}—NO2`,
      productMoleculeId: a.mol,
      topicId: 'org-alkanes',
      summary: `Радикальное нитрование (${a.name.toLowerCase()}) по реакции Коновалова.`,
      steps: [
        { title: 'Шаг 1. Термический распад HNO3', description: 'Генерация радикалов •NO₂ и •OH при 140 °C.', stateFormula: 'HNO3 → •OH + •NO2', bondChange: 'Гомолиз HO–NO₂' },
        { title: 'Шаг 2. Отрыв H', description: 'Гидроксильный радикал отрывает H с образованием воды.', stateFormula: `•${a.rad} + H2O`, bondChange: 'Разрыв C–H' },
        { title: 'Шаг 3. Рекомбинация', description: 'Соединение с •NO₂ даёт нитроалкан.', stateFormula: `${a.rad}NO2 + H2O`, bondChange: 'Новая связь C–N' },
      ],
    });
  }

  // 2. Alkenes C2..C6 (H2, Br2, HCl, HBr, H2O, KMnO4/H2O)
  const alkenes = [
    { n: 2, f: 'C2H4', name: 'Этилен', alkane: 'C2H6', alc: 'C2H5OH', mol: 'ethene', alkMol: 'ethane', alcMol: 'ethanol' },
    { n: 3, f: 'C3H6', name: 'Пропен', alkane: 'C3H8', alc: 'CH3CH(OH)CH3', mol: 'ethene', alkMol: 'propane', alcMol: 'ethanol' },
    { n: 4, f: 'C4H8', name: 'Бутен-1', alkane: 'C4H10', alc: 'CH3CH(OH)C2H5', mol: 'cis-but-2-ene', alkMol: 'n-butane', alcMol: 'ethanol' },
    { n: 5, f: 'C5H10', name: 'Пентен-1', alkane: 'C5H12', alc: 'C5H11OH', mol: 'trans-but-2-ene', alkMol: 'n-butane', alcMol: 'ethanol' },
    { n: 6, f: 'C6H12', name: 'Гексен-1', alkane: 'C6H14', alc: 'C6H13OH', mol: 'trans-but-2-ene', alkMol: 'n-butane', alcMol: 'ethanol' },
  ];

  for (const al of alkenes) {
    if (al.n > 2) {
      list.push({
        id: `rx-gen-alkene-h2-${al.n}`,
        section: 'organic',
        level: 'base',
        reactionType: 'Присоединение (гидрирование)',
        startFormula: al.f,
        startName: al.name,
        reagent: 'H2',
        reagentName: 'Водород',
        condition: 'Ni / Pt, t°',
        equation: `${al.f} + H2 → ${al.alkane}`,
        productFormula: al.alkane,
        productName: `Алкан C${al.n}`,
        structuralProduct: al.alkane,
        productMoleculeId: al.alkMol,
        topicId: 'org-alkenes',
        summary: `Каталитическое гидрирование (${al.name.toLowerCase()}) до предельного углеводорода.`,
        steps: [
          { title: 'Шаг 1. Адсорбция на Ni', description: 'Активация водорода и двойной связи.', stateFormula: `${al.f} + H2 (Ni)`, bondChange: 'Ослабление π-связи' },
          { title: 'Шаг 2. Присоединение H2', description: 'Син-присоединение двух атомов водорода.', stateFormula: al.alkane, bondChange: 'π → 2 σ(C–H)' },
          { title: 'Шаг 3. Насыщенный продукт', description: 'Образование алкана с sp³-углеродами.', stateFormula: al.alkane, bondChange: 'Снятие непредельности' },
        ],
      });
      list.push({
        id: `rx-gen-alkene-h2o-${al.n}`,
        section: 'organic',
        level: 'base',
        reactionType: 'Присоединение (гидратация)',
        startFormula: al.f,
        startName: al.name,
        reagent: 'H2O',
        reagentName: 'Вода',
        condition: 'H3PO4 / H2SO4, t°',
        equation: `${al.f} + H2O → ${al.alc}`,
        productFormula: al.alc,
        productName: `Вторичный спирт C${al.n}`,
        structuralProduct: al.alc,
        productMoleculeId: al.alcMol,
        topicId: 'org-alkenes',
        summary: `Гидратация (${al.name.toLowerCase()}) по правилу Марковникова с образованием вторичного спирта.`,
        steps: [
          { title: 'Шаг 1. Атака протона H+', description: 'Протон присоединяется к концевому =CH₂ (правило Марковникова).', stateFormula: 'Вторичный карбокатион', bondChange: 'Разрыв π-связи' },
          { title: 'Шаг 2. Присоединение воды', description: 'Вода атакует вторичный катионный центр.', stateFormula: 'Оксониевый ион', bondChange: 'Образование C–O' },
          { title: 'Шаг 3. Отдача H+', description: 'Образование вторичного спирта.', stateFormula: al.alc, bondChange: 'Стабилизация –OH' },
        ],
      });
    }

    list.push({
      id: `rx-gen-alkene-br2-${al.n}`,
      section: 'organic',
      level: 'base',
      reactionType: 'Присоединение (бромирование)',
      startFormula: al.f,
      startName: al.name,
      reagent: 'Br2',
      reagentName: 'Бромная вода',
      condition: '20 °C (без катализатора)',
      equation: `${al.f} + Br2 → ${al.f}Br2`,
      productFormula: `${al.f}Br2`,
      productName: `Дибромалкан (${al.name.toLowerCase()})`,
      structuralProduct: `${al.f}Br2 (вицинальный дибромид)`,
      productMoleculeId: 'chloromethane',
      topicId: 'org-alkenes',
      summary: `Качественная реакция: обесцвечивание бромной воды (${al.name.toLowerCase()}).`,
      steps: [
        { title: 'Шаг 1. Поляризация Br2', description: 'π-Облако алкена индуцирует диполь в молекуле Br₂.', stateFormula: `${al.f} + Brδ+—Brδ-`, bondChange: 'Образование π-комплекса' },
        { title: 'Шаг 2. Бромониевый ион', description: 'Формируется циклический бромониевый катион.', stateFormula: '[Циклический Br+ интермедиат]', bondChange: 'Разрыв Br–Br' },
        { title: 'Шаг 3. Анти-присоединение Br-', description: 'Атака Br⁻ с противоположной стороны даёт дибромалкан.', stateFormula: `${al.f}Br2`, bondChange: 'Две σ-связи C–Br' },
      ],
    });

    for (const hx of [{ f: 'HCl', n: 'Хлороводород', x: 'Cl' }, { f: 'HBr', n: 'Бромоводород', x: 'Br' }]) {
      list.push({
        id: `rx-gen-alkene-${hx.f.toLowerCase()}-${al.n}`,
        section: 'organic',
        level: 'base',
        reactionType: 'Электрофильное присоединение (AdE)',
        startFormula: al.f,
        startName: al.name,
        reagent: hx.f,
        reagentName: hx.n,
        condition: '20 °C (по правилу Марковникова)',
        equation: `${al.f} + ${hx.f} → C${al.n}H${2 * al.n + 1}${hx.x}`,
        productFormula: `C${al.n}H${2 * al.n + 1}${hx.x}`,
        productName: `Галогеналкан C${al.n}`,
        structuralProduct: `C${al.n}H${2 * al.n + 1}—${hx.x}`,
        productMoleculeId: 'chloromethane',
        topicId: 'org-alkenes',
        summary: `Гидрогалогенирование (${al.name.toLowerCase()}) по правилу Марковникова.`,
        steps: [
          { title: 'Шаг 1. Протонирование', description: 'Присоединение H⁺ к наиболее гидрированному углероду.', stateFormula: 'Карбокатион', bondChange: 'Разрыв π-связи' },
          { title: 'Шаг 2. Атака галогенид-иона', description: `Присоединение ${hx.x}⁻ к карбокатиону.`, stateFormula: `C${al.n}H${2 * al.n + 1}${hx.x}`, bondChange: `Новая связь C–${hx.x}` },
          { title: 'Шаг 3. Продукт', description: 'Получен насыщенный галогеналкан.', stateFormula: `C${al.n}H${2 * al.n + 1}${hx.x}`, bondChange: 'sp² → sp³' },
        ],
      });
    }
  }

  // 3. Alcohols, Aldehydes, Carboxylic acids systematic reactions
  const alcohols = [
    { n: 1, f: 'CH3OH', name: 'Метанол', ald: 'HCHO', acid: 'HCOOH', rad: 'CH3', mol: 'methanol' },
    { n: 2, f: 'C2H5OH', name: 'Этанол', ald: 'CH3CHO', acid: 'CH3COOH', rad: 'C2H5', mol: 'ethanol' },
    { n: 3, f: 'C3H7OH', name: 'Пропанол-1', ald: 'C2H5CHO', acid: 'C2H5COOH', rad: 'C3H7', mol: 'ethanol' },
    { n: 4, f: 'C4H9OH', name: 'Бутанол-1', ald: 'C3H7CHO', acid: 'C3H7COOH', rad: 'C4H9', mol: 'ethanol' },
    { n: 5, f: 'C5H11OH', name: 'Пентанол-1', ald: 'C4H9CHO', acid: 'C4H9COOH', rad: 'C5H11', mol: 'ethanol' },
  ];

  for (const alc of alcohols) {
    list.push({
      id: `rx-gen-alc-na-${alc.n}`,
      section: 'organic',
      level: 'base',
      reactionType: 'Замещение (с активным металлом)',
      startFormula: alc.f,
      startName: alc.name,
      reagent: 'Na',
      reagentName: 'Натрий',
      condition: '20 °C',
      equation: `2 ${alc.f} + 2 Na → 2 ${alc.rad}ONa + H2↑`,
      productFormula: `${alc.rad}ONa`,
      productName: `Алкоголят натрия (${alc.name.toLowerCase()})`,
      structuralProduct: `${alc.rad}—O⁻Na⁺`,
      productMoleculeId: alc.mol,
      topicId: 'org-alcohols',
      summary: `Взаимодействие (${alc.name.toLowerCase()}) с металлическим натрием с выделением водорода.`,
      steps: [
        { title: 'Шаг 1. Поляризация связи O–H', description: 'Активный натрий отдаёт электрон подвижному протону группы –OH.', stateFormula: `${alc.rad}—O—H + Na`, bondChange: 'Ослабление O–H' },
        { title: 'Шаг 2. Выделение водорода', description: 'Атомы водорода рекомбинируют в газ H₂.', stateFormula: '2H → H2↑', bondChange: 'Образование H–H' },
        { title: 'Шаг 3. Образование алкоголята', description: 'Образуется ионная соль — алкоголят натрия.', stateFormula: `${alc.rad}ONa + 0,5 H2↑`, bondChange: 'Ионная пара O⁻ Na⁺' },
      ],
    });

    list.push({
      id: `rx-gen-alc-hbr-${alc.n}`,
      section: 'organic',
      level: 'advanced',
      reactionType: 'Нуклеофильное замещение (SN2)',
      startFormula: alc.f,
      startName: alc.name,
      reagent: 'HBr',
      reagentName: 'Бромоводород',
      condition: 'H2SO4 (кат.), t°',
      equation: `${alc.f} + HBr → ${alc.rad}Br + H2O`,
      productFormula: `${alc.rad}Br`,
      productName: `Бромалкил (${alc.rad}Br)`,
      structuralProduct: `${alc.rad}—Br`,
      productMoleculeId: 'chloromethane',
      topicId: 'org-mechanisms',
      summary: `Замещение гидроксильной группы на бром в кислой среде по механизму SN2.`,
      steps: [
        { title: 'Шаг 1. Протонирование –OH', description: 'Превращение –OH в уходящую группу –OH₂⁺.', stateFormula: `${alc.rad}—O+H2`, bondChange: 'Активация C–O' },
        { title: 'Шаг 2. Тыловая атака Br-', description: 'Нуклеофил Br⁻ вытесняет молекулу воды.', stateFormula: `[Br···${alc.rad}···OH2]`, bondChange: 'Синхронный разрыв C–O и образование C–Br' },
        { title: 'Шаг 3. Продукт', description: 'Образование бромалкана и воды.', stateFormula: `${alc.rad}Br + H2O`, bondChange: 'Замещение завершено' },
      ],
    });

    if (alc.n !== 2) {
      list.push({
        id: `rx-gen-alc-cuo-${alc.n}`,
        section: 'organic',
        level: 'base',
        reactionType: 'Окисление',
        startFormula: alc.f,
        startName: alc.name,
        reagent: 'CuO',
        reagentName: 'Оксид меди(II)',
        condition: 't°',
        equation: `${alc.f} + CuO → ${alc.ald} + Cu + H2O`,
        productFormula: alc.ald,
        productName: `Альдегид (${alc.ald})`,
        structuralProduct: alc.ald,
        productMoleculeId: 'ethanal',
        topicId: 'org-alcohols',
        summary: `Окисление (${alc.name.toLowerCase()}) оксидом меди(II) до альдегида.`,
        steps: [
          { title: 'Шаг 1. Дегидрирование у α-углерода', description: 'Оксид меди отбирает 2 атома H от группы –CH₂OH.', stateFormula: `${alc.f} + CuO`, bondChange: 'Разрыв C–H и O–H' },
          { title: 'Шаг 2. Восстановление меди', description: 'Cu²⁺ восстанавливается до металлической меди.', stateFormula: 'Cu + H2O', bondChange: 'Cu(+2) → Cu(0)' },
          { title: 'Шаг 3. Образование карбонила', description: 'Формируется альдегидная группа –CH=O.', stateFormula: alc.ald, bondChange: 'Новая π-связь C=O' },
        ],
      });
    }

    // Aldehyde -> Acid (silver mirror) and Aldehyde -> Alcohol (H2)
    list.push({
      id: `rx-gen-ald-ag-${alc.n}`,
      section: 'organic',
      level: 'base',
      reactionType: 'Окисление («серебряное зеркало»)',
      startFormula: alc.ald,
      startName: `Альдегид ${alc.ald}`,
      reagent: 'Ag2O (NH3)',
      reagentName: 'Аммиачный раствор Ag2O',
      condition: 'Нагревание на водяной бане',
      equation: `${alc.ald} + Ag2O → ${alc.acid} + 2Ag↓`,
      productFormula: alc.acid,
      productName: `Карбоновая кислота (${alc.acid})`,
      structuralProduct: alc.acid,
      productMoleculeId: 'acetic-acid',
      topicId: 'org-aldehydes',
      summary: `Реакция «серебряного зеркала» для ${alc.ald}.`,
      steps: [
        { title: 'Шаг 1. Комплекс [Ag(NH3)2]+', description: 'Аммиачный комплекс серебра окисляет альдегидную группу.', stateFormula: `${alc.ald} + 2Ag+`, bondChange: 'Окисление карбонильного C' },
        { title: 'Шаг 2. Выделение серебра', description: 'Металлическое серебро осаждается зеркальным слоем.', stateFormula: '2Ag+ + 2e- → 2Ag↓', bondChange: 'Ag(+1) → Ag(0)' },
        { title: 'Шаг 3. Кислота / соль аммония', description: 'Карбонильная группа переходит в карбоксильную.', stateFormula: alc.acid, bondChange: '–CHO → –COOH' },
      ],
    });

    list.push({
      id: `rx-gen-ald-h2-${alc.n}`,
      section: 'organic',
      level: 'base',
      reactionType: 'Восстановление (гидрирование)',
      startFormula: alc.ald,
      startName: `Альдегид ${alc.ald}`,
      reagent: 'H2',
      reagentName: 'Водород',
      condition: 'Ni, t°',
      equation: `${alc.ald} + H2 → ${alc.f}`,
      productFormula: alc.f,
      productName: alc.name,
      structuralProduct: alc.f,
      productMoleculeId: alc.mol,
      topicId: 'org-aldehydes',
      summary: `Восстановление альдегида ${alc.ald} до первичного спирта.`,
      steps: [
        { title: 'Шаг 1. Присоединение H2 по C=O', description: 'Разрыв π-связи карбонильной группы на катализаторе Ni.', stateFormula: `${alc.ald} + H2`, bondChange: 'Разрыв π-связи C=O' },
        { title: 'Шаг 2. Образование C–H и O–H', description: 'Атомы водорода присоединяются к C и O.', stateFormula: alc.f, bondChange: 'Две новые σ-связи' },
        { title: 'Шаг 3. Первичный спирт', description: `Получен ${alc.name.toLowerCase()}.`, stateFormula: alc.f, bondChange: 'sp² → sp³' },
      ],
    });

    // Acid + NaOH, Acid + Na2CO3, Acid + CH3OH/C2H5OH
    list.push({
      id: `rx-gen-acid-naoh-${alc.n}`,
      section: 'organic',
      level: 'base',
      reactionType: 'Нейтрализация',
      startFormula: alc.acid,
      startName: `Карбоновая кислота ${alc.acid}`,
      reagent: 'NaOH',
      reagentName: 'Гидроксид натрия',
      condition: 'Водный раствор',
      equation: `${alc.acid} + NaOH → ${alc.acid.replace('H', '')}Na + H2O`.replace(`${alc.acid.replace('H', '')}Na`, `${alc.acid.slice(0, -1)}Na`),
      productFormula: `${alc.acid.slice(0, -1)}Na`,
      productName: `Натриевая соль (${alc.acid})`,
      structuralProduct: `${alc.acid.slice(0, -1)}⁻ Na⁺`,
      productMoleculeId: 'acetic-acid',
      topicId: 'org-acids',
      summary: `Нейтрализация карбоновой кислоты ${alc.acid} щёлочью.`,
      steps: [
        { title: 'Шаг 1. Перенос протона', description: 'Протон карбоксильной группы реагирует с OH⁻.', stateFormula: 'H+ + OH- → H2O', bondChange: 'Разрыв O–H кислоты' },
        { title: 'Шаг 2. Карбоксилат-анион', description: 'Отрицательный заряд делокализуется по двум атомам кислорода.', stateFormula: `${alc.acid.slice(0, -1)}-`, bondChange: 'Сопряжение в группе –COO⁻' },
        { title: 'Шаг 3. Растворимая соль', description: 'В растворе образуется натриевая соль кислоты.', stateFormula: `${alc.acid.slice(0, -1)}Na + H2O`, bondChange: 'Полная нейтрализация' },
      ],
    });

    list.push({
      id: `rx-gen-acid-ester-me-${alc.n}`,
      section: 'organic',
      level: 'base',
      reactionType: 'Этерификация',
      startFormula: alc.acid,
      startName: `Карбоновая кислота ${alc.acid}`,
      reagent: 'CH3OH',
      reagentName: 'Метанол',
      condition: 'H2SO4 (конц.), t°',
      equation: `${alc.acid} + CH3OH ⇄ ${alc.acid.slice(0, -1)}CH3 + H2O`,
      productFormula: `${alc.acid.slice(0, -1)}CH3`,
      productName: `Метиловый эфир (${alc.acid})`,
      structuralProduct: `${alc.acid.slice(0, -1)}—CH3`,
      productMoleculeId: 'ethyl-acetate',
      topicId: 'org-esters',
      summary: `Этерификация ${alc.acid} метанолом в кислой среде.`,
      steps: [
        { title: 'Шаг 1. Кислотная активация', description: 'Протонирование карбонила кислотным катализатором.', stateFormula: `${alc.acid} (H+)`, bondChange: 'Увеличение δ+ на C' },
        { title: 'Шаг 2. Присоединение метанола', description: 'Образование тетраэдрического интермедиата.', stateFormula: 'Интермедиат присоединения', bondChange: 'Новая связь C–OCH₃' },
        { title: 'Шаг 3. Отщепление воды', description: 'Образуется метиловый сложный эфир.', stateFormula: `${alc.acid.slice(0, -1)}CH3 + H2O`, bondChange: 'Эфирная группа –COOCH₃' },
      ],
    });
  }

  // 4. Systematic Inorganic matrix: Basic/Amphoteric Oxides + Acids, Metals + Acids, Acid Oxides + Bases, Salts + Salts (200+ real reactions)
  const basicOxides = [
    { f: 'Na2O', m: 'Na', v: 1, name: 'Оксид натрия' },
    { f: 'K2O', m: 'K', v: 1, name: 'Оксид калия' },
    { f: 'Li2O', m: 'Li', v: 1, name: 'Оксид лития' },
    { f: 'CaO', m: 'Ca', v: 2, name: 'Оксид кальция' },
    { f: 'BaO', m: 'Ba', v: 2, name: 'Оксид бария' },
    { f: 'MgO', m: 'Mg', v: 2, name: 'Оксид магния' },
    { f: 'CuO', m: 'Cu', v: 2, name: 'Оксид меди(II)' },
    { f: 'FeO', m: 'Fe', v: 2, name: 'Оксид железа(II)' },
    { f: 'ZnO', m: 'Zn', v: 2, name: 'Оксид цинка (амф.)' },
    { f: 'Al2O3', m: 'Al', v: 3, name: 'Оксид алюминия (амф.)' },
    { f: 'Fe2O3', m: 'Fe', v: 3, name: 'Оксид железа(III)' },
  ];

  const strongAcids = [
    { f: 'HCl', an: 'Cl', av: 1, name: 'Соляная кислота', mol: 'sodium-chloride' },
    { f: 'HBr', an: 'Br', av: 1, name: 'Бромоводородная кислота', mol: 'sodium-chloride' },
    { f: 'HNO3', an: 'NO3', av: 1, name: 'Азотная кислота', mol: 'nitric-acid' },
    { f: 'H2SO4', an: 'SO4', av: 2, name: 'Серная кислота', mol: 'sulfuric-acid' },
  ];

  const makeSalt = (m: string, v: number, an: string, av: number): string => {
    const anWrap = (an.length > 2 || /\d/.test(an)) && v > 1 ? `(${an})` : an;
    if (v === av) return `${m}${an}`;
    if (v === 1 && av === 2) return `${m}2${an}`;
    if (v === 2 && av === 1) return `${m}${anWrap}2`;
    if (v === 3 && av === 1) return `${m}${anWrap}3`;
    if (v === 3 && av === 2) return `${m}2(${an})3`;
    return `${m}${an}`;
  };

  for (const ox of basicOxides) {
    for (const ac of strongAcids) {
      const salt = makeSalt(ox.m, ox.v, ac.an, ac.av);
      let eq = '';
      if (ox.v === 1 && ac.av === 1) eq = `${ox.f} + 2 ${ac.f} → 2 ${salt} + H2O`;
      else if (ox.v === 1 && ac.av === 2) eq = `${ox.f} + ${ac.f} → ${salt} + H2O`;
      else if (ox.v === 2 && ac.av === 1) eq = `${ox.f} + 2 ${ac.f} → ${salt} + H2O`;
      else if (ox.v === 2 && ac.av === 2) eq = `${ox.f} + ${ac.f} → ${salt} + H2O`;
      else if (ox.v === 3 && ac.av === 1) eq = `${ox.f} + 6 ${ac.f} → 2 ${salt} + 3 H2O`;
      else eq = `${ox.f} + 3 ${ac.f} → ${salt} + 3 H2O`;

      list.push({
        id: `rx-inorg-ox-${ox.f.toLowerCase()}-${ac.f.toLowerCase()}`,
        section: 'inorganic',
        level: 'base',
        reactionType: 'Обмен (оксид + кислота)',
        startFormula: ox.f,
        startName: ox.name,
        reagent: ac.f,
        reagentName: ac.name,
        condition: 'Водный раствор (при нагревании для нерастворимых)',
        equation: eq,
        productFormula: salt,
        productName: `Соль ${salt} и вода`,
        structuralProduct: `${salt} + H2O`,
        productMoleculeId: ac.mol,
        topicId: 'inorg-oxides',
        summary: `Растворение оксида ${ox.f} в кислоте ${ac.f} с образованием соли и воды.`,
        steps: [
          { title: 'Шаг 1. Атака протонов H+', description: `Ионы H⁺ кислоты разрушают решётку оксида ${ox.f}.`, stateFormula: `${ox.f} + H+`, bondChange: 'Разрыв связей Me–O' },
          { title: 'Шаг 2. Образование воды', description: 'Оксид-ион O²⁻ связывается с двумя H⁺ в воду.', stateFormula: 'O2- + 2H+ → H2O', bondChange: 'Новые связи O–H' },
          { title: 'Шаг 3. Образование соли', description: `Катионы ${ox.m} и анионы ${ac.an} образуют соль ${salt}.`, stateFormula: eq, bondChange: 'Ионный обмен завершён' },
        ],
      });
    }
  }

  // 5. Active & Medium Metals + Dilute Acids -> Salt + H2
  const metals = [
    { f: 'Mg', v: 2, name: 'Магний' },
    { f: 'Zn', v: 2, name: 'Цинк' },
    { f: 'Fe', v: 2, name: 'Железо' },
    { f: 'Al', v: 3, name: 'Алюминий' },
    { f: 'Ca', v: 2, name: 'Кальций' },
    { f: 'Mn', v: 2, name: 'Марганец' },
    { f: 'Ni', v: 2, name: 'Никель' },
    { f: 'Cr', v: 2, name: 'Хром' },
  ];
  const nonOxAcids = [
    { f: 'HCl', an: 'Cl', av: 1, name: 'Соляная кислота (разб.)' },
    { f: 'H2SO4 (разб.)', an: 'SO4', av: 2, name: 'Серная кислота (разб.)' },
    { f: 'HBr', an: 'Br', av: 1, name: 'Бромоводородная кислота' },
  ];

  for (const me of metals) {
    for (const ac of nonOxAcids) {
      const salt = makeSalt(me.f, me.v, ac.an, ac.av);
      let eq = '';
      if (me.v === 2 && ac.av === 1) eq = `${me.f} + 2 ${ac.f} → ${salt} + H2↑`;
      else if (me.v === 2 && ac.av === 2) eq = `${me.f} + ${ac.f} → ${salt} + H2↑`;
      else if (me.v === 3 && ac.av === 1) eq = `2 ${me.f} + 6 ${ac.f} → 2 ${salt} + 3 H2↑`;
      else eq = `2 ${me.f} + 3 ${ac.f} → ${salt} + 3 H2↑`;

      list.push({
        id: `rx-inorg-me-${me.f.toLowerCase()}-${ac.an.toLowerCase()}`,
        section: 'inorganic',
        level: 'base',
        reactionType: 'Замещение (ОВР)',
        startFormula: me.f,
        startName: me.name,
        reagent: ac.f,
        reagentName: ac.name,
        condition: 'Водный раствор',
        equation: eq,
        productFormula: salt,
        productName: `Соль ${salt} и водород`,
        structuralProduct: `${salt} + H2↑`,
        productMoleculeId: 'sodium-chloride',
        topicId: 'inorg-acids',
        summary: `Вытеснение водорода металлом ${me.f} (стоит левее H₂ в ряду напряжений).`,
        steps: [
          { title: 'Шаг 1. Окисление металла', description: `${me.name} отдаёт электроны и переходит в раствор в виде катиона.`, stateFormula: `${me.f}⁰ − ${me.v}e⁻ → ${me.f}^${me.v}+`, bondChange: 'Окисление восстановителя' },
          { title: 'Шаг 2. Восстановление H+', description: 'Ионы водорода кислоты принимают электроны и выделяются в виде газа H₂.', stateFormula: '2H+ + 2e- → H2↑', bondChange: 'Образование связи H–H' },
          { title: 'Шаг 3. Соль в растворе', description: `Образуется раствор соли ${salt}.`, stateFormula: eq, bondChange: 'ОВР завершена' },
        ],
      });
    }
  }

  // 6. Bases + Acids (Neutralization) & Acid Oxides + Alkalis
  const bases = [
    { f: 'NaOH', m: 'Na', v: 1, name: 'Гидроксид натрия' },
    { f: 'KOH', m: 'K', v: 1, name: 'Гидроксид калия' },
    { f: 'LiOH', m: 'Li', v: 1, name: 'Гидроксид лития' },
    { f: 'Ca(OH)2', m: 'Ca', v: 2, name: 'Гидроксид кальция' },
    { f: 'Ba(OH)2', m: 'Ba', v: 2, name: 'Гидроксид бария' },
    { f: 'Cu(OH)2', m: 'Cu', v: 2, name: 'Гидроксид меди(II)' },
    { f: 'Mg(OH)2', m: 'Mg', v: 2, name: 'Гидроксид магния' },
    { f: 'Fe(OH)3', m: 'Fe', v: 3, name: 'Гидроксид железа(III)' },
    { f: 'Al(OH)3', m: 'Al', v: 3, name: 'Гидроксид алюминия' },
  ];

  for (const b of bases) {
    for (const ac of strongAcids) {
      if (b.f === 'NaOH' && ac.f === 'HCl') continue;
      const salt = makeSalt(b.m, b.v, ac.an, ac.av);
      let eq = '';
      if (b.v === 1 && ac.av === 1) eq = `${b.f} + ${ac.f} → ${salt} + H2O`;
      else if (b.v === 1 && ac.av === 2) eq = `2 ${b.f} + ${ac.f} → ${salt} + 2 H2O`;
      else if (b.v === 2 && ac.av === 1) eq = `${b.f} + 2 ${ac.f} → ${salt} + 2 H2O`;
      else if (b.v === 2 && ac.av === 2) eq = `${b.f} + ${ac.f} → ${salt} + 2 H2O`;
      else if (b.v === 3 && ac.av === 1) eq = `${b.f} + 3 ${ac.f} → ${salt} + 3 H2O`;
      else eq = `2 ${b.f} + 3 ${ac.f} → ${salt} + 6 H2O`;

      list.push({
        id: `rx-inorg-base-${b.m.toLowerCase()}${b.v}-${ac.an.toLowerCase()}`,
        section: 'inorganic',
        level: 'base',
        reactionType: 'Обмен (нейтрализация)',
        startFormula: b.f,
        startName: b.name,
        reagent: ac.f,
        reagentName: ac.name,
        condition: 'Водный раствор',
        equation: eq,
        productFormula: salt,
        productName: `Соль ${salt} и вода`,
        structuralProduct: `${salt} + H2O`,
        productMoleculeId: 'water',
        topicId: 'inorg-bases',
        summary: `Реакция нейтрализации ${b.f} кислотой ${ac.f}.`,
        steps: [
          { title: 'Шаг 1. Взаимодействие с H+', description: 'Гидроксидные группы основания связываются с протонами кислоты.', stateFormula: 'OH- + H+ → H2O', bondChange: 'Образование воды' },
          { title: 'Шаг 2. Переход катиона в соль', description: `Катион ${b.m} соединяется с кислотным остатком ${ac.an}.`, stateFormula: salt, bondChange: 'Формирование ионной соли' },
          { title: 'Шаг 3. Итоговое уравнение', description: 'Реакция необратима из-за образования слабого электролита H₂O.', stateFormula: eq, bondChange: 'pH стремится к нейтральному' },
        ],
      });
    }
  }

  // 7. Acid oxides + Alkalis
  const acidOxides = [
    { f: 'CO2', an: 'CO3', name: 'Оксид углерода(IV)', mol: 'co2' },
    { f: 'SO2', an: 'SO3', name: 'Оксид серы(IV)', mol: 'so3' },
    { f: 'SO3', an: 'SO4', name: 'Оксид серы(VI)', mol: 'so3' },
    { f: 'SiO2', an: 'SiO3', name: 'Оксид кремния(IV)', mol: 'co2' },
    { f: 'N2O5', an: 'NO3', name: 'Оксид азота(V)', mol: 'nitric-acid' },
  ];
  const alkalis = [
    { f: 'NaOH', m: 'Na', v: 1, name: 'Гидроксид натрия' },
    { f: 'KOH', m: 'K', v: 1, name: 'Гидроксид калия' },
    { f: 'Ca(OH)2', m: 'Ca', v: 2, name: 'Гидроксид кальция' },
    { f: 'Ba(OH)2', m: 'Ba', v: 2, name: 'Гидроксид бария' },
  ];

  for (const ao of acidOxides) {
    for (const alk of alkalis) {
      const av = ao.an === 'NO3' ? 1 : 2;
      const salt = makeSalt(alk.m, alk.v, ao.an, av);
      const eq =
        ao.an === 'NO3'
          ? alk.v === 1
            ? `${ao.f} + 2 ${alk.f} → 2 ${salt} + H2O`
            : `${ao.f} + ${alk.f} → ${salt} + H2O`
          : alk.v === 1
          ? `${ao.f} + 2 ${alk.f} → ${salt} + H2O`
          : `${ao.f} + ${alk.f} → ${salt}↓ + H2O`;
      list.push({
        id: `rx-inorg-ao-${ao.f.toLowerCase()}-${alk.m.toLowerCase()}`,
        section: 'inorganic',
        level: ao.f === 'SiO2' ? 'advanced' : 'base',
        reactionType: 'Кислотно-основное взаимодействие',
        startFormula: ao.f,
        startName: ao.name,
        reagent: alk.f,
        reagentName: alk.name,
        condition: ao.f === 'SiO2' ? 'Сплавление (t°)' : 'Водный раствор',
        equation: eq,
        productFormula: salt,
        productName: `Соль ${salt}`,
        structuralProduct: `${salt} + H2O`,
        productMoleculeId: ao.mol,
        topicId: 'inorg-oxides',
        summary: `Взаимодействие кислотного оксида ${ao.f} со щёлочью ${alk.f}.`,
        steps: [
          { title: 'Шаг 1. Атака OH-', description: `Гидроксид-ионы присоединяются к центральному атому оксида ${ao.f}.`, stateFormula: `${ao.f} + OH-`, bondChange: 'Перестройка в оксоанион' },
          { title: 'Шаг 2. Отщепление воды', description: 'Формирование аниона кислородсодержащей кислоты и молекулы воды.', stateFormula: `${ao.an}^${av}- + H2O`, bondChange: 'Образование H₂O' },
          { title: 'Шаг 3. Образование соли', description: `Соль ${salt} кристаллизуется или остаётся в растворе.`, stateFormula: eq, bondChange: 'Кислотный оксид нейтрализован' },
        ],
      });
    }
  }

  // 8. Precipitation / Ion-exchange salt reactions (AgNO3, BaCl2, Na2CO3, NaOH with heavy metal salts)
  const halides = [
    { f: 'NaCl', m: 'Na', x: 'Cl', name: 'Хлорид натрия' },
    { f: 'KCl', m: 'K', x: 'Cl', name: 'Хлорид калия' },
    { f: 'NaBr', m: 'Na', x: 'Br', name: 'Бромид натрия' },
    { f: 'KI', m: 'K', x: 'I', name: 'Иодид калия' },
    { f: 'NH4Cl', m: 'NH4', x: 'Cl', name: 'Хлорид аммония' },
  ];
  for (const h of halides) {
    list.push({
      id: `rx-inorg-ppt-ag-${h.f.toLowerCase()}`,
      section: 'inorganic',
      level: 'base',
      reactionType: 'Ионный обмен (осаждение)',
      startFormula: h.f,
      startName: h.name,
      reagent: 'AgNO3',
      reagentName: 'Нитрат серебра(I)',
      condition: 'Водный раствор',
      equation: `${h.f} + AgNO3 → Ag${h.x}↓ + ${h.m}NO3`,
      productFormula: `Ag${h.x}`,
      productName: `Осадок галогенида серебра Ag${h.x}`,
      structuralProduct: `Ag${h.x}↓ + ${h.m}NO3`,
      productMoleculeId: 'sodium-chloride',
      topicId: 'inorg-salts',
      summary: `Качественная реакция на галогенид-ион ${h.x}⁻ с выпадением творожистого осадка Ag${h.x}.`,
      steps: [
        { title: 'Шаг 1. Диссоциация солей', description: 'Обе исходные соли полностью диссоциируют в воде.', stateFormula: `${h.m}+ + ${h.x}- + Ag+ + NO3-`, bondChange: 'Свободные гидратированные ионы' },
        { title: 'Шаг 2. Связывание в нерастворимую решётку', description: `Ионы Ag⁺ и ${h.x}⁻ образуют малорастворимый осадок.`, stateFormula: `Ag+ + ${h.x}- → Ag${h.x}↓`, bondChange: 'Кристаллизация осадка' },
        { title: 'Шаг 3. Необратимый обмен', description: 'Выход осадка из раствора делает реакцию необратимой.', stateFormula: `${h.f} + AgNO3 → Ag${h.x}↓ + ${h.m}NO3`, bondChange: 'Выпадение осадка' },
      ],
    });
  }

  const sulfates = ['Na2SO4', 'K2SO4', 'MgSO4', 'ZnSO4', 'CuSO4', 'FeSO4', '(NH4)2SO4'];
  for (const sf of sulfates) {
    const cation = sf.replace('2SO4', '').replace('SO4', '');
    const isMono = sf.includes('2SO4');
    const chloride = isMono ? `2 ${cation.replace(/[()]/g, '')}Cl` : `${cation}Cl2`;
    list.push({
      id: `rx-inorg-ppt-ba-${sf.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      section: 'inorganic',
      level: 'base',
      reactionType: 'Ионный обмен (осаждение)',
      startFormula: sf,
      startName: `Сульфат ${sf}`,
      reagent: 'BaCl2',
      reagentName: 'Хлорид бария',
      condition: 'Водный раствор',
      equation: `${sf} + BaCl2 → BaSO4↓ + ${chloride}`,
      productFormula: 'BaSO4',
      productName: 'Сульфат бария (белый осадок)',
      structuralProduct: 'BaSO4↓ (нерастворим в кислотах)',
      productMoleculeId: 'sulfuric-acid',
      topicId: 'inorg-salts',
      summary: `Качественная реакция на сульфат-ион SO₄²⁻ с образованием белого осадка BaSO₄.`,
      steps: [
        { title: 'Шаг 1. Сливание растворов', description: 'Ионы Ba²⁺ и SO₄²⁻ встречаются в водном растворе.', stateFormula: 'Ba2+ + SO4^2-', bondChange: 'Электростатическое сближение' },
        { title: 'Шаг 2. Выпадение BaSO4↓', description: 'Образуется белый кристаллический осадок, нерастворимый в кислотах.', stateFormula: 'BaSO4↓', bondChange: 'Образование прочной ионной решётки' },
        { title: 'Шаг 3. Полное уравнение', description: 'В растворе остаётся соответствующий хлорид.', stateFormula: `${sf} + BaCl2 → BaSO4↓ + ${chloride}`, bondChange: 'Качественное обнаружение SO₄²⁻' },
      ],
    });
  }

  // 9. Metal displacement reactions from salt solutions (Fe, Zn, Mg, Al with CuSO4, AgNO3, Pb(NO3)2, FeSO4)
  const displacePairs: [string, string, string, string, string][] = [
    ['Fe', 'CuSO4', 'Fe + CuSO4 → FeSO4 + Cu↓', 'FeSO4', 'Железо вытесняет медь из раствора медного купороса'],
    ['Zn', 'CuSO4', 'Zn + CuSO4 → ZnSO4 + Cu↓', 'ZnSO4', 'Цинк вытесняет медь из раствора CuSO₄'],
    ['Mg', 'CuSO4', 'Mg + CuSO4 → MgSO4 + Cu↓', 'MgSO4', 'Магний активно вытесняет медь'],
    ['Al', 'CuCl2', '2 Al + 3 CuCl2 → 2 AlCl3 + 3 Cu↓', 'AlCl3', 'Алюминий вытесняет медь из раствора CuCl₂'],
    ['Zn', 'FeSO4', 'Zn + FeSO4 → ZnSO4 + Fe↓', 'ZnSO4', 'Цинк стоит левее железа в ряду напряжений'],
    ['Mg', 'ZnSO4', 'Mg + ZnSO4 → MgSO4 + Zn↓', 'MgSO4', 'Магний вытесняет цинк из раствора соли'],
    ['Cu', 'AgNO3', 'Cu + 2 AgNO3 → Cu(NO3)2 + 2 Ag↓', 'Cu(NO3)2', 'Медь вытесняет серебро — раствор становится голубым'],
    ['Zn', 'Pb(NO3)2', 'Zn + Pb(NO3)2 → Zn(NO3)2 + Pb↓', 'Zn(NO3)2', 'Цинк вытесняет свинец в виде блестящих кристаллов'],
    ['Fe', 'AgNO3', 'Fe + 2 AgNO3 → Fe(NO3)2 + 2 Ag↓', 'Fe(NO3)2', 'Железо вытесняет серебро из нитрата серебра'],
  ];

  for (let i = 0; i < displacePairs.length; i++) {
    const [m, s, eq, prod, sum] = displacePairs[i];
    list.push({
      id: `rx-inorg-disp-${i}`,
      section: 'inorganic',
      level: 'base',
      reactionType: 'Замещение (ряд напряжений)',
      startFormula: m,
      startName: `Металл ${m}`,
      reagent: s,
      reagentName: `Раствор соли ${s}`,
      condition: 'Водный раствор, 20 °C',
      equation: eq,
      productFormula: prod,
      productName: `Соль ${prod} + вытесненный металл`,
      structuralProduct: eq.split('→ ')[1],
      productMoleculeId: 'sodium-chloride',
      topicId: 'inorg-redox',
      summary: sum,
      steps: [
        { title: 'Шаг 1. Сравнение активности', description: `Металл ${m} стоит левее металла из соли ${s} в электрохимическом ряду.`, stateFormula: `${m} + ${s}`, bondChange: 'Термодинамическая возможность ОВР' },
        { title: 'Шаг 2. Перенос электронов', description: `${m} окисляется, а катион менее активного металла восстанавливается.`, stateFormula: eq, bondChange: 'Переход электронов от более активного металла' },
        { title: 'Шаг 3. Выделение металла', description: 'На поверхности пластинки оседает вытесненный металл.', stateFormula: eq.split('→ ')[1], bondChange: 'Осаждение металлического слоя' },
      ],
    });
  }

  // 10. Electrolysis, Redox (KMnO4, K2Cr2O7), Complexes & Advanced organic (SN1/SN2, E2, polymers)
  const advancedSpecial: Array<Omit<ReactionData, 'steps'> & { stepNotes: [string, string, string] }> = [
    {
      id: 'rx-adv-electro-nacl-aq',
      section: 'inorganic',
      level: 'base',
      reactionType: 'Электролиз раствора',
      startFormula: 'NaCl',
      startName: 'Хлорид натрия (раствор)',
      reagent: 'H2O + электроток',
      reagentName: 'Электролиз (инерт. электроды)',
      condition: 'Постоянный ток',
      equation: '2 NaCl + 2 H2O → H2↑ + Cl2↑ + 2 NaOH',
      productFormula: 'NaOH',
      productName: 'Гидроксид натрия, H2 и Cl2',
      structuralProduct: 'H2↑ (катод) + Cl2↑ (анод) + NaOH',
      productMoleculeId: 'sodium-hydroxide',
      topicId: 'inorg-electrolysis',
      summary: 'Промышленный хлор-щелочной электролиз водного раствора поваренной соли.',
      stepNotes: ['Катод (−): 2H₂O + 2e⁻ → H₂↑ + 2OH⁻', 'Анод (+): 2Cl⁻ − 2e⁻ → Cl₂↑', 'В прикатодном пространстве накапливается NaOH'],
    },
    {
      id: 'rx-adv-electro-cuso4',
      section: 'inorganic',
      level: 'base',
      reactionType: 'Электролиз раствора',
      startFormula: 'CuSO4',
      startName: 'Сульфат меди(II) (раствор)',
      reagent: 'H2O + электроток',
      reagentName: 'Электролиз (инерт. электроды)',
      condition: 'Постоянный ток',
      equation: '2 CuSO4 + 2 H2O → 2 Cu↓ + O2↑ + 2 H2SO4',
      productFormula: 'H2SO4',
      productName: 'Медь (катод), O2 (анод), H2SO4',
      structuralProduct: 'Cu↓ + O2↑ + H2SO4',
      productMoleculeId: 'sulfuric-acid',
      topicId: 'inorg-electrolysis',
      summary: 'Электролиз раствора сульфата меди(II) с выделением чистой меди на катоде и кислорода на аноде.',
      stepNotes: ['Катод (−): Cu²⁺ + 2e⁻ → Cu⁰↓', 'Анод (+): 2H₂O − 4e⁻ → O₂↑ + 4H⁺', 'В растворе образуется серная кислота H₂SO₄'],
    },
    {
      id: 'rx-adv-aloh3-naoh',
      section: 'inorganic',
      level: 'advanced',
      reactionType: 'Комплексообразование (амфотерность)',
      startFormula: 'Al(OH)3',
      startName: 'Гидроксид алюминия',
      reagent: 'NaOH (раствор)',
      reagentName: 'Щёлочь (водный раствор)',
      condition: '20 °C',
      equation: 'Al(OH)3 + NaOH → Na[Al(OH)4]',
      productFormula: 'Na[Al(OH)4]',
      productName: 'Тетрагидроксоалюминат натрия',
      structuralProduct: 'Na⁺ [Al(OH)4]⁻',
      productMoleculeId: 'tetraamminecopper',
      topicId: 'inorg-complexes',
      summary: 'Растворение амфотерного гидроксида алюминия в водном растворе щёлочи с образованием гидроксокомплекса.',
      stepNotes: ['Ион OH⁻ атакует координационно ненасыщенный Al³⁺', 'Образуется тетраэдрический комплексный анион [Al(OH)₄]⁻', 'Белый студенистый осадок полностью растворяется'],
    },
    {
      id: 'rx-adv-znoh2-naoh',
      section: 'inorganic',
      level: 'advanced',
      reactionType: 'Комплексообразование (амфотерность)',
      startFormula: 'Zn(OH)2',
      startName: 'Гидроксид цинка',
      reagent: 'NaOH (раствор)',
      reagentName: 'Щёлочь (избыток)',
      condition: '20 °C',
      equation: 'Zn(OH)2 + 2 NaOH → Na2[Zn(OH)4]',
      productFormula: 'Na2[Zn(OH)4]',
      productName: 'Тетрагидроксоцинкат натрия',
      structuralProduct: '2 Na⁺ [Zn(OH)4]²⁻',
      productMoleculeId: 'tetraamminecopper',
      topicId: 'inorg-complexes',
      summary: 'Образование растворимого тетрагидроксоцинката при действии щёлочи на Zn(OH)₂.',
      stepNotes: ['Присоединение двух лигандов OH⁻ к Zn(OH)₂', 'Координационное число цинка равно 4', 'Растворение белого осадка'],
    },
    {
      id: 'rx-adv-so2-o2',
      section: 'inorganic',
      level: 'advanced',
      reactionType: 'Каталитическое окисление (равновесие)',
      startFormula: 'SO2',
      startName: 'Оксид серы(IV)',
      reagent: 'O2',
      reagentName: 'Кислород',
      condition: 'V2O5, 450 °C',
      equation: '2 SO2 + O2 ⇄ 2 SO3',
      productFormula: 'SO3',
      productName: 'Оксид серы(VI)',
      structuralProduct: 'O=S(=O)=O',
      productMoleculeId: 'so3',
      topicId: 'inorg-equilibria',
      summary: 'Контактное окисление SO₂ в производстве серной кислоты — ключевая обратимая экзотермическая реакция.',
      stepNotes: ['Катализатор V₂O₅ снижает энергию активации', 'Окисление серы из +4 в +6', 'Экзотермическое равновесие смещается к SO₃ при 450 °C'],
    },
    {
      id: 'rx-adv-kmno4-hcl',
      section: 'inorganic',
      level: 'base',
      reactionType: 'ОВР (получение хлора)',
      startFormula: 'KMnO4',
      startName: 'Перманганат калия',
      reagent: 'HCl (конц.)',
      reagentName: 'Соляная кислота (конц.)',
      condition: '20 °C',
      equation: '2 KMnO4 + 16 HCl → 2 KCl + 2 MnCl2 + 5 Cl2↑ + 8 H2O',
      productFormula: 'Cl2',
      productName: 'Хлор, хлорид марганца(II) и вода',
      structuralProduct: 'Cl—Cl↑ + MnCl2 + KCl',
      productMoleculeId: 'water',
      topicId: 'inorg-redox',
      summary: 'Лабораторный способ получения газообразного хлора окислением концентрированной HCl.',
      stepNotes: ['Mn(+7) + 5e⁻ → Mn(+2) (восстановление)', '2Cl⁻ − 2e⁻ → Cl₂⁰ (окисление)', 'Баланс: 2 моль KMnO₄ окисляют 10 ионов Cl⁻ в 5 Cl₂'],
    },
    {
      id: 'rx-adv-sn2-ch3cl',
      section: 'organic',
      level: 'advanced',
      reactionType: 'Нуклеофильное замещение (SN2)',
      startFormula: 'CH3Cl',
      startName: 'Хлорметан',
      reagent: 'NaOH (водн.)',
      reagentName: 'Гидроксид натрия (водный)',
      condition: 'Нагревание, водный раствор',
      equation: 'CH3Cl + NaOH(водн.) → CH3OH + NaCl',
      productFormula: 'CH3OH',
      productName: 'Метанол',
      structuralProduct: 'CH3—OH',
      productMoleculeId: 'methanol',
      topicId: 'org-mechanisms',
      summary: 'Одностадийное нуклеофильное замещение хлора на гидроксильную группу по механизму SN2.',
      stepNotes: ['Нуклеофил OH⁻ атакует углерод с тыльной стороны относительно Cl', 'Пентакоординированное переходное состояние [HO···CH₃···Cl]⁻', 'Уход Cl⁻ с образованием метанола CH₃OH'],
    },
    {
      id: 'rx-adv-e2-c2h5br',
      section: 'organic',
      level: 'advanced',
      reactionType: 'Отщепление (E2)',
      startFormula: 'C2H5Br',
      startName: 'Бромэтан',
      reagent: 'KOH (спирт.)',
      reagentName: 'Спиртовой раствор KOH',
      condition: 'Нагревание, спирт',
      equation: 'C2H5Br + KOH(спирт.) → C2H4 + KBr + H2O',
      productFormula: 'C2H4',
      productName: 'Этилен',
      structuralProduct: 'CH2=CH2',
      productMoleculeId: 'ethene',
      topicId: 'org-mechanisms',
      summary: 'Дегидробромирование галогеналкана спиртовым раствором щёлочи по согласованному механизму E2.',
      stepNotes: ['Основание отрывает β-протон H⁺', 'Одновременно формируется π-связь C=C', 'Бромид-ион Br⁻ уходит в виде соли KBr'],
    },
    {
      id: 'rx-adv-glycine-dipep',
      section: 'organic',
      level: 'base',
      reactionType: 'Поликонденсация (пептидная связь)',
      startFormula: 'NH2CH2COOH',
      startName: 'Глицин',
      reagent: 'NH2CH2COOH',
      reagentName: 'Вторая молекула глицина',
      condition: 'Ферменты / конденсация',
      equation: '2 H2N-CH2-COOH → H2N-CH2-CO-NH-CH2-COOH + H2O',
      productFormula: 'H2NCH2CONHCH2COOH',
      productName: 'Глицилглицин (дипептид)',
      structuralProduct: 'H2N—CH2—CO—NH—CH2—COOH',
      productMoleculeId: 'glycine',
      topicId: 'org-aminoacids',
      summary: 'Образование пептидной (амидной) связи –CO–NH– между двумя остатками аминокислот.',
      stepNotes: ['Сближение –COOH первой молекулы и –NH₂ второй', 'Отщепление молекулы H₂O', 'Замыкание плоской пептидной связи –CO–NH–'],
    },
    {
      id: 'rx-adv-toluene-kmno4',
      section: 'organic',
      level: 'advanced',
      reactionType: 'Окисление боковой цепи',
      startFormula: 'C6H5CH3',
      startName: 'Толуол',
      reagent: 'KMnO4 + H2SO4',
      reagentName: 'Подкисленный перманганат калия',
      condition: 'Нагревание',
      equation: '5 C6H5CH3 + 6 KMnO4 + 9 H2SO4 → 5 C6H5COOH + 6 MnSO4 + 3 K2SO4 + 14 H2O',
      productFormula: 'C6H5COOH',
      productName: 'Бензойная кислота',
      structuralProduct: 'C6H5—COOH',
      productMoleculeId: 'toluene',
      topicId: 'org-arenes',
      summary: 'Окисление метильной группы толуола до карбоксильной при сохранении ароматического кольца.',
      stepNotes: ['Активация бензильного атома углерода кольцом', 'Окисление C(−3) → C(+3) ионами MnO₄⁻', 'Обесцвечивание раствора и кристаллизация бензойной кислоты'],
    },
    {
      id: 'rx-adv-benzene-hno3',
      section: 'organic',
      level: 'base',
      reactionType: 'Нитрование (SEAr)',
      startFormula: 'C6H6',
      startName: 'Бензол',
      reagent: 'HNO3',
      reagentName: 'Нитрующая смесь (HNO3 + H2SO4)',
      condition: 'H2SO4 (конц.), 50–60 °C',
      equation: 'C6H6 + HNO3 → C6H5NO2 + H2O',
      productFormula: 'C6H5NO2',
      productName: 'Нитробензол',
      structuralProduct: 'C6H5—NO2',
      productMoleculeId: 'benzene',
      topicId: 'org-arenes',
      summary: 'Электрофильное нитрование бензола нитроний-катионом NO₂⁺.',
      stepNotes: ['H₂SO₄ протонирует HNO₃ с образованием катиона нитрония NO₂⁺', 'Атака NO₂⁺ на кольцо даёт σ-комплекс', 'Отщепление H⁺ восстанавливает ароматичность (нитробензол)'],
    },
    {
      id: 'rx-adv-methylamine-hcl',
      section: 'organic',
      level: 'base',
      reactionType: 'Присоединение (основные свойства)',
      startFormula: 'CH3NH2',
      startName: 'Метиламин',
      reagent: 'HCl',
      reagentName: 'Соляная кислота',
      condition: '20 °C',
      equation: 'CH3NH2 + HCl → [CH3NH3]Cl',
      productFormula: '[CH3NH3]Cl',
      productName: 'Хлорид метиламмония',
      structuralProduct: '[CH3—NH3]⁺ Cl⁻',
      productMoleculeId: 'methylamine',
      topicId: 'org-amines',
      summary: 'Образование соли алкиламмония по донорно-акцепторному механизму.',
      stepNotes: ['Неподелённая пара азота притягивает протон H⁺', 'Образуется донорно-акцепторная связь N→H', 'Формируется ионная соль хлорид метиламмония'],
    },
  ];

  for (const sp of advancedSpecial) {
    list.push({
      id: sp.id,
      section: sp.section,
      level: sp.level,
      reactionType: sp.reactionType,
      startFormula: sp.startFormula,
      startName: sp.startName,
      reagent: sp.reagent,
      reagentName: sp.reagentName,
      condition: sp.condition,
      equation: sp.equation,
      productFormula: sp.productFormula,
      productName: sp.productName,
      structuralProduct: sp.structuralProduct,
      productMoleculeId: sp.productMoleculeId,
      topicId: sp.topicId,
      summary: sp.summary,
      steps: [
        { title: 'Шаг 1. Старт взаимодействия', description: sp.stepNotes[0], stateFormula: `${sp.startFormula} + ${sp.reagent}`, bondChange: 'Активация исходных связей' },
        { title: 'Шаг 2. Переходное состояние', description: sp.stepNotes[1], stateFormula: sp.structuralProduct, bondChange: 'Перераспределение электронной плотности' },
        { title: 'Шаг 3. Формирование продукта', description: sp.stepNotes[2], stateFormula: sp.equation, bondChange: 'Стабилизация продукта реакции' },
      ],
    });
  }

  return list;
}

export const REACTIONS: ReactionData[] = buildExpandedReactions();

export function getReactionById(id: string): ReactionData | undefined {
  return REACTIONS.find((r) => r.id === id);
}
