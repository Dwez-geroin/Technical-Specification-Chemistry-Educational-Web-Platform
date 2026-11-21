import React from 'react';
import {
  ArrowRight,
  Bookmark,
  Box,
  CheckCircle2,
  FlaskConical,
  LogOut,
  Trash2,
  XCircle,
} from 'lucide-react';
import type { AppRoute, UserProfile } from '../types/chemistry';
import { TOPICS, getTopicById } from '../data/topics';
import { TASKS } from '../data/tasks';
import { getMoleculeById } from '../data/molecules';
import { getReactionById } from '../data/reactions';
import { calculateSectionProgress } from '../utils/chemistryLogic';
import { FormulaText } from './FormulaText';

interface ProfileViewProps {
  user: UserProfile;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
  onRemoveReaction: (reactionId: string) => void;
  onRemoveMolecule: (moleculeId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onNavigate,
  onLogout,
  onRemoveReaction,
  onRemoveMolecule,
}) => {
  const orgProgress = calculateSectionProgress('organic', TOPICS, TASKS, user.completedTopicIds, user.attempts);
  const inorgProgress = calculateSectionProgress('inorganic', TOPICS, TASKS, user.completedTopicIds, user.attempts);

  const totalAttempts = user.attempts.length;
  const correctAttempts = user.attempts.filter((a) => a.correct).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="bg-white border border-[#DDE3DF] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs text-[#52635C]">
            Личный кабинет · {user.role === 'teacher' ? 'Преподаватель' : 'Ученик / Студент'} ·{' '}
            <span className="text-[#4E6D35] font-medium">
              {user.activated ? 'Email подтверждён' : 'Ожидает активации'}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#2E3B36]">{user.fullName}</h1>
          <p className="text-sm text-[#52635C] font-mono">{user.email}</p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#EDF1EC] text-[#2E3B36] rounded-xl hover:bg-[#DCE5DF] transition-colors cursor-pointer self-start sm:self-center"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </div>

      {/* Progress Section: Organic, Inorganic & Overall Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Organic Progress */}
        <div className="bg-white border border-[#DDE3DF] rounded-xl p-5 space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display font-semibold text-base text-[#2E3B36]">Органика</h2>
            <span className="font-mono text-sm font-semibold text-[#3A6E56] tabular-nums">
              {orgProgress.topicPercent}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#EDF1EC] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4F8A6E] rounded-full transition-all"
              style={{ width: `${orgProgress.topicPercent}%` }}
            />
          </div>
          <div className="text-xs text-[#52635C] tabular-nums flex items-center justify-between">
            <span>
              Тем изучено: {orgProgress.completedTopics} / {orgProgress.totalTopics}
            </span>
            <span>
              Заданий: {orgProgress.solvedTasks} / {orgProgress.totalTasks}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'section', section: 'organic', level: 'base' })}
            className="text-xs font-medium text-[#3A6E56] hover:underline cursor-pointer"
          >
            Продолжить органику →
          </button>
        </div>

        {/* Inorganic Progress */}
        <div className="bg-white border border-[#DDE3DF] rounded-xl p-5 space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display font-semibold text-base text-[#2E3B36]">Неорганика</h2>
            <span className="font-mono text-sm font-semibold text-[#44658A] tabular-nums">
              {inorgProgress.topicPercent}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#EDF1EC] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5B7FA6] rounded-full transition-all"
              style={{ width: `${inorgProgress.topicPercent}%` }}
            />
          </div>
          <div className="text-xs text-[#52635C] tabular-nums flex items-center justify-between">
            <span>
              Тем изучено: {inorgProgress.completedTopics} / {inorgProgress.totalTopics}
            </span>
            <span>
              Заданий: {inorgProgress.solvedTasks} / {inorgProgress.totalTasks}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'section', section: 'inorganic', level: 'base' })}
            className="text-xs font-medium text-[#44658A] hover:underline cursor-pointer"
          >
            Продолжить неорганику →
          </button>
        </div>

        {/* Tasks Stats */}
        <div className="bg-white border border-[#DDE3DF] rounded-xl p-5 space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display font-semibold text-base text-[#2E3B36]">Задания</h2>
            <span className="font-mono text-sm font-semibold text-[#4E6D35] tabular-nums">{accuracy}% точность</span>
          </div>
          <div className="w-full h-2.5 bg-[#EDF1EC] rounded-full overflow-hidden">
            <div className="h-full bg-[#7BA05B] rounded-full transition-all" style={{ width: `${accuracy}%` }} />
          </div>
          <div className="text-xs text-[#52635C] tabular-nums flex items-center justify-between">
            <span>Попыток: {totalAttempts}</span>
            <span>Верных: {correctAttempts}</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'tasks' })}
            className="text-xs font-medium text-[#437265] hover:underline cursor-pointer"
          >
            Перейти к тренажёру →
          </button>
        </div>
      </div>

      {/* Results History Table */}
      <section className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-[#2E3B36]">История результатов заданий</h2>
        {user.attempts.length === 0 ? (
          <p className="text-sm text-[#52635C]">
            Вы ещё не решали задания. Перейдите в раздел «Задания», чтобы начать отслеживать прогресс.
          </p>
        ) : (
          <div className="overflow-x-auto chem-scroll">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#F5F7F4] text-left text-xs text-[#52635C]">
                  <th className="border-b border-[#DDE3DF] py-2.5 px-3">Задание</th>
                  <th className="border-b border-[#DDE3DF] py-2.5 px-3">Тема</th>
                  <th className="border-b border-[#DDE3DF] py-2.5 px-3">Ваш ответ</th>
                  <th className="border-b border-[#DDE3DF] py-2.5 px-3">Результат</th>
                  <th className="border-b border-[#DDE3DF] py-2.5 px-3">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DF]">
                {user.attempts.slice(0, 15).map((att) => {
                  const topic = getTopicById(att.topicId);
                  return (
                    <tr key={att.id} className="hover:bg-[#FAFBF9]">
                      <td className="py-2.5 px-3 font-medium text-[#2E3B36]">{att.taskTitle}</td>
                      <td className="py-2.5 px-3 text-xs text-[#52635C]">{topic?.title || att.topicId}</td>
                      <td className="py-2.5 px-3 font-mono text-xs text-[#2E3B36]">{att.userAnswer}</td>
                      <td className="py-2.5 px-3">
                        {att.correct ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#4E6D35]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Верно
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#8F4F39]">
                            <XCircle className="w-3.5 h-3.5" /> Ошибка
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-xs text-[#52635C] tabular-nums">
                        {new Date(att.timestamp).toLocaleDateString('ru-RU')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Saved Reactions & Saved Molecules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Reactions */}
        <section className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-[#2E3B36] inline-flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[#437265]" />
              Сохранённые реакции ({user.savedReactions.length})
            </h2>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'constructor' })}
              className="text-xs font-medium text-[#3A6E56] hover:underline cursor-pointer"
            >
              Конструктор →
            </button>
          </div>

          {user.savedReactions.length === 0 ? (
            <p className="text-sm text-[#52635C]">
              Сохраняйте важные уравнения из Конструктора реакций для быстрого повторения.
            </p>
          ) : (
            <div className="space-y-2.5">
              {user.savedReactions.map((item) => {
                const exists = Boolean(getReactionById(item.reactionId));
                return (
                  <div
                    key={item.reactionId}
                    className="p-3.5 bg-[#FAFBF9] border border-[#DDE3DF] rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#2E3B36] truncate">
                        <FormulaText text={item.equation} />
                      </div>
                      <div className="text-xs text-[#52635C] truncate">{item.productName}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {exists && (
                        <button
                          type="button"
                          onClick={() => onNavigate({ page: 'constructor', reactionId: item.reactionId })}
                          aria-label={`Открыть реакцию ${item.productName}`}
                          className="p-1.5 rounded-lg border border-[#DDE3DF] bg-white text-[#2E3B36] hover:border-[#4F8A6E] cursor-pointer"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onRemoveReaction(item.reactionId)}
                        aria-label={`Удалить реакцию ${item.productName}`}
                        className="p-1.5 rounded-lg border border-[#DDE3DF] bg-white text-[#8F4F39] hover:bg-[#F9EFEA] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Saved Molecules */}
        <section className="bg-white border border-[#DDE3DF] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-[#2E3B36] inline-flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#4F8A6E]" />
              Сохранённые 3D-молекулы ({user.savedMolecules.length})
            </h2>
          </div>

          {user.savedMolecules.length === 0 ? (
            <p className="text-sm text-[#52635C]">
              Отмечайте закладкой молекулы в 3D-просмотрщике, чтобы быстро возвращаться к их строению.
            </p>
          ) : (
            <div className="space-y-2.5">
              {user.savedMolecules.map((item) => {
                const mol = getMoleculeById(item.moleculeId);
                return (
                  <div
                    key={item.moleculeId}
                    className="p-3.5 bg-[#FAFBF9] border border-[#DDE3DF] rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#2E3B36]">
                        {item.name} · <FormulaText text={item.formula} className="text-[#3A6E56]" />
                      </div>
                      {mol && <div className="text-xs text-[#52635C]">{mol.geometry}</div>}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {mol && (
                        <button
                          type="button"
                          onClick={() => {
                            const matchingTopic = TOPICS.find((t) => t.moleculeIds.includes(mol.id));
                            if (matchingTopic) {
                              onNavigate({
                                page: 'topic',
                                section: matchingTopic.section,
                                topicId: matchingTopic.id,
                                level: matchingTopic.level,
                                tab: 'examples',
                              });
                            }
                          }}
                          aria-label={`Открыть 3D-модель ${item.name}`}
                          className="p-1.5 rounded-lg border border-[#DDE3DF] bg-white text-[#2E3B36] hover:border-[#4F8A6E] cursor-pointer"
                        >
                          <Box className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onRemoveMolecule(item.moleculeId)}
                        aria-label={`Удалить молекулу ${item.name}`}
                        className="p-1.5 rounded-lg border border-[#DDE3DF] bg-white text-[#8F4F39] hover:bg-[#F9EFEA] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
