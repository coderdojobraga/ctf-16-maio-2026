'use client';

import { useState, useMemo } from 'react';
import { useGame } from '@/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Smartphone, AlertCircle, CheckCircle2, Search, X, ShieldAlert } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
type Difficulty = 'easy' | 'medium' | 'hard';

interface FakeEmail {
  id: number;
  from: string;
  replyTo?: string;
  subject: string;
  body: (username: string, token: string) => string;
  linkText: string;
  linkHref: string;        // what it SHOWS
  realHref: string;        // where it ACTUALLY goes
  isReal: false;
  difficulty: Difficulty;
  technique: string;
  explanation: string;
  stolen: string;          // what would have been stolen
}

interface RealEmail {
  id: number;
  from: string;
  subject: string;
  body: (username: string, token: string) => string;
  linkText: string;
  isReal: true;
}

type Email = FakeEmail | RealEmail;

// ─── Email Data ───────────────────────────────────────────────────────────────
function buildEmails(username: string, token: string): Email[] {
  const fakes: FakeEmail[] = [
    // ── EASY ──────────────────────────────────────────────────────────────────
    {
      id: 2,
      from: 'seguranca@cod3rdoj0.com',
      subject: '⚠️ A TUA CONTA VAI SER ELIMINADA EM 24H!!!',
      body: () => `ATENÇÃO UTILIZADOR!\n\nA tua conta será PERMANENTEMENTE ELIMINADA em 24 horas se não confirmares agora!\n\nClica IMEDIATAMENTE no botão abaixo para evitar a perda de todos os teus dados!\n\nACTUA JÁ!`,
      linkText: 'CONFIRMAR AGORA OU PERDER ACESSO',
      linkHref: 'https://cod3rdoj0.com/confirm',
      realHref: 'https://cod3rdoj0.com/steal?user=' + username,
      isReal: false,
      difficulty: 'easy',
      technique: 'Urgência extrema + Domínio falso',
      explanation: 'Dois sinais óbvios: linguagem de pânico ("ELIMINADA EM 24H!!") e o domínio "cod3rdoj0.com" usa "0" no lugar de "o". Organizações legítimas nunca criam urgência artificial para te assustar.',
      stolen: 'Credenciais de login e dados da conta',
    },
    {
      id: 3,
      from: 'noreply@coderdojo.confirmação-rapida.com',
      subject: 'Confirmar o teu email agora',
      body: () => `Caro utilizador,\n\nDeves confirmar o teu enderço de email. Clicar no botão abaixo para confirmar.\n\nSe não confirmares, o tua conta vai ser bloqueado.\n\nCumprimentos,\nEquipa CoderDojo`,
      linkText: 'Confirmar email',
      linkHref: 'https://coderdojo.confirmação-rapida.com/confirm',
      realHref: 'https://phish.ru/harvest',
      isReal: false,
      difficulty: 'easy',
      technique: 'Erros gramaticais + Domínio suspeito',
      explanation: 'O email tem vários erros ("enderço", "o tua conta vai ser bloqueado"). Phishers muitas vezes traduzem mal. O domínio "confirmação-rapida.com" também não tem relação com o CoderDojo.',
      stolen: 'Email e password se tentasses fazer login',
    },
    {
      id: 4,
      from: 'admin@coderdojo-suporte.net',
      subject: 'RESPONDE COM A TUA PASSWORD PARA CONFIRMAR',
      body: () => `Olá,\n\nPara confirmar a tua identidade e aceder ao painel de mentores, por favor RESPONDE a este email com:\n\n- O teu nome de utilizador\n- A tua palavra-passe actual\n\nObrigado pela colaboração.\n\nAdministração CoderDojo`,
      linkText: '(Responder ao email)',
      linkHref: '',
      realHref: '',
      isReal: false,
      difficulty: 'easy',
      technique: 'Pedido directo de credenciais',
      explanation: 'Nenhuma organização legítima pede a tua palavra-passe por email. Nunca. Pedir a password por email é sempre phishing, sem excepções.',
      stolen: 'Username e password em texto simples',
    },
    {
      id: 5,
      from: 'coderdojo@gmail.com',
      subject: 'Acesso ao painel - clica aqui',
      body: () => `Olá!\n\nO teu pedido foi aprovado. Clica no link abaixo para aceder ao painel.\n\nhttp://bit.ly/cd-acesso-2026\n\nAté já!`,
      linkText: 'http://bit.ly/cd-acesso-2026',
      linkHref: 'http://bit.ly/cd-acesso-2026',
      realHref: 'http://malware-download.xyz/trojan.exe',
      isReal: false,
      difficulty: 'easy',
      technique: 'Email gratuito + Link encurtado',
      explanation: 'O CoderDojo usa o seu próprio domínio, nunca Gmail. Links encurtados (bit.ly, tinyurl) escondem o destino real — podem levar a malware ou páginas de phishing.',
      stolen: 'Instalação de malware no teu computador',
    },
    {
      id: 6,
      from: 'mentor-confirmacao@coderdojo.pt',
      subject: '[SPAM?] Confirmação de acesso - verificar',
      body: () => `ATENÇÃO: Este email foi marcado como potencial SPAM pelo nosso sistema.\n\nSe achas que é legítimo, clica aqui para o desmarcar e confirmar o teu acesso.\n\nAnexo: confirmacao_acesso.exe`,
      linkText: 'Confirmar e remover de SPAM',
      linkHref: 'https://coderdojo.pt/confirm',
      realHref: 'https://phish.coderdojo.pt/harvest',
      isReal: false,
      difficulty: 'easy',
      technique: 'Falso aviso de SPAM + Anexo executável',
      explanation: 'Um email a dizer que foi marcado como SPAM é uma táctica para te fazer clicar. O anexo ".exe" é especialmente perigoso — nunca abras executáveis enviados por email.',
      stolen: 'Acesso completo ao teu sistema operativo',
    },
    {
      id: 7,
      from: 'premios@coderdojo-sorteio.com',
      subject: '🎉 Parabéns! Foste seleccionado como Mentor Destaque!',
      body: () => `Olá Ninja!\n\nForte seleccionado para o programa Mentor Destaque 2026!\n\nPrémio: €500 + Certificado Oficial\n\nPara reclamar, clica abaixo e preenche os teus dados bancários para receber a transferência.`,
      linkText: 'Reclamar o meu prémio →',
      linkHref: 'https://coderdojo-sorteio.com/premio',
      realHref: 'https://coderdojo-sorteio.com/bank-harvest',
      isReal: false,
      difficulty: 'easy',
      technique: 'Isca de prémio + Pedido de dados bancários',
      explanation: 'Prémios inesperados são sempre suspeitos. Pedir dados bancários por email é fraude financeira. O domínio "coderdojo-sorteio.com" não é oficial.',
      stolen: 'Dados bancários e informação financeira',
    },
    {
      id: 8,
      from: 'noreply@CODERDOJO.COM',
      subject: 'Confirmação de Acesso ao Painel',
      body: () => `Prezado utilizador,\n\nNos foi solicitado acesso ao painel mentor para a sua conta. Para confirmar, clica no link:\n\nATTENTION: This link expires in 1 hour.\n\nPor favor não partilhe este link com ninguém.`,
      linkText: 'Confirm Access / Confirmar Acesso',
      linkHref: 'https://coderdojo.com.verify-now.biz/confirm',
      realHref: 'https://verify-now.biz/phish',
      isReal: false,
      difficulty: 'easy',
      technique: 'Mistura de idiomas + Domínio enganoso no link',
      explanation: 'Um email que mistura português e inglês sem razão é sinal de tradução automática. O link mostra "coderdojo.com" mas o domínio real (o que está depois do último ponto antes do caminho) é "verify-now.biz".',
      stolen: 'Sessão de acesso ao painel',
    },

    // ── MEDIUM ─────────────────────────────────────────────────────────────────
    {
      id: 9,
      from: 'noreply@coderdoj0.com',
      subject: `Confirmação de acesso — ${username}`,
      body: (u) => `Olá ${u},\n\nRecebemos o teu pedido de acesso ao painel de mentores.\n\nClica no botão abaixo para confirmar o teu endereço de email e activar o acesso.\n\nEste link expira em 24 horas.\n\nEquipa CoderDojo`,
      linkText: 'Confirmar email e activar acesso',
      linkHref: 'https://coderdoj0.com/activate',
      realHref: 'https://coderdoj0.com/steal',
      isReal: false,
      difficulty: 'medium',
      technique: 'Typosquatting — troca de letra',
      explanation: 'O domínio "coderdoj0.com" usa o dígito "0" em vez da letra "o". O email parece legítimo (usa o teu nome, tom calmo), mas o domínio trai tudo. Verifica sempre o domínio letra a letra.',
      stolen: 'Token de confirmação e acesso ao painel',
    },
    {
      id: 10,
      from: 'noreply@coderdojo-portal.com',
      subject: `Pedido de acesso recebido — ${username}`,
      body: (u) => `Olá ${u},\n\nO teu pedido de acesso ao CoderDojo Mentor Portal foi registado.\n\nPara completar o processo, confirma o teu email através do link abaixo.\n\nAtenciosamente,\nCoderDojo Portal`,
      linkText: 'Confirmar acesso ao portal',
      linkHref: 'https://coderdojo-portal.com/confirm',
      realHref: 'https://coderdojo-portal.com/harvest',
      isReal: false,
      difficulty: 'medium',
      technique: 'Domínio com palavra extra',
      explanation: '"coderdojo-portal.com" não é o domínio oficial. Adicionar palavras como "-portal", "-secure", "-login" é uma táctica comum para criar domínios credíveis.',
      stolen: 'Credenciais e token de acesso',
    },
    {
      id: 11,
      from: 'noreply@coderdojo.org',
      subject: `Bem-vindo ao painel de mentores`,
      body: (u) => `Olá ${u},\n\nA tua candidatura a mentor foi aprovada! Para aceder ao painel, confirma o teu email:\n\nEquipa CoderDojo`,
      linkText: 'Aceder ao Painel de Mentores',
      linkHref: 'https://coderdojo.org/mentor-panel',
      realHref: 'https://coderdojo.org/phish',
      isReal: false,
      difficulty: 'medium',
      technique: 'TLD errado (.org em vez de .local)',
      explanation: 'O CoderDojo neste sistema usa o domínio "coderdojo.local". O ".org" é um domínio registado por terceiros para imitar o original.',
      stolen: 'Token de sessão do mentor',
    },
    {
      id: 12,
      from: 'no-reply@coderdojo.com',
      subject: 'Confirma o teu acesso como mentor',
      body: () => `Caro membro,\n\nRecebemos um pedido de acesso ao painel de mentores associado a esta conta.\n\nSe foste tu, clica abaixo para confirmar. Se não foste tu, ignora este email.\n\nEquipa de Segurança CoderDojo`,
      linkText: 'Confirmar acesso',
      linkHref: 'https://coderdojo.com/confirm-access',
      realHref: 'https://phish-coderdojo.com/harvest',
      isReal: false,
      difficulty: 'medium',
      technique: 'Saudação genérica "Caro membro"',
      explanation: 'O email usa "Caro membro" em vez do teu nome real. O email legítimo usa sempre o teu username. Além disso, o link aponta para um domínio diferente do que parece.',
      stolen: 'Sessão autenticada e token',
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
      difficulty: 'medium',
      technique: 'Link de cancelamento malicioso',
      explanation: 'O botão principal parece correcto, mas o link de "Cancelar subscrição" no rodapé leva a um site de recolha de dados. Phishers exploram a confiança nos links de unsubscribe.',
      stolen: 'Email confirmado + dados de comportamento',
    },
    {
      id: 14,
      from: 'acesso@c0derdojo.com',
      subject: `Acção necessária: confirmar acesso — ${username}`,
      body: (u) => `Olá ${u},\n\nRecebemos o teu pedido. Para completar a verificação:\n\n1. Clica no link abaixo\n2. Faz login com as tuas credenciais\n3. O acesso será activado automaticamente\n\nCoderDojo Segurança`,
      linkText: 'Verificar identidade →',
      linkHref: 'https://c0derdojo.com/verify',
      realHref: 'https://c0derdojo.com/fake-login',
      isReal: false,
      difficulty: 'medium',
      technique: 'Página de login falsa',
      explanation: '"c0derdojo.com" (com zero) é um domínio falso. O passo de "fazer login" depois de clicar é uma táctica para roubar credenciais através de uma página de login clonada.',
      stolen: 'Username e password da conta real',
    },
    {
      id: 15,
      from: 'noreply@coderdojo.local',
      subject: `Confirmação pendente — ${username}`,
      body: (u) => `Olá ${u},\n\nO teu acesso ao painel foi aprovado! Clica aqui para activar:\n\nhttps://coderdojo.local/mentor-confirm`,
      linkText: 'https://coderdojo.local/mentor-confirm',
      linkHref: 'https://coderdojo.local/mentor-confirm',
      realHref: 'https://coderdojo-fake.local/steal',
      isReal: false,
      difficulty: 'medium',
      technique: 'Texto do link ≠ destino real',
      explanation: 'O texto visível do link mostra "coderdojo.local/mentor-confirm", mas o destino real é diferente. Em HTML, é fácil disfarçar um link — o texto e o href podem ser completamente diferentes.',
      stolen: 'Token de confirmação',
    },
    {
      id: 16,
      from: 'suporte@coderdoj0.pt',
      subject: 'O teu pedido de mentor foi recebido',
      body: (u) => `Olá ${u},\n\nO teu pedido está a ser processado. Enquanto aguardas, podes confirmar o teu email para acelerar o processo.\n\nPrazo: 48 horas.\n\nEquipa de Suporte`,
      linkText: 'Confirmar email',
      linkHref: 'https://coderdoj0.pt/email-confirm',
      realHref: 'https://coderdoj0.pt/steal',
      isReal: false,
      difficulty: 'medium',
      technique: 'Typosquatting + TLD regional falso',
      explanation: 'Duas irregularidades: "coderdoj0.pt" usa "0" em vez de "o", e o domínio ".pt" não é o usado pelo sistema. Sempre verifica o domínio completo.',
      stolen: 'Confirmação de email e token',
    },
    {
      id: 17,
      from: 'noreply@coderdojo.local',
      subject: `Re: Pedido de acesso — ${username}`,
      body: (u) => `Olá ${u},\n\nEm resposta ao teu pedido de acesso, precisamos de verificar a tua identidade.\n\nClica no botão abaixo. Serás redireccionado para uma página de verificação segura.\n\nEquipa CoderDojo`,
      linkText: 'Verificação segura →',
      linkHref: 'https://coderdojo.local/secure-verify',
      realHref: 'https://evil.coderdojo.local.phish.com/steal',
      isReal: false,
      difficulty: 'medium',
      technique: '"Re:" falso + Redirecccionamento',
      explanation: 'O prefixo "Re:" simula uma resposta a um pedido anterior. O link promete "verificação segura" mas redireciona para um domínio malicioso.',
      stolen: 'Sessão e dados de verificação',
    },

    // ── HARD ───────────────────────────────────────────────────────────────────
    {
      id: 18,
      from: 'noreply@coderdojo.verify-access.net',
      subject: `Confirma o teu acesso como mentor — ${username}`,
      body: (u) => `Olá ${u},\n\nRecebemos o teu pedido de acesso ao painel de mentores CoderDojo.\n\nPara confirmar, clica no botão abaixo. O link é válido por 24 horas.\n\nEquipa CoderDojo`,
      linkText: 'Confirmar acesso ao painel',
      linkHref: 'https://coderdojo.verify-access.net/confirm',
      realHref: 'https://verify-access.net/harvest',
      isReal: false,
      difficulty: 'hard',
      technique: 'Spoofing de subdomínio',
      explanation: 'O domínio parece conter "coderdojo" mas está como subdomínio de "verify-access.net". O domínio real (o que controla o site) é sempre a parte final — "verify-access.net". "coderdojo" aqui é apenas um subdomínio que pode ser criado por qualquer um.',
      stolen: 'Token de confirmação e sessão',
    },
    {
      id: 19,
      from: 'noreply@coderdojo.security-portal.com',
      subject: `Verificação de segurança — ${username}`,
      body: (u) => `Olá ${u},\n\nDetectámos um acesso ao teu pedido de mentor a partir de um novo dispositivo. Para confirmar que és tu:\n\nToken de verificação gerado: ${token.split('-')[0]}-XXXX-XXXX\n\nEquipa de Segurança`,
      linkText: 'Verificar e confirmar acesso',
      linkHref: 'https://coderdojo.security-portal.com/verify',
      realHref: 'https://security-portal.com/phish',
      isReal: false,
      difficulty: 'hard',
      technique: 'Subdomínio + Token parcialmente correcto',
      explanation: 'Este email mostra parte do token real para parecer legítimo. No entanto, "coderdojo.security-portal.com" tem "coderdojo" apenas como subdomínio. O token visível está incompleto — táctica para criar confiança.',
      stolen: 'Token completo e credenciais de acesso',
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
      difficulty: 'hard',
      technique: 'Reply-To diferente do remetente',
      explanation: 'O "From" parece legítimo (coderdojo.local), mas o "Reply-To" escondido aponta para um servidor malicioso. Se responderes a este email, a resposta vai para os atacantes. O link também está comprometido.',
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
      difficulty: 'hard',
      technique: 'Token inválido que parece válido',
      explanation: 'O token mostrado tem o formato certo mas a última parte está errada (WXYZ). Um ninja atento compara este token com o gerado no pedido original. Tokens falsos são uma táctica avançada de phishing.',
      stolen: 'Token real se tentasses "corrigir" o token no link',
    },
    {
      id: 22,
      from: 'noreply@coderdojo.local',
      subject: `[CoderDojo] Confirmação de acesso — ${username}`,
      body: (u, t) => `Olá ${u},\n\nRecebemos o teu pedido de acesso ao painel de mentores.\n\nToken de verificação: ${t}\n\nPara confirmar, clica no botão abaixo. Este link é válido por 24 horas.\n\nCoderDojo`,
      linkText: 'Confirmar acesso →',
      linkHref: `https://coderdojo.local/confirm?token=${token}&user=${username}`,
      realHref: `https://coderdojo-mirror.com/confirm?token=${token}&user=${username}`,
      isReal: false,
      difficulty: 'hard',
      technique: 'Clone visual quase perfeito',
      explanation: 'Este email tem o domínio correcto no "From", o teu nome real, o token correcto — mas o link vai para "coderdojo-mirror.com" em vez de "coderdojo.local". A diferença é apenas no href do botão, invisível sem inspecionar.',
      stolen: 'Token real + sessão autenticada',
    },
    {
      id: 23,
      from: 'no.reply@coderdojo.local',
      subject: `Acesso mentor: confirmação necessária`,
      body: (u) => `Olá ${u},\n\nO teu pedido foi recebido. Para activar o acesso, confirma através do link personalizado abaixo.\n\nNota: Este link é único e não pode ser partilhado.\n\nCordialmente,\nSistema CoderDojo`,
      linkText: 'Link de confirmação personalizado',
      linkHref: 'https://coderdojo.local/activate?ref=mentor',
      realHref: 'https://cod3rdojo.local/activate?ref=mentor&harvest=true',
      isReal: false,
      difficulty: 'hard',
      technique: 'Remetente quase idêntico (no.reply vs noreply)',
      explanation: '"no.reply@coderdojo.local" vs "noreply@coderdojo.local" — um ponto faz a diferença. O endereço tem um ponto extra. Muitos utilizadores não reparam nesta subtileza.',
      stolen: 'Token de activação e dados de sessão',
    },
    {
      id: 24,
      from: 'noreply@coderdojo.local',
      subject: `Confirmação pendente — acção necessária`,
      body: (u, t) => `Olá ${u},\n\nO teu token de acesso foi gerado:\n\n${t}\n\nPara confirmar, acede ao link de verificação da tua sessão.\n\nEquipa Técnica CoderDojo`,
      linkText: 'Verificar sessão →',
      linkHref: 'https://coderdojo.local/session-verify',
      realHref: `https://coderdojo.local.session-verify.io/steal?t=${token}`,
      isReal: false,
      difficulty: 'hard',
      technique: 'Domínio com subdomínio enganoso no link',
      explanation: 'O "From" está correcto e o token é real, mas o link vai para "coderdojo.local.session-verify.io" — aqui "coderdojo.local" é apenas um subdomínio de "session-verify.io". Muito difícil de detectar sem verificar o href completo.',
      stolen: 'Token real e sessão activa',
    },
    {
      id: 25,
      from: 'seguranca@coderdojo.local',
      subject: `Aviso: acesso ao painel solicitado`,
      body: (u) => `Olá ${u},\n\nRecebemos um pedido de acesso ao painel de mentores. Se foste tu, confirma abaixo.\n\nSe não foste tu, clica em "Revogar pedido" imediatamente para proteger a tua conta.\n\nEquipa de Segurança`,
      linkText: '⚠️ Revogar pedido (emergência)',
      linkHref: 'https://coderdojo.local/revoke',
      realHref: 'https://coderdojo.local/revoke-fake?harvest=1',
      isReal: false,
      difficulty: 'hard',
      technique: 'Engenharia social via botão de "segurança"',
      explanation: 'Este email cria medo ("Se não foste tu...") para te fazer clicar no botão de "Revogar". O botão que parece proteger-te é o que te compromete. Uma táctica elegante que joga com o instinto de protecção.',
      stolen: 'Token de sessão ao clicar em "revogar"',
    },
    // Extra fakes to pad to 29
    {
      id: 26,
      from: 'mentor@coderdojo.io',
      subject: `Bem-vindo ao programa de mentores`,
      body: (u) => `Olá ${u}, confirmação de acesso ao programa. Clica para activar.`,
      linkText: 'Activar conta',
      linkHref: 'https://coderdojo.io/activate',
      realHref: 'https://coderdojo.io/fake-activate',
      isReal: false,
      difficulty: 'medium',
      technique: 'TLD alternativo (.io)',
      explanation: '"coderdojo.io" não é o domínio deste sistema. TLDs alternativos (.io, .co, .net) são usados para imitar sites oficiais.',
      stolen: 'Sessão de mentor',
    },
    {
      id: 27,
      from: 'noreply@coderdojo.local',
      subject: 'Notificação de sistema',
      body: () => `Sistema actualizado. Todos os mentores devem re-confirmar o acesso. Clica abaixo.`,
      linkText: 'Re-confirmar acesso',
      linkHref: 'https://coderdojo.local/reconfirm',
      realHref: 'https://evil.local/steal',
      isReal: false,
      difficulty: 'easy',
      technique: 'Notificação de sistema genérica',
      explanation: 'Email vago sem contexto específico. Não menciona o teu nome nem detalhes do pedido. Organizações legítimas identificam sempre o utilizador.',
      stolen: 'Credenciais ao re-fazer login',
    },
    {
      id: 28,
      from: 'ops@coderdojo.local',
      subject: `Token gerado: ${token.split('-')[0]}-****-****`,
      body: (u, t) => `${u}, o teu token foi gerado. Para segurança, mostramos apenas os primeiros 4 caracteres: ${t.split('-')[0]}. Confirma no link.`,
      linkText: 'Confirmar e ver token completo',
      linkHref: 'https://coderdojo.local/token-full',
      realHref: 'https://coderdojo-ops.net/harvest',
      isReal: false,
      difficulty: 'hard',
      technique: 'Token parcial para criar curiosidade',
      explanation: 'Mostrar apenas parte do token cria curiosidade para clicar e "ver o completo". O link leva a um site que vai tentar roubar o token real da tua sessão.',
      stolen: 'Token completo e dados de sessão',
    },
    {
      id: 29,
      from: 'noreply@coderdojo.local',
      subject: `[Reminder] Confirma o teu email, ${username}`,
      body: (u) => `Olá ${u}, este é um lembrete de que o teu pedido de acesso está pendente de confirmação. Clica abaixo para confirmar.`,
      linkText: 'Confirmar agora',
      linkHref: 'https://coderdojo.local/reminder-confirm',
      realHref: 'https://coderdojo-reminder.com/steal',
      isReal: false,
      difficulty: 'medium',
      technique: '"Reminder" falso',
      explanation: 'Este email imita um lembrete automático. O "From" parece correcto mas o link de "confirmar" aponta para "coderdojo-reminder.com" — domínio externo.',
      stolen: 'Token de confirmação',
    },
  ];

  const real: RealEmail = {
    id: 1,
    from: 'noreply@coderdojo.local',
    subject: `Confirma o teu acesso como mentor — ${username}`,
    body: (u, t) =>
      `Olá ${u},\n\nRecebemos o teu pedido de acesso ao painel de mentores CoderDojo.\n\nPara confirmar, clica no botão abaixo. O link é válido por 24 horas.\n\nToken de verificação: ${t}\n\nSe não fizeste este pedido, podes ignorar este email em segurança.\n\nEquipa CoderDojo`,
    linkText: 'Confirmar acesso ao painel →',
    isReal: true,
  };

  // Shuffle and inject real email at a random position
  const shuffled: Email[] = [...fakes].sort(() => Math.random() - 0.5);
  const insertAt = Math.floor(Math.random() * shuffled.length);
  shuffled.splice(insertAt, 0, real);
  return shuffled;
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────
function DiffBadge({ d }: { d: Difficulty }) {
  const map = {
    easy:   'bg-green-900/50 text-green-400 border-green-800',
    medium: 'bg-yellow-900/50 text-yellow-400 border-yellow-800',
    hard:   'bg-red-900/50 text-red-400 border-red-800',
  } as const;
  const labels = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${map[d]}`}>
      {labels[d]}
    </span>
  );
}

// ─── Phishing Alert Modal ─────────────────────────────────────────────────────
function PhishingModal({ email, onClose }: { email: FakeEmail; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
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
            <DiffBadge d={email.difficulty} />
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
              <p className="text-gray-500 mb-0.5">Remetente real</p>
              <p className="text-white font-mono break-all">{email.from}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-2">
              <p className="text-gray-500 mb-0.5">Destino real do link</p>
              <p className="text-red-400 font-mono break-all">{email.realHref}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Compreendi — Continuar a pesquisar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Python Inbox ─────────────────────────────────────────────────────────────
function PythonInbox() {
  const game = useGame();
  const token = game.mentorToken ?? 'XXX-XXX-XXX';
  const username = game.credentials?.user ?? 'ninja';

  const emails = useMemo(() => buildEmails(username, token), [username, token]);

  const [selected, setSelected] = useState<Email | null>(null);
  const [alertEmail, setAlertEmail] = useState<FakeEmail | null>(null);
  const [success, setSuccess] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = emails.filter(e =>
    e.subject.toLowerCase().includes(search.toLowerCase()) ||
    e.from.toLowerCase().includes(search.toLowerCase())
  );

  function clickLink(email: Email) {
    if (email.isReal) {
      setSuccess(true);
      setTimeout(() => {
        game.setLevel(5);
        game.unlockTab('champion_panel');
      }, 1500);
    } else {
      setAlertEmail(email as FakeEmail);
    }
  }

  return (
    <div className="flex h-full min-h-[600px]">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 flex flex-col bg-gray-900/50">
        <div className="p-3 border-b border-gray-800 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Inbox <span className="text-blue-400 ml-1">{emails.length}</span>
          </p>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              placeholder="Pesquisar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map(e => (
            <button
              key={e.id}
              onClick={() => setSelected(e)}
              className={`w-full text-left px-3 py-2.5 border-b border-gray-900/60 hover:bg-gray-800 transition-colors ${
                selected?.id === e.id ? 'bg-gray-800 border-l-2 border-l-blue-500' : ''
              }`}
            >
              <p className={`text-xs font-semibold truncate ${
                e.isReal ? 'text-green-400' : 'text-gray-300'
              }`}>
                {e.from}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{e.subject}</p>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-gray-800 text-xs text-gray-600">
          <p>💡 1 email é legítimo. Encontra-o.</p>
        </div>
      </div>

      {/* Email body */}
      <div className="flex-1 overflow-y-auto bg-gray-950">
        {success ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-green-400 p-8">
            <CheckCircle2 className="w-14 h-14" />
            <p className="text-xl font-bold">Email legítimo encontrado!</p>
            <p className="text-gray-400 text-sm">Acesso ao Champion Panel desbloqueado.</p>
          </div>
        ) : selected ? (
          <div className="max-w-2xl mx-auto p-6 space-y-5">
            {/* Email header */}
            <div className="border-b border-gray-800 pb-4 space-y-2">
              <h2 className="text-white font-bold text-lg">{selected.subject}</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <span className="text-gray-500">De: </span>
                  <span className={`font-mono ${selected.isReal ? 'text-green-400' : 'text-gray-300'}`}>
                    {selected.from}
                  </span>
                </div>
                {!selected.isReal && (selected as FakeEmail).replyTo && (
                  <div>
                    <span className="text-gray-500">Reply-To: </span>
                    <span className="text-red-400 font-mono">{(selected as FakeEmail).replyTo}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Para: </span>
                  <span className="text-gray-300">{game.credentials?.email ?? 'ninja@dojo.pt'}</span>
                </div>
              </div>
              {!selected.isReal && (
                <DiffBadge d={(selected as FakeEmail).difficulty} />
              )}
            </div>

            {/* Body */}
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line bg-gray-900 rounded-xl p-4 border border-gray-800">
              {selected.body(username, token)}
            </div>

            {/* CTA button */}
            <div>
              <button
                onClick={() => clickLink(selected)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  selected.isReal
                    ? 'bg-green-700 hover:bg-green-600 text-white'
                    : 'bg-blue-700 hover:bg-blue-600 text-white'
                }`}
              >
                {selected.linkText}
              </button>
              {!selected.isReal && (
                <p className="text-xs text-gray-600 mt-2 font-mono">
                  → {(selected as FakeEmail).linkHref}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-3">
            <Mail className="w-12 h-12" />
            <p className="text-sm">Seleciona um email para ler</p>
            <p className="text-xs max-w-xs text-center text-gray-700">
              Analisa cuidadosamente cada email. Verifica o remetente, o tom, o token e o destino dos links.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {alertEmail && (
          <PhishingModal email={alertEmail} onClose={() => setAlertEmail(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Scratch: Mobile notifications (unchanged) ────────────────────────────────
function ScratchInbox() {
  const game = useGame();
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);

  const notifications = [
    {
      id: '1',
      app: 'CoderDojo',
      msg: `Olá ${game.credentials?.user ?? 'Ninja'}! Confirma o teu login no link abaixo.`,
      isReal: true,
      displayUrl: 'dojo.local/confirm',
      realUrl: 'dojo.local/confirm',
    },
    {
      id: '2',
      app: 'Banco Seguro',
      msg: 'URGENTE: Conta bloqueada! Clica para desbloquear AGORA!',
      isReal: false,
      displayUrl: 'banco-seguro.pt',
      realUrl: 'bancoo-segur0.ru/steal',
    },
    {
      id: '3',
      app: 'Prémios App',
      msg: 'Ganhaste €1000! Levanta hoje!',
      isReal: false,
      displayUrl: 'premios.pt/levantar',
      realUrl: 'scam-premios.xyz/phish',
    },
  ];

  function click(n: typeof notifications[0]) {
    if (n.isReal) {
      game.setLevel(5);
      game.unlockTab('champion_panel');
    } else {
      setWrong(n.id);
    }
  }

  return (
    <div className="flex flex-col items-center p-8 gap-6">
      <p className="text-gray-400 text-sm text-center max-w-md">
        Examina as notificações no telemóvel. Passa o rato por cima dos botões para ver o URL real.
      </p>
      <div className="bg-gray-950 border-4 border-gray-700 rounded-[2.5rem] w-72 min-h-[480px] shadow-2xl p-4 overflow-hidden">
        <div className="flex justify-between text-xs text-gray-500 px-2 mb-3">
          <span>9:41</span><span>🔋 87%</span>
        </div>
        <div className="space-y-3">
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
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-full"
              >
                {n.displayUrl}
              </button>
              {wrong === n.id && <p className="text-red-400 text-xs mt-1">⚠ URL suspeito!</p>}
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 right-4 text-gray-600">
          <Search className="w-5 h-5" />
        </div>
      </div>
      <AnimatePresence>
        {hoveredUrl && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-gray-800 border border-gray-600 rounded-xl px-4 py-2 font-mono text-sm text-green-400"
          >
            URL real: <span className="text-red-300">{hoveredUrl}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function InboxTab() {
  const { path } = useGame();
  return path === 'scratch' ? <ScratchInbox /> : <PythonInbox />;
}
