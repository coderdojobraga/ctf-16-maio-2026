'use client';

import { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import TerminalGlitch from './TerminalGlitch';
import DojoBOT from './DojoBOT';

type Phase = 'congrats' | 'glitch' | 'dojabot';

export default function UnlockedChampion() {
  const game = useGame();
  const [phase, setPhase] = useState<Phase>('congrats');

  useEffect(() => {
    if (phase === 'congrats') {
      const t = setTimeout(() => setPhase('glitch'), 4000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <AnimatePresence mode="wait">
      {phase === 'congrats' && (
        <motion.div
          key="congrats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(4px)' }}
          className="flex flex-col items-center justify-center min-h-full p-8 gap-6"
        >
          <motion.div
            animate={{
              x: [0, -2, 2, -2, 2, 0],
              filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(180deg)', 'hue-rotate(0deg)'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-center space-y-4"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
            <h1 className="text-3xl font-bold text-white">
              Parabéns, <span className="text-green-400">{game.credentials?.user ?? 'Ninja'}</span>!
            </h1>
            <p className="text-gray-400">Acesso Champion desbloqueado com sucesso.</p>
            <p className="text-gray-600 text-sm animate-pulse">A carregar o painel secreto...</p>
          </motion.div>
        </motion.div>
      )}

      {phase === 'glitch' && (
        <TerminalGlitch key="glitch" onComplete={() => setPhase('dojabot')} />
      )}

      {phase === 'dojabot' && (
        <motion.div
          key="dojabot"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-full"
        >
          <DojoBOT />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
