import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export interface StoredTaskAttempt {
  id: string;
  taskId: string;
  topicId: string;
  section: 'organic' | 'inorganic';
  level: 'base' | 'advanced';
  type: 'test' | 'formula' | 'chain' | 'calculation';
  taskTitle: string;
  correct: boolean;
  userAnswer: string;
  timestamp: string;
}

export interface StoredSavedReaction {
  reactionId: string;
  equation: string;
  productName: string;
  savedAt: string;
}

export interface StoredSavedMolecule {
  moleculeId: string;
  name: string;
  formula: string;
  savedAt: string;
}

export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'teacher';
  passwordHash: string;
  activated: boolean;
  activationToken: string | null;
  resetToken: string | null;
  resetTokenExpires: number | null;
  createdAt: string;
  completedTopicIds: string[];
  attempts: StoredTaskAttempt[];
  savedReactions: StoredSavedReaction[];
  savedMolecules: StoredSavedMolecule[];
}

export interface PublicUser {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'teacher';
  activated: boolean;
  createdAt: string;
  completedTopicIds: string[];
  attempts: StoredTaskAttempt[];
  savedReactions: StoredSavedReaction[];
  savedMolecules: StoredSavedMolecule[];
}

interface DatabaseSchema {
  users: StoredUser[];
}

