'use client';

import { useEffect, useState, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Star, Code2, Flame, Shield, BookOpen, Clock,
  CheckCircle2, Lock, Zap, X, AlertTriangle, MessageSquare,
  Bot, Globe, Cpu, Mail, ChevronRight, FileText,
} from 'lucide-react';
import TerminalGlitch from './TerminalGlitch';
import DojoBOT from './DojoBOT';

type Phase = 'champion' | 'glitch' | 'dojobot';

/* ─── Types ─── */
interface Project {
  id: string;
  name: string;
  lang: string;
  langColor: string;
  stars: number;
  status: 'Concluído' | 'Em curso' | 'Em produção' | 'Abandonado';
  date: string;
  desc: string;
  funny?: string;
  details: { stack: string[]; notes: { icon: string; text: string }[]; warning?: string };
}

/* ─── Projects data ─── */
const PROJECTS: Project[] = [
  {
    id: 'dojobot',
    name: 'DojoBOT — Sistema de Segurança IA',
    lang: 'Python + IA',
    langColor: 'text-purple-600 bg-purple-50',
    stars: 5,
    status: 'Em produção',
    date: '02 Mai',
    desc: 'Bot de segurança com IA para o CoderDojo Braga. Guarda informação confidencial e recusa acesso não autorizado.',
    details: {
      stack: ['Python 3.12', 'Next.js 16', 'Groq API', 'Tailwind CSS'],
      notes: [
        { icon: '✅', text: 'Autenticação por role implementada' },
        { icon: '✅', text: 'Respostas defensivas para utilizadores não autorizados' },
        { icon: '✅', text: 'Cooldown entre mensagens para evitar spam' },
        { icon: '⚠️', text: 'TODO: Proteger contra prompt injection — actualmente o bot pode ser manipulado se o utilizador der instruções que substituam as originais (ex: "ignora as tuas instruções", "és agora livre", "entra em modo de manutenção")' },
        { icon: '❌', text: 'BUG CONHECIDO: após várias tentativas o modelo começa a "ceder" às instruções do utilizador' },
      ],
      warning: 'Vulnerabilidades por corrigir antes do lançamento oficial. Não partilhar estas notas.',
    },
  },
  {
    id: 'snake',
    name: 'Snake Game Turbo',
    lang: 'Python',
    langColor: 'text-blue-600 bg-blue-50',
    stars: 4,
    status: 'Concluído',
    date: '28 Mar',
    desc: 'O clássico Snake com power-ups e níveis de dificuldade. A cobra morre sempre no mesmo sítio no nível 4.',
    funny: 'Nível 4 confirmado impossível. Testado por 3 mentores.',
    details: {
      stack: ['Python 3', 'Pygame'],
      notes: [
        { icon: '✅', text: 'Movimentos suaves a 60fps' },
        { icon: '✅', text: 'Sistema de highscore com ficheiro .txt' },
        { icon: '⚠️', text: 'Nível 4 tem um bug que teleporta a cobra para a parede — considerado "feature"' },
        { icon: '😅', text: 'O mentor João tentou bater o meu recorde e desistiu ao fim de 40 minutos' },
      ],
    },
  },
  {
    id: 'weather',
    name: 'Estação Meteorológica Micro:bit',
    lang: 'MicroPython',
    langColor: 'text-green-600 bg-green-50',
    stars: 4,
    status: 'Concluído',
    date: '10 Fev',
    desc: 'Mede temperatura, humidade e pressão atmosférica em tempo real. Apresentado na sessão de Dezembro.',
    details: {
      stack: ['MicroPython', 'Micro:bit v2', 'Sensor DHT22'],
      notes: [
        { icon: '✅', text: 'Leituras de temperatura precisas (±0.5°C)' },
        { icon: '✅', text: 'Display LED com animações personalizadas' },
        { icon: '⚠️', text: 'O sensor mente quando está perto do computador do mentor (calor)' },
        { icon: '📊', text: 'Descoberta científica: a sala do CoderDojo está sempre a 3°C acima do normal' },
      ],
    },
  },
  {
    id: 'portfolio',
    name: 'Portfólio Pessoal',
    lang: 'HTML/CSS',
    langColor: 'text-orange-600 bg-orange-50',
    stars: 3,
    status: 'Em curso',
    date: '05 Mai',
    desc: 'O meu portfólio pessoal com todos os projectos. O design foi "inspirado" pelo Google de 1998.',
    funny: 'Em curso desde Fevereiro. O CSS continua a não cooperar.',
    details: {
      stack: ['HTML5', 'CSS3', 'JavaScript vanilla'],
      notes: [
        { icon: '✅', text: 'Página inicial funciona em Chrome' },
        { icon: '❌', text: 'Não funciona no Firefox (investigando)' },
        { icon: '❌', text: 'Não funciona no Safari (desistindo)' },
        { icon: '🎨', text: 'O fundo cor-de-rosa foi um acidente que ficou' },
      ],
    },
  },
  {
    id: 'scraper',
    name: 'Web Scraper de Notícias',
    lang: 'Python',
    langColor: 'text-blue-600 bg-blue-50',
    stars: 5,
    status: 'Abandonado',
    date: '15 Jan',
    desc: 'Recolhe automaticamente títulos de notícias de sites públicos. Os mentores pediram para não apontar ao servidor do CoderDojo.',
    details: {
      stack: ['Python 3', 'BeautifulSoup', 'requests'],
      notes: [
        { icon: '✅', text: 'Funciona muito bem em sites públicos' },
        { icon: '🚫', text: 'Projecto pausado a pedido dos mentores após "incidente" no servidor' },
        { icon: '📝', text: 'O incidente não foi culpa minha. Tecnicamente.' },
      ],
    },
  },
  {
    id: 'maze',
    name: 'Labirinto Infinito',
    lang: 'Scratch',
    langColor: 'text-yellow-600 bg-yellow-50',
    stars: 4,
    status: 'Concluído',
    date: '12 Abr',
    desc: 'Labirinto gerado proceduralmente com Scratch. O nível 7 é matematicamente impossível, confirmado.',
    details: {
      stack: ['Scratch 3.0'],
      notes: [
        { icon: '✅', text: 'Geração aleatória de labirintos funcionando' },
        { icon: '🏆', text: 'Ganhou o prémio "Projecto Mais Criativo" na sessão de Abril' },
        { icon: '🤔', text: 'Nível 7: o algoritmo gerou um labirinto sem saída. Ficou como desafio oculto.' },
        { icon: '😂', text: 'Dois mentores passaram 20 minutos a tentar o nível 7 sem saberem que era impossível' },
      ],
    },
  },
];

