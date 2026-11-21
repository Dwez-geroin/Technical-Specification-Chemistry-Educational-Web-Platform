import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import {
  AuthStore,
  SlidingWindowRateLimiter,
  toPublicUser,
  validateEmail,
  validateRegistrationInput,
} from './server/authStore.ts';
import type { StoredUser } from './server/authStore.ts';

const PORT = Number(process.env.PORT) || 3000;
const app = express();
const store = new AuthStore();
const authLimiter = new SlidingWindowRateLimiter(30, 60_000);

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

interface AuthedRequest extends express.Request {
  user?: StoredUser;
  sessionToken?: string;
}

function getClientKey(req: express.Request): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function rateLimitAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!authLimiter.allow(getClientKey(req))) {
    res.status(429).json({ error: 'Слишком много запросов. Повторите попытку через минуту.' });
    return;
  }
  next();
}

function requireAuth(req: AuthedRequest, res: express.Response, next: express.NextFunction) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Требуется авторизация.' });
    return;
  }
  const token = header.slice('Bearer '.length).trim();
  const user = store.getUserBySession(token);
  if (!user) {
    res.status(401).json({ error: 'Сессия недействительна или истекла.' });
    return;
  }
  req.user = user;
  req.sessionToken = token;
  next();
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', rateLimitAuth, (req, res) => {
  const { fullName, email, password, role, consent, captchaA, captchaB, captchaAnswer } = req.body ?? {};
  const validationError = validateRegistrationInput({ fullName, email, password, consent });
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }
  const a = Number(captchaA);
  const b = Number(captchaB);
  const ans = Number(captchaAnswer);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a < 1 || a > 20 || b < 1 || b > 20 || ans !== a + b) {
    res.status(400).json({ error: 'Неверный ответ на проверку от спама (капчу).' });
    return;
  }

  const result = store.register({
    fullName: String(fullName),
    email: String(email),
    password: String(password),
    role: role === 'teacher' ? 'teacher' : 'student',
  });
  if ('error' in result) {
    res.status(409).json({ error: result.error });
    return;
  }
  res.status(201).json({
    user: result.user,
    activationToken: result.activationToken,
    message: 'Аккаунт создан. Подтвердите email по ссылке из письма активации.',
  });
});

app.post('/api/auth/activate', rateLimitAuth, (req, res) => {
  const token = typeof req.body?.token === 'string' ? req.body.token : '';
  if (!token) {
    res.status(400).json({ error: 'Отсутствует токен активации.' });
    return;
  }
  const result = store.activate(token);
  if ('error' in result) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({
    user: result.user,
    token: result.sessionToken,
  });
});

app.post('/api/auth/login', rateLimitAuth, (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!validateEmail(email) || !password) {
    res.status(400).json({ error: 'Введите корректный email и пароль.' });
    return;
  }
  const result = store.login(email, password);
  if ('error' in result) {
    res.status(result.needsActivation ? 403 : 401).json({ error: result.error });
    return;
  }
  res.json({ user: result.user, token: result.sessionToken });
});

app.post('/api/auth/demo', rateLimitAuth, (_req, res) => {
  const result = store.loginDemo();
  res.json({ user: result.user, token: result.sessionToken });
});

app.post('/api/auth/forgot-password', rateLimitAuth, (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email : '';
  if (!validateEmail(email)) {
    res.status(400).json({ error: 'Введите корректный email.' });
    return;
  }
  const { resetToken } = store.requestPasswordReset(email);
  res.json({
    message: 'Если аккаунт с таким email существует, ссылка для восстановления пароля отправлена.',
    resetToken,
  });
});

app.post('/api/auth/reset-password', rateLimitAuth, (req, res) => {
  const token = typeof req.body?.token === 'string' ? req.body.token : '';
  const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
  if (!token) {
    res.status(400).json({ error: 'Отсутствует токен восстановления.' });
    return;
  }
  const result = store.resetPassword(token, newPassword);
  if ('error' in result) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({ ok: true, message: 'Пароль успешно обновлён. Теперь вы можете войти.' });
});

app.post('/api/auth/logout', requireAuth, (req: AuthedRequest, res) => {
  if (req.sessionToken) {
    store.revokeSession(req.sessionToken);
  }
  res.json({ ok: true });
});

app.get('/api/profile', requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: toPublicUser(req.user!) });
});

app.post('/api/profile/topic-toggle', requireAuth, (req: AuthedRequest, res) => {
  const topicId = typeof req.body?.topicId === 'string' ? req.body.topicId.slice(0, 80) : '';
  if (!topicId) {
    res.status(400).json({ error: 'Не указан идентификатор темы.' });
    return;
  }
  const updated = store.toggleTopicCompleted(req.user!.id, topicId);
  if (!updated) {
    res.status(404).json({ error: 'Пользователь не найден.' });
    return;
  }
  res.json({ user: updated });
});

app.post('/api/profile/attempts', requireAuth, (req: AuthedRequest, res) => {
  const { taskId, topicId, section, level, type, taskTitle, correct, userAnswer } = req.body ?? {};
  if (
    typeof taskId !== 'string' ||
    typeof topicId !== 'string' ||
    (section !== 'organic' && section !== 'inorganic') ||
    (level !== 'base' && level !== 'advanced') ||
    !['test', 'formula', 'chain', 'calculation'].includes(type) ||
    typeof taskTitle !== 'string' ||
    typeof correct !== 'boolean'
  ) {
    res.status(400).json({ error: 'Некорректные данные результата задания.' });
    return;
  }
  const updated = store.recordAttempt(req.user!.id, {
    taskId: taskId.slice(0, 80),
    topicId: topicId.slice(0, 80),
    section,
    level,
    type,
    taskTitle: taskTitle.slice(0, 160),
    correct,
    userAnswer: typeof userAnswer === 'string' ? userAnswer.slice(0, 200) : '',
  });
  res.json({ user: updated });
});

app.post('/api/profile/reactions', requireAuth, (req: AuthedRequest, res) => {
  const { reactionId, equation, productName } = req.body ?? {};
  if (typeof reactionId !== 'string' || typeof equation !== 'string' || typeof productName !== 'string') {
    res.status(400).json({ error: 'Некорректные данные реакции.' });
    return;
  }
  const updated = store.toggleSavedReaction(req.user!.id, {
    reactionId: reactionId.slice(0, 100),
    equation: equation.slice(0, 240),
    productName: productName.slice(0, 120),
  });
  res.json({ user: updated });
});

app.post('/api/profile/molecules', requireAuth, (req: AuthedRequest, res) => {
  const { moleculeId, name, formula } = req.body ?? {};
  if (typeof moleculeId !== 'string' || typeof name !== 'string' || typeof formula !== 'string') {
    res.status(400).json({ error: 'Некорректные данные молекулы.' });
    return;
  }
  const updated = store.toggleSavedMolecule(req.user!.id, {
    moleculeId: moleculeId.slice(0, 80),
    name: name.slice(0, 120),
    formula: formula.slice(0, 80),
  });
  res.json({ user: updated });
});

async function startServer() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(distDir);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ChemEdu server running on http://localhost:${PORT}`);
  });
}

startServer();
