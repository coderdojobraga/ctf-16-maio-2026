'use client';

import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const QUESTIONS = [
  { q: 'O que é phishing?', options: ['Uma técnica para pescar peixes', 'Uma tentativa de enganar utilizadores para roubar dados', 'Um tipo de antivírus', 'Uma linguagem de programação'], correct: 1 },
  { q: 'O que significa HTTPS?', options: ['HyperText Transfer Protocol Secure', 'High Tech Transfer Protocol System', 'HyperText Transmission Protocol Standard', 'Home Transfer Protocol Secure'], correct: 0 },
  { q: 'Qual destes é um exemplo de palavra-passe forte?', options: ['123456', 'password', 'Xk9#mP2!qL', 'nomedata'], correct: 2 },
  { q: 'O que é um firewall?', options: ['Um programa para ver filmes', 'Um sistema que bloqueia tráfego não autorizado', 'Um tipo de vírus', 'Uma rede wi-fi'], correct: 1 },
  { q: 'O que é engenharia social em cibersegurança?', options: ['Construção de pontes', 'Programar robots', 'Manipular pessoas para obter informações confidenciais', 'Instalar software'], correct: 2 },
  { q: 'O que deves fazer se receberes um email suspeito?', options: ['Clicar em todos os links', 'Reencaminhar para todos', 'Apagar e reportar como spam', 'Responder a pedir mais informações'], correct: 2 },
  { q: 'O que é autenticação de dois fatores (2FA)?', options: ['Ter duas passwords iguais', 'Verificação extra além da senha, como um código SMS', 'Fazer login duas vezes', 'Usar dois browsers'], correct: 1 },
  { q: 'Qual destas é uma boa prática de segurança?', options: ['Usar a mesma senha em tudo', 'Partilhar a senha', 'Usar um gestor de palavras-passe', 'Escrever a senha num post-it'], correct: 2 },
  { q: 'O que é malware?', options: ['Software malicioso que pode danificar o sistema', 'Um tipo de hardware', 'Uma marca de computadores', 'Um protocolo de rede'], correct: 0 },
  { q: 'O que significa VPN?', options: ['Very Private Network', 'Virtual Public Node', 'Virtual Private Network', 'Verified Protocol Network'], correct: 2 },
];

interface QuizSimProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function QuizSim({ onClose, onSuccess }: QuizSimProps) {
  const [current, setCurrent] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [completed, setCompleted] = useState(false);

  function answer(idx: number) {
    if (idx !== QUESTIONS[current].correct) { setWrong(true); setCurrent(0); return; }
    setWrong(false);
    if (current === QUESTIONS.length - 1) setCompleted(true);
    else setCurrent(c => c + 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Quiz de Segurança</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {completed ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">🏆</div>
              <p className="text-purple-700 font-bold text-lg">Quiz concluído!</p>
              <p className="text-gray-600">O teu código secreto é:</p>
              <div className="bg-purple-50 border border-purple-200 rounded-xl px-6 py-4 font-mono text-purple-700 text-2xl font-bold tracking-widest">
                secreto-codigo
              </div>
              <button onClick={onSuccess}
                className="mt-2 px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-semibold transition-colors"
              >Ir para o Registo</button>
            </div>
          ) : (
            <div className="space-y-4">
              {wrong && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Resposta errada! O quiz recomeça do início.
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Pergunta {current + 1} / {QUESTIONS.length}</span>
                <span className="text-purple-600">{current} corretas</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${(current / QUESTIONS.length) * 100}%` }} />
              </div>
              <p className="text-gray-900 font-medium text-lg mb-4">{QUESTIONS[current].q}</p>
              <div className="grid grid-cols-1 gap-2">
                {QUESTIONS[current].options.map((opt, i) => (
                  <button key={i} onClick={() => answer(i)}
                    className="text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-400 text-gray-700 hover:text-purple-900 transition-all text-sm"
                  >{opt}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
