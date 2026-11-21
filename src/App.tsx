import React, { useCallback, useMemo, useState } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import type {
  AppRoute,
  Molecule3D,
  ReactionData,
  TaskAttempt,
  UserProfile,
} from './types/chemistry';
import { getTopicById } from './data/topics';
import { getReactionById } from './data/reactions';
import { getMoleculeById } from './data/molecules';
import { portalApi } from './services/portalApi';
import { Layout, type BreadcrumbItem } from './components/Layout';
import { HomeView } from './components/HomeView';
import { SectionView } from './components/SectionView';
import { TopicDetailView } from './components/TopicDetailView';
import { TasksView } from './components/TasksView';
import { TablesView } from './components/TablesView';
import { ReferenceView } from './components/ReferenceView';
import { ConstructorView } from './components/ConstructorView';
import { ProfileView } from './components/ProfileView';
import { AuthView } from './components/AuthView';
import { GlobalSearchView, NotFoundView, PrivacyPolicyView } from './components/UtilityViews';

interface ToastState {
  text: string;
  tone: 'success' | 'info' | 'error';
  actionLabel?: string;
  actionRoute?: AppRoute;
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>({ page: 'home' });
  // Session token kept strictly in React memory (never persisted to localStorage)
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((next: ToastState) => {
    setToast(next);
  }, []);

