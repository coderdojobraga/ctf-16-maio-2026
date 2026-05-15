'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { LogOut, LayoutDashboard, BookOpen, Users, Mail, ShieldCheck, Bot } from 'lucide-react';

const NAV_ITEMS = [
  { tab: 'blog',           label: 'Blog',          icon: BookOpen },
  { tab: 'mentores',       label: 'Mentores',       icon: Users },
  { tab: 'emails',         label: 'Inbox',          icon: Mail },
  { tab: 'champion_panel', label: 'Área Privada',   icon: ShieldCheck },
  { tab: 'dojobot',        label: 'DojoBOT',        icon: Bot },
];

const UNLOCK_TOASTS: Record<string, [string, string]> = {
  blog:           ['Bem-vindo!', 'Explora o site à vontade.'],
  mentores:       ['Secção encontrada', 'Acedeste à página de mentores.'],
  emails:         ['Inbox disponível', 'Tens mensagens pendentes.'],
  champion_panel: ['Área Privada', 'Verifica as tuas permissões de acesso.'],
  dojobot:        ['DojoBOT', 'O assistente virtual do CoderDojo está disponível.'],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const game = useGame();
  const { toast } = useToast();

  const activeTab = pathname.split('/').pop() ?? 'login';
  const prevTabsLength = useRef(game.unlockedTabs.length);
  const onLoginPage = activeTab === 'login';

  useEffect(() => {
    if (!game.path) router.replace('/');
  }, [game.path, router]);

  useEffect(() => {
    const tabs = game.unlockedTabs;
    // Only act when a tab was genuinely just added
    if (tabs.length <= prevTabsLength.current) {
      prevTabsLength.current = tabs.length;
      return;
    }
    prevTabsLength.current = tabs.length;
    const newTab = tabs[tabs.length - 1];
    if (!newTab || newTab === 'login' || newTab === activeTab) return;
    const [t, m] = UNLOCK_TOASTS[newTab] ?? ['Nova secção disponível', ''];
    toast('unlock', t, m);
    router.push(`/dashboard/${newTab}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.unlockedTabs.length]);

  if (onLoginPage) {
    return (
      <div className="flex flex-col h-screen bg-white overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 shrink-0">
          <div className="flex items-center gap-2">
            <img src="/DojoLogo.svg" alt="CoderDojo Braga" className="h-8 w-auto" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Top bar (Permanece para o logótipo e Sair) */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 shrink-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/DojoLogo.svg" alt="CoderDojo Braga" className="h-8 w-auto" />
            <span className="text-xs font-mono text-gray-300 hidden sm:block">| Internal Portal</span>
          </div>

          <div className="flex items-center gap-3">
            {game.credentials?.user && (
              <span className="text-sm text-gray-500 hidden sm:block italic">
                Sessão ativa: {game.credentials.user}
              </span>
            )}
            <button
              onClick={game.resetGame}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Área de Conteúdo - Agora sem Sidebar para ser "seamless" */}
      <div className="flex flex-1 overflow-hidden">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 overflow-y-auto bg-gray-50"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
