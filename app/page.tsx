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
          <img src="/DojoLogo.svg" alt="CoderDojo Braga" className="h-9 w-auto" />
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span className="hidden sm:block">CoderDojo Braga</span>
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
            <span className="text-purple-700">CoderDojo Braga</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto">
            Vais juntar-te a nós nesta aventura a aprender a programar? Diz-nos qual é a tua linguagem preferida: 
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
              O que é o CoderDojo Braga?
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              O CoderDojo Braga integra-se num movimento global, voluntário, sem fins lucrativos e que visa ensinar crianças e jovens dos 7 aos 17 anos a programar. O projeto pretende mostrar como a programação pode ser uma força de mudança positiva no mundo.
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold flex items-center justify-end gap-2 mb-2">
              Como funciona?
              <span className="w-1 h-6 bg-purple-500 rounded-full inline-block" />
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              As sessões decorrem uma vez por mês no Departamento de Informática da Universidade do Minho, em Braga. São propostos diversos desafios aos Ninjas, consoante o nível em que se encontram, e que os mesmos tentam completar com a ajuda dos Mentores.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
