import type {
  ChemSection,
  DifficultyLevel,
  ElementData,
  GlossaryTerm,
  Molecule3D,
  ReactionData,
  TaskAttempt,
  TaskData,
  TopicData,
} from '../types/chemistry';

const SUBSCRIPT_MAP: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
};

/**
 * Normalizes a chemical formula for robust comparison (case-insensitive,
 * converts Unicode subscripts, strips whitespace and optional hyphens).
 */
export function normalizeFormula(raw: string): string {
  let out = raw.trim();
  for (const [sub, ascii] of Object.entries(SUBSCRIPT_MAP)) {
    out = out.split(sub).join(ascii);
  }
  return out
    .replace(/\s+/g, '')
    .replace(/[–—-]/g, '')
    .replace(/[↑↓]/g, '')
    .toUpperCase();
}

export interface GradeResult {
  correct: boolean;
  normalizedUserAnswer: string;
  feedback: string;
}

export function checkTaskAnswer(
  task: TaskData,
  submission: {
    selectedOption?: number | null;
    formulaInput?: string;
    chainInputs?: string[];
    numericInput?: string;
  },
): GradeResult {
  if (task.type === 'test') {
    const idx = submission.selectedOption;
    if (idx === null || idx === undefined || !task.options || idx < 0 || idx >= task.options.length) {
      return { correct: false, normalizedUserAnswer: '', feedback: 'Выберите один из вариантов ответа.' };
    }
    const isCorrect = idx === task.correctOptionIndex;
    return {
      correct: isCorrect,
      normalizedUserAnswer: task.options[idx],
      feedback: isCorrect ? 'Верно! Отличное понимание темы.' : 'Есть ошибка. Изучите разбор ниже и попробуйте снова.',
    };
  }

  if (task.type === 'formula') {
    const raw = (submission.formulaInput || '').trim();
    if (!raw) {
      return { correct: false, normalizedUserAnswer: '', feedback: 'Введите химическую формулу.' };
    }
    const norm = normalizeFormula(raw);
    const accepted = (task.acceptedFormulas || []).map(normalizeFormula);
    const isCorrect = accepted.includes(norm);
    return {
      correct: isCorrect,
      normalizedUserAnswer: raw,
      feedback: isCorrect
        ? 'Верно! Формула записана правильно.'
        : `Ответ «${raw}» не совпадает с ожидаемой формулой. Проверьте индексы и состав.`,
    };
  }

  if (task.type === 'chain') {
    const blanks = task.chainSteps?.blanks || [];
    const inputs = submission.chainInputs || [];
    if (blanks.length === 0 || inputs.some((val) => !val || !val.trim())) {
      return { correct: false, normalizedUserAnswer: inputs.join(' → '), feedback: 'Заполните все пропуски в цепочке.' };
    }
    const allCorrect = blanks.every((blank, i) => {
      const norm = normalizeFormula(inputs[i] || '');
      return blank.accepted.map(normalizeFormula).includes(norm);
    });
    return {
      correct: allCorrect,
      normalizedUserAnswer: inputs.map((s) => s.trim()).join(' → '),
      feedback: allCorrect
        ? 'Верно! Все звенья цепочки превращений определены точно.'
        : 'Одно или несколько веществ в цепочке указаны неверно. Проверьте разбор по стадиям.',
    };
  }

  if (task.type === 'calculation') {
    const raw = (submission.numericInput || '').trim().replace(',', '.');
    if (!raw) {
      return { correct: false, normalizedUserAnswer: '', feedback: 'Введите числовой ответ.' };
    }
    const num = Number(raw);
    if (!Number.isFinite(num) || !task.calculationAnswer) {
      return { correct: false, normalizedUserAnswer: raw, feedback: 'Введите корректное число (например, 11.2).' };
    }
    const diff = Math.abs(num - task.calculationAnswer.value);
    const isCorrect = diff <= task.calculationAnswer.tolerance;
    return {
      correct: isCorrect,
      normalizedUserAnswer: `${raw} ${task.calculationAnswer.unit}`,
      feedback: isCorrect
        ? `Верно! Точный расчёт (${task.calculationAnswer.value} ${task.calculationAnswer.unit}).`
        : `Полученное значение (${num}) отличается от правильного (${task.calculationAnswer.value} ${task.calculationAnswer.unit}).`,
    };
  }

  return { correct: false, normalizedUserAnswer: '', feedback: 'Неизвестный тип задания.' };
}

