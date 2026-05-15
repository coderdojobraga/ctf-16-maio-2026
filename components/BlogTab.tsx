'use client';

import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, ArrowLeft, BookOpen } from 'lucide-react';

const POSTS = [
  {
    id: 'intro',
    title: 'O que é o CoderDojo Braga?',
    excerpt:
      'Descobre como funcionam as nossas sessões mensais e o que podes aprender connosco.',
    date: '10 Mai 2026',
    author: 'Equipa Dojo',
    featured: false,
    content: `
O CoderDojo Braga é um clube gratuito de programação para jovens entre os 7 e os 17 anos. Todos os meses reunimo-nos para criar jogos, aplicações, sites e explorar tecnologia de forma divertida.

Nas sessões existem vários caminhos que podes experimentar:
- Scratch para criar jogos e animações
- Python para aprender lógica e programação
- Web Design para criar sites reais
- Robótica e eletrónica
- Cibersegurança e desafios secretos

O mais importante no Dojo é aprender fazendo. Não precisas de ser um especialista — basta curiosidade e vontade de experimentar.

Também acreditamos que errar faz parte do processo. Muitas vezes os melhores projetos começam com bugs estranhos e ideias malucas!

Se gostas de tecnologia, jogos, computadores ou simplesmente descobrir como as coisas funcionam, vais sentir-te em casa no CoderDojo Braga.
    `,
  },

  {
    id: 'directories',
    title: 'Guia: O que são Diretorias Web?',
    excerpt:
      'Alguma vez te perguntaste como é que os sites organizam os seus ficheiros? Nem tudo o que existe está à vista.',
    date: '12 Abr 2026',
    author: 'mentor_dojo',
    featured: true,
    content: 'special-directories',
  },

  {
    id: 'scratch-tips',
    title: '5 Truques de Scratch que Parecem Magia',
    excerpt:
      'Aprende pequenos truques usados pelos ninjas mais experientes para criar jogos incríveis.',
    date: '05 Abr 2026',
    author: 'Ninja Master',
    path: 'scratch',
    content: `
O Scratch parece simples no início, mas consegue fazer coisas muito avançadas quando aprendes alguns truques.

1. Variáveis escondidas
Podes criar variáveis invisíveis para guardar pontuações secretas, vidas extra ou até códigos escondidos.

2. Clones inteligentes
Os clones permitem criar dezenas de inimigos sem teres de desenhar tudo manualmente.

3. Sons sincronizados
Adicionar pequenos efeitos sonoros faz o teu jogo parecer muito mais profissional.

4. Níveis secretos
Muitos jogos usam mensagens escondidas para desbloquear novas áreas.

5. Easter eggs
Os melhores programadores adoram esconder pequenas surpresas nos seus jogos.

Desafio:
Consegues criar um botão secreto que só aparece depois de clicares 5 vezes no mesmo sítio?
    `,
  },

  {
    id: 'python-logic',
    title: 'Lógica de Programação em Python',
    excerpt:
      'Entender ciclos e condições é o primeiro passo para dominares qualquer linguagem.',
    date: '02 Abr 2026',
    author: 'Python Pro',
    path: 'python',
    content: `
Quando programas em Python, estás basicamente a ensinar o computador a tomar decisões.

As condições ajudam o programa a escolher:
- "Se acontecer isto, faz aquilo."
- "Se não acontecer, faz outra coisa."

Exemplo:
if password == "dojo":
    print("Acesso permitido")

Os ciclos ajudam a repetir tarefas automaticamente.

Exemplo:
for i in range(5):
    print("Olá Ninja!")

Os jogos usam ciclos constantemente:
- atualizar movimentos
- contar pontos
- verificar colisões
- mostrar animações

A programação é como criar regras para um mundo virtual.
    `,
  },

  {
    id: 'passwords',
    title: 'Porque é que “123456” é uma Péssima Password?',
    excerpt:
      'Descobre como os hackers conseguem adivinhar passwords demasiado simples.',
    date: '28 Mar 2026',
    author: 'Cyber Mentor',
    content: `
Muitas pessoas usam passwords fáceis porque são simples de memorizar.

O problema?
Também são fáceis de adivinhar.

As passwords mais usadas no mundo incluem:
- 123456
- password
- qwerty
- abc123

Os atacantes usam programas automáticos que testam milhares de passwords por segundo.

Uma boa password deve:
- ter letras maiúsculas e minúsculas
- incluir números
- usar símbolos
- ser longa

Exemplo:
N1nja!Dojo2026

Ainda melhor:
usar frases completas como:
"EuAdoroPizzaAoSabado!"

É mais fácil de memorizar e muito mais segura.
    `,
  },

  {
    id: 'html',
    title: 'Como os Sites São Construídos?',
    excerpt:
      'HTML, CSS e JavaScript: as três peças principais de quase todos os sites.',
    date: '22 Mar 2026',
    author: 'Web Team',
    content: `
Quase todos os sites usam três tecnologias principais.

HTML:
É a estrutura da página.
Funciona como os blocos LEGO do site.

CSS:
Controla as cores, tamanhos, fontes e animações.

JavaScript:
Adiciona interação.
Botões, jogos, menus e efeitos usam JavaScript.

Exemplo:
- HTML cria um botão
- CSS pinta o botão
- JavaScript faz o botão funcionar

Quando visitas um site, o browser descarrega estes ficheiros e junta tudo para construir a página que vês.
    `,
  },

  {
    id: 'robots',
    title: 'O Misterioso robots.txt',
    excerpt:
      'Um pequeno ficheiro escondido que quase todos os sites possuem.',
    date: '17 Mar 2026',
    author: 'Web Explorer',
    path: 'python',
    content: `
Existe um ficheiro especial chamado robots.txt.

Normalmente encontra-se aqui:
/robots.txt

Esse ficheiro serve para dizer aos motores de busca:
- que páginas podem visitar
- que páginas devem ignorar

Exemplo:
Disallow: /admin/
Disallow: /private/

Curiosamente, alguns sites acabam por revelar diretorias secretos sem querer.

Claro que isso não significa que possas entrar.
Mas mostra como pequenos detalhes podem revelar muita informação.
    `,
  },

  {
    id: 'console',
    title: 'Ferramentas Secretas do Browser',
    excerpt:
      'Sabias que o teu browser tem ferramentas escondidas para programadores?',
    date: '10 Mar 2026',
    author: 'Frontend Ninja',
    content: `
Os browsers modernos têm ferramentas para programadores integradas.

Podes abrir normalmente com:
F12

Lá dentro consegues:
- ver o HTML do site
- alterar texto temporariamente
- ver pedidos de rede
- explorar imagens e ficheiros

Os programadores usam estas ferramentas todos os dias.

Mas atenção:
Alterar algo no teu browser NÃO altera o site verdadeiro.
Só muda no teu computador.
    `,
  },

  {
    id: 'gaming',
    title: 'Como os Jogos Guardam Pontuações?',
    excerpt:
      'Pontuações, moedas e níveis precisam de ser guardados algures.',
    date: '03 Mar 2026',
    author: 'Game Dev Team',
    content: `
Quando jogas online, o jogo precisa de guardar dados:
- moedas
- progresso
- pontuação
- inventário

Esses dados costumam ser guardados:
- numa base de dados
- no browser
- ou numa conta online

Alguns jogos usam cookies para guardar pequenas informações.

Os cookies não são bolachas verdadeiras 😄
São pequenos ficheiros usados pelos sites.
    `,
  },
];

