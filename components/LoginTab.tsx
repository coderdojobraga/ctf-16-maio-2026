'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import QuizSim from './QuizSim';
import { useToast } from './Toast';

type Mode = 'login' | 'register';

export default function LoginTab() {
  const router = useRouter();
  const game = useGame();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [regCode, setRegCode] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regError, setRegError] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setErrorModal(true); }, 1200);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (regCode !== 'secreto-codigo') { setRegError('Código secreto inválido!'); return; }
    if (!regUser || !regEmail || !regPass) { setRegError('Preenche todos os campos.'); return; }
    game.setCredentials({ user: regUser, email: regEmail, pass: regPass });
    game.setLevel(2);
    if (!game.unlockedTabs.includes('blog')) {
      game.unlockTab('blog');
    }
    toast('success', `Bem-vindo, ${regUser}!`, 'A tua conta foi criada com sucesso.');
    router.push('/dashboard/blog');
  }

  return (
    <div className="flex items-center justify-center min-h-full p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-gray-200 rounded-2xl w-full max-w-md shadow-sm p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">CoderDojo Braga</h1>
          <p className="text-gray-500 text-sm mt-1">Inicia sessão ou cria uma conta</p>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          {(['login', 'register'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 pb-2 text-sm font-semibold capitalize transition-colors border-b-2 ${
                mode === m ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {m === 'login' ? 'Entrar' : 'Registar'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.form key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onSubmit={handleLogin} className="space-y-4"
            >
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Utilizador</label>
                <input
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                  value={loginUser} onChange={e => setLoginUser(e.target.value)} placeholder="o_teu_nome"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Palavra-passe</label>
                <input type="password"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                  value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="••••••••"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
              </button>
            </motion.form>
          ) : (
            <motion.form key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onSubmit={handleRegister} className="space-y-4"
            >
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Código Secreto</label>
                <input
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 font-mono"
                  value={regCode} onChange={e => setRegCode(e.target.value)} placeholder="???-???-??????"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Precisas de um código para criar um conta. Não tens o código?{' '}
                  <button type="button" onClick={() => setShowQuiz(true)} className="text-purple-600 hover:underline">
                    Descobre aqui
                  </button>
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Utilizador</label>
                <input
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                  value={regUser} onChange={e => setRegUser(e.target.value)} placeholder="ninja_supremo"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Email</label>
                <input type="email"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                  value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="ninja@dojo.pt"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Palavra-passe</label>
                <input type="password"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                  value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="••••••••"
                />
              </div>
              {regError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" /> {regError}
                </div>
              )}
              <button type="submit"
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-semibold transition-colors"
              >
                Registar
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error modal */}
      <AnimatePresence>
        {errorModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white border border-red-200 rounded-2xl p-6 max-w-sm w-full shadow-xl"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Erro de autenticação</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Nenhuma conta encontrada. Caso não tenhas uma conta, vai ser preciso criar uma nova.
                  </p>
                  <button onClick={() => setErrorModal(false)}
                    className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-700 transition-colors"
                  >Fechar</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showQuiz && (
        <QuizSim onClose={() => setShowQuiz(false)} onSuccess={() => { setShowQuiz(false); setMode('register'); }} />
      )}
    </div>
  );
}
