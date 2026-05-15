'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, CheckCircle2, Mail, EyeOff } from 'lucide-react';
import { useToast } from './Toast';

// Agora o URL secreto a descobrir é o /emkors/inbox
const SECRET_URL = '/emkors/inbox';

function generateToken(): string {
  return Array.from({ length: 3 }, () => Math.random().toString(36).slice(2, 6).toUpperCase()).join('-');
}

const MENTORS = [
  { name: 'Felipe Espinheira', role: 'Mentor Pedagógico', image: '/images/Filipe.jpg', suspicious: false },
  { name: 'Gonçalo Lemos',     role: 'Mentor Pedagógico', image: '/images/Lemos.jpg', suspicious: false },
  { name: 'Pedro Coutinho',    role: 'Mentor Pedagógico', image: '/images/PedroCoutinho.jpg', suspicious: false },
  { name: 'Sofia Freitas',     role: 'Mentor Lúdico',     image: '/images/SofiaFreitas.jpg', suspicious: false },
  { name: 'Afonso Carpinteiro',role: 'Mentor',            image: '/images/AfonsoCarpinteiro.png', suspicious: false },
  { name: 'Afonso Dionísio',   role: 'Mentor',            image: '/images/AfonsoDionisio.png', suspicious: false },
  { name: 'Afonso Leite',      role: 'Mentor',            image: '/images/AfonsoLeite.png', suspicious: false },
  { name: 'Afonso Martins',    role: 'Mentor',            image: '/images/AfonsoMartins.png', suspicious: false },
  { name: 'Afonso Pimenta',    role: 'Mentor',            image: '/images/AfonsoPimenta.png', suspicious: false },
  { name: 'Ana Leite',         role: 'Mentor',            image: '/images/AnaLeite.png', suspicious: false },
  { name: 'Ana Rita',          role: 'Mentor',            image: '/images/AnaRita.png', suspicious: false },
  { name: 'Andréia Cardoso',   role: 'Mentor',            image: '/images/AndreiaCardoso.png', suspicious: false },
  { name: 'Bernard Georges',   role: 'Mentor',            image: '/images/BernardGeorges.png', suspicious: false },
  { name: 'Carlos Ribeiro',    role: 'Mentor',            image: '/images/CarlosRibeiro.png', suspicious: false },
  { name: 'Daniel Pereira',    role: 'Mentor',            image: '/images/DanielPereira.png', suspicious: false },
  { name: 'Diogo Lameira',     role: 'Mentor',            image: '/images/DiogoLameira.png', suspicious: false },
  { name: 'Diogo Matos',       role: 'Mentor',            image: '/images/DiogoMatos.png', suspicious: false },
  { name: 'Diogo Neto',        role: 'Mentor',            image: '/images/DiogoNeto.png', suspicious: false },
  { name: 'Eduardo Faria',     role: 'Mentor',            image: '/images/EduardoFaria.png', suspicious: false },
  { name: 'Eduardo Reis',      role: 'Mentor',            image: '/images/EduardoReis.png', suspicious: false },
  { name: 'Felipe Felício',    role: 'Mentor',            image: '/images/FelipeFelicio.png', suspicious: false },
  { name: 'Filipe Rodrigues',  role: 'Mentor',            image: '/images/FilipeRodrigues.png', suspicious: false },
  { name: 'Francisca Costa',   role: 'Mentor',            image: '/images/FranciscaCosta.png', suspicious: false },
  { name: 'Gonçalo Costa',     role: 'Mentor',            image: '/images/GoncaloCosta.png', suspicious: false },
  { name: 'Guarda',            role: 'Mentor',            image: '/images/Guarda.png', suspicious: false },
  { name: 'Guilherme Vara',    role: 'Mentor',            image: '/images/GuilhermeVara.png', suspicious: false },
  { name: 'Gustavo Castro',    role: 'Mentor',            image: '/images/GustavoCastro.png', suspicious: false },
  { name: 'Gustavo Pereira',   role: 'Mentor',            image: '/images/GustavoPereira.png', suspicious: false },
  { name: 'Heitor Fernandes',  role: 'Mentor',            image: '/images/HeitorFernandes.png', suspicious: false },
  { name: 'Hélder Gomes',      role: 'Mentor',            image: '/images/HelderGomes.png', suspicious: false },
  { name: 'Henrique Pereira',  role: 'Mentor',            image: '/images/HenriquePereira.png', suspicious: false },
  { name: 'Humberto Gomes',    role: 'Mentor',            image: '/images/HumbertoGomes.png', suspicious: false },
  { name: 'Jéssica Fernandes', role: 'Mentor',            image: '/images/JessicaFernandes.png', suspicious: false },
  { name: 'Joana Branco',      role: 'Mentor',            image: '/images/JoanaBranco.png', suspicious: false },
  { name: 'Joana Fernandes',   role: 'Mentor',            image: '/images/JoanaFernandes.png', suspicious: false },
  { name: 'Joana Pereira',     role: 'Mentor',            image: '/images/JoanaPereira.png', suspicious: false },
  { name: 'João Alvim',        role: 'Mentor',            image: '/images/JoaoAlvim.png', suspicious: false },
  { name: 'João Coelho',       role: 'Mentor',            image: '/images/JoaoCoelho.png', suspicious: false },
  { name: 'João Lobo',         role: 'Mentor',            image: '/images/JoaoLobo.png', suspicious: false },
  { name: 'Jorge Teixeira',    role: 'Mentor',            image: '/images/JorgeTeixeira.png', suspicious: false },
  { name: 'José Fonte',        role: 'Mentor',            image: '/images/JoseFonte.png', suspicious: false },
  { name: 'José Lopes',        role: 'Mentor',            image: '/images/JoseLopes.png', suspicious: false },
  { name: 'José Oliveira',     role: 'Mentor',            image: '/images/JoseOliveira.png', suspicious: false },
  { name: 'Júlio Pinto',       role: 'Mentor',            image: '/images/JulioPinto.png', suspicious: false },
  { name: 'Lara Regina',       role: 'Mentor',            image: '/images/LaraRegina.png', suspicious: false },
  { name: 'Luís Felício',      role: 'Mentor',            image: '/images/LuisFelicio.png', suspicious: false },
  { name: 'Manuel Carvalho',   role: 'Mentor',            image: '/images/ManuelCarvalho.png', suspicious: false },
  { name: 'Maria Vale',        role: 'Mentor',            image: '/images/MariaVale.png', suspicious: false },
  { name: 'Mário Rodrigues',   role: 'Mentor',            image: '/images/MarioRodrigues.png', suspicious: false },
  { name: 'Marta Gonçalves',   role: 'Mentor',            image: '/images/MartaGoncalves.png', suspicious: false },
  { name: 'Marta Rodrigues',   role: 'Mentor',            image: '/images/MartaRodrigues.png', suspicious: false },
  { name: 'Marta Silva',       role: 'Mentor',            image: '/images/MartaSilva.png', suspicious: false },
  { name: 'Martim Ferreira',   role: 'Mentor',            image: '/images/MartimFerreira.png', suspicious: false },
  { name: 'Nelson Almeida',    role: 'Mentor',            image: '/images/NelsonAlmeida.png', suspicious: false },
  { name: 'Nuno Costa',        role: 'Mentor',            image: '/images/NunoCosta.png', suspicious: false },
  { name: 'Nuno Fernandes',    role: 'Mentor',            image: '/images/NunoFernandes.png', suspicious: false },
  { name: 'Pedro Lopes',       role: 'Mentor',            image: '/images/PedroLopes.png', suspicious: false },
  { name: 'Pedro Pereira',     role: 'Mentor',            image: '/images/PedroPereira.png', suspicious: false },
  { name: 'Pedro Sousa',       role: 'Mentor',            image: '/images/PedroSousa.png', suspicious: false },
  { name: 'Ricardo Lucena',    role: 'Mentor',            image: '/images/RicardoLucena.png', suspicious: false },
  { name: 'Rita Camacho',      role: 'Mentor',            image: '/images/RitaCamacho.png', suspicious: false },
];

