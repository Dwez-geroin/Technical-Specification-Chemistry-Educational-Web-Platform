import React, { useState } from 'react';
import { ChevronRight, Menu, Search, User, X } from 'lucide-react';
import type { AppRoute, UserProfile } from '../types/chemistry';

export interface BreadcrumbItem {
  label: string;
  route?: AppRoute;
}

interface LayoutProps {
  route: AppRoute;
  user: UserProfile | null;
  breadcrumbs: BreadcrumbItem[];
  onNavigate: (route: AppRoute) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ route, user, breadcrumbs, onNavigate, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    onNavigate({ page: 'search', query: q });
    setMobileMenuOpen(false);
  };

  const navItems: { label: string; active: boolean; route: AppRoute }[] = [
    {
      label: 'Разделы',
      active: route.page === 'section' || route.page === 'topic',
      route: { page: 'section', section: 'organic', level: 'base' },
    },
    {
      label: 'Задания',
      active: route.page === 'tasks',
      route: { page: 'tasks' },
    },
    {
      label: 'Таблицы',
      active: route.page === 'tables',
      route: { page: 'tables', tab: 'periodic' },
    },
    {
      label: 'Справочник',
      active: route.page === 'reference',
      route: { page: 'reference' },
    },
    {
      label: 'Конструктор',
      active: route.page === 'constructor',
      route: { page: 'constructor' },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F4] text-[#2E3B36]">
      {/* Strict 3-zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#DDE3DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => {
              onNavigate({ page: 'home' });
              setMobileMenuOpen(false);
            }}
            className="font-display text-lg font-bold tracking-tight text-[#2E3B36] hover:text-[#3A6E56] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Химия · Портал
          </button>

          {/* Zone 2: 5 single-line nav links */}
          <nav aria-label="Главное меню" className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate(item.route)}
                className={`text-sm font-medium py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  item.active
                    ? 'text-[#3A6E56] border-[#4F8A6E]'
                    : 'text-[#52635C] border-transparent hover:text-[#2E3B36] hover:border-[#C2CEC8]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action (Profile / Sign In) + Mobile toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onNavigate(user ? { page: 'profile' } : { page: 'auth', mode: 'login' });
                setMobileMenuOpen(false);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                route.page === 'profile' || route.page === 'auth'
                  ? 'bg-[#355D52] text-white'
                  : 'bg-[#437265] text-white hover:bg-[#355D52]'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="max-w-[140px] truncate">{user ? user.fullName.split(' ')[0] : 'Профиль'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-lg border border-[#DDE3DF] text-[#2E3B36] hover:bg-[#EDF1EC] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#DDE3DF] bg-white px-4 py-3 space-y-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <label htmlFor="mobile-global-search" className="sr-only">
                Поиск по темам, формулам и терминам
              </label>
              <input
                id="mobile-global-search"
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Поиск тем, формул, терминов..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#F5F7F4] border border-[#DDE3DF] rounded-lg text-[#2E3B36] placeholder:text-[#6B7C75]"
              />
              <Search className="w-4 h-4 text-[#52635C] absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    onNavigate(item.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 text-left text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    item.active ? 'bg-[#EBF3EE] text-[#3A6E56]' : 'text-[#2E3B36] hover:bg-[#F5F7F4]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Breadcrumbs + Global Search Utility Strip (shown on interior screens) */}
      {route.page !== 'home' && (
        <div className="bg-[#FAFBF9] border-b border-[#DDE3DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Хлебные крошки" className="flex items-center flex-wrap gap-1 text-sm text-[#52635C]">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={`${crumb.label}-${idx}`}>
                    {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#8FA199] shrink-0" />}
                    {crumb.route && !isLast ? (
                      <button
                        type="button"
                        onClick={() => onNavigate(crumb.route!)}
                        className="hover:text-[#3A6E56] hover:underline cursor-pointer"
                      >
                        {crumb.label}
                      </button>
                    ) : (
                      <span className="text-[#2E3B36] font-medium">{crumb.label}</span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>

            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative w-72">
              <label htmlFor="desktop-global-search" className="sr-only">
                Глобальный поиск по сайту
              </label>
              <input
                id="desktop-global-search"
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Поиск: H2SO4, алканы, бензол..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-[#DDE3DF] rounded-lg text-[#2E3B36] placeholder:text-[#6B7C75] focus:border-[#4F8A6E]"
              />
              <Search className="w-4 h-4 text-[#52635C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-[#DDE3DF] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-[#52635C]">
          <div>
            <p className="font-display font-semibold text-[#2E3B36]">Образовательный портал «Химия: органика и неорганика»</p>
            <p className="text-xs mt-0.5">Для учащихся 10–11 классов, студентов СПО и преподавателей</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'tables', tab: 'periodic' })}
              className="hover:text-[#3A6E56] cursor-pointer"
            >
              Таблица Менделеева
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'reference', anchor: 'glossary' })}
              className="hover:text-[#3A6E56] cursor-pointer"
            >
              Глоссарий
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'constructor' })}
              className="hover:text-[#3A6E56] cursor-pointer"
            >
              Конструктор реакций
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'privacy' })}
              className="hover:text-[#3A6E56] cursor-pointer"
            >
              Политика персональных данных (152-ФЗ)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
