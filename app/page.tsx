'use client';

import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { Code2, Cpu } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { setPath, resetGame } = useGame();

  function choose(path: 'scratch' | 'python') {
    resetGame();
    setPath(path);
    router.push('/dashboard/login');
  }

  return (
    <main className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">CD</span>
          </div>
          <span className="font-bold text-gray-900">CoderDojo <span className="text-gray-500 font-normal">Braga</span></span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span className="hidden sm:block">Cyber Challenge</span>
          <span className="hidden sm:block">2026</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Bem-vindo ao<br />
            <span className="text-purple-700">CoderDojo Cyber Challenge!</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto">
            Vais juntar-te a nós nesta aventura de cibersegurança?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => choose('scratch')}
            className="flex items-center gap-3 px-8 py-3.5 bg-purple-700 hover:bg-purple-800 text-white rounded-full font-semibold text-sm transition-colors shadow-sm"
          >
            <Cpu className="w-4 h-4" />
            Scratch
          </button>
          <button
            onClick={() => choose('python')}
            className="flex items-center gap-3 px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold text-sm transition-colors shadow-sm"
          >
            <Code2 className="w-4 h-4" />
            Python
          </button>
        </motion.div>
      </section>

      {/* Dark wave section */}
      <section className="bg-gray-900 text-white px-8 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-12 bg-white"
          style={{ clipPath: 'ellipse(60% 100% at 50% 0%)' }} />
        <div className="max-w-2xl mx-auto pt-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full inline-block" />
              O que é o CoderDojo Cyber Challenge?
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              Um desafio interactivo de cibersegurança onde vais explorar conceitos reais como phishing,
              manipulação de URLs, cifras e engenharia social — tudo de forma segura e educativa.
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold flex items-center justify-end gap-2 mb-2">
              Como funciona?
              <span className="w-1 h-6 bg-purple-500 rounded-full inline-block" />
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              Passas por 6 níveis progressivos. Cada nível ensina uma técnica de cibersegurança
              diferente. Completas o desafio e avanças automaticamente para o próximo.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