const SCRYPT_KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
  return `scrypt:${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, expectedHex] = parts;
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  const expected = Buffer.from(expectedHex, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function validateRegistrationInput(input: {
  fullName?: unknown;
  email?: unknown;
  password?: unknown;
  consent?: unknown;
}): string | null {
  if (typeof input.fullName !== 'string' || input.fullName.trim().length < 2 || input.fullName.trim().length > 120) {
    return 'Укажите корректное ФИО (от 2 до 120 символов).';
  }
  if (typeof input.email !== 'string' || !validateEmail(input.email) || input.email.length > 160) {
    return 'Укажите корректный адрес электронной почты.';
  }
  if (typeof input.password !== 'string' || input.password.length < 6 || input.password.length > 128) {
    return 'Пароль должен содержать от 6 до 128 символов.';
  }
  if (input.consent !== true) {
    return 'Необходимо согласие на обработку персональных данных (152-ФЗ).';
  }
  return null;
}

export function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    activated: user.activated,
    createdAt: user.createdAt,
    completedTopicIds: user.completedTopicIds,
    attempts: user.attempts,
    savedReactions: user.savedReactions,
    savedMolecules: user.savedMolecules,
  };
}

export class SlidingWindowRateLimiter {
  private hits = new Map<string, number[]>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  allow(key: string, now = Date.now()): boolean {
    const cutoff = now - this.windowMs;
    const recent = (this.hits.get(key) || []).filter((t) => t > cutoff);
    if (recent.length >= this.maxRequests) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }
}

export class AuthStore {
  private readonly filePath: string;
  private db: DatabaseSchema;
  private sessions = new Map<string, { userId: string; createdAt: number }>();

  constructor(dataDir?: string) {
    const baseDir = dataDir ? path.resolve(dataDir) : path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    this.filePath = path.resolve(baseDir, 'chem-db.json');
    if (!this.filePath.startsWith(baseDir + path.sep)) {
      throw new Error('Invalid data storage path');
    }
    this.db = this.load();
    this.ensureDemoUser();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw) as DatabaseSchema;
        if (parsed && Array.isArray(parsed.users)) {
          return parsed;
        }
      }
    } catch {
      // Fallback to fresh store if file is unreadable
    }
    return { users: [] };
  }

  private persist(): void {
    const tmpPath = `${this.filePath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(this.db, null, 2), 'utf-8');
    fs.renameSync(tmpPath, this.filePath);
  }

  private ensureDemoUser(): void {
    const demoEmail = 'student@chem-edu.ru';
    const existing = this.db.users.find((u) => u.email === demoEmail);
    if (!existing) {
      const demoUser: StoredUser = {
        id: 'demo-student-1',
        fullName: 'Соколова Анна Дмитриевна',
        email: demoEmail,
        role: 'student',
        passwordHash: hashPassword('chem2026'),
        activated: true,
        activationToken: null,
        resetToken: null,
        resetTokenExpires: null,
        createdAt: new Date('2026-10-15T09:00:00Z').toISOString(),
        completedTopicIds: ['org-alkanes', 'org-alkenes', 'inorg-oxides'],
        attempts: [
          {
            id: 'seed-att-1',
            taskId: 't-org-1',
            topicId: 'org-alkanes',
            section: 'organic',
            level: 'base',
            type: 'test',
            taskTitle: 'Общая формула алканов',
            correct: true,
            userAnswer: 'CnH2n+2',
            timestamp: new Date('2026-11-18T14:20:00Z').toISOString(),
          },
          {
            id: 'seed-att-2',
            taskId: 't-org-3',
            topicId: 'org-alkenes',
            section: 'organic',
            level: 'base',
            type: 'formula',
            taskTitle: 'Гидратация этилена',
            correct: true,
            userAnswer: 'C2H5OH',
            timestamp: new Date('2026-11-19T11:10:00Z').toISOString(),
          },
          {
            id: 'seed-att-3',
            taskId: 't-inorg-1',
            topicId: 'inorg-oxides',
            section: 'inorganic',
            level: 'base',
            type: 'test',
            taskTitle: 'Классификация оксидов',
            correct: true,
            userAnswer: 'Амфотерный оксид (Al2O3)',
            timestamp: new Date('2026-11-20T16:40:00Z').toISOString(),
          },
        ],
        savedReactions: [
          {
            reactionId: 'rx-org-ethene-h2o',
            equation: 'C2H4 + H2O → C2H5OH',
            productName: 'Этанол',
            savedAt: new Date('2026-11-19T11:15:00Z').toISOString(),
          },
        ],
        savedMolecules: [
          {
            moleculeId: 'ethanol',
            name: 'Этанол',
            formula: 'C2H5OH',
            savedAt: new Date('2026-11-19T11:16:00Z').toISOString(),
          },
          {
            moleculeId: 'benzene',
            name: 'Бензол',
            formula: 'C6H6',
            savedAt: new Date('2026-11-20T09:30:00Z').toISOString(),
          },
        ],
      };
      this.db.users.push(demoUser);
      this.persist();
    }
  }

  register(params: {
    fullName: string;
    email: string;
    password: string;
    role: 'student' | 'teacher';
  }): { user: PublicUser; activationToken: string } | { error: string } {
    const email = params.email.trim().toLowerCase();
    if (this.db.users.some((u) => u.email === email)) {
      return { error: 'Пользователь с таким email уже зарегистрирован.' };
    }

    const activationToken = crypto.randomBytes(24).toString('hex');
    const user: StoredUser = {
      id: `usr-${crypto.randomUUID()}`,
      fullName: params.fullName.trim(),
      email,
      role: params.role === 'teacher' ? 'teacher' : 'student',
      passwordHash: hashPassword(params.password),
      activated: false,
      activationToken,
      resetToken: null,
      resetTokenExpires: null,
      createdAt: new Date().toISOString(),
      completedTopicIds: [],
      attempts: [],
      savedReactions: [],
      savedMolecules: [],
    };
    this.db.users.push(user);
    this.persist();
    return { user: toPublicUser(user), activationToken };
  }

  activate(token: string): { user: PublicUser; sessionToken: string } | { error: string } {
    const user = this.db.users.find((u) => u.activationToken && u.activationToken === token.trim());
    if (!user) {
      return { error: 'Ссылка активации недействительна или уже использована.' };
    }
    user.activated = true;
    user.activationToken = null;
    this.persist();
    const sessionToken = this.createSession(user.id);
    return { user: toPublicUser(user), sessionToken };
  }

  login(emailRaw: string, password: string): { user: PublicUser; sessionToken: string } | { error: string; needsActivation?: boolean } {
    const email = emailRaw.trim().toLowerCase();
    const user = this.db.users.find((u) => u.email === email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return { error: 'Неверный email или пароль.' };
    }
    if (!user.activated) {
      return {
        error: 'Аккаунт ещё не активирован. Подтвердите email по ссылке из письма.',
        needsActivation: true,
      };
    }
    const sessionToken = this.createSession(user.id);
    return { user: toPublicUser(user), sessionToken };
  }

  loginDemo(): { user: PublicUser; sessionToken: string } {
    this.ensureDemoUser();
    const user = this.db.users.find((u) => u.email === 'student@chem-edu.ru')!;
    const sessionToken = this.createSession(user.id);
    return { user: toPublicUser(user), sessionToken };
  }

  requestPasswordReset(emailRaw: string): { resetToken: string | null } {
    const email = emailRaw.trim().toLowerCase();
    const user = this.db.users.find((u) => u.email === email);
    if (!user) {
      return { resetToken: null };
    }
    const resetToken = crypto.randomBytes(24).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 30 * 60 * 1000;
    this.persist();
    return { resetToken };
  }

  resetPassword(token: string, newPassword: string): { ok: true } | { error: string } {
    if (newPassword.length < 6 || newPassword.length > 128) {
      return { error: 'Новый пароль должен содержать от 6 до 128 символов.' };
    }
    const user = this.db.users.find(
      (u) => u.resetToken === token.trim() && u.resetTokenExpires && u.resetTokenExpires > Date.now(),
    );
    if (!user) {
      return { error: 'Токен восстановления недействителен или истёк.' };
    }
    user.passwordHash = hashPassword(newPassword);
    user.resetToken = null;
    user.resetTokenExpires = null;
    user.activated = true;
    this.persist();
    return { ok: true };
  }

  createSession(userId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.sessions.set(token, { userId, createdAt: Date.now() });
    return token;
  }

  getUserBySession(token: string): StoredUser | null {
    const session = this.sessions.get(token);
    if (!session) return null;
    return this.db.users.find((u) => u.id === session.userId) || null;
  }

  revokeSession(token: string): void {
    this.sessions.delete(token);
  }

  toggleTopicCompleted(userId: string, topicId: string): PublicUser | null {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) return null;
    if (user.completedTopicIds.includes(topicId)) {
      user.completedTopicIds = user.completedTopicIds.filter((id) => id !== topicId);
    } else {
      user.completedTopicIds.push(topicId);
    }
    this.persist();
    return toPublicUser(user);
  }

  recordAttempt(userId: string, attempt: Omit<StoredTaskAttempt, 'id' | 'timestamp'>): PublicUser | null {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) return null;
    const entry: StoredTaskAttempt = {
      ...attempt,
      id: `att-${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
    };
    user.attempts.unshift(entry);
    if (user.attempts.length > 200) {
      user.attempts = user.attempts.slice(0, 200);
    }
    this.persist();
    return toPublicUser(user);
  }

  toggleSavedReaction(userId: string, item: Omit<StoredSavedReaction, 'savedAt'>): PublicUser | null {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) return null;
    const exists = user.savedReactions.some((r) => r.reactionId === item.reactionId);
    if (exists) {
      user.savedReactions = user.savedReactions.filter((r) => r.reactionId !== item.reactionId);
    } else {
      user.savedReactions.unshift({ ...item, savedAt: new Date().toISOString() });
    }
    this.persist();
    return toPublicUser(user);
  }

  toggleSavedMolecule(userId: string, item: Omit<StoredSavedMolecule, 'savedAt'>): PublicUser | null {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) return null;
    const exists = user.savedMolecules.some((m) => m.moleculeId === item.moleculeId);
    if (exists) {
      user.savedMolecules = user.savedMolecules.filter((m) => m.moleculeId !== item.moleculeId);
    } else {
      user.savedMolecules.unshift({ ...item, savedAt: new Date().toISOString() });
    }
    this.persist();
    return toPublicUser(user);
  }
}
