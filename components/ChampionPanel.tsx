'use client';

import { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Trophy, RefreshCw, EyeOff } from 'lucide-react';

const SCRATCH_PASSWORD = 'NINJA-HACKER';
const CHAMPION_COOKIE = 'Y2hhbXBpb24';
const MENTOR_COOKIE = 'bWVudG9y';

export default function ChampionPanel() {
  const game = useGame();
  
  // Estados para o painel principal
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  // Estados para o Cartão de Dica Secreta (Python)
  const [hintPass, setHintPass] = useState('');
  const [hintUnlocked, setHintUnlocked] = useState(false);
  const [hintError, setHintError] = useState('');

  // Para o nível Python, injeta um cookie REAL no browser do Ninja
  useEffect(() => {
    if (game.path === 'python' && game.currentLevel < 6) {
      if (!document.cookie.includes('role=')) {
        document.cookie = `role=${MENTOR_COOKIE}; path=/`;
      }
    }
  }, [game.path, game.currentLevel]);

  if (game.currentLevel >= 6) return (
    <div className="flex flex-col items-center justify-center min-h-full p-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-sm w-full text-center shadow-sm space-y-4">
        <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center mx-auto">
          <Trophy className="w-7 h-7 text-yellow-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Acesso Champion desbloqueado!</h1>
        <p className="text-gray-500 text-sm">Conseguiste elevar as tuas permissões. O painel secreto foi ativado.</p>
      </div>
    </div>
  );

  // Lógica do botão Scratch
  function tryPass(e: React.FormEvent) {
    e.preventDefault();
    if (pass === SCRATCH_PASSWORD) { 
      game.setLevel(6); 
      game.unlockTab('dojobot');
    } else {
      setError('Senha incorrecta. Tenta de novo.');
    }
  }

  // Lógica de verificação do botão Python (lê os cookies REAIS)
  function checkRealCookie() {
    const cookies = document.cookie.split(';');
    let roleValue = '';
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('role=')) {
        roleValue = cookie.substring('role='.length);
        break;
      }
    }

    if (roleValue === CHAMPION_COOKIE) {
      game.setLevel(6);
      game.unlockTab('dojobot');
    } else {
      setError(`Permissão negada. O teu cookie atual é "${roleValue}". Sabes como fazer isso?`);
    }
  }

  // Lógica para desbloquear a dica do cartão
  function unlockHint(e: React.FormEvent) {
    e.preventDefault();
    if (hintPass.toLowerCase() === 'dica2026') {
      setHintUnlocked(true);
      setHintError('');
    } else {
      setHintError('Código de mentor inválido.');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-8 text-center space-y-6 shadow-sm"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Acesso Champion</h1>
          <p className="text-gray-500 text-sm mt-1">Área reservada. Autorização necessária.</p>
        </div>

        {game.path === 'scratch' ? (
          <div className="space-y-4">
            <form onSubmit={tryPass} className="space-y-3">
              <input type="password"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-purple-500 text-center font-mono tracking-widest"
                value={pass} onChange={e => { setPass(e.target.value); setError(''); }}
                placeholder="••••••••••••"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit"
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Unlock className="w-4 h-4" /> Desbloquear
              </button>
            </form>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-gray-400 text-xs"><strong>Nota para o champion:</strong> O código está no código-fonte que gera esta página.</p>
              <p className="text-gray-400 text-xs mt-1">
                Sabes como ver o <kbd className="bg-gray-100 px-1 rounded text-gray-600">código-fonte</kbd> de uma página?
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left">
              <p className="text-gray-700 text-sm font-semibold mb-1">Permissão negada</p>
              <p className="text-gray-500 text-xs mb-3">
                O nosso sistema de segurança detetou que não és um Champion. Usamos <strong>Cookies</strong> no browser para verificar a tua identidade.
              </p>
              <p className="text-gray-500 text-xs">
                <strong>Nota para o champion:</strong> Não te esqueças de alterar os cookies do site para alterar as tuas permissões. (Não te esqueças de usar o mecanismo secreto para esconder o valor do cookie!)
              </p>

              {/* Cartão de Dica com Flip Animation */}
              <div className="mt-6 perspective-1000">
                <AnimatePresence mode="wait">
                  {!hintUnlocked ? (
                    <motion.div
                      key="locked"
                      initial={{ rotateX: -90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      exit={{ rotateX: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-5 bg-gray-100 rounded-xl border border-gray-200 text-center space-y-4 shadow-inner"
                    >
                      <EyeOff className="w-8 h-8 mx-auto text-gray-400" />
                      
                      <form onSubmit={unlockHint}>
                        <input
                          type="password"
                          value={hintPass}
                          onChange={e => { setHintPass(e.target.value); setHintError(''); }}
                          placeholder="Código..."
                          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-center font-mono"
                        />
                      </form>
                      {hintError && <p className="text-red-500 text-[10px] m-0">{hintError}</p>}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unlocked"
                      initial={{ rotateX: -90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-purple-50 rounded-xl text-xs font-mono text-purple-900 space-y-2 border border-purple-200 shadow-inner"
                    >
                      <p>Se mentor = <span className="text-blue-600">{MENTOR_COOKIE}</span>  ... então</p>
                      <p>champion = <span className="text-purple-600">???</span></p>
                      <div className="mt-2 pt-2 border-t border-purple-200/50">
                        <p className="text-[10px] text-purple-600 italic">// Dica: O valor original está codificado.</p>
                        <p className="text-[10px] text-purple-600 italic">// Usa um conversor de Base64 online para descobrir.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <button
              onClick={checkRealCookie}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Verificar Permissões
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}