export function findMatchingReactions(
  reactions: ReactionData[],
  params: {
    startFormula?: string;
    reagent?: string;
    condition?: string;
    section?: ChemSection | 'all';
    level?: DifficultyLevel | 'all';
  },
): ReactionData[] {
  const startNorm = params.startFormula ? normalizeFormula(params.startFormula) : '';
  const reagentNorm = params.reagent ? normalizeFormula(params.reagent) : '';
  const condLower = (params.condition || '').trim().toLowerCase();

  return reactions.filter((rx) => {
    if (params.section && params.section !== 'all' && rx.section !== params.section) return false;
    if (params.level && params.level !== 'all' && rx.level !== params.level) return false;
    if (startNorm) {
      const matchesFormula = normalizeFormula(rx.startFormula).includes(startNorm);
      const matchesName = rx.startName.toLowerCase().includes((params.startFormula || '').trim().toLowerCase());
      if (!matchesFormula && !matchesName) return false;
    }
    if (reagentNorm) {
      const matchesReagent = normalizeFormula(rx.reagent).includes(reagentNorm);
      const matchesReagentName = rx.reagentName.toLowerCase().includes((params.reagent || '').trim().toLowerCase());
      if (!matchesReagent && !matchesReagentName) return false;
    }
    if (condLower && !rx.condition.toLowerCase().includes(condLower)) return false;
    return true;
  });
}

export interface GlobalSearchResults {
  topics: TopicData[];
  molecules: Molecule3D[];
  reactions: ReactionData[];
  elements: ElementData[];
  glossary: GlossaryTerm[];
}

export function searchAllContent(
  queryRaw: string,
  datasets: {
    topics: TopicData[];
    molecules: Molecule3D[];
    reactions: ReactionData[];
    elements: ElementData[];
    glossary: GlossaryTerm[];
  },
): GlobalSearchResults {
  const q = queryRaw.trim().toLowerCase();
  const qNorm = normalizeFormula(queryRaw);
  if (!q) {
    return { topics: [], molecules: [], reactions: [], elements: [], glossary: [] };
  }

  const topics = datasets.topics.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.shortDesc.toLowerCase().includes(q) ||
      (t.generalFormula && normalizeFormula(t.generalFormula).includes(qNorm)),
  );

  const molecules = datasets.molecules.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      normalizeFormula(m.formula).includes(qNorm) ||
      m.className.toLowerCase().includes(q),
  );

  const reactions = datasets.reactions
    .filter(
      (r) =>
        normalizeFormula(r.equation).includes(qNorm) ||
        r.startName.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.reactionType.toLowerCase().includes(q) ||
        r.reagentName.toLowerCase().includes(q),
    )
    .slice(0, 20);

  const elements = datasets.elements
    .filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.symbol.toLowerCase() === q ||
        e.latinName.toLowerCase().includes(q) ||
        String(e.number) === q,
    )
    .slice(0, 12);

  const glossary = datasets.glossary.filter(
    (g) =>
      g.term.toLowerCase().includes(q) ||
      g.definition.toLowerCase().includes(q) ||
      (g.formula && normalizeFormula(g.formula).includes(qNorm)),
  );

  return { topics, molecules, reactions, elements, glossary };
}

export interface SectionProgressSummary {
  section: ChemSection;
  completedTopics: number;
  totalTopics: number;
  topicPercent: number;
  solvedTasks: number;
  totalTasks: number;
  taskPercent: number;
}

export function calculateSectionProgress(
  section: ChemSection,
  topics: TopicData[],
  tasks: TaskData[],
  completedTopicIds: string[],
  attempts: TaskAttempt[],
): SectionProgressSummary {
  const sectionTopics = topics.filter((t) => t.section === section);
  const completedTopics = sectionTopics.filter((t) => completedTopicIds.includes(t.id)).length;
  const sectionTasks = tasks.filter((t) => t.section === section);
  const solvedTaskIds = new Set(attempts.filter((a) => a.section === section && a.correct).map((a) => a.taskId));
  const solvedTasks = sectionTasks.filter((t) => solvedTaskIds.has(t.id)).length;

  return {
    section,
    completedTopics,
    totalTopics: sectionTopics.length,
    topicPercent: sectionTopics.length ? Math.round((completedTopics / sectionTopics.length) * 100) : 0,
    solvedTasks,
    totalTasks: sectionTasks.length,
    taskPercent: sectionTasks.length ? Math.round((solvedTasks / sectionTasks.length) * 100) : 0,
  };
}

export interface FormulaToken {
  type: 'text' | 'sub' | 'sup';
  value: string;
}

/**
 * Safely tokenizes chemical formulas and equations into plain text, subscript,
 * and superscript runs for React rendering without dangerouslySetInnerHTML.
 */
export function tokenizeFormula(input: string): FormulaToken[] {
  const tokens: FormulaToken[] = [];
  const regex = /(\^[0-9]*[+-]?|(?<=C)n(?=H)|(?<=H)2n(?:[+-][0-9]+)?|[0-9]+[+-]|(?<=[A-Za-z)\]])[0-9]+)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIdx) {
      tokens.push({ type: 'text', value: input.slice(lastIdx, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith('^')) {
      tokens.push({ type: 'sup', value: raw.slice(1) });
    } else if (/^[0-9]+[+-]$/.test(raw)) {
      tokens.push({ type: 'sup', value: raw });
    } else {
      tokens.push({ type: 'sub', value: raw });
    }
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < input.length) {
    tokens.push({ type: 'text', value: input.slice(lastIdx) });
  }
  return tokens;
}
