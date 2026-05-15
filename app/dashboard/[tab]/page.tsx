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
import DirectoryFeedback from '@/components/DirectoryFeedback'; // Importa o novo componente

function AccessDenied({ tab }: { tab: string }) {
  const ACCESS_MESSAGES: Record<string, { title: string; body: string }> = {
    blog:           { title: '403 — Acesso negado', body: 'Precisas de ter uma conta activa para aceder ao blog.' },
    mentores:       { title: '403 — Acesso negado', body: 'Esta secção é restrita a membros autenticados.' },
    emails:         { title: '403 — Sem permissão', body: 'A tua conta não tem acesso à caixa de entrada.' },
    champion_panel: { title: '403 — Área restrita', body: 'Esta área é reservada a utilizadores com role champion.' },
  };

  const msg = ACCESS_MESSAGES[tab] ?? { title: '403 — Acesso negado', body: 'Não tens permissão para aceder a esta página.' };
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

export default function TabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = use(params);
  const game = useGame();
  const { toast } = useToast();

  useEffect(() => {
    if (tab === 'mentores' && !game.unlockedTabs.includes('mentores') && game.currentLevel >= 2) {
      game.unlockTab('mentores');
      toast('unlock', 'Secção encontrada', 'Acedeste à página de mentores.');
    }
  }, [tab, game, toast]);

  const LEVEL_REQUIRED: Record<string, number> = {
    blog:           2,
    mentores:       2,
    emails:         4,
    champion_panel: 5,
    dojobot:        6,
  };

  const required = LEVEL_REQUIRED[tab];
  const isLocked = required != null && game.currentLevel < required && !game.unlockedTabs.includes(tab);

  if (isLocked) return <AccessDenied tab={tab} />;

  switch (tab) {
    case 'login':          return <LoginTab />;
    case 'blog':           return <BlogTab />;
    case 'mentores':       return <SecretMentorsPage />;
    case 'emails':         return <InboxTab />;
    case 'champion_panel': return <ChampionPanel />;
    case 'dojobot':        return <UnlockedChampion />;
    
    // Novas rotas de teste
    case 'jogos': return (
      <DirectoryFeedback 
        type="test" 
        title="Boa, conseguiste mudar a diretoria!" 
        message="Acabaste de descobrir a pasta de jogos." 
        explanation="Isto chama-se 'URL Manipulation'. Às vezes, os programadores esquecem-se de proteger pastas que não deviam estar públicas."
      />
    );
    case 'imagens': return (
      <DirectoryFeedback 
        type="test" 
        title="Excelente!" 
        message="Encontraste a diretoria de imagens do servidor." 
        explanation="Mudar o URL manualmente é uma das formas mais simples de explorar um site à procura de ficheiros ou pastas que não aparecem nos menus."
      />
    );

    // Rotas falsas (Dicas/Distração)
    case 'six-seven': return (
      <DirectoryFeedback 
        type="false" 
        title="SIX-SEVENNNNNNNNNNNNNNN" 
        message="Mas esta diretoria não te vai levar a lado nenhum, volta a tentar! Mas parabéns por tentares o 6-7...parece que tens 5 anos" 
      />
    );
    case 'dojo': return (
      <DirectoryFeedback 
        type="false" 
        title="Quase!" 
        message="Esta pasta é só para Ninjas... ah espera, tu és um Ninja! Mas não é esta a que procuras." 
      />
    );
    case 'programar': return (
      <DirectoryFeedback 
        type="false" 
        title="Tenta outra vez" 
        message="Programar é a alma do CoderDojo, mas não é o caminho para o segredo dos mentores." 
      />
    );

    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-full p-8 text-center">
          <p className="font-mono text-sm text-gray-400">404 — Diretoria não encontrada</p>
          <p className="text-gray-500 text-sm mt-2">Esta pasta não existe no servidor.</p>
        </div>
      );
  }
}