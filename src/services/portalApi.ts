import type {
  TaskAttempt,
  UserProfile,
  UserRole,
} from '../types/chemistry';

const STATIC_DB_KEY = 'chem_portal_static_users_v1';

interface StaticStoredUser extends UserProfile {
  passwordHash: string;
  activationToken: string | null;
  resetToken: string | null;
  resetTokenExpires: number | null;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export interface RegisterResponse {
  user: UserProfile;
  activationToken: string;
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken: string | null;
}

export interface SimpleOkResponse {
  ok: boolean;
  message?: string;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

function getApiBase(): string {
  const raw =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    typeof import.meta.env.VITE_API_BASE_URL === 'string'
      ? import.meta.env.VITE_API_BASE_URL
      : '';
  return raw.replace(/\/+$/, '');
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const buffer = new ArrayBuffer(hex.length / 2);
  const out = new Uint8Array(buffer);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function randomHex(byteLength = 16): string {
  const buf = new Uint8Array(byteLength);
  globalThis.crypto.getRandomValues(buf);
  return bytesToHex(buf);
}

/**
 * Salted PBKDF2 password hashing via Web Crypto API for autonomous static hosting
 * (e.g. GitHub Pages when no Express backend is present).
 */
export async function hashPasswordBrowser(password: string): Promise<string> {
  const saltBytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(saltBytes);
  const enc = new TextEncoder();
  const keyMaterial = await globalThis.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const derivedBits = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  );
  return `pbkdf2:${bytesToHex(saltBytes)}:${bytesToHex(new Uint8Array(derivedBits))}`;
}

export async function verifyPasswordBrowser(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(':');
  if (parts.length !== 3 || parts[0] !== 'pbkdf2') return false;
  const [, saltHex, expectedHex] = parts;
  const saltBytes = hexToBytes(saltHex);
  const enc = new TextEncoder();
  const keyMaterial = await globalThis.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const derivedBits = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  );
  const actualHex = bytesToHex(new Uint8Array(derivedBits));
  if (actualHex.length !== expectedHex.length) return false;
  let diff = 0;
  for (let i = 0; i < actualHex.length; i++) {
    diff |= actualHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
  }
  return diff === 0;
}

function toPublicProfile(u: StaticStoredUser): UserProfile {
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    role: u.role,
    activated: u.activated,
    createdAt: u.createdAt,
    completedTopicIds: u.completedTopicIds,
    attempts: u.attempts,
    savedReactions: u.savedReactions,
    savedMolecules: u.savedMolecules,
  };
}

