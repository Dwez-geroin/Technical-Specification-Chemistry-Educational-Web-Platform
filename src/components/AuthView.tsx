import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  LogIn,
  MailCheck,
  RefreshCw,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import type { AppRoute, UserProfile, UserRole } from '../types/chemistry';
import { portalApi } from '../services/portalApi';

interface AuthViewProps {
  mode: 'login' | 'register' | 'reset';
  initialToken?: string;
  onNavigate: (route: AppRoute) => void;
  onAuthSuccess: (user: UserProfile, token: string, notice?: string) => void;
}

function generateCaptcha(): { a: number; b: number } {
  const a = Math.floor(Math.random() * 9) + 2;
  const b = Math.floor(Math.random() * 9) + 2;
  return { a, b };
}

export const AuthView: React.FC<AuthViewProps> = ({
  mode,
  initialToken,
  onNavigate,
  onAuthSuccess,
}) => {
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [consent, setConsent] = useState(false);
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [pendingActivation, setPendingActivation] = useState<{
    email: string;
    fullName: string;
    token: string;
  } | null>(null);

  // Reset password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState(initialToken || '');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [resetDone, setResetDone] = useState(false);

  // Shared UX state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const switchMode = (nextMode: 'login' | 'register' | 'reset') => {
    setErrorMsg(null);
    setInfoMsg(null);
    onNavigate({ page: 'auth', mode: nextMode });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);
    try {
      const res = await portalApi.login(loginEmail.trim(), loginPassword);
      if (!res.ok) {
        setErrorMsg(res.error);
        return;
      }
      onAuthSuccess(res.data.user, res.data.token, 'Вы успешно вошли в личный кабинет.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);
    try {
      const res = await portalApi.demoLogin();
      if (!res.ok) {
        setErrorMsg(res.error);
        return;
      }
      onAuthSuccess(res.data.user, res.data.token, 'Выполнен вход в демонстрационный профиль ученика.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (regPassword !== regConfirm) {
      setErrorMsg('Пароли не совпадают. Проверьте ввод.');
      return;
    }
    if (!consent) {
      setErrorMsg('Необходимо согласие на обработку персональных данных (152-ФЗ).');
      return;
    }

    setLoading(true);
    try {
      const res = await portalApi.register({
        fullName: fullName.trim(),
        email: regEmail.trim(),
        role: regRole,
        password: regPassword,
        consent,
        captchaA: captcha.a,
        captchaB: captcha.b,
        captchaAnswer: Number(captchaAnswer.trim()),
      });
      if (!res.ok) {
        setErrorMsg(res.error);
        setCaptcha(generateCaptcha());
        setCaptchaAnswer('');
        return;
      }
      setPendingActivation({
        email: res.data.user.email,
        fullName: res.data.user.fullName,
        token: res.data.activationToken,
      });
      setInfoMsg(res.data.message || 'Письмо активации отправлено на указанный email.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateAccount = async () => {
    if (!pendingActivation) return;
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await portalApi.activate(pendingActivation.token);
      if (!res.ok) {
        setErrorMsg(res.error);
        return;
      }
      onAuthSuccess(res.data.user, res.data.token, 'Email подтверждён, аккаунт активирован.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);
    try {
      const res = await portalApi.forgotPassword(resetEmail.trim());
      if (!res.ok) {
        setErrorMsg(res.error);
        return;
      }
      setResetEmailSent(true);
      setInfoMsg(res.data.message);
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (newPassword.length < 6) {
      setErrorMsg('Новый пароль должен содержать не менее 6 символов.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setErrorMsg('Пароли не совпадают.');
      return;
    }
    setLoading(true);
    try {
      const res = await portalApi.resetPassword(resetToken, newPassword);
      if (!res.ok) {
        setErrorMsg(res.error);
        return;
      }
      setResetDone(true);
      setInfoMsg(res.data.message || 'Пароль обновлён.');
    } finally {
      setLoading(false);
    }
  };

  const titleMeta = useMemo(() => {
    if (mode === 'register') {
      return {
        heading: 'Регистрация на портале',
        subtitle: 'Создайте личный кабинет, чтобы сохранять прогресс по темам, историю заданий и реакции из конструктора.',
      };
    }
    if (mode === 'reset') {
      return {
        heading: 'Восстановление пароля',
        subtitle: 'Укажите email, на который зарегистрирован аккаунт, для получения ссылки сброса пароля.',
      };
    }
    return {
      heading: 'Вход в личный кабинет',
      subtitle: 'Войдите по email и паролю или используйте готовый демонстрационный профиль ученика.',
    };
  }, [mode]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Mode Switcher Tabs */}
      <div className="bg-white border border-[#DDE3DF] rounded-2xl p-1.5 grid grid-cols-3 gap-1">
        <button
          type="button"
          onClick={() => switchMode('login')}
          className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === 'login'
              ? 'bg-[#3A6E56] text-white'
              : 'text-[#52635C] hover:text-[#2E3B36] hover:bg-[#F5F7F4]'
          }`}
        >
          <LogIn className="w-4 h-4" />
          <span>Вход</span>
        </button>
        <button
          type="button"
          onClick={() => switchMode('register')}
          className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === 'register'
              ? 'bg-[#3A6E56] text-white'
              : 'text-[#52635C] hover:text-[#2E3B36] hover:bg-[#F5F7F4]'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Регистрация</span>
        </button>
        <button
          type="button"
          onClick={() => switchMode('reset')}
          className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            mode === 'reset'
              ? 'bg-[#3A6E56] text-white'
              : 'text-[#52635C] hover:text-[#2E3B36] hover:bg-[#F5F7F4]'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Пароль</span>
        </button>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5">
          <h1 className="font-display text-2xl font-bold text-[#2E3B36]">{titleMeta.heading}</h1>
          <p className="text-sm text-[#52635C] leading-relaxed">{titleMeta.subtitle}</p>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FDF2EE] border border-[#E5BFB0] text-sm text-[#8F4F39]"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F0F6EC] border border-[#C6DAA7] text-sm text-[#4E6D35]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* [7.2] LOGIN */}
        {mode === 'login' && (
          <div className="space-y-5">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="block text-sm font-medium text-[#2E3B36]">
                  Электронная почта (email)
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ivanov@school.ru"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:outline-none focus:bg-white focus:border-[#4F8A6E]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-sm font-medium text-[#2E3B36]">
                    Пароль
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-xs text-[#3A6E56] hover:underline cursor-pointer"
                  >
                    Забыли пароль?
                  </button>
                </div>
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:outline-none focus:bg-white focus:border-[#4F8A6E]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#437265] hover:bg-[#365D52] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {loading ? 'Выполняется вход…' : 'Войти'}
              </button>
            </form>

            <div className="pt-4 border-t border-[#DDE3DF] space-y-3">
              <div className="p-4 rounded-xl bg-[#F5F7F4] border border-[#DDE3DF] space-y-2.5">
                <div className="text-xs font-medium text-[#2E3B36]">Быстрый просмотр личного кабинета</div>
                <p className="text-xs text-[#52635C] leading-relaxed">
                  Войдите в демонстрационный профиль ученика (с уже пройденными темами, решёнными заданиями и
                  сохранёнными реакциями) в один клик.
                </p>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleDemoLogin}
                  className="w-full py-2 px-3.5 rounded-xl bg-white border border-[#4F8A6E] text-[#3A6E56] hover:bg-[#EBF3EE] text-sm font-medium transition-colors cursor-pointer"
                >
                  Войти как демо-ученик
                </button>
              </div>
            </div>
          </div>
        )}

        {/* [7.1] REGISTRATION */}
        {mode === 'register' && !pendingActivation && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="reg-fullname" className="block text-sm font-medium text-[#2E3B36]">
                ФИО
              </label>
              <input
                id="reg-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Иванов Алексей Сергеевич"
                className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:outline-none focus:bg-white focus:border-[#4F8A6E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="reg-email" className="block text-sm font-medium text-[#2E3B36]">
                  Электронная почта (email)
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@example.ru"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:outline-none focus:bg-white focus:border-[#4F8A6E]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reg-role" className="block text-sm font-medium text-[#2E3B36]">
                  Роль
                </label>
                <select
                  id="reg-role"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:outline-none focus:bg-white focus:border-[#4F8A6E]"
                >
                  <option value="student">Ученик / Студент СПО</option>
                  <option value="teacher">Преподаватель</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="reg-password" className="block text-sm font-medium text-[#2E3B36]">
                  Пароль (от 6 символов)
                </label>
                <input
                  id="reg-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:outline-none focus:bg-white focus:border-[#4F8A6E]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reg-confirm" className="block text-sm font-medium text-[#2E3B36]">
                  Повторите пароль
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  placeholder="Повторите пароль"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:outline-none focus:bg-white focus:border-[#4F8A6E]"
                />
              </div>
            </div>

            {/* Anti-spam Captcha */}
            <div className="p-4 rounded-xl bg-[#F5F7F4] border border-[#DDE3DF] space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="reg-captcha" className="text-sm font-medium text-[#2E3B36]">
                  Защита от автоматической регистрации: сколько будет{' '}
                  <span className="font-mono font-bold text-[#3A6E56]">
                    {captcha.a} + {captcha.b}
                  </span>
                  ?
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCaptcha(generateCaptcha());
                    setCaptchaAnswer('');
                  }}
                  title="Обновить пример"
                  className="p-1.5 rounded-lg text-[#52635C] hover:text-[#2E3B36] hover:bg-white cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <input
                id="reg-captcha"
                type="number"
                required
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                placeholder="Введите число"
                className="w-36 px-3 py-2 text-sm font-mono bg-white border border-[#DDE3DF] rounded-lg text-[#2E3B36] focus:outline-none focus:border-[#4F8A6E]"
              />
            </div>

            {/* 152-FZ Consent Checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-[#52635C] leading-relaxed cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded border-[#DDE3DF] text-[#3A6E56] focus:ring-[#4F8A6E]"
              />
              <span>
                Я даю согласие на обработку персональных данных (ФИО и email) в соответствии с требованиями{' '}
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'privacy' })}
                  className="text-[#3A6E56] underline underline-offset-2 hover:text-[#2F5B47] cursor-pointer"
                >
                  Политики обработки персональных данных (152-ФЗ)
                </button>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#437265] hover:bg-[#365D52] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {loading ? 'Создание аккаунта…' : 'Зарегистрироваться'}
            </button>
          </form>
        )}

        {/* Email Activation Step after Registration */}
        {mode === 'register' && pendingActivation && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#F5F7F4] border border-[#DDE3DF] space-y-3">
              <div className="flex items-center gap-2 text-[#3A6E56] font-semibold text-sm">
                <MailCheck className="w-5 h-5" />
                <span>Подтверждение адреса электронной почты</span>
              </div>
              <p className="text-sm text-[#2E3B36] leading-relaxed">
                Здравствуйте, <strong>{pendingActivation.fullName}</strong>! На адрес{' '}
                <span className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-[#DDE3DF]">
                  {pendingActivation.email}
                </span>{' '}
                сформирована ссылка активации аккаунта.
              </p>
              <p className="text-xs text-[#52635C] leading-relaxed">
                В демонстрационной среде письмо отображается прямо здесь, чтобы вы могли сразу завершить активацию и
                перейти в личный кабинет.
              </p>
              <button
                type="button"
                disabled={loading}
                onClick={handleActivateAccount}
                className="w-full py-2.5 px-4 rounded-xl bg-[#3A6E56] hover:bg-[#2F5B47] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {loading ? 'Активация…' : 'Подтвердить email и активировать аккаунт'}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setPendingActivation(null)}
              className="text-xs text-[#52635C] hover:text-[#2E3B36] underline cursor-pointer"
            >
              Вернуться к форме регистрации
            </button>
          </div>
        )}

        {/* [7.3] PASSWORD RECOVERY */}
        {mode === 'reset' && !resetDone && (
          <div className="space-y-5">
            {!resetEmailSent && !resetToken ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="reset-email" className="block text-sm font-medium text-[#2E3B36]">
                    Email аккаунта
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="student@chem-edu.ru"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:outline-none focus:bg-white focus:border-[#4F8A6E]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#437265] hover:bg-[#365D52] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  {loading ? 'Отправка запроса…' : 'Отправить ссылку для восстановления'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-4">
                {resetToken ? (
                  <>
                    <div className="p-3.5 rounded-xl bg-[#F5F7F4] border border-[#DDE3DF] text-xs text-[#52635C]">
                      Ссылка восстановления подтверждена. Задайте новый пароль (не менее 6 символов).
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="new-pass" className="block text-sm font-medium text-[#2E3B36]">
                        Новый пароль
                      </label>
                      <input
                        id="new-pass"
                        type="password"
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:outline-none focus:bg-white focus:border-[#4F8A6E]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="new-pass-confirm" className="block text-sm font-medium text-[#2E3B36]">
                        Повторите новый пароль
                      </label>
                      <input
                        id="new-pass-confirm"
                        type="password"
                        required
                        minLength={6}
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl text-[#2E3B36] focus:outline-none focus:bg-white focus:border-[#4F8A6E]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#3A6E56] hover:bg-[#2F5B47] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
                    >
                      {loading ? 'Сохранение…' : 'Сохранить новый пароль'}
                    </button>
                  </>
                ) : (
                  <div className="text-sm text-[#52635C] space-y-3">
                    <p>
                      Если аккаунт с адресом <span className="font-mono">{resetEmail}</span> зарегистрирован,
                      инструкции по сбросу пароля отправлены.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmailSent(false);
                        setInfoMsg(null);
                      }}
                      className="text-xs text-[#3A6E56] underline cursor-pointer"
                    >
                      Попробовать другой email
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        )}

        {mode === 'reset' && resetDone && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#437265] hover:bg-[#365D52] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Перейти ко входу
            </button>
          </div>
        )}
      </div>

      {/* Security & Privacy Note */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-white border border-[#DDE3DF] text-xs text-[#52635C]">
        <ShieldCheck className="w-4 h-4 text-[#3A6E56] shrink-0 mt-0.5" />
        <span>
          Пароли хранятся в хэшированном виде с индивидуальной солью. Учебные материалы, 3D-модели и таблицы доступны
          без регистрации; личный кабинет нужен только для сохранения прогресса и избранных реакций.
        </span>
      </div>
    </div>
  );
};