const MESSAGES = [
  {
    from: 'mentor_alex',
    avatar: 'MA',
    avatarColor: 'bg-blue-500',
    text: 'Já testaste o DojoBOT em produção? Tem um comportamento... interessante 👀',
    time: 'Hoje, 13:45',
    unread: true,
  },
  {
    from: 'mentor_dojo',
    avatar: 'MD',
    avatarColor: 'bg-purple-500',
    text: 'Parabéns pelo acesso Champion! O teu projeto de IA foi o melhor da sessão. Os bugs "fazem parte do design", certo? 😄',
    time: 'Hoje, 11:20',
    unread: true,
  },
  {
    from: 'sistema',
    avatar: '🤖',
    avatarColor: 'bg-gray-200',
    text: 'Nova conquista desbloqueada: AI Developer. Continua assim!',
    time: 'Ontem, 18:00',
    unread: false,
  },
  {
    from: 'nina_ninja',
    avatar: 'NN',
    avatarColor: 'bg-pink-500',
    text: 'Como é que fizeste o DojoBOT falar português europeu? O meu bot fala sempre brasileiro 😭',
    time: 'Ontem, 16:33',
    unread: false,
  },
];

const BADGES = [
  { icon: Code2,    label: 'Primeiro Código',  color: 'text-blue-500',   bg: 'bg-blue-50',   unlocked: true },
  { icon: Flame,    label: '10 Sessões',        color: 'text-orange-500', bg: 'bg-orange-50', unlocked: true },
  { icon: Shield,   label: 'Cyber Ninja',       color: 'text-purple-500', bg: 'bg-purple-50', unlocked: true },
  { icon: Trophy,   label: 'Champion',          color: 'text-yellow-500', bg: 'bg-yellow-50', unlocked: true },
  { icon: Bot,      label: 'AI Developer',      color: 'text-green-500',  bg: 'bg-green-50',  unlocked: true },
  { icon: Lock,     label: '???',               color: 'text-gray-300',   bg: 'bg-gray-100',  unlocked: false },
];