function validateEmailFormat(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/**
 * Pure factory for the browser-local fallback store used ONLY on static hosts
 * (like GitHub Pages) when no Express backend is available.
 * Session tokens live strictly in memory (Map) and are never written to storage.
 */
export function createStaticPortalStore(storage?: StorageLike) {
  const sessions = new Map<string, string>();

  const readUsers = (): StaticStoredUser[] => {
    if (!storage) return [];
    try {
      const raw = storage.getItem(STATIC_DB_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as StaticStoredUser[]) : [];
    } catch {
      return [];
    }
  };

  const writeUsers = (users: StaticStoredUser[]) => {
    if (!storage) return;
    try {
      storage.setItem(STATIC_DB_KEY, JSON.stringify(users));
    } catch {
      // Ignore quota errors in restricted private browsing modes
    }
  };

  let cache: StaticStoredUser[] = readUsers();

  const persist = () => {
    writeUsers(cache);
  };

  const ensureDemoUser = async (): Promise<StaticStoredUser> => {
    const existing = cache.find((u) => u.email.toLowerCase() === 'student@chem-edu.ru');
    if (existing) return existing;
    const demo: StaticStoredUser = {
      id: 'demo-student-1',
      fullName: 'Соколова Анна Дмитриевна',
      email: 'student@chem-edu.ru',
      role: 'student',
      passwordHash: await hashPasswordBrowser('chem2026'),
      activated: true,
      activationToken: null,
      resetToken: null,
      resetTokenExpires: null,
      createdAt: '2026-09-01T08:00:00.000Z',
      completedTopicIds: ['org-alkanes', 'org-alkenes', 'inorg-oxides'],
      attempts: [
        {
          id: 'att-demo-1',
          taskId: 't-org-1',
          topicId: 'org-alkanes',
          section: 'organic',
          level: 'base',
          type: 'test',
          taskTitle: 'Общая формула алканов',
          correct: true,
          userAnswer: 'CnH2n+2',
          timestamp: '2026-11-18T10:15:00.000Z',
        },
        {
          id: 'att-demo-2',
          taskId: 't-org-3',
          topicId: 'org-alkenes',
          section: 'organic',
          level: 'base',
          type: 'formula',
          taskTitle: 'Гидратация этилена',
          correct: true,
          userAnswer: 'C2H5OH',
          timestamp: '2026-11-19T14:30:00.000Z',
        },
        {
          id: 'att-demo-3',
          taskId: 't-inorg-1',
          topicId: 'inorg-oxides',
          section: 'inorganic',
          level: 'base',
          type: 'test',
          taskTitle: 'Классификация оксидов',
          correct: true,
          userAnswer: 'Амфотерный оксид (Al2O3)',
          timestamp: '2026-11-20T09:40:00.000Z',
        },
      ],
      savedReactions: [
        {
          reactionId: 'rx-org-ethene-h2o',
          equation: 'C2H4 + H2O → C2H5OH',
          productName: 'Этанол',
          savedAt: '2026-11-19T14:35:00.000Z',
        },
      ],
      savedMolecules: [
        {
          moleculeId: 'benzene',
          name: 'Бензол',
          formula: 'C6H6',
          savedAt: '2026-11-19T16:00:00.000Z',
        },
        {
          moleculeId: 'ethanol',
          name: 'Этанол',
          formula: 'C2H5OH',
          savedAt: '2026-11-20T11:20:00.000Z',
        },
      ],
    };
    cache = [demo, ...cache];
    persist();
    return demo;
  };

  const issueSession = (userId: string): string => {
    const token = randomHex(24);
    sessions.set(token, userId);
    return token;
  };

  const getUserByToken = (token: string): StaticStoredUser | null => {
    const userId = sessions.get(token);
    if (!userId) return null;
    return cache.find((u) => u.id === userId) || null;
  };

  return {
    async demoLogin(): Promise<ApiResult<AuthResponse>> {
      const demo = await ensureDemoUser();
      const token = issueSession(demo.id);
      return { ok: true, data: { user: toPublicProfile(demo), token } };
    },

    async login(email: string, password: string): Promise<ApiResult<AuthResponse>> {
      if (!validateEmailFormat(email) || !password) {
        return { ok: false, error: 'Введите корректный email и пароль.' };
      }
      await ensureDemoUser();
      const user = cache.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!user) {
        return { ok: false, error: 'Неверный email или пароль.' };
      }
      const valid = await verifyPasswordBrowser(password, user.passwordHash);
      if (!valid) {
        return { ok: false, error: 'Неверный email или пароль.' };
      }
      if (!user.activated) {
        return { ok: false, error: 'Аккаунт ещё не активирован. Подтвердите email.' };
      }
      const token = issueSession(user.id);
      return { ok: true, data: { user: toPublicProfile(user), token } };
    },

    async register(params: {
      fullName: string;
      email: string;
      password: string;
      role: UserRole;
      consent: boolean;
      captchaA: number;
      captchaB: number;
      captchaAnswer: number;
    }): Promise<ApiResult<RegisterResponse>> {
      if (params.fullName.trim().length < 2 || params.fullName.trim().length > 120) {
        return { ok: false, error: 'Укажите корректное ФИО (от 2 до 120 символов).' };
      }
      if (!validateEmailFormat(params.email)) {
        return { ok: false, error: 'Укажите корректный адрес электронной почты.' };
      }
      if (params.password.length < 6 || params.password.length > 128) {
        return { ok: false, error: 'Пароль должен содержать от 6 до 128 символов.' };
      }
      if (!params.consent) {
        return { ok: false, error: 'Необходимо согласие на обработку персональных данных (152-ФЗ).' };
      }
      if (params.captchaAnswer !== params.captchaA + params.captchaB) {
        return { ok: false, error: 'Неверный ответ на проверку от спама (капчу).' };
      }

      const normEmail = params.email.trim().toLowerCase();
      if (cache.some((u) => u.email.toLowerCase() === normEmail)) {
        return { ok: false, error: 'Пользователь с таким email уже зарегистрирован.' };
      }

      const activationToken = randomHex(18);
      const user: StaticStoredUser = {
        id: `usr-${randomHex(8)}`,
        fullName: params.fullName.trim(),
        email: normEmail,
        role: params.role === 'teacher' ? 'teacher' : 'student',
        passwordHash: await hashPasswordBrowser(params.password),
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
      cache = [...cache, user];
      persist();
      return {
        ok: true,
        data: {
          user: toPublicProfile(user),
          activationToken,
          message: 'Аккаунт создан. Подтвердите email по ссылке из письма активации.',
        },
      };
    },

    async activate(token: string): Promise<ApiResult<AuthResponse>> {
      const user = cache.find((u) => u.activationToken === token);
      if (!user) {
        return { ok: false, error: 'Ссылка активации недействительна или уже использована.' };
      }
      user.activated = true;
      user.activationToken = null;
      persist();
      const sessionToken = issueSession(user.id);
      return { ok: true, data: { user: toPublicProfile(user), token: sessionToken } };
    },

    async forgotPassword(email: string): Promise<ApiResult<ForgotPasswordResponse>> {
      if (!validateEmailFormat(email)) {
        return { ok: false, error: 'Введите корректный email.' };
      }
      await ensureDemoUser();
      const user = cache.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      let resetToken: string | null = null;
      if (user) {
        resetToken = randomHex(18);
        user.resetToken = resetToken;
        user.resetTokenExpires = Date.now() + 30 * 60 * 1000;
        persist();
      }
      return {
        ok: true,
        data: {
          message: 'Если аккаунт с таким email существует, ссылка для восстановления пароля отправлена.',
          resetToken,
        },
      };
    },

    async resetPassword(token: string, newPassword: string): Promise<ApiResult<SimpleOkResponse>> {
      if (newPassword.length < 6 || newPassword.length > 128) {
        return { ok: false, error: 'Пароль должен содержать от 6 до 128 символов.' };
      }
      const user = cache.find(
        (u) => u.resetToken === token && u.resetTokenExpires && u.resetTokenExpires > Date.now(),
      );
      if (!user) {
        return { ok: false, error: 'Ссылка восстановления недействительна или срок её действия истёк.' };
      }
      user.passwordHash = await hashPasswordBrowser(newPassword);
      user.resetToken = null;
      user.resetTokenExpires = null;
      user.activated = true;
      persist();
      return {
        ok: true,
        data: { ok: true, message: 'Пароль успешно обновлён. Теперь вы можете войти.' },
      };
    },

    async logout(token: string): Promise<ApiResult<SimpleOkResponse>> {
      sessions.delete(token);
      return { ok: true, data: { ok: true } };
    },

    async toggleTopic(token: string, topicId: string): Promise<ApiResult<{ user: UserProfile }>> {
      const user = getUserByToken(token);
      if (!user) return { ok: false, error: 'Требуется авторизация.' };
      const exists = user.completedTopicIds.includes(topicId);
      user.completedTopicIds = exists
        ? user.completedTopicIds.filter((id) => id !== topicId)
        : [...user.completedTopicIds, topicId];
      persist();
      return { ok: true, data: { user: toPublicProfile(user) } };
    },

    async recordAttempt(
      token: string,
      attempt: Omit<TaskAttempt, 'id' | 'timestamp'>,
    ): Promise<ApiResult<{ user: UserProfile }>> {
      const user = getUserByToken(token);
      if (!user) return { ok: false, error: 'Требуется авторизация.' };
      const entry: TaskAttempt = {
        ...attempt,
        id: `att-${randomHex(6)}`,
        timestamp: new Date().toISOString(),
      };
      user.attempts = [entry, ...user.attempts].slice(0, 150);
      persist();
      return { ok: true, data: { user: toPublicProfile(user) } };
    },

    async toggleReaction(
      token: string,
      payload: { reactionId: string; equation: string; productName: string },
    ): Promise<ApiResult<{ user: UserProfile }>> {
      const user = getUserByToken(token);
      if (!user) return { ok: false, error: 'Требуется авторизация.' };
      const exists = user.savedReactions.some((r) => r.reactionId === payload.reactionId);
      user.savedReactions = exists
        ? user.savedReactions.filter((r) => r.reactionId !== payload.reactionId)
        : [{ ...payload, savedAt: new Date().toISOString() }, ...user.savedReactions];
      persist();
      return { ok: true, data: { user: toPublicProfile(user) } };
    },

    async toggleMolecule(
      token: string,
      payload: { moleculeId: string; name: string; formula: string },
    ): Promise<ApiResult<{ user: UserProfile }>> {
      const user = getUserByToken(token);
      if (!user) return { ok: false, error: 'Требуется авторизация.' };
      const exists = user.savedMolecules.some((m) => m.moleculeId === payload.moleculeId);
      user.savedMolecules = exists
        ? user.savedMolecules.filter((m) => m.moleculeId !== payload.moleculeId)
        : [{ ...payload, savedAt: new Date().toISOString() }, ...user.savedMolecules];
      persist();
      return { ok: true, data: { user: toPublicProfile(user) } };
    },
  };
}

let modePromise: Promise<'server' | 'static'> | null = null;
const browserStaticStore = createStaticPortalStore(
  typeof window !== 'undefined' ? window.localStorage : undefined,
);

async function detectBackendMode(): Promise<'server' | 'static'> {
  if (modePromise) return modePromise;
  modePromise = (async () => {
    const base = getApiBase();
    // Skip health probe on known static hosts (e.g. GitHub Pages) when no external API URL is configured
    if (
      !base &&
      typeof window !== 'undefined' &&
      (window.location.hostname.endsWith('.github.io') || window.location.protocol === 'file:')
    ) {
      return 'static';
    }
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${base}/api/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timer);
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const body = await res.json();
        if (body && body.status === 'ok') {
          return 'server';
        }
      }
      return 'static';
    } catch {
      return 'static';
    }
  })();
  return modePromise;
}