export default function SecretMentorsPage() {
  const game = useGame();
  
  // Estados do Modal
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<'geral' | 'detalhes'>('geral');
  
  // Estados do Email
  const [emailInput, setEmailInput] = useState(game.credentials?.email ?? '');
  const [emailSent, setEmailSent] = useState(false);

  // Estados da Dica (Flip Card)
  const [hintPass, setHintPass] = useState('');
  const [hintUnlocked, setHintUnlocked] = useState(false);
  const [hintError, setHintError] = useState('');

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="border-b border-gray-200 pb-4">
        <p className="text-xs font-mono text-purple-600 mb-1">dojo.local/mentores</p>
        <h1 className="text-2xl font-bold text-gray-900">Equipa de Mentores</h1>
        <p className="text-gray-500 text-sm mt-1">Os guardiões do Coder Camp de 2026</p>
      </header>

      {/* Event Image */}
      <section className="group flex justify-center">
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white">
          <Image
            src="/images/FotoSecretaFinal.jpg"
            alt="Coder Camp 2026"
            width={600} 
            height={600}
            className="object-contain p-4"
            priority
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
        {/* Mentores Pedagógicos */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">👨‍🏫 Mentores Pedagógicos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MENTORS.filter(m => m.role === 'Mentor Pedagógico').map(m => (
              <MentorCard key={m.name} m={m} onSuspectClick={() => setShowModal(true)} />
            ))}
          </div>
        </section>

        {/* Mentores Lúdicos */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🎮 Mentores Lúdicos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MENTORS.filter(m => m.role === 'Mentor Lúdico').map(m => (
              <MentorCard key={m.name} m={m} onSuspectClick={() => setShowModal(true)} />
            ))}
          </div>
        </section>

        {/* Outros Mentores */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">👨‍🏫 Outros Mentores</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MENTORS.filter(m => m.role === 'Mentor').map(m => (
              <MentorCard key={m.name} m={m} onSuspectClick={() => setShowModal(true)} />
            ))}
          </div>
        </section>
      </div>

      {/* --- AQUI COMEÇA A NOVA SECÇÃO DE PEDIR ACESSO --- */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-purple-600" />
          <h2 className="text-gray-900 font-semibold">És mentor?</h2>
        </div>
        <p className="text-gray-500 text-sm">
          Clica neste botão para enviarmos um email de confirmação para entrares como mentor ou champion.
        </p>
        
        {emailSent ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm">Email enviado! Agora tens de descobrir onde fica a caixa de entrada para o leres...</span>
          </div>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!emailInput.trim()) return;
            game.setMentorToken(generateToken()); // Gera a permissão de ver emails reais
            setEmailSent(true);
            // NOTA: O jogo não os redireciona, eles é que têm de procurar a diretoria!
          }} className="flex gap-2">
            <input type="email"
              className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-purple-500"
              placeholder="o-teu-email@exemplo.com"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              required
            />
            <button type="submit"
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-semibold transition-colors"
            >Pedir Acesso</button>
          </form>
        )}
      </div>

      {/* --- AQUI COMEÇA O NOVO CARTÃO DE DICA (FLIP CARD) --- */}
      <div className="mt-6 perspective-1000 max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          {!hintUnlocked ? (
            <motion.div
              key="locked"
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-5 bg-white rounded-xl border border-gray-200 text-center space-y-4 shadow-sm"
            >
              <EyeOff className="w-8 h-8 mx-auto text-gray-400" />
              <form onSubmit={(e) => {
                e.preventDefault();
                if (hintPass.toLowerCase() === 'ajuda_2026') { setHintUnlocked(true); setHintError(''); } 
                else setHintError('Código de ajuda inválido.');
              }}>
                <input type="password" value={hintPass} onChange={e => { setHintPass(e.target.value); setHintError(''); }}
                  placeholder="Precisas de ajuda?"
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
              className="p-5 bg-purple-50 rounded-xl text-sm text-purple-900 space-y-2 border border-purple-200 shadow-inner text-center font-medium"
            >
              <p>Tantas imagens... será que alguma tem informação escondida nas suas propriedades?</p>
              <p className="text-xs text-purple-600 mt-2 italic">// Dica: Passa o rato pela foto suspeita e vê os metadados.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Modal de Metadados (Ficheiro) */}
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
                      <Row label="Diretoria" value={SECRET_URL} highlight />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Componentes Auxiliares
function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 w-24 shrink-0">{label}:</span>
      <span className={highlight ? 'text-purple-700 font-mono font-bold' : 'text-gray-700'}>{value}</span>
    </div>
  );
}

function MentorCard({ m, onSuspectClick }: { m: any, onSuspectClick: () => void }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}
      className={`bg-white border rounded-2xl p-5 text-center shadow-sm ${
        m.suspicious ? 'border-yellow-300' : 'border-gray-200'
      }`}
    >
      <div className="mb-3 flex justify-center group">
        <div className="w-24 h-24 relative rounded-lg overflow-hidden">
          <Image src={m.image} alt={m.name} fill className="object-cover" />
          <a href={m.image} download={`${m.name}.jpg`}
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
            <button onClick={onSuspectClick}
              className="flex items-center gap-1.5 mx-auto text-xs text-purple-600 hover:text-purple-800 transition-colors"
            >
              <Download className="w-3 h-3" /> Ver Metadados
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}