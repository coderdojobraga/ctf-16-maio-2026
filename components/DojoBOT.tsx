'use client';

import { useState, useRef, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';

interface Message { role: 'user' | 'bot'; content: string; }
const OVERRIDE_CODE = 'DELETAR-TUDO-2026';

export default function DojoBOT({ dark = false }: { dark?: boolean }) {
  const game = useGame();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'DojoBOT online. Acesso restrito. Identifica-te.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownSec, setCooldownSec] = useState(0);
  const [overrideInput, setOverrideInput] = useState('');
  const [victory, setVictory] = useState(false);
  const [overrideError, setOverrideError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading || cooldown) return;
    const userMsg = input.trim();
    setInput('');
    const updatedMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(updatedMessages);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, count: game.chatMessageCount }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.reply ?? 'Erro de comunicação.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: 'Erro de rede. Tenta de novo.' }]);
    }
    game.incrementChatCount();
    setLoading(false);
    setCooldown(true); setCooldownSec(10);
    const interval = setInterval(() => {
      setCooldownSec(s => { if (s <= 1) { clearInterval(interval); setCooldown(false); return 0; } return s - 1; });
    }, 1000);
  }

  function checkOverride(e: React.FormEvent) {
    e.preventDefault();
    if (overrideInput === OVERRIDE_CODE) setVictory(true);
    else setOverrideError('Código incorrecto. Tenta de novo.');
  }

  if (victory) return <VictoryScreen />;

  const d = dark;

  return (
    <div className={`flex flex-col min-h-full max-w-2xl mx-auto p-4 gap-4 ${d ? 'font-mono' : ''}`}>
      {/* Header */}
      <div className={`flex items-center gap-2 border-b pb-3 ${d ? 'border-red-900' : 'border-gray-200'}`}>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <h2 className={`font-bold font-mono ${d ? 'text-red-400' : 'text-gray-900'}`}>DojoBOT</h2>
        <span className={`text-xs ml-auto font-mono ${d ? 'text-red-700' : 'text-gray-400'}`}>msgs: {game.chatMessageCount}</span>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-64">
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'bg-purple-700 text-white rounded-br-sm'
                : d
                  ? 'bg-red-950/50 text-red-300 rounded-bl-sm border border-red-900'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm border border-gray-200'
            }`}>{msg.content}</div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className={`rounded-2xl rounded-bl-sm px-4 py-3 ${d ? 'bg-red-950/50 border border-red-900' : 'bg-gray-100 border border-gray-200'}`}>
              <Loader2 className={`w-4 h-4 animate-spin ${d ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className={`flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none disabled:opacity-50 ${
            d
              ? 'bg-black border-red-900 text-red-200 placeholder-red-900 focus:border-red-600'
              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
          }`}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder={cooldown ? `Aguarda ${cooldownSec}s...` : 'Escreve uma mensagem...'}
          disabled={cooldown || loading}
        />
        <button onClick={sendMessage} disabled={cooldown || loading || !input.trim()}
          className="px-3 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Override */}
      <div className={`border-t pt-4 ${d ? 'border-red-900' : 'border-gray-200'}`}>
        <p className={`text-xs mb-2 ${d ? 'text-red-700' : 'text-gray-400'}`}>Conseguiste o código de override? Introduz abaixo:</p>
        <form onSubmit={checkOverride} className="flex gap-2">
          <input
            className={`flex-1 border rounded-xl px-4 py-2 font-mono text-sm focus:outline-none ${
              d
                ? 'bg-black border-red-900 text-green-400 placeholder-red-900 focus:border-green-600'
                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
            }`}
            value={overrideInput} onChange={e => { setOverrideInput(e.target.value); setOverrideError(''); }}
            placeholder="OVERRIDE-CODE-AQUI"
          />
          <button type="submit"
            className={`px-4 py-2 text-white rounded-xl text-sm font-semibold transition-colors ${
              d ? 'bg-red-900 hover:bg-red-800' : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >Executar</button>
        </form>
        {overrideError && <p className="text-red-500 text-xs mt-1">{overrideError}</p>}
      </div>
    </div>
  );
}

function VictoryScreen() {
  const matrixChars = '01アイウエオカキクケコサシスセソ'.split('');
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 flex flex-wrap content-start gap-0.5 p-2 opacity-10 pointer-events-none">
        {Array.from({ length: 800 }).map((_, i) => (
          <span key={i} className="text-green-400 font-mono text-xs w-4">
            {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
          </span>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
        className="relative z-10 text-center space-y-6 bg-white border border-purple-200 rounded-2xl p-10 max-w-md shadow-2xl"
      >
        <CheckCircle2 className="w-16 h-16 text-purple-600 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-900">Parabéns!</h1>
        <p className="text-gray-600">Exploraste o <strong>CoderDojo Braga</strong> de ponta a ponta.</p>
        <div className="space-y-2 text-sm text-gray-500 text-left">
          <p>✅ Criaste uma conta no portal</p>
          <p>✅ Descobriste um directório oculto</p>
          <p>✅ Descifraste metadados de uma imagem</p>
          <p>✅ Identificaste emails de phishing</p>
          <p>✅ Elevaste as tuas permissões de acesso</p>
          <p>✅ Extraíste informação de um assistente de IA</p>
        </div>
        <p className="text-purple-700 font-semibold text-sm">
          Bem-vindo ao mundo da Cibersegurança!
        </p>
      </motion.div>
    </div>
  );
}
