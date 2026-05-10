'use client';

import { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Wrench, Trophy } from 'lucide-react';
import FakeDevTools from './FakeDevTools';

const SCRATCH_PASSWORD = 'NINJA-HACKER';
const CHAMPION_COOKIE = 'Y2hhbXBpb24';

export default function ChampionPanel() {
  const game = useGame();
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [showDevTools, setShowDevTools] = useState(false);

  const cookieIsChampion = game.simulatedCookies.role === CHAMPION_COOKIE;
  useEffect(() => {
    if (game.path === 'python' && cookieIsChampion && game.currentLevel < 6) {
      game.setLevel(6);
      game.unlockTab('dojobot');
    }
  }, [cookieIsChampion, game.path, game.currentLevel]); // eslint-disable-line react-hooks/exhaustive-deps

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

  function tryPass(e: React.FormEvent) {
    e.preventDefault();
    if (pass === SCRATCH_PASSWORD) { game.setLevel(6); game.unlockTab('dojobot'); }
    else setError('Senha incorrecta. Tenta de novo.');
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
              <p className="text-gray-400 text-xs">Pista: O código está no código-fonte da página.</p>
              <p className="text-gray-400 text-xs mt-1">
                Tenta <kbd className="bg-gray-100 px-1 rounded text-gray-600">Ctrl+U</kbd> para ver o source...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left">
              <p className="text-gray-700 text-sm font-semibold mb-1">Permissão negada</p>
              <p className="text-gray-500 text-xs">
                O teu cookie <code className="text-purple-600">role</code> é{' '}
                <code className="text-gray-700">{game.simulatedCookies.role}</code>.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Precisas do role <code className="text-purple-600">champion</code>. Modifica o cookie nas DevTools.
              </p>
            </div>
            <button
              onClick={() => setShowDevTools(v => !v)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                showDevTools
                  ? 'bg-gray-900 border-gray-900 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Wrench className="w-4 h-4" />
              {showDevTools ? 'Fechar DevTools' : 'Abrir DevTools'}
            </button>
          </div>
        )}
      </motion.div>

      {game.path === 'python' && showDevTools && (
        <div className="w-full max-w-2xl border border-gray-200 rounded-2xl overflow-hidden bg-white h-96 shadow-sm">
          <FakeDevTools />
        </div>
      )}

    </div>
  );
}