async function serverPost<T>(
  endpoint: string,
  body?: unknown,
  token?: string | null,
): Promise<ApiResult<T>> {
  const base = getApiBase();
  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  try {
    const res = await fetch(`${base}${endpoint}`, {
      method: 'POST',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
      return { ok: false, error: 'Сервер вернул некорректный ответ.' };
    }
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data?.error || 'Не удалось выполнить запрос.' };
    }
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, error: 'Ошибка соединения с сервером. Повторите попытку.' };
  }
}

export const portalApi = {
  async login(email: string, password: string): Promise<ApiResult<AuthResponse>> {
    const mode = await detectBackendMode();
    if (mode === 'static') return browserStaticStore.login(email, password);
    return serverPost<AuthResponse>('/api/auth/login', { email, password });
  },

  async demoLogin(): Promise<ApiResult<AuthResponse>> {
    const mode = await detectBackendMode();
    if (mode === 'static') return browserStaticStore.demoLogin();
    return serverPost<AuthResponse>('/api/auth/demo');
  },

  async register(params: {
    fullName: string;
    email: string;
    role: UserRole;
    password: string;
    consent: boolean;
    captchaA: number;
    captchaB: number;
    captchaAnswer: number;
  }): Promise<ApiResult<RegisterResponse>> {
    const mode = await detectBackendMode();
    if (mode === 'static') return browserStaticStore.register(params);
    return serverPost<RegisterResponse>('/api/auth/register', params);
  },

  async activate(token: string): Promise<ApiResult<AuthResponse>> {
    const mode = await detectBackendMode();
    if (mode === 'static') return browserStaticStore.activate(token);
    return serverPost<AuthResponse>('/api/auth/activate', { token });
  },

  async forgotPassword(email: string): Promise<ApiResult<ForgotPasswordResponse>> {
    const mode = await detectBackendMode();
    if (mode === 'static') return browserStaticStore.forgotPassword(email);
    return serverPost<ForgotPasswordResponse>('/api/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiResult<SimpleOkResponse>> {
    const mode = await detectBackendMode();
    if (mode === 'static') return browserStaticStore.resetPassword(token, newPassword);
    return serverPost<SimpleOkResponse>('/api/auth/reset-password', { token, newPassword });
  },

  async logout(token: string): Promise<ApiResult<SimpleOkResponse>> {
    const mode = await detectBackendMode();
    if (mode === 'static') return browserStaticStore.logout(token);
    return serverPost<SimpleOkResponse>('/api/auth/logout', undefined, token);
  },

  async toggleTopic(token: string, topicId: string): Promise<ApiResult<{ user: UserProfile }>> {
    const mode = await detectBackendMode();
    if (mode === 'static') return browserStaticStore.toggleTopic(token, topicId);
    return serverPost<{ user: UserProfile }>('/api/profile/topic-toggle', { topicId }, token);
  },

  async recordAttempt(
    token: string,
    attempt: Omit<TaskAttempt, 'id' | 'timestamp'>,
  ): Promise<ApiResult<{ user: UserProfile }>> {
    const mode = await detectBackendMode();
    if (mode === 'static') return browserStaticStore.recordAttempt(token, attempt);
    return serverPost<{ user: UserProfile }>('/api/profile/attempts', attempt, token);
  },

  async toggleReaction(
    token: string,
    payload: { reactionId: string; equation: string; productName: string },
  ): Promise<ApiResult<{ user: UserProfile }>> {
    const mode = await detectBackendMode();
    if (mode === 'static') return browserStaticStore.toggleReaction(token, payload);
    return serverPost<{ user: UserProfile }>('/api/profile/reactions', payload, token);
  },

  async toggleMolecule(
    token: string,
    payload: { moleculeId: string; name: string; formula: string },
  ): Promise<ApiResult<{ user: UserProfile }>> {
    const mode = await detectBackendMode();
    if (mode === 'static') return browserStaticStore.toggleMolecule(token, payload);
    return serverPost<{ user: UserProfile }>('/api/profile/molecules', payload, token);
  },
};
