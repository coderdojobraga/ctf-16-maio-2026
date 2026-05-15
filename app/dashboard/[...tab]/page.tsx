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
import DirectoryFeedback from '@/components/DirectoryFeedback';

function AccessDenied({ tab }: { tab: string }) {
  const msg = { title: '403 — Acesso negado', body: 'Não tens permissão para aceder a esta página.' };
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-12">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-sm w-full text-center shadow-sm space-y-4">
        <Lock className="w-10 h-10 text-gray-300 mx-auto" />
        <p className="font-mono text-sm text-gray-400">{msg.title}</p>
        <p className="text-gray-600 text-sm">{msg.body}</p>
      </div>
    </div>
  );
}

export default function TabPage({ params }: { params: Promise<{ tab: string | string[] }> }) {
  const resolvedParams = use(params);
  // Transforma o array do [...tab] numa string junta (ex: "emkors/inbox")
  const tabArray = Array.isArray(resolvedParams.tab) ? resolvedParams.tab : [resolvedParams.tab];
  const tab = tabArray.join('/');

  const game = useGame();
  const { toast } = useToast();

  useEffect(() => {
    // Quando descobrem a diretoria dos Mentores, passam para o Nível 3
    if (tab === 'mentores' && !game.unlockedTabs.includes('mentores') && game.currentLevel >= 2) {
      game.setLevel(3); // <--- Faltava esta linha!
      game.unlockTab('mentores');
      toast('unlock', 'Secção encontrada', 'Acedeste à página de mentores.');
    }
    
    // Nível 4 desbloqueado por descobrir o URL /emkors/inbox
    if (tab === 'emkors/inbox' && !game.unlockedTabs.includes('emkors/inbox') && game.currentLevel >= 3) {
      game.setLevel(4);
      game.unlockTab('emkors/inbox');
      toast('unlock', 'Inbox descoberta', 'Acedeste à caixa de correio secreta.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const LEVEL_REQUIRED: Record<string, number> = {
    blog:           2,
    mentores:       2,
    'emkors/inbox': 4,
    champion_panel: 5,
    dojobot:        6,
  };

  const required = LEVEL_REQUIRED[tab];
  const isLocked = required != null && game.currentLevel < required && !game.unlockedTabs.includes(tab);
  const bypassLock = tab === 'emkors/inbox' && game.currentLevel >= 3;

  if (isLocked && !bypassLock) return <AccessDenied tab={tab} />;

  if (tab.startsWith('blog/')) {
    const postId = tab.slice(5);
    return <BlogTab postId={postId} />;
  }

  switch (tab) {
    case 'login':          return <LoginTab />;
    case 'blog':           return <BlogTab />;
    case 'mentores':       return <SecretMentorsPage />;
    case 'emkors/inbox':   return <InboxTab />;
    case 'champion_panel': return <ChampionPanel />;
    case 'dojobot':        return <UnlockedChampion />;
    
    case 'jogos': return <DirectoryFeedback type="test" title="Boa!" message="Pasta de jogos." />;
    case 'imagens': return <DirectoryFeedback type="test" title="Excelente!" message="Diretoria de imagens." />;
    case 'six-seven': return <DirectoryFeedback type="false" title="SIX-SEVENNNNNN!" message="Descobriste o sítio do six-seven, mas isto é só uma piada, não te leva a lado nenhum... (Se estás a fazer o gesto com as mãos deves ter 5 anos)" />;
    case 'dojo': return <DirectoryFeedback type="false" title="Quase!" message="Não é esta a que procuras." />;
    case 'programar': return <DirectoryFeedback type="false" title="Tenta outra vez" message="Não é este o caminho." />;

    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-full p-8 text-center">
          <p className="font-mono text-sm text-gray-400">404 — Diretoria não encontrada</p>
        </div>
      );
  }
}