export default function BlogTab() {
  const { path } = useGame();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const filteredPosts = POSTS.filter(
    (p) => !p.path || p.path === path
  );

  const currentPost = POSTS.find((p) => p.id === selectedPost);

  if (selectedPost && currentPost) {
    if (currentPost.id === 'directories') {
      return (
        <article className="max-w-3xl mx-auto p-8 text-gray-700 space-y-6">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </button>

          <header className="border-b border-gray-200 pb-4">
            <p className="text-xs text-purple-600 font-mono mb-2">
              dojo.local/blog/diretorios
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Guia das Diretorias Web
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Publicado por mentor_dojo · 12 Abr 2026
            </p>
          </header>

          <p>
            Quando visitas um site, estás na verdade a navegar entre
            várias pastas e ficheiros guardados num servidor.
          </p>

          <p>
            Essas pastas chamam-se <strong>diretorias</strong>.
          </p>

          <p>
            Imagina o computador como um armário cheio de gavetas.
            Cada gaveta guarda coisas diferentes:
          </p>

          <pre className="bg-gray-900 text-green-400 border border-gray-200 rounded-xl p-4 font-mono text-sm overflow-x-auto">
{`Casa/
├── Jogos/
├── Fotografias/
├── Trabalhos/
└── Segredos/`}
          </pre>

          <p>
            Os sites funcionam de forma muito parecida.
          </p>

          <h2 className="text-xl font-bold text-gray-900">
            Diretorias num site
          </h2>

          <pre className="bg-gray-900 text-green-400 border border-gray-200 rounded-xl p-4 font-mono text-sm overflow-x-auto">
{`/
├── index.html
├── blog/
├── imagens/
├── jogos/
└── admin/`}
          </pre>

          <p>
            Cada diretório pode conter mais páginas, imagens, jogos ou
            ficheiros especiais. Secalhar este blog tem texto escondido onde estão escritas diretorias secretas.
          </p>

          <p>
            Quando escreves um endereço no browser, estás a indicar ao
            servidor exatamente onde queres entrar.
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
            <h3 className="font-bold text-purple-800 mb-3">
              Exemplo prático
            </h3>

            <p className="text-sm text-purple-900 mb-3">
              Se estiveres nesta página:
            </p>

            <code className="block bg-white rounded-lg p-3 text-sm font-mono text-purple-700">
              dojo.local/blog
            </code>

            <p className="text-sm text-purple-900 mt-4 mb-3">
              Podes experimentar mudar o endereço para:
            </p>

            <code className="block bg-white rounded-lg p-3 text-sm font-mono text-purple-700">
              dojo.local/jogos
            </code>

            <p className="text-sm text-purple-900 mt-4">
              Ou até:
            </p>

            <code className="block bg-white rounded-lg p-3 text-sm font-mono text-purple-700">
              dojo.local/imagens
            </code>
          </div>

          <p>
            Nem todos as diretorias aparecem nos menus do site.
          </p>

          <p>
            Alguns existem mas ficam escondidos. Só consegues aceder se
            souberes o caminho exato.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <h3 className="font-bold text-yellow-800 mb-2">
              Importante
            </h3>

            <p className="text-sm text-yellow-900">
              Isto não significa “hackear”. Muitos sites têm páginas
              públicas que simplesmente não estão ligadas nos menus.
            </p>
          </div>

          {path === 'python' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="text-blue-700 font-semibold mb-2">
                Pista Python: robots.txt
              </h3>

              <p className="text-sm text-blue-800 mb-3">
                Alguns sites possuem um ficheiro especial chamado:
              </p>

              <code className="block bg-white rounded-lg p-3 text-sm font-mono text-blue-700">
                /robots.txt
              </code>

              <p className="text-sm text-blue-800 mt-4">
                Esse ficheiro diz aos motores de busca quais páginas não
                devem visitar.
              </p>

              <p className="text-sm text-blue-800 mt-2">
                Curiosamente, às vezes revela diretorias interessantes.
              </p>
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-900">
            Explorar caminhos
          </h2>

          <p>
            Os programadores usam diretorias para organizar melhor os
            sites:
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>/blog para artigos</li>
            <li>/jogos para minijogos</li>
            <li>/assets para imagens e sons</li>
            <li>/admin para ferramentas internas</li>
          </ul>

          <p>
            Às vezes, descobrir um novo diretório é como encontrar uma
            porta escondida num jogo.
          </p>

          <div className="pt-10 space-y-4">
            <p className="text-white select-all cursor-text leading-8">
              O diretório mais interessante nem sempre aparece no menu.
              Alguns caminhos só podem ser encontrados por quem observa com atenção. (
              
              six-seven,
              
              dojo,

              mentores,

              programar

              )
              
              
            </p>

            <p className="text-[12px] text-gray-400">
              Há texto escondido aqui.
            </p>
          </div>
        </article>
      );
    }

    return (
      <article className="max-w-3xl mx-auto p-8 text-gray-700 space-y-6">
        <button
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Blog
        </button>

        <header className="border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2 text-purple-600 mb-3">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-mono">
              dojo.local/blog/{currentPost.id}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            {currentPost.title}
          </h1>

          <p className="text-sm text-gray-400 mt-2">
            Publicado por {currentPost.author} · {currentPost.date}
          </p>
        </header>

        <div className="space-y-4 text-[15px] leading-7 whitespace-pre-line">
          {currentPost.content}
        </div>
      </article>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Blog CoderDojo Braga
        </h1>

        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          Tutoriais, desafios, tecnologia, programação e aventuras
          digitais para os nossos Ninjas.
        </p>
      </header>

      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ y: -3 }}
            onClick={() => setSelectedPost(post.id)}
            className={`cursor-pointer bg-white border rounded-2xl p-6 shadow-sm transition-all hover:shadow-md ${
              post.featured
                ? 'border-purple-300 bg-purple-50/40'
                : 'border-gray-100'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-mono text-purple-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.date}
              </span>

              {post.featured && (
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Destaque
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {post.title}
            </h2>

            <p className="text-gray-600 text-sm mb-4">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs text-gray-400">
                Por {post.author}
              </span>

              <span className="text-purple-600 text-sm font-semibold flex items-center gap-1">
                Ler mais
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}