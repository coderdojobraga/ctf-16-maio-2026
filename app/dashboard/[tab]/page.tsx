'use client';

import { use, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/components/Toast';
import { Lock } from 'lucide-react';

import LoginTab from '@/components/LoginTab';
import BlogTab from '@/components/BlogTab';
import SecretMentorsPage from '@/components/SecretMentorsPage';
import InboxTab from '@/components/InboxTab';
import ChampionPanel from '@/components/ChampionPanel';
import UnlockedChampion from '@/components/UnlockedChampion';

const ACCESS_MESSAGES: Record<string, { title: string; body: string }> = {
  blog:           { title: '403 — Acesso negado',    body: 'Precisas de ter uma conta activa para aceder ao blog.' },
  mentores:       { title: '403 — Acesso negado',    body: 'Esta secção é restrita a membros autenticados.' },
  emails:         { title: '403 — Sem permissão',    body: 'A tua conta não tem acesso à caixa de entrada. Contacta um mentor.' },
  champion_panel: { title: '403 — Área restrita',    body: 'Esta área é reservada a utilizadores com role champion. Verifica as tuas permissões.' },
  dojobot:        { title: '403 — Acesso negado',    body: 'O DojoBOT está disponível apenas para champions.' },
};

function AccessDenied({ tab }: { tab: string }) {
  const msg = ACCESS_MESSAGES[tab] ?? { title: '403 — Acesso negado', body: 'Não tens permissão para aceder a esta página.' };
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-12">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-sm w-full text-center shadow-sm space-y-4">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6 text-gray-400" />
        </div>
        <p className="font-mono text-sm text-gray-400">{msg.title}</p>
        <p className="text-gray-600 text-sm">{msg.body}</p>
      </div>
    </div>
  );
}

export default function TabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = use(params);
  const game = useGame();
  const { toast } = useToast();

  // Level 2 mechanic: navigating directly to /mentores via browser URL unlocks it
  useEffect(() => {
    if (tab === 'mentores' && !game.unlockedTabs.includes('mentores') && game.currentLevel >= 2) {
      game.unlockTab('mentores');
      toast('unlock', 'Secção encontrada', 'Acedeste à página de mentores.');
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const LEVEL_REQUIRED: Record<string, number> = {
    blog:           2,
    mentores:       2,
    emails:         4,
    champion_panel: 5,
    dojobot:        6,
  };

  const required = LEVEL_REQUIRED[tab];
  const isLocked = required != null && game.currentLevel < required && !game.unlockedTabs.includes(tab);

  switch (tab) {
    case 'login':          return <LoginTab />;
    case 'blog':           return isLocked ? <AccessDenied tab={tab} /> : <BlogTab />;
    case 'mentores':       return isLocked ? <AccessDenied tab={tab} /> : <SecretMentorsPage />;
    case 'emails':         return isLocked ? <AccessDenied tab={tab} /> : <InboxTab />;
    case 'champion_panel': return isLocked ? <AccessDenied tab={tab} /> : <ChampionPanel />;
    case 'dojobot':        return isLocked ? <AccessDenied tab={tab} /> : <UnlockedChampion />;
    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-full p-8">
          <div className="text-center space-y-2">
            <p className="font-mono text-sm text-gray-400">404 — Página não encontrada</p>
            <p className="text-gray-500 text-sm">Esta página não existe.</p>
          </div>
        </div>
      );
  }
}