  const handleNavigate = useCallback((nextRoute: AppRoute) => {
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAuthSuccess = useCallback(
    (profile: UserProfile, token: string, notice?: string) => {
      setUser(profile);
      setAuthToken(token);
      setRoute({ page: 'profile' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (notice) {
        showToast({ text: notice, tone: 'success' });
      }
    },
    [showToast],
  );

  const handleLogout = useCallback(async () => {
    const currentToken = authToken;
    setAuthToken(null);
    setUser(null);
    setRoute({ page: 'home' });
    showToast({ text: 'Вы вышли из личного кабинета.', tone: 'info' });
    if (currentToken) {
      await portalApi.logout(currentToken);
    }
  }, [authToken, showToast]);

  const handleToggleTopicComplete = useCallback(
    async (topicId: string) => {
      if (!authToken || !user) {
        showToast({
          text: 'Чтобы отмечать пройденные темы и отслеживать прогресс, войдите в личный кабинет.',
          tone: 'info',
          actionLabel: 'Войти',
          actionRoute: { page: 'auth', mode: 'login' },
        });
        return;
      }
      const res = await portalApi.toggleTopic(authToken, topicId);
      if (res.ok && res.data.user) {
        const isNowDone = res.data.user.completedTopicIds.includes(topicId);
        setUser(res.data.user);
        showToast({
          text: isNowDone ? 'Тема отмечена как пройденная.' : 'Отметка о прохождении темы снята.',
          tone: 'success',
        });
      } else {
        showToast({ text: 'Не удалось обновить статус темы.', tone: 'error' });
      }
    },
    [authToken, user, showToast],
  );

  const handleRecordAttempt = useCallback(
    async (attempt: Omit<TaskAttempt, 'id' | 'timestamp'>) => {
      if (!authToken || !user) {
        return;
      }
      const res = await portalApi.recordAttempt(authToken, attempt);
      if (res.ok && res.data.user) {
        setUser(res.data.user);
      }
    },
    [authToken, user],
  );

  const handleToggleSaveReaction = useCallback(
    async (rx: ReactionData) => {
      if (!authToken || !user) {
        showToast({
          text: 'Чтобы сохранять реакции в профиль, войдите или создайте аккаунт.',
          tone: 'info',
          actionLabel: 'Войти',
          actionRoute: { page: 'auth', mode: 'login' },
        });
        return;
      }
      const res = await portalApi.toggleReaction(authToken, {
        reactionId: rx.id,
        equation: rx.equation,
        productName: rx.productName,
      });
      if (res.ok && res.data.user) {
        const saved = res.data.user.savedReactions.some((r) => r.reactionId === rx.id);
        setUser(res.data.user);
        showToast({
          text: saved ? 'Реакция сохранена в личном кабинете.' : 'Реакция удалена из сохранённых.',
          tone: 'success',
        });
      } else {
        showToast({ text: 'Не удалось сохранить реакцию.', tone: 'error' });
      }
    },
    [authToken, user, showToast],
  );

  const handleToggleSaveMolecule = useCallback(
    async (mol: Molecule3D) => {
      if (!authToken || !user) {
        showToast({
          text: 'Чтобы сохранять 3D-молекулы в профиль, войдите в личный кабинет.',
          tone: 'info',
          actionLabel: 'Войти',
          actionRoute: { page: 'auth', mode: 'login' },
        });
        return;
      }
      const res = await portalApi.toggleMolecule(authToken, {
        moleculeId: mol.id,
        name: mol.name,
        formula: mol.formula,
      });
      if (res.ok && res.data.user) {
        const saved = res.data.user.savedMolecules.some((m) => m.moleculeId === mol.id);
        setUser(res.data.user);
        showToast({
          text: saved ? `Молекула «${mol.name}» сохранена в профиле.` : `Молекула «${mol.name}» удалена из профиля.`,
          tone: 'success',
        });
      } else {
        showToast({ text: 'Не удалось сохранить молекулу.', tone: 'error' });
      }
    },
    [authToken, user, showToast],
  );

  const handleRemoveReactionById = useCallback(
    (reactionId: string) => {
      const rx = getReactionById(reactionId);
      const savedEntry = user?.savedReactions.find((r) => r.reactionId === reactionId);
      if (rx) {
        void handleToggleSaveReaction(rx);
      } else if (savedEntry) {
        void handleToggleSaveReaction({
          id: savedEntry.reactionId,
          equation: savedEntry.equation,
          productName: savedEntry.productName,
          section: 'organic',
          level: 'base',
          reactionType: '',
          startFormula: '',
          startName: '',
          reagent: '',
          reagentName: '',
          condition: '',
          productFormula: '',
          structuralProduct: '',
          productMoleculeId: 'methane',
          topicId: 'org-base-alkanes',
          summary: '',
          steps: [],
        });
      }
    },
    [user, handleToggleSaveReaction],
  );

  const handleRemoveMoleculeById = useCallback(
    (moleculeId: string) => {
      const mol = getMoleculeById(moleculeId);
      const savedEntry = user?.savedMolecules.find((m) => m.moleculeId === moleculeId);
      if (mol) {
        void handleToggleSaveMolecule(mol);
      } else if (savedEntry) {
        void handleToggleSaveMolecule({
          id: savedEntry.moleculeId,
          name: savedEntry.name,
          formula: savedEntry.formula,
          smiles: '',
          section: 'organic',
          className: '',
          molarMass: 0,
          geometry: '',
          description: '',
          structuralDisplay: '',
          atoms: [],
          bonds: [],
        });
      }
    },
    [user, handleToggleSaveMolecule],
  );

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [{ label: 'Главная', route: { page: 'home' } }];

    if (route.page === 'home') {
      return [];
    }
    if (route.page === 'section') {
      items.push({
        label: route.section === 'organic' ? 'Органическая химия' : 'Неорганическая химия',
      });
      return items;
    }
    if (route.page === 'topic') {
      const topic = getTopicById(route.topicId);
      items.push({
        label: route.section === 'organic' ? 'Органическая химия' : 'Неорганическая химия',
        route: { page: 'section', section: route.section, level: route.level },
      });
      items.push({ label: topic?.title || 'Тема' });
      return items;
    }
    if (route.page === 'tasks') {
      items.push({ label: 'Задания' });
      return items;
    }
    if (route.page === 'tables') {
      items.push({ label: 'Таблицы' });
      return items;
    }
    if (route.page === 'reference') {
      items.push({ label: 'Справочник и глоссарий' });
      return items;
    }
    if (route.page === 'constructor') {
      items.push({ label: 'Конструктор реакций' });
      return items;
    }
    if (route.page === 'profile') {
      items.push({ label: 'Личный кабинет' });
      return items;
    }
    if (route.page === 'auth') {
      items.push({
        label:
          route.mode === 'register'
            ? 'Регистрация'
            : route.mode === 'reset'
              ? 'Восстановление пароля'
              : 'Вход',
      });
      return items;
    }
    if (route.page === 'search') {
      items.push({ label: `Поиск: ${route.query}` });
      return items;
    }
    if (route.page === 'privacy') {
      items.push({ label: 'Политика обработки ПДн (152-ФЗ)' });
      return items;
    }
    items.push({ label: 'Страница не найдена' });
    return items;
  }, [route]);

  const renderPage = () => {
    switch (route.page) {
      case 'home':
        return <HomeView user={user} onNavigate={handleNavigate} />;

      case 'section':
        return (
          <SectionView
            section={route.section}
            level={route.level}
            user={user}
            onNavigate={handleNavigate}
          />
        );

      case 'topic': {
        const topic = getTopicById(route.topicId);
        if (!topic) {
          return <NotFoundView onNavigate={handleNavigate} />;
        }
        return (
          <TopicDetailView
            key={`${topic.id}-${route.level}-${route.tab || 'theory'}`}
            topic={topic}
            level={route.level}
            initialTab={route.tab}
            user={user}
            onNavigate={handleNavigate}
            onToggleTopicComplete={handleToggleTopicComplete}
            onToggleSaveMolecule={handleToggleSaveMolecule}
          />
        );
      }

      case 'tasks':
        return (
          <TasksView
            key={`${route.section || 'all'}-${route.topicId || 'all'}-${route.level || 'all'}-${route.type || 'all'}`}
            initialSection={route.section}
            initialTopicId={route.topicId}
            initialLevel={route.level}
            initialType={route.type}
            user={user}
            onRecordAttempt={handleRecordAttempt}
            onToggleSaveMolecule={handleToggleSaveMolecule}
          />
        );

      case 'tables':
        return (
          <TablesView
            key={`${route.tab || 'periodic'}-${route.subTab || 'solubility'}`}
            initialTab={route.tab}
            initialSubTab={route.subTab}
            onNavigate={handleNavigate}
          />
        );

      case 'reference':
        return <ReferenceView initialAnchor={route.anchor} onNavigate={handleNavigate} />;

      case 'constructor':
        return (
          <ConstructorView
            key={route.reactionId || 'default-constructor'}
            initialReactionId={route.reactionId}
            user={user}
            onToggleSaveReaction={handleToggleSaveReaction}
            onToggleSaveMolecule={handleToggleSaveMolecule}
          />
        );

      case 'profile':
        if (!user) {
          return (
            <AuthView
              mode="login"
              onNavigate={handleNavigate}
              onAuthSuccess={handleAuthSuccess}
            />
          );
        }
        return (
          <ProfileView
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onRemoveReaction={handleRemoveReactionById}
            onRemoveMolecule={handleRemoveMoleculeById}
          />
        );

      case 'auth':
        return (
          <AuthView
            key={`${route.mode}-${route.token || ''}`}
            mode={route.mode}
            initialToken={route.token}
            onNavigate={handleNavigate}
            onAuthSuccess={handleAuthSuccess}
          />
        );

      case 'search':
        return <GlobalSearchView query={route.query} onNavigate={handleNavigate} />;

      case 'privacy':
        return <PrivacyPolicyView onNavigate={handleNavigate} />;

      case 'notfound':
      default:
        return <NotFoundView onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout route={route} user={user} breadcrumbs={breadcrumbs} onNavigate={handleNavigate}>
      {toast && (
        <div
          role="status"
          className={`mb-5 flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm ${
            toast.tone === 'success'
              ? 'bg-[#F0F6EC] border-[#C6DAA7] text-[#4E6D35]'
              : toast.tone === 'error'
                ? 'bg-[#FDF2EE] border-[#E5BFB0] text-[#8F4F39]'
                : 'bg-white border-[#DDE3DF] text-[#2E3B36]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.tone === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <Info className="w-4 h-4 shrink-0 text-[#44658A]" />
            )}
            <span>{toast.text}</span>
          </div>
          <div className="flex items-center gap-2">
            {toast.actionLabel && toast.actionRoute && (
              <button
                type="button"
                onClick={() => {
                  const dest = toast.actionRoute!;
                  setToast(null);
                  handleNavigate(dest);
                }}
                className="px-3 py-1 rounded-lg bg-[#437265] hover:bg-[#365D52] text-white text-xs font-medium cursor-pointer"
              >
                {toast.actionLabel}
              </button>
            )}
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Закрыть уведомление"
              className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {renderPage()}
    </Layout>
  );
}
