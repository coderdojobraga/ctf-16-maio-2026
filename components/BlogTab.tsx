'use client';

import { useGame } from '@/context/GameContext';

export default function BlogTab() {
  const { path } = useGame();

  return (
    <article className="max-w-2xl mx-auto p-8 text-gray-700 space-y-6">
      <header className="border-b border-gray-200 pb-4">
        <p className="text-xs text-purple-600 font-mono mb-2">dojo.local/blog</p>
        <h1 className="text-2xl font-bold text-gray-900">Guia dos Diretórios Web</h1>
        <p className="text-sm text-gray-400 mt-1">Publicado por mentor_dojo · Nível 2</p>
      </header>

      <p>
        Quando um servidor web recebe um pedido, responde com ficheiros guardados em diretórios específicos.
        Mas nem todos os diretórios são visíveis — alguns são <em className="text-purple-700 font-medium">ocultos</em>,
        acessíveis apenas a quem souber o caminho exacto.
      </p>

      <h2 className="text-lg font-semibold text-gray-900">Estrutura típica de um site</h2>
      <pre className="bg-gray-900 text-green-400 border border-gray-200 rounded-xl p-4 font-mono text-sm overflow-x-auto">
{`/
├── index.html
├── blog/
├── assets/
├── admin/        ← restrito
└── mentores/     ← secreto?`}
      </pre>

      <p>
        Muitos sites têm áreas protegidas que não aparecem no menu. Para as encontrar, precisas de
        saber o <strong className="text-gray-900">caminho exacto</strong> — é como uma chave invisível.
        Basta modificar o URL directamente na barra de endereço do teu browser.
      </p>

      {path === 'python' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-blue-700 font-semibold mb-2">Pista Python: robots.txt</h3>
          <p className="text-sm text-blue-800">
            O ficheiro <code className="bg-blue-100 px-1 rounded text-blue-700">/robots.txt</code> diz
            aos motores de busca quais páginas <em>não</em> devem indexar.
            Curiosamente, lista exactamente os diretórios que os administradores querem esconder.
            É um mapa do tesouro público!
          </p>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-900">Pistas ocultas</h2>
      <p>Tenta seleccionar o texto abaixo para revelar as pistas:</p>

      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 space-y-2">
        <p className="text-gray-200 text-sm leading-relaxed select-all">
          Dica 1:{' '}
          <span className="text-gray-100 hover:text-gray-900 transition-colors duration-200 cursor-text">
            mentores
          </span>
          {' · '}
          Dica 2:{' '}
          <span className="text-gray-100 hover:text-gray-900 transition-colors duration-200 cursor-text">
            six-seven
          </span>
          {' · '}
          Dica 3:{' '}
          <span className="text-gray-100 hover:text-gray-900 transition-colors duration-200 cursor-text">
            ninjas
          </span>
          {' · '}
          Dica 4:{' '}
          <span className="text-gray-100 hover:text-gray-900 transition-colors duration-200 cursor-text">
            mi-bombo
          </span>
        </p>
        <p className="text-xs text-gray-400 italic">(Seleciona o texto para revelar)</p>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-2">
        <p className="text-purple-700 font-semibold text-sm">Missão do Nível 2</p>
        <p className="text-gray-600 text-sm">
          Usa as pistas acima e navega para o directório secreto modificando o URL
          directamente na <strong className="text-gray-900">barra de endereço do teu browser</strong>.
        </p>
        <p className="text-gray-400 text-xs font-mono">
          exemplo: …/dashboard/<span className="text-purple-600">???</span>
        </p>
      </div>
    </article>
  );
}