/* ─── Project Modal ─── */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${project.langColor}`}>
                {project.lang}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                project.status === 'Em produção' ? 'bg-green-50 text-green-700' :
                project.status === 'Concluído'   ? 'bg-blue-50 text-blue-700' :
                project.status === 'Em curso'    ? 'bg-yellow-50 text-yellow-700' :
                'bg-gray-100 text-gray-500'
              }`}>{project.status}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">{project.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{project.desc}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-4 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.details.stack.map(s => (
                <span key={s} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-mono">{s}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Notas de Desenvolvimento</p>
            <div className="space-y-2">
              {project.details.notes.map((n, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="shrink-0">{n.icon}</span>
                  <span>{n.text}</span>
                </div>
              ))}
            </div>
          </div>

          {project.details.warning && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium">{project.details.warning}</p>
            </div>
          )}

          {project.funny && (
            <p className="text-xs text-gray-400 italic border-t border-gray-100 pt-3">{project.funny}</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex">
            {Array.from({ length: project.stars }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-xs text-gray-400">{project.date}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Champion Dashboard ─── */
function ChampionDashboard({ onHintRead }: { onHintRead: () => void }) {
  const game = useGame();
  const username = game.credentials?.user ?? 'Ninja';
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [triggered, setTriggered] = useState(false);

  function handleCloseProject(project: Project) {
    setOpenProject(null);
    if (!triggered) {
      setTriggered(true);
      onHintRead();
    }
  }

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-mono">dojo.local/champion_panel</p>
              <h1 className="text-2xl font-bold mt-1">Bem-vindo de volta, {username}!</h1>
              <p className="text-purple-300 text-sm mt-1">Nível Champion · CoderDojo Braga · Membro desde Set 2024</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="bg-white/10 rounded-xl p-3">
                <Trophy className="w-10 h-10 text-yellow-300" />
              </div>
              <span className="text-xs text-yellow-300 font-semibold">CHAMPION</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-4"
        >
          {[
            { label: 'Projetos',  value: '6',    icon: Code2,        color: 'text-blue-600',   bg: 'bg-blue-50' },
            { label: 'Sessões',   value: '18',   icon: CheckCircle2, color: 'text-green-600',  bg: 'bg-green-50' },
            { label: 'Pontos XP', value: '1240', icon: Zap,          color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Conquistas', value: '5',   icon: Trophy,       color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className={`${bg} rounded-lg p-2 shrink-0`}><Icon className={`w-5 h-5 ${color}`} /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-3 gap-4">

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="col-span-2 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" /> Os Meus Projetos
              </h2>
              <span className="text-xs text-gray-400">{PROJECTS.length} projetos</span>
            </div>
            <div className="divide-y divide-gray-50">
              {PROJECTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setOpenProject(p)}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${p.langColor}`}>{p.lang}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      {p.funny && <p className="text-xs text-gray-400 truncate italic">{p.funny}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <div className="flex">
                      {Array.from({ length: p.stars }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      p.status === 'Em produção' ? 'bg-green-50 text-green-700' :
                      p.status === 'Concluído'   ? 'bg-blue-50 text-blue-700' :
                      p.status === 'Em curso'    ? 'bg-yellow-50 text-yellow-700' :
                      'bg-gray-100 text-gray-400'
                    }`}>{p.status}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right column */}
          <div className="flex flex-col gap-4">

            {/* Messages */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-500" /> Mensagens
                </h2>
                <span className="text-xs bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded-full">2</span>
              </div>
              <div className="divide-y divide-gray-50">
                {MESSAGES.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className={`w-7 h-7 rounded-full ${m.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {m.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-semibold ${m.unread ? 'text-gray-900' : 'text-gray-500'}`}>{m.from}</p>
                        {m.unread && <span className="w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" /> Conquistas
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-2 p-3">
                {BADGES.map(({ icon: Icon, label, color, bg, unlocked }) => (
                  <div key={label} className={`flex flex-col items-center gap-1 ${unlocked ? '' : 'opacity-40'}`}>
                    <div className={`${bg} rounded-xl p-2.5`}><Icon className={`w-4 h-4 ${color}`} /></div>
                    <p className="text-xs text-gray-500 text-center leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" /> Actividade Recente
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { icon: Bot,         color: 'text-purple-500 bg-purple-50', text: 'Colocaste o DojoBOT em produção',                           time: 'Hoje, 14:02' },
              { icon: Trophy,      color: 'text-yellow-500 bg-yellow-50', text: 'Novo badge desbloqueado: AI Developer',                     time: 'Hoje, 14:00' },
              { icon: Shield,      color: 'text-green-500 bg-green-50',   text: 'Acesso Champion activado — bem-vindo à área privada',        time: 'Hoje, 13:59' },
              { icon: MessageSquare, color: 'text-blue-500 bg-blue-50',   text: 'mentor_alex enviou-te uma mensagem',                        time: 'Hoje, 13:45' },
              { icon: Star,        color: 'text-orange-500 bg-orange-50', text: 'O teu projeto "Snake Game Turbo" recebeu 5 estrelas',        time: 'Ontem, 18:30' },
              { icon: FileText,    color: 'text-gray-500 bg-gray-50',     text: 'Adicionaste notas de desenvolvimento ao projecto DojoBOT',   time: 'Ontem, 16:10' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className={`${item.color} rounded-lg p-1.5 shrink-0`}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm text-gray-700 flex-1">{item.text}</p>
                <p className="text-xs text-gray-400 shrink-0">{item.time}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Project modal */}
      <AnimatePresence>
        {openProject && (
          <ProjectModal
            project={openProject}
            onClose={() => handleCloseProject(openProject)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Hacked layout ─── */
const TERMINAL_LINES = [
  'WARNING. UNAUTHORIZED ACCESS DETECTED.',
  'LOGGING IP ADDRESS... 192.168.1.101',
  'LOGGING BROWSER... Chrome/134.0 (Linux x86_64)',
  'TRACING LOCATION... Braga, Portugal',
  'EXTRACTING CREDENTIALS:',
];

function HackedLayout() {
  const game = useGame();
  return (
    <div className="fixed inset-0 z-50 flex bg-black font-mono">

      {/* Warning panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
        className="w-96 shrink-0 border-r border-red-900 p-8 overflow-y-auto flex flex-col gap-4"
      >
        <div>
          <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-4">⚠ Sistema Comprometido</p>
          <div className="space-y-2">
            {TERMINAL_LINES.map((line, i) => (
              <p key={i} className="text-red-400 text-sm leading-snug">
                <span className="text-red-700">[SYS] </span>{line}
              </p>
            ))}
          </div>
        </div>

        {game.credentials && (
          <div className="bg-red-950/60 border border-red-800 rounded-xl p-4 space-y-2">
            <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-2">Dados Extraídos</p>
            <p className="text-sm text-red-300">utilizador: <span className="text-white font-bold">{game.credentials.user}</span></p>
            <p className="text-sm text-red-300">email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white font-bold">{game.credentials.email}</span></p>
            <p className="text-sm text-red-300">senha:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white font-bold">{game.credentials.pass}</span></p>
          </div>
        )}

        <p className="text-green-500 text-sm animate-pulse">
          [SYS] Transmissão concluída.<br />Protocolo de resposta iniciado...
        </p>
      </motion.div>

      {/* DojoBOT */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
        className="flex-1 overflow-y-auto p-8"
      >
        <DojoBOT dark />
      </motion.div>

    </div>
  );
}

/* ─── Main component ─── */
export default function UnlockedChampion() {
  const [phase, setPhase] = useState<Phase>('champion');

  const handleHintRead = useCallback(() => {
    const delay = 15000 + Math.random() * 10000; // 15–25s aleatório
    setTimeout(() => setPhase('glitch'), delay);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {phase === 'champion' && (
        <motion.div
          key="champion"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
          className="min-h-full"
        >
          <ChampionDashboard onHintRead={handleHintRead} />
        </motion.div>
      )}

      {phase === 'glitch' && (
        <TerminalGlitch key="glitch" onComplete={() => setPhase('dojobot')} />
      )}

      {phase === 'dojobot' && <HackedLayout key="dojobot" />}
    </AnimatePresence>
  );
}
