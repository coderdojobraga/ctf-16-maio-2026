'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { CheckCircle2, Circle, RotateCcw } from 'lucide-react';

const STEPS = [
  { tab: 'login',          label: 'Autenticação',       level: 1 },
  { tab: 'blog',           label: 'Exploração Web',     level: 2 },
  { tab: 'mentores',       label: 'OSINT',              level: 3 },
  { tab: 'emails',         label: 'Phishing',           level: 4 },
  { tab: 'champion_panel', label: 'Escalada de Acesso', level: 5 },
  { tab: 'dojabot',        label: 'Eng. Social',        level: 6 },
];

const UNLOCK_TOASTS: Record<string, [string, string]> = {
  blog:           ['Nível 2 desbloqueado', 'Explora o blog para encontrar o próximo passo.'],
  mentores:       ['Nível 3 desbloqueado', 'Acedeste a uma página secreta!'],
  emails:         ['Nível 4 desbloqueado', 'Analisa os emails com cuidado.'],
  champion_panel: ['Nível 5 desbloqueado', 'Precisas de elevar o teu acesso.'],
  dojabot:        ['Nível 6 desbloqueado', 'Conversa com a IA e extrai o código.'],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const game = useGame();
  const { toast } = useToast();

  const activeTab = pathname.split('/').pop() ?? 'login';

  useEffect(() => {
    if (!game.path) router.replace('/');
  }, [game.path, router]);

  useEffect(() => {
    const tabs = game.unlockedTabs;
    const dest = tabs[tabs.length - 1];
    if (!dest || dest === 'login' || dest === activeTab) return;
    const [t, m] = UNLOCK_TOASTS[dest] ?? ['Novo nível!', ''];
    toast('unlock', t, m);
    router.push(`/dashboard/${dest}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.unlockedTabs.length]);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Progress header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">CD</span>
            </div>
            <span className="text-sm font-bold text-gray-900 hidden sm:block">CoderDojo Cyber</span>
          </div>

          {/* Steps */}
          <div className="flex items-center">
            {STEPS.map((step, i) => {
              const done   = game.currentLevel > step.level;
              const active = activeTab === step.tab;
              const locked = !game.unlockedTabs.includes(step.tab) && step.tab !== 'login';

              return (
                <div key={step.tab} className="flex items-center">
                  {i > 0 && (
                    <div className={`w-6 sm:w-10 h-px mx-0.5 ${done ? 'bg-purple-500' : 'bg-gray-200'}`} />
                  )}
                  <div className="relative flex flex-col items-center group">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${
                      done   ? 'bg-purple-600 text-white' :
                      active ? 'bg-purple-700 text-white ring-2 ring-purple-300' :
                      locked ? 'bg-gray-100 text-gray-300 border border-gray-200' :
                               'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}>
                      {done
                        ? <CheckCircle2 className="w-4 h-4" />
                        : <Circle className={`w-3 h-3 ${active ? 'fill-white' : ''}`} />
                      }
                    </div>
                    {/* Active label */}
                    {active && (
                      <span className="absolute -bottom-5 text-xs whitespace-nowrap font-semibold text-purple-700">
                        {step.label}
                      </span>
                    )}
                    {/* Hover tooltip */}
                    {!locked && (
                      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {step.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={game.resetGame}
            title="Reiniciar"
            className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Label spacer */}
      <div className="h-6 bg-white border-b border-gray-100" />

      {/* Content */}
      <motion.main
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 overflow-y-auto bg-gray-50"
      >
        {children}
      </motion.main>
    </div>
  );
}
