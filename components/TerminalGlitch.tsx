'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';

const LINES = [
  'WARNING. UNAUTHORIZED ACCESS DETECTED.',
  'LOGGING IP ADDRESS... 192.168.1.101',
  'LOGGING BROWSER... Chrome/134.0 (Linux x86_64)',
  'TRACING LOCATION... Lisbon, Portugal',
  'EXTRACTING CREDENTIALS:',
];

interface TerminalGlitchProps {
  onComplete: () => void;
}

export default function TerminalGlitch({ onComplete }: TerminalGlitchProps) {
  const game = useGame();
  const [lines, setLines] = useState<string[]>([]);
  const [showCreds, setShowCreds] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < LINES.length) {
        setLines(prev => [...prev, LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowCreds(true), 500);
        setTimeout(() => setDone(true), 2500);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (done) {
      setTimeout(onComplete, 1200);
    }
  }, [done, onComplete]);

  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center p-8 font-mono">
      <div className="max-w-xl w-full space-y-2">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-red-400 text-sm"
          >
            <span className="text-red-600">[SYS] </span>{line}
          </motion.p>
        ))}

        {showCreds && game.credentials && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-red-950/50 border border-red-700 rounded-xl p-4 space-y-1"
          >
            <p className="text-yellow-300 font-bold text-xs mb-2">DADOS EXTRAÍDOS:</p>
            <p className="text-red-300">utilizador: <span className="text-white font-bold">{game.credentials.user}</span></p>
            <p className="text-red-300">email:      <span className="text-white font-bold">{game.credentials.email}</span></p>
            <p className="text-red-300">senha:      <span className="text-white font-bold">{game.credentials.pass}</span></p>
          </motion.div>
        )}

        {done && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 text-sm animate-pulse"
          >
            [SYS] Transmissão concluída. Iniciando protocolo de resposta...
          </motion.p>
        )}
      </div>
    </div>
  );
}
