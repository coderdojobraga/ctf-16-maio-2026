'use client';

import { useState, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Smartphone, ShieldAlert, CheckCircle2, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FakeEmail {
  id: number | string;
  from: string;
  replyTo?: string;
  subject: string;
  body: (username: string, token: string) => string;
  linkText: string;
  linkHref: string;        
  realHref: string;        
  isReal: false;
  technique: string;
  explanation: string;
  stolen: string;          
}

interface RealEmail {
  id: number | string;
  from: string;
  subject: string;
  body: (username: string, token: string) => string;
  linkText: string;
  isReal: true;
}

type Email = FakeEmail | RealEmail;

// ─── Email Data (PYTHON) ──────────────────────────────────────────────────────
function buildEmails(username: string, token: string | null): Email[] {
  if (!token) {
    return [
      {
        id: 888,
        from: 'admin@coderdojo.local',
        subject: 'Bem-vindo ao CoderDojo Braga',
        body: () => `Bem vindo ao CoderDojo Braga!\n\nCaso sejas mentor (ou queiras mentir e dizeres que és um), vai à aba dos mentores, pede para enviarem um email de acesso e volta aqui para veres o teu link de confirmação.`,
        linkText: 'Não tens links disponíveis.',
        isReal: true,
      } as RealEmail
    ];
  }

  const fakes: FakeEmail[] = [
    {
      id: 2,
      from: 'admin@cod3rdojo.local',
      subject: 'URGENTE: Acesso Bloqueado',
      body: (u) => `Caro ${u},\n\nO teu acesso foi bloqueado por motivos de segurança. Clica no link abaixo para validar a tua conta imediatamente, caso contrário será apagada permanentemente.`,
      linkText: 'Validar Conta',
      linkHref: 'dojo.local/verify',
      realHref: 'cod3rdojo.local/steal-data',
      isReal: false,
      technique: 'Typosquatting & Urgência',
      explanation: 'O atacante usou um domínio muito parecido (cod3rdojo em vez de coderdojo) e criou um sentido de urgência falso para te forçar a agir sem pensar.',
      stolen: 'A tua password de acesso ao portal do CoderDojo.'
    },
    {
      id: 3,
      from: 'it-support@coderdojo.local',
      replyTo: 'hacker1337@gmail.com',
      subject: 'Atualização da Caixa de Correio',
      body: () => `A tua caixa de correio está quase cheia. Por favor, faz login no novo portal para aumentares o teu espaço gratuito de armazenamento.`,
      linkText: 'Aumentar Espaço',
      linkHref: 'coderdojo.local/quota',
      realHref: 'malware-xyz.com/login',
      isReal: false,
      technique: 'Reply-To Spoofing',
      explanation: 'Embora o remetente pareça o nosso suporte oficial, a propriedade "Reply-To" iria enviar a tua resposta (e dados) diretamente para um endereço do Gmail externo.',
      stolen: 'As tuas credenciais de email.'
    },
    {
      id: 4,
      from: 'guilherme.ferreira@mentor-dojo.pt',
      subject: 'Partilha de Documento Restrito',
      body: (u) => `Olá ${u},\n\nPartilhei contigo o ficheiro restrito "Avaliação_Ninjas_2026.pdf". Clica abaixo para abrir através da tua conta Microsoft.`,
      linkText: 'Abrir Documento',
      linkHref: 'onedrive.com/file/xyz',
      realHref: '0nedrive-login.com/phish',
      isReal: false,
      technique: 'Spear Phishing / Autoridade',
      explanation: 'O atacante fez-se passar por uma figura de autoridade conhecida no CoderDojo (Guilherme Ferreira) para te dar confiança e te levar a abrir um ficheiro malicioso.',
      stolen: 'A tua sessão do browser e possível instalação de vírus no computador.'
    },
    {
      id: 5,
      from: 'recursos.humanos@coderdojo.local',
      subject: 'Pagamento Extraordinário - Mentores',
      body: (u) => `Olá ${u},\n\nDevido ao teu excelente desempenho, tens direito a um bónus de 50€. Clica no link para inserires o teu IBAN e receberes a transferência.`,
      linkText: 'Reclamar Bónus de 50€',
      linkHref: 'coderdojo.local/bonus',
      realHref: 'scam-money.net/collect',
      isReal: false,
      technique: 'Isco Financeiro (Baiting)',
      explanation: 'Ataques de phishing usam frequentemente prémios monetários falsos para tentar roubar os teus dados bancários.',
      stolen: 'Os teus dados bancários e informações pessoais.'
    },
    {
      id: 7,
      from: 'adm1n@cod3rdoj0.local',
      subject: `URGENTE: Confirma o teu acesso como mentor — ${username}`,
      body: (u) => `Olá ${u},\n\nHouve um erro ao validar o teu acesso ao painel de mentores CoderDojo.\n\nPara garantir que o teu acesso não é revogado, clica imediatamente no botão abaixo para confirmar os teus dados!\n\nEquipa CoderDojo`,
      linkText: 'Confirmar acesso urgente →',
      linkHref: 'https://coderdojo.local/confirm',
      realHref: 'https://cod3rdoj0.local/steal?user=' + username,
      isReal: false,
      technique: 'Urgência + Domínio falso',
      explanation: 'Sinais óbvios: linguagem de pânico e o domínio "cod3rdoj0.local" usa "3" e "0" no lugar de "e" e "o".',
      stolen: 'Credenciais de login',
    },
    {
      id: 8,
      from: 'coderdojo.pt@gmail.com',
      subject: `[Aprovado] Confirma o teu acesso como mentor — ${username}`,
      body: (u) => `Olá ${u},\n\nA tua conta de mentor CoderDojo foi aprovada.\n\nClica no link abaixo para aceder ao teu painel de administração e veres os teus ninjas registados.\n\nhttp://bit.ly/coderdojo-acesso-2026\n\nAté já!`,
      linkText: 'http://bit.ly/coderdojo-acesso-2026',
      linkHref: 'http://bit.ly/coderdojo-acesso-2026',
      realHref: 'http://malware-download.xyz/trojan.exe',
      isReal: false,
      technique: 'Email gratuito + Link encurtado',
      explanation: 'O CoderDojo usa o seu próprio domínio, nunca contas de Gmail. Além disso, links encurtados com "bit.ly" escondem o ficheiro malicioso.',
      stolen: 'Instalação de vírus no teu dispositivo',
    },
    {
      id: 13,
      from: 'mentores@coderdojo.local',
      subject: `Confirma o teu email, ${username}`,
      body: (u) => `Olá ${u},\n\nClica no botão "Confirmar" para activar o acesso.\n\nSe não fizeste este pedido, clica em "Cancelar subscrição" abaixo.\n\nCoderDojo`,
      linkText: 'Cancelar subscrição',
      linkHref: 'https://coderdojo.local/unsubscribe',
      realHref: 'https://data-harvest.net/collect?email=' + encodeURIComponent('user@dojo.pt'),
      isReal: false,
      technique: 'Link de cancelamento malicioso',
      explanation: 'O botão principal parece correcto, mas o link de "Cancelar subscrição" no rodapé leva a um site de recolha de dados.',
      stolen: 'Email confirmado + dados de comportamento',
    },
    {
      id: 18,
      from: 'noreply@coderdojo.verify-access.net',
      subject: `Confirma o teu acesso como mentor — ${username}`,
      body: (u) => `Olá ${u},\n\nRecebemos o teu pedido de acesso ao painel de mentores CoderDojo.\n\nPara confirmar, clica no botão abaixo. O link é válido por 24 horas.\n\nEquipa CoderDojo`,
      linkText: 'Confirmar acesso ao painel',
      linkHref: 'https://coderdojo.verify-access.net/confirm',
      realHref: 'https://verify-access.net/harvest',
      isReal: false,
      technique: 'Spoofing de subdomínio',
      explanation: 'O domínio tem "coderdojo" mas está como subdomínio de "verify-access.net". O domínio real é sempre a parte final.',
      stolen: 'Token de confirmação e sessão',
    },
    {
      id: 20,
      from: 'noreply@coderdojo.local',
      replyTo: 'harvest@phish-server.com',
      subject: `Confirmação de acesso — ${username}`,
      body: (u) => `Olá ${u},\n\nO teu pedido de acesso foi recebido e está a ser processado.\n\nPara confirmar o teu endereço de email e activar o acesso, clica no botão abaixo.\n\nCoderDojo Team`,
      linkText: 'Confirmar email',
      linkHref: 'https://coderdojo.local/confirm-email',
      realHref: 'https://coderdojo-fake.net/steal',
      isReal: false,
      technique: 'Reply-To diferente do remetente',
      explanation: 'O "From" parece válido mas o "Reply-To" escondido aponta para um servidor externo. O link também leva a malware.',
      stolen: 'Respostas com informação confidencial',
    },
    {
      id: 21,
      from: 'confirmacoes@coderdojo.local',
      subject: `Acesso aprovado — token de confirmação`,
      body: (u, t) => `Olá ${u},\n\nO teu pedido foi aprovado. Usa o token abaixo para confirmar:\n\nToken: ${t.replace(/-[^-]+$/, '-WXYZ')}\n\nEste token expira em 1 hora.\n\nEquipa CoderDojo`,
      linkText: 'Usar token e confirmar acesso →',
      linkHref: 'https://coderdojo.local/use-token',
      realHref: 'https://coderdojo-real.net/fake-token-page',
      isReal: false,
      technique: 'Token inválido que parece válido',
      explanation: 'O token mostrado tem o formato certo mas a última parte está errada (WXYZ). Sempre compara o token com o gerado no pedido.',
      stolen: 'Token real',
    },
    {
      id: 9,
      from: 'noreply@coderdoj0.com',
      subject: `Confirmação de acesso — ${username}`,
      body: (u) => `Olá ${u},\n\nRecebemos o teu pedido de acesso.\n\nClica no botão abaixo para confirmar o teu endereço de email e activar o acesso.\n\nEste link expira em 24 horas.\n\nEquipa CoderDojo`,
      linkText: 'Confirmar email',
      linkHref: 'https://coderdojo.local/activate',
      realHref: 'https://coderdoj0.com/steal',
      isReal: false,
      technique: 'Typosquatting — troca de letra',
      explanation: 'O domínio de destino usa o dígito "0" em vez da letra "o". Verifica sempre o domínio letra a letra.',
      stolen: 'Token de confirmação',
    },
  ];

  const real: RealEmail = {
    id: 1,
    from: 'noreply@coderdojo.local',
    subject: `Confirma o teu acesso como mentor — ${username}`,
    body: (u, t) => `Olá ${u},\n\nRecebemos o teu pedido de acesso ao painel de mentores CoderDojo.\n\nPara confirmar, clica no botão abaixo. O link é válido por 24 horas.\n\nToken de verificação: ${t}\n\nSe não fizeste este pedido, podes ignorar este email em segurança.\n\nEquipa CoderDojo`,
    linkText: 'Confirmar acesso ao painel →',
    isReal: true,
  };

  const educational: RealEmail = {
    id: 999,
    from: 'seguranca@coderdojo.local',
    subject: '❗ CUIDADO: Ataques de Phishing em curso',
    body: () => `Cuidado Membros do CoderDojo Braga.\n\nSoubemos que os nossos membros sofreram um ataque de phishing recentemente.\n\nO que é Phishing?\nPhishing é uma técnica de engano onde os atacantes fingem ser uma entidade de confiança para roubar as tuas passwords ou instalar vírus.\n\nDicas de Segurança:\n- Desconfia de emails com tom de urgência ou ofertas boas demais.\n- Verifica SEMPRE o domínio de quem envia o email.\n- Analisa o destino real dos links antes de clicares.\n\nPassa o rato pelos links (sem clicar) e analisa bem as opções abaixo!`,
    linkText: 'Compreendido',
    isReal: true,
  };

  const shuffled: Email[] = [...fakes].sort(() => Math.random() - 0.5);  const insertAt = Math.floor(Math.random() * shuffled.length);
  shuffled.splice(insertAt, 0, real);
  
  return [educational, ...shuffled];
}

// ─── Phishing Alert Modal ─────────────────────────────────────────────────────
function PhishingModal({ email, onClose }: { email: FakeEmail; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
        className="bg-gray-900 border border-red-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div className="bg-red-950/60 border-b border-red-800 px-5 py-4 flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-bold">Ataque de Phishing Detectado!</p>
            <p className="text-red-400/80 text-xs mt-0.5">Clicaste num link malicioso</p>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-500 hover:text-white shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold text-sm">Técnica:</p>
            <p className="text-yellow-300 text-sm">{email.technique}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">O que aconteceu</p>
            <p className="text-gray-300 text-sm leading-relaxed">{email.explanation}</p>
          </div>
          <div className="bg-red-950/40 border border-red-900 rounded-xl p-3">
            <p className="text-red-300 text-xs font-semibold uppercase tracking-wider mb-1">O que teriam roubado</p>
            <p className="text-red-200 text-sm">{email.stolen}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-800 rounded-xl p-2">
              <p className="text-gray-500 mb-0.5">Destino aparente</p>
              <p className="text-white font-mono break-all">{email.linkHref}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-2">
              <p className="text-gray-500 mb-0.5">Destino REAL do link</p>
              <p className="text-red-400 font-mono break-all">{email.realHref}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-semibold transition-colors"
          >Compreendi — Continuar a pesquisar</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Python Inbox ─────────────────────────────────────────────────────────────
function PythonInbox() {
  const router = useRouter();
  const game = useGame();
  const token = game.mentorToken;
  const username = game.credentials?.user ?? 'ninja';

  const emails = useMemo(() => buildEmails(username, token), [username, token]);

  const [selected, setSelected] = useState<Email | null>(null);
  const [alertEmail, setAlertEmail] = useState<FakeEmail | null>(null);
  const [success, setSuccess] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = emails.filter(e =>
    e.subject.toLowerCase().includes(search.toLowerCase()) ||
    e.from.toLowerCase().includes(search.toLowerCase())
  );

  function clickLink(email: Email) {
    if (email.id === 888) return; 
    if (email.id === 999) {
      alert('Lê bem as dicas antes de prosseguires.');
      return;
    }

    if (email.isReal) {
      setSuccess(true);
      setTimeout(() => {
        game.setLevel(5);
        if (!game.unlockedTabs.includes('champion_panel')) game.unlockTab('champion_panel');
        router.push('/dashboard/champion_panel');
      }, 1500);
    } else {
      setAlertEmail(email as FakeEmail);
    }
  }

  return (
    <div className="flex h-full min-h-[600px] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm m-6">
      <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-3 border-b border-gray-200 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Inbox <span className="text-blue-500 ml-1">{emails.length}</span>
          </p>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              className="w-full bg-white border border-gray-300 rounded-lg pl-7 pr-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-blue-500"
              placeholder="Pesquisar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map(e => (
            <button key={e.id} onClick={() => setSelected(e)}
              className={`w-full text-left px-3 py-2.5 border-b border-gray-100 hover:bg-gray-100 transition-colors ${
                selected?.id === e.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
              }`}
            >
              <p className={`text-xs font-semibold truncate text-gray-900`}>{e.from}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{e.subject}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white relative">
        {success ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-green-600 p-8">
            <CheckCircle2 className="w-14 h-14" />
            <p className="text-xl font-bold">Email legítimo encontrado!</p>
            <p className="text-gray-500 text-sm">Acesso ao Champion Panel desbloqueado.</p>
          </div>
        ) : selected ? (
          <div className="max-w-2xl mx-auto p-6 space-y-5">
            <div className="border-b border-gray-200 pb-4 space-y-2">
              <h2 className="text-gray-900 font-bold text-lg">{selected.subject}</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <span className="text-gray-500">De: </span>
                  <span className="font-mono text-gray-900">{selected.from}</span>
                </div>
                {!selected.isReal && (selected as FakeEmail).replyTo && (
                  <div>
                    <span className="text-gray-500">Reply-To: </span>
                    <span className="text-red-500 font-mono">{(selected as FakeEmail).replyTo}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Para: </span>
                  <span className="text-gray-700">{game.credentials?.email ?? 'ninja@dojo.pt'}</span>
                </div>
              </div>
            </div>

            <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl p-4 border border-gray-200">
              {selected.body(username, token ?? '')}
            </div>

            <div>
              <button onClick={() => clickLink(selected)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm ${
                  selected.id === 888 || selected.id === 999 ? 'bg-gray-200 text-gray-600 cursor-default' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {selected.linkText}
              </button>
              {!selected.isReal && (
                <div className="mt-2 text-xs font-mono group inline-block relative">
                   <span className="text-gray-400 cursor-help">→ {selected.linkHref}</span>
                   <div className="absolute top-full left-0 mt-1 opacity-0 group-hover:opacity-100 bg-gray-900 text-red-400 px-2 py-1 rounded transition-opacity duration-300 pointer-events-none z-10">
                     Destino Real: {selected.realHref}
                   </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
            <Mail className="w-12 h-12" />
            <p className="text-sm font-medium text-gray-500">Seleciona um email para ler</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {alertEmail && <PhishingModal email={alertEmail} onClose={() => setAlertEmail(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Scratch: Mobile notifications ─────────────────────────────────────────────
function ScratchInbox() {
  const router = useRouter();
  const game = useGame();
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);

  const hasToken = !!game.mentorToken;

  // O useMemo "lembra-se" da ordem para não baralhar a cada hover do rato!
  const notifications = useMemo(() => {
    const realNotification = {
      id: '1', app: 'CoderDojo',
      msg: `Olá ${game.credentials?.user ?? 'Ninja'}! Confirma o teu login no link abaixo.`,
      isReal: true, displayUrl: 'dojo.local/confirm', realUrl: 'dojo.local/confirm',
    };

    const fakeNotifications = [
      { id: '2', app: 'CoderDojo Admin', msg: 'ERRO Crítico no painel! Confirma o teu acesso rápido para não seres expulso.', isReal: false, displayUrl: 'coderdojo.local/verify', realUrl: 'cod3rdoj0.local/steal' },
      { id: '3', app: 'Mentores Dojo', msg: 'Acesso aprovado! Acede a este link encurtado para veres os teus ninjas.', isReal: false, displayUrl: 'bit.ly/acesso-mentor', realUrl: 'malware-xyz.com/trojan.exe' },
      { id: '4', app: 'InstaGram', msg: 'Alguém tentou entrar na tua conta. Muda a password.', isReal: false, displayUrl: 'instagram.com/secure', realUrl: 'lnstagram-security.net/login' },
      { id: '5', app: 'Correios', msg: 'A tua encomenda está retida na alfândega. Paga 2€ para libertar.', isReal: false, displayUrl: 'ctt.pt/tracking', realUrl: 'ctt-alfandega.com/pagar' },
      { id: '6', app: 'WhatsApp', msg: 'Tens 3 novas mensagens de voz. Ouve agora.', isReal: false, displayUrl: 'whatsapp.com/voice', realUrl: 'whats-app-voice.ru/malware' },
      { id: '7', app: 'My Games', msg: 'A tua assinatura Xbox expira amanhã. Renova aqui.', isReal: false, displayUrl: 'xbox.com/renew', realUrl: 'xboox-renew.com/billing' },
    ];

    const educationalNotif = {
      id: '999', app: 'Segurança',
      msg: '❗ CUIDADO: Phishing a decorrer! Passa o rato pelos botões antes de clicares para veres o site real.',
      isReal: true, displayUrl: 'Compreendido', realUrl: 'Aviso Lido',
    };

    const noTokenNotifs = [
      { id: '888', app: 'CoderDojo Admin', msg: 'Para receberes a notificação de Mentor, pede o acesso na página dos Mentores primeiro.', isReal: true, displayUrl: 'Ir para Mentores', realUrl: 'dojo.local/mentores' }
    ];

    // Se não há token, mostra a mensagem de bloqueio
    if (!hasToken) return noTokenNotifs;

    // Se há token, baralha apenas uma vez as falsas e a verdadeira
    const mixed = [...fakeNotifications, realNotification].sort(() => Math.random() - 0.5);

    // O aviso educativo fica fixo no topo, seguido pelas baralhadas
    return [educationalNotif, ...mixed];
  }, [hasToken, game.credentials?.user]);

  function click(n: any) {
    if (n.id === '888') return; 
    if (n.id === '999') { alert('Aviso de Segurança lido!'); return; }

    if (n.isReal) {
      game.setLevel(5);
      if (!game.unlockedTabs.includes('champion_panel')) game.unlockTab('champion_panel');
      router.push('/dashboard/champion_panel');
    } else {
      setWrong(n.id);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-6 h-full">
      <p className="text-gray-500 text-sm text-center max-w-md">
        Examina as notificações no telemóvel. Passa o rato por cima dos botões para ver o URL real.
      </p>
      <div className="bg-gray-950 border-[6px] border-gray-800 rounded-[2.5rem] w-[320px] h-[600px] shadow-2xl p-4 flex flex-col relative overflow-hidden">
        <div className="flex justify-between text-xs text-gray-500 px-2 mb-4 shrink-0 font-medium tracking-wide">
          <span>9:41</span><span>🔋 87%</span>
        </div>
        
        <div className="space-y-3 flex-1 overflow-y-auto pr-1 pb-4" style={{ scrollbarWidth: 'none' }}>
          {notifications.map(n => (
            <div key={n.id} className={`bg-gray-800/90 rounded-2xl p-3 border ${wrong === n.id ? 'border-red-500' : 'border-gray-700'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-semibold text-gray-300">{n.app}</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{n.msg}</p>
              <button
                onMouseEnter={() => setHoveredUrl(n.realUrl)}
                onMouseLeave={() => setHoveredUrl(null)}
                onClick={() => click(n)}
                className={`text-xs px-3 py-1 rounded-full ${n.id === '888' || n.id === '999' ? 'bg-gray-600 text-gray-300' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
              >
                {n.displayUrl}
              </button>
              {wrong === n.id && <p className="text-red-400 text-xs mt-1">⚠ URL suspeito!</p>}
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-700/50 rounded-full shrink-0"></div>
      </div>
      <div className="h-12 flex items-center justify-center">
        <AnimatePresence>
          {hoveredUrl && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-gray-800 border border-gray-600 rounded-xl px-4 py-2 font-mono text-sm text-green-400"
            >
              Destino real: <span className="text-red-300">{hoveredUrl}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function InboxTab() {
  const { path } = useGame();
  return path === 'scratch' ? <ScratchInbox /> : <PythonInbox />;
}