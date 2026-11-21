import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeFormula,
  checkTaskAnswer,
  findMatchingReactions,
  searchAllContent,
  calculateSectionProgress,
  tokenizeFormula,
} from './chemistryLogic';
import { TOPICS } from '../data/topics';
import { TASKS } from '../data/tasks';
import { MOLECULES } from '../data/molecules';
import { REACTIONS } from '../data/reactions';
import { ELEMENTS } from '../data/elements';
import { GLOSSARY_TERMS } from '../data/tablesData';
import {
  hashPassword,
  verifyPassword,
  validateRegistrationInput,
  SlidingWindowRateLimiter,
} from '../../server/authStore';

test('normalizeFormula handles Unicode subscripts, case, spaces, and hyphens', () => {
  assert.equal(normalizeFormula('H₂SO₄'), 'H2SO4');
  assert.equal(normalizeFormula('  ch3-ch2-oh '), 'CH3CH2OH');
  assert.equal(normalizeFormula('Cu(OH)₂↓'), 'CU(OH)2');
});

test('checkTaskAnswer grades test, formula, chain, and calculation tasks accurately', () => {
  const testTask = TASKS.find((t) => t.type === 'test')!;
  assert.equal(checkTaskAnswer(testTask, { selectedOption: testTask.correctOptionIndex }).correct, true);
  assert.equal(checkTaskAnswer(testTask, { selectedOption: (testTask.correctOptionIndex! + 1) % 4 }).correct, false);

  const formulaTask = TASKS.find((t) => t.id === 't-org-3')!;
  assert.equal(checkTaskAnswer(formulaTask, { formulaInput: 'c2h5oh' }).correct, true);
  assert.equal(checkTaskAnswer(formulaTask, { formulaInput: 'CH₃-CH₂-OH' }).correct, true);
  assert.equal(checkTaskAnswer(formulaTask, { formulaInput: 'CH4' }).correct, false);

  const chainTask = TASKS.find((t) => t.id === 't-org-5')!;
  assert.equal(checkTaskAnswer(chainTask, { chainInputs: ['C2H2', 'C6H6'] }).correct, true);
  assert.equal(checkTaskAnswer(chainTask, { chainInputs: ['C2H4', 'C6H6'] }).correct, false);
  assert.equal(checkTaskAnswer(chainTask, { chainInputs: ['C2H2', ''] }).correct, false);

  const calcTask = TASKS.find((t) => t.id === 't-org-7')!;
  assert.equal(checkTaskAnswer(calcTask, { numericInput: '11.2' }).correct, true);
  assert.equal(checkTaskAnswer(calcTask, { numericInput: '11,25' }).correct, true);
  assert.equal(checkTaskAnswer(calcTask, { numericInput: '22.4' }).correct, false);
});

test('reaction database has 200+ reactions and matches by formula & reagent', () => {
  assert.ok(REACTIONS.length >= 200, `Expected >= 200 reactions, got ${REACTIONS.length}`);
  const etheneWater = findMatchingReactions(REACTIONS, { startFormula: 'C2H4', reagent: 'H2O' });
  assert.ok(etheneWater.length >= 1);
  assert.equal(etheneWater[0].productFormula, 'C2H5OH');

  const oxideAcid = findMatchingReactions(REACTIONS, { startFormula: 'CuO', reagent: 'H2SO4' });
  assert.ok(oxideAcid.length >= 1);
  assert.equal(oxideAcid[0].productFormula, 'CuSO4');
});

test('global search finds topics, molecules, reactions, elements, and glossary terms', () => {
  const res = searchAllContent('бензол', {
    topics: TOPICS,
    molecules: MOLECULES,
    reactions: REACTIONS,
    elements: ELEMENTS,
    glossary: GLOSSARY_TERMS,
  });
  assert.ok(res.molecules.some((m) => m.id === 'benzene'));
  assert.ok(res.reactions.length > 0);

  const elRes = searchAllContent('Углерод', {
    topics: TOPICS,
    molecules: MOLECULES,
    reactions: REACTIONS,
    elements: ELEMENTS,
    glossary: GLOSSARY_TERMS,
  });
  assert.equal(elRes.elements[0]?.symbol, 'C');
});

test('calculateSectionProgress computes topic and task percentages correctly', () => {
  const summary = calculateSectionProgress(
    'organic',
    TOPICS,
    TASKS,
    ['org-alkanes', 'org-alkenes'],
    [
      {
        id: '1',
        taskId: 't-org-1',
        topicId: 'org-alkanes',
        section: 'organic',
        level: 'base',
        type: 'test',
        taskTitle: 'Test',
        correct: true,
        userAnswer: 'CnH2n+2',
        timestamp: new Date().toISOString(),
      },
    ],
  );
  assert.equal(summary.completedTopics, 2);
  assert.equal(summary.totalTopics, 15);
  assert.equal(summary.solvedTasks, 1);
});

test('tokenizeFormula splits subscripts and superscripts cleanly', () => {
  const tokens = tokenizeFormula('H2SO4 + Cu^2+');
  assert.ok(tokens.some((t) => t.type === 'sub' && t.value === '2'));
  assert.ok(tokens.some((t) => t.type === 'sub' && t.value === '4'));
  assert.ok(tokens.some((t) => t.type === 'sup' && t.value === '2+'));
});

test('server authStore hashes and verifies passwords via scrypt and enforces validation & rate limiting', () => {
  const hash = hashPassword('SecretPass123');
  assert.ok(hash.startsWith('scrypt:'));
  assert.equal(verifyPassword('SecretPass123', hash), true);
  assert.equal(verifyPassword('WrongPass', hash), false);

  assert.equal(
    validateRegistrationInput({ fullName: 'Иванов Иван', email: 'ivan@edu.ru', password: 'password1', consent: true }),
    null,
  );
  assert.notEqual(
    validateRegistrationInput({ fullName: 'Иванов Иван', email: 'bad-email', password: 'password1', consent: true }),
    null,
  );
  assert.notEqual(
    validateRegistrationInput({ fullName: 'Иванов Иван', email: 'ivan@edu.ru', password: 'password1', consent: false }),
    null,
  );

  const limiter = new SlidingWindowRateLimiter(2, 1000);
  assert.equal(limiter.allow('ip-1', 1000), true);
  assert.equal(limiter.allow('ip-1', 1100), true);
  assert.equal(limiter.allow('ip-1', 1200), false);
  assert.equal(limiter.allow('ip-1', 2100), true);
});
