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
  { tab: 'dojabot',        label: 'DojoBOT',        icon: Bot },
];

const UNLOCK_TOASTS: Record<string, [string, string]> = {
  blog:           ['Bem-vindo!', 'Explora o site à vontade.'],
  mentores:       ['Secção encontrada', 'Acedeste à página de mentores.'],
  emails:         ['Inbox disponível', 'Tens mensagens pendentes.'],
  champion_panel: ['Área Privada', 'Verifica as tuas permissões de acesso.'],
  dojabot:        ['DojoBOT', 'O assistente virtual do CoderDojo está disponível.'],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const game = useGame();
  const { toast } = useToast();

  const activeTab = pathname.split('/').pop() ?? 'login';
  const hasMounted = useRef(false);
  const onLoginPage = activeTab === 'login';

  useEffect(() => {
    if (!game.path) router.replace('/');
  }, [game.path, router]);

  useEffect(() => {
    if (!hasMounted.current) { hasMounted.current = true; return; }
    const tabs = game.unlockedTabs;
    const dest = tabs[tabs.length - 1];
    if (!dest || dest === 'login' || dest === activeTab) return;
    const [t, m] = UNLOCK_TOASTS[dest] ?? ['Nova secção disponível', ''];
    toast('unlock', t, m);
    router.push(`/dashboard/${dest}`);
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
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 shrink-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard/blog')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src="/DojoLogo.svg" alt="CoderDojo Braga" className="h-8 w-auto" />
          </button>

          <div className="flex items-center gap-3">
            {game.credentials?.username && (
              <span className="text-sm text-gray-500 hidden sm:block">
                {game.credentials.username}
              </span>
            )}
            <button
              onClick={game.resetGame}
              title="Sair"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 bg-white border-r border-gray-100 flex flex-col py-4 px-3 gap-1 overflow-y-auto">
          <p className="text-xs text-gray-400 uppercase tracking-widest px-2 mb-2">Portal</p>
          {NAV_ITEMS.map(({ tab, label, icon: Icon }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => router.push(`/dashboard/${tab}`)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium w-full text-left transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                {label}
              </button>
            );
          })}
        </aside>

        {/* Main content */}
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-auto bg-gray-50"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
