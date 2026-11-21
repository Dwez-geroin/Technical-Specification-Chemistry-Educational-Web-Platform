export type ChemSection = 'organic' | 'inorganic';
export type DifficultyLevel = 'base' | 'advanced';
export type TaskType = 'test' | 'formula' | 'chain' | 'calculation';
export type UserRole = 'student' | 'teacher';

export interface Atom3D {
  element: string;
  x: number;
  y: number;
  z: number;
  label?: string;
}

export interface Bond3D {
  from: number;
  to: number;
  order: 1 | 2 | 3 | 1.5;
}

export interface Molecule3D {
  id: string;
  name: string;
  formula: string;
  smiles: string;
  section: ChemSection;
  className: string;
  molarMass: number;
  geometry: string;
  description: string;
  structuralDisplay: string;
  atoms: Atom3D[];
  bonds: Bond3D[];
  isomerPairId?: string;
  isomerNote?: string;
}

export interface TheoryBlock {
  heading: string;
  paragraphs: string[];
  formulas?: { label: string; equation: string }[];
  definition?: { term: string; text: string };
  important?: string;
}

export interface TopicData {
  id: string;
  section: ChemSection;
  level: DifficultyLevel;
  title: string;
  shortDesc: string;
  generalFormula?: string;
  estimatedMinutes: number;
  theoryBase: TheoryBlock[];
  theoryAdvanced: TheoryBlock[];
  moleculeIds: string[];
  isomerPair?: [string, string];
  schemeNodeId?: string;
}

export interface TaskData {
  id: string;
  number: number;
  section: ChemSection;
  topicId: string;
  level: DifficultyLevel;
  type: TaskType;
  title: string;
  prompt: string;
  options?: string[];
  correctOptionIndex?: number;
  acceptedFormulas?: string[];
  chainSteps?: {
    sequence: string;
    blanks: {
      label: string;
      accepted: string[];
      placeholder: string;
    }[];
  };
  calculationAnswer?: {
    value: number;
    tolerance: number;
    unit: string;
  };
  hint: string;
  explanation: string;
  moleculeId?: string;
}

export interface ReactionStep {
  title: string;
  description: string;
  stateFormula: string;
  bondChange: string;
}

export interface ReactionData {
  id: string;
  section: ChemSection;
  level: DifficultyLevel;
  reactionType: string;
  startFormula: string;
  startName: string;
  reagent: string;
  reagentName: string;
  condition: string;
  equation: string;
  productFormula: string;
  productName: string;
  structuralProduct: string;
  productMoleculeId: string;
  topicId: string;
  summary: string;
  steps: ReactionStep[];
}

export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  latinName: string;
  mass: number;
  period: number;
  group: number;
  category:
    | 'alkali'
    | 'alkaline'
    | 'transition'
    | 'post-transition'
    | 'metalloid'
    | 'nonmetal'
    | 'halogen'
    | 'noble'
    | 'lanthanide'
    | 'actinide';
  electronConfig: string;
  shells: number[];
  electronegativity: number | null;
  oxidationStates: string;
  state: 'твёрдое' | 'жидкое' | 'газ';
  meltingPoint: number | null;
  boilingPoint: number | null;
  density: number | null;
  oxideCharacter: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  letter: string;
  section: ChemSection | 'general';
  definition: string;
  formula?: string;
  relatedTopicId?: string;
}

export interface TaskAttempt {
  id: string;
  taskId: string;
  topicId: string;
  section: ChemSection;
  level: DifficultyLevel;
  type: TaskType;
  taskTitle: string;
  correct: boolean;
  userAnswer: string;
  timestamp: string;
}

export interface SavedReactionItem {
  reactionId: string;
  equation: string;
  productName: string;
  savedAt: string;
}

export interface SavedMoleculeItem {
  moleculeId: string;
  name: string;
  formula: string;
  savedAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  activated: boolean;
  createdAt: string;
  completedTopicIds: string[];
  attempts: TaskAttempt[];
  savedReactions: SavedReactionItem[];
  savedMolecules: SavedMoleculeItem[];
}

export type AppRoute =
  | { page: 'home' }
  | { page: 'section'; section: ChemSection; level: DifficultyLevel }
  | { page: 'topic'; section: ChemSection; topicId: string; level: DifficultyLevel; tab?: 'theory' | 'examples' | 'schemes' | 'tasks' }
  | { page: 'tasks'; section?: ChemSection; topicId?: string; level?: DifficultyLevel; type?: TaskType }
  | { page: 'tables'; tab?: 'periodic' | 'general' | 'schemes'; subTab?: 'solubility' | 'reactivity' | 'physical' | 'acidbase' }
  | { page: 'reference'; anchor?: 'guides' | 'schemes' | 'glossary' }
  | { page: 'constructor'; reactionId?: string }
  | { page: 'profile' }
  | { page: 'auth'; mode: 'login' | 'register' | 'reset'; token?: string }
  | { page: 'search'; query: string }
  | { page: 'privacy' }
  | { page: 'notfound' };
