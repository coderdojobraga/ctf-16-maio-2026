'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Info, CheckCircle2, Mail, ArrowRight } from 'lucide-react';
import { useToast } from './Toast';

function caesarDecode(text: string, shift: number): string {
  return text.split('').map(ch => {
    if (/[a-z]/.test(ch)) return String.fromCharCode(((ch.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
    if (/[A-Z]/.test(ch)) return String.fromCharCode(((ch.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
    return ch;
  }).join('');
}

const ENCRYPTED_URL = '/jrptwx/nsgtc';
const CORRECT_ANSWER = caesarDecode(ENCRYPTED_URL, 5);

function generateToken(): string {
  return Array.from({ length: 3 }, () => Math.random().toString(36).slice(2, 6).toUpperCase()).join('-');
}

const MENTORS = [
  { name: 'Felipe Espinheira', role: 'Mentor Pedagógico',    image: '/images/Filipe.jpg', suspicious: false },
  { name: 'Gonçalo Lemos',     role: 'Mentor Pedagógico',   image: '/images/Lemos.jpg', suspicious: false },
  { name: 'Pedro Coutinho ', role: 'Mentor Pedagógico', image: '/images/PedroCoutinho.jpg', suspicious: false  },
  { name: 'Sofia Freitas',    role: 'Mentor Lúdico',    image: '/images/SofiaFreitas.jpg', suspicious: false },
];

export default function SecretMentorsPage() {
  const game = useGame();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<'geral' | 'detalhes'>('geral');
  const [cipherInput, setCipherInput] = useState('');
  const [cipherError, setCipherError] = useState('');
  const [cipherSolved, setCipherSolved] = useState(false);
  const [emailInput, setEmailInput] = useState(game.credentials?.email ?? '');
  const [emailSent, setEmailSent] = useState(false);
  const [showGoToEmail, setShowGoToEmail] = useState(false);

  function checkCipher() {
    if (cipherInput.trim().toLowerCase() === CORRECT_ANSWER.toLowerCase()) {
      setCipherSolved(true);
      toast('success', 'Cifra decifrada!', 'URL correcto. Inbox desbloqueado.');
      setTimeout(() => { game.setLevel(4); game.unlockTab('emails'); }, 1500);
    } else {
      setCipherError('Decifração incorrecta. Verifica a cifra e a chave!');
    }
  }

  function requestAccess(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim()) return;
    game.setMentorToken(generateToken());
    game.unlockTab('emails');
    game.setLevel(4);
    setEmailSent(true);
    setShowGoToEmail(true);
    toast('info', 'Pedido enviado!', 'Verifica o teu email para confirmar.');
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="border-b border-gray-200 pb-4">
        <p className="text-xs font-mono text-purple-600 mb-1">dojo.local/mentores</p>
        <h1 className="text-2xl font-bold text-gray-900">Equipa de Mentores</h1>
        <p className="text-gray-500 text-sm mt-1">Os guardiões do Coder Camp de 2026</p>
      </header>

      {/* Event Image */}
      <section className="group">
        <div className="relative w-full h-210 rounded-2xl overflow-hidden shadow-md border border-gray-200">
          <Image
            src="/images/FotoSecretaFinal.jpg"
            alt="Coder Camp 2026"
            fill
            className="object-cover"
          />
          <a
            href="/api/download/image?file=FotoSecretaFinal.jpg"
            download="FotoSecretaFinal.jpg"
            className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <div className="flex flex-col items-center gap-2">
              <Download className="w-8 h-8 text-white" />
              <span className="text-white font-semibold text-sm">Fazer Download</span>
            </div>
          </a>
        </div>
      </section>

      <div className="space-y-8">
        {/* Pedagogical Mentors */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">👨‍🏫 Mentores Pedagógicos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MENTORS.filter(m => m.role === 'Mentor Pedagógico').map(m => (
              <motion.div key={m.name} whileHover={{ scale: 1.02 }}
                className={`bg-white border rounded-2xl p-5 text-center shadow-sm ${
                  m.suspicious ? 'border-yellow-300' : 'border-gray-200'
                }`}
              >
                <div className="mb-3 flex justify-center group">
                  <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      className="object-cover"
                    />
                    <a
                      href={m.image}
                      download={`${m.name}.jpg`}
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Download className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>
                <p className="text-gray-900 font-semibold text-sm">{m.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{m.role}</p>
                {m.suspicious && (
                  <div className="mt-3 space-y-1">
                    <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-2 py-0.5">
                      Foto suspeita
                    </span>
                    <div className="relative group mt-2">
                      <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-1.5 mx-auto text-xs text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <Download className="w-3 h-3" /> Ver Metadados
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Ludic Mentors */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🎮 Mentores Lúdicos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MENTORS.filter(m => m.role === 'Mentor Lúdico').map(m => (
              <motion.div key={m.name} whileHover={{ scale: 1.02 }}
                className={`bg-white border rounded-2xl p-5 text-center shadow-sm ${
                  m.suspicious ? 'border-yellow-300' : 'border-gray-200'
                }`}
              >
                <div className="mb-3 flex justify-center group">
                  <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      className="object-cover"
                    />
                    <a
                      href={m.image}
                      download={`${m.name}.jpg`}
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Download className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>
                <p className="text-gray-900 font-semibold text-sm">{m.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{m.role}</p>
                {m.suspicious && (
                  <div className="mt-3 space-y-1">
                    <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-2 py-0.5">
                      Foto suspeita
                    </span>
                    <div className="relative group mt-2">
                      <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-1.5 mx-auto text-xs text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <Download className="w-3 h-3" /> Ver Metadados
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {game.path === 'scratch' ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-600" />
            <h2 className="text-gray-900 font-semibold">Ferramenta de Decifração</h2>
          </div>
          <p className="text-gray-500 text-sm">Encontraste metadados suspeitos? Decifra o URL e introduz abaixo.</p>
          {cipherSolved ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span>Correcto! A desbloqueares o Inbox...</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-900 font-mono text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                placeholder="/decifrado/aqui"
                value={cipherInput}
                onChange={e => { setCipherInput(e.target.value); setCipherError(''); }}
                onKeyDown={e => e.key === 'Enter' && checkCipher()}
              />
              <button onClick={checkCipher}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-semibold transition-colors"
              >Verificar</button>
            </div>
          )}
          {cipherError && <p className="text-red-500 text-sm">{cipherError}</p>}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-600" />
            <h2 className="text-gray-900 font-semibold">Pedir Acesso ao Painel de Mentores</h2>
          </div>
          <p className="text-gray-500 text-sm">Para aceder ao painel restrito, submete o teu email. Receberás um link de confirmação.</p>
          {emailSent ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span>Pedido enviado para <strong>{emailInput}</strong>.</span>
            </div>
          ) : (
            <form onSubmit={requestAccess} className="flex gap-2">
              <input type="email"
                className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                placeholder="o-teu-email@exemplo.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                required
              />
              <button type="submit"
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
              >Pedir Acesso</button>
            </form>
          )}
        </div>
      )}

      {/* File modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white border border-gray-200 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Propriedades do Ficheiro</span>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex border-b border-gray-200">
                {(['geral', 'detalhes'] as const).map(t => (
                  <button key={t} onClick={() => setModalTab(t)}
                    className={`flex-1 py-2 text-xs font-semibold capitalize transition-colors ${
                      modalTab === t ? 'text-purple-700 border-b-2 border-purple-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                ))}
              </div>
              <div className="p-5 text-sm space-y-3">
                {modalTab === 'geral' ? (
                  <>
                    <Row label="Nome" value="foto_suspeita.jpg" />
                    <Row label="Tipo" value="JPEG Image" />
                    <Row label="Tamanho" value="847 KB" />
                    <Row label="Modificado" value="2026-04-01 13:37" />
                    <Row label="Autor" value="m.ferreira" />
                  </>
                ) : (
                  <>
                    <Row label="Câmara" value="Nokia 3310 Ultra" />
                    <Row label="GPS" value="38.7169° N, 9.1395° W" />
                    <Row label="Software" value="Dojo Secret Editor v2" />
                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <p className="text-purple-700 font-mono font-bold text-xs mb-2">DADOS OCULTOS:</p>
                      <Row label="Segredo" value={ENCRYPTED_URL} highlight />
                      <Row label="Chave" value="5" highlight />
                      <Row label="Cifra" value="Caesar" highlight />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Go to email popup */}
      <AnimatePresence>
        {showGoToEmail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="bg-white border border-gray-200 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center space-y-4"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-gray-900 font-bold text-lg">Verifica o teu email</h3>
              <p className="text-gray-500 text-sm">
                Enviámos um link de confirmação para{' '}
                <span className="text-gray-900 font-medium">{emailInput}</span>.
              </p>
              <p className="text-yellow-700 text-xs bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
                Cuidado — podes receber mais do que um email. Só um é legítimo.
              </p>
              <button onClick={() => setShowGoToEmail(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-semibold transition-colors"
              >
                <ArrowRight className="w-4 h-4" /> Ir para o Email
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 w-24 shrink-0">{label}:</span>
      <span className={highlight ? 'text-purple-700 font-mono font-bold' : 'text-gray-700'}>{value}</span>
    </div>
  );
}
