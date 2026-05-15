'use client';

import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useGame } from '@/context/GameContext';

const QUESTIONS_SCRATCH = [
  { q: 'O que é um "browser" (navegador)?', options: ['Um jogo de carros', 'Um programa para aceder à internet', 'Um tipo de vírus', 'O disco do computador'], correct: 1 },
  { q: 'O que deves fazer se um estranho te pedir a palavra-passe num jogo?', options: ['Dar apenas a primeira letra', 'Dar a palavra-passe se ele prometer coisas', 'Ignorar, não dar a palavra-passe e avisar um adulto', 'Pedir a palavra-passe dele em troca'], correct: 2 },
  { q: 'No Scratch, qual é a cor do bloco de Eventos, como o "quando alguém clicar na bandeira verde"?', options: ['Amarelo', 'Azul', 'Cor-de-laranja', 'Verde'], correct: 0 },
  { q: 'Para moveres um ator para a direita e para a esquerda, qual é o eixo que alteras no Scratch?', options: ['Eixo Z', 'Eixo Y', 'Eixo X', 'Eixo W'], correct: 2 },
  { q: 'O que significa um cadeado fechado ao lado do endereço de um site?', options: ['O site está fechado e não podes entrar', 'A ligação ao site é segura', 'Precisas de uma chave física para entrar', 'O site tem vírus'], correct: 1 },
  { q: 'A que nos referimos quando falamos em "Hardware"?', options: ['Aos programas instalados', 'Às peças físicas do computador (rato, teclado, ecrã)', 'À internet', 'Aos jogos difíceis'], correct: 1 },
  { q: 'Se quiseres que uma ação no Scratch se repita sem parar, que bloco usas?', options: ['Bloco "espera 1 segundo"', 'Bloco "se... então"', 'Bloco "para sempre"', 'Bloco "desliza"'], correct: 2 },
  { q: 'O que faz um Antivírus?', options: ['Deixa o computador doente', 'Protege o computador contra software malicioso', 'Acelera a internet', 'Limpa o pó do ecrã'], correct: 1 },
  { q: 'Como se chama o ecrã onde os teus atores do Scratch se mexem e a ação acontece?', options: ['Palco (Stage)', 'Camarim', 'Mochila', 'Script'], correct: 0 },
  { q: 'Qual destas palavras-passe é a mais segura?', options: ['123456', 'palavrapasse', 'meunome2014', 'G@toPreto7#Lx!'], correct: 3 },
];

const QUESTIONS_PYTHON = [
  { q: 'O que é "Phishing" em cibersegurança?', options: ['Uma técnica de pesca no Minecraft', 'Uma tentativa de enganar utilizadores para roubar dados', 'Um erro no código Python', 'Um tipo de firewall'], correct: 1 },
  { q: 'Qual destas funções é usada para mostrar texto no ecrã em Python?', options: ['echo()', 'console.log()', 'print()', 'display()'], correct: 2 },
  { q: 'O que é um endereço IP?', options: ['A password do router wifi', 'A identificação de um dispositivo numa rede', 'Um protocolo de impressão', 'Um tipo de variável'], correct: 1 },
  { q: 'Como inicias um comentário de uma única linha em Python?', options: ['// comentário', '/* comentário */', '% comentário', '# comentário'], correct: 3 },
  { q: 'O que é a Autenticação de Dois Fatores (2FA)?', options: ['Fazer login em dois computadores ao mesmo tempo', 'Usar duas passwords diferentes seguidas', 'Uma verificação extra além da password (ex: código por SMS)', 'Um tipo de ataque hacker'], correct: 2 },
  { q: 'Qual das seguintes opções NÃO é um tipo de dados válido em Python?', options: ['int', 'float', 'char', 'bool'], correct: 2 },
  { q: 'O que faz uma "Firewall"?', options: ['Aquece o computador nos dias frios', 'Controla e filtra o tráfego de rede (entrada e saída)', 'Apaga ficheiros antigos automaticamente', 'Cria cópias de segurança do código'], correct: 1 },
  { q: 'Qual a estrutura correta de um ciclo "para" (for) em Python?', options: ['for x in range(5):', 'for (i=0; i<5; i++)', 'loop 5 times:', 'for x = 1 to 5'], correct: 0 },
  { q: 'O que significa o "S" no protocolo HTTPS?', options: ['System', 'Secure (Seguro)', 'Standard', 'Server'], correct: 1 },
  { q: 'Numa lista (array) em Python, qual é o índice do primeiro elemento?', options: ['1', '-1', 'A', '0'], correct: 3 },
];

interface QuizSimProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function QuizSim({ onClose, onSuccess }: QuizSimProps) {
  const { path } = useGame();
  // Escolhe as perguntas certas baseadas no percurso
  const currentQuestions = path === 'python' ? QUESTIONS_PYTHON : QUESTIONS_SCRATCH;

  const [current, setCurrent] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [completed, setCompleted] = useState(false);

  function answer(idx: number) {
    if (idx !== currentQuestions[current].correct) { 
      setWrong(true); 
      setCurrent(0); 
      return;
    }
    setWrong(false);
    if (current === currentQuestions.length - 1) setCompleted(true);
    else setCurrent(c => c + 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Quiz de Segurança e Código</h2>
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
                <span>Pergunta {current + 1} / {currentQuestions.length}</span>
                <span className="text-purple-600">{current} corretas</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${(current / currentQuestions.length) * 100}%` }} />
              </div>
              <p className="text-gray-900 font-medium text-lg mb-4">{currentQuestions[current].q}</p>
              <div className="grid grid-cols-1 gap-2">
                {currentQuestions[current].options.map((opt, i) => (
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