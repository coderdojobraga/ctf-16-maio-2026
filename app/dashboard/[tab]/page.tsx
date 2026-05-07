'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/components/Toast';

import LoginTab from '@/components/LoginTab';
import BlogTab from '@/components/BlogTab';
import SecretMentorsPage from '@/components/SecretMentorsPage';
import InboxTab from '@/components/InboxTab';
import ChampionPanel from '@/components/ChampionPanel';
import DojoBOT from '@/components/DojoBOT';
import UnlockedChampion from '@/components/UnlockedChampion';

export default function TabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = use(params);
  const game = useGame();
  const router = useRouter();
  const { toast } = useToast();

  // Level 2 mechanic: navigating directly to /mentores via browser URL unlocks it
  useEffect(() => {
    if (tab === 'mentores' && !game.unlockedTabs.includes('mentores') && game.currentLevel >= 2) {
      game.unlockTab('mentores');
      toast('unlock', 'Directório encontrado!', 'Acedeste a uma área secreta do servidor.');
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Guard locked tabs
  const LEVEL_REQUIRED: Record<string, number> = {
    blog:           2,
    mentores:       2,
    emails:         4,
    champion_panel: 5,
    dojabot:        6,
  };

  const required = LEVEL_REQUIRED[tab];
  if (required && game.currentLevel < required && !game.unlockedTabs.includes(tab)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 text-gray-600">
        <p className="text-lg font-mono">404 — Não encontrado</p>
        <p className="text-sm mt-2">Este caminho não existe... ou ainda não desbloqueaste acesso.</p>
        <button onClick={() => router.push('/dashboard/login')} className="mt-4 text-green-400 hover:underline text-sm">
          ← Voltar ao início
        </button>
      </div>
    );
  }

  switch (tab) {
    case 'login':          return <LoginTab />;
    case 'blog':           return <BlogTab />;
    case 'mentores':       return <SecretMentorsPage />;
    case 'emails':         return <InboxTab />;
    case 'champion_panel': return game.currentLevel >= 6 ? <UnlockedChampion /> : <ChampionPanel />;
    case 'dojabot':        return <DojoBOT />;
    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-full p-8 text-gray-600">
          <p className="text-lg font-mono">404 — Página não encontrada</p>
          <button onClick={() => router.push('/dashboard/login')} className="mt-4 text-green-400 hover:underline text-sm">
            ← Voltar
          </button>
        </div>
      );
  }
}
