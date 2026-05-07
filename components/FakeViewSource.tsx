'use client';

import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface FakeViewSourceProps {
  onClose: () => void;
}

export default function FakeViewSource({ onClose }: FakeViewSourceProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gray-950 overflow-auto p-6 font-mono text-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-xs">
          view-source:dojo.local/champion
        </span>
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <pre className="text-gray-400 leading-relaxed whitespace-pre-wrap">
        <span className="text-blue-400">&lt;!DOCTYPE html&gt;</span>
        <span className="text-blue-400">&lt;html lang=&quot;pt&quot;&gt;</span>
        <span className="text-blue-400">&lt;head&gt;</span>
        <span className="text-blue-400">&lt;meta</span>{' '}
        <span className="text-yellow-300">charset</span>=
        <span className="text-green-400">&quot;UTF-8&quot;</span>
        <span className="text-blue-400">/&gt;</span>
        <span className="text-blue-400">&lt;title&gt;</span>Champion Panel
        <span className="text-blue-400">&lt;/title&gt;</span>
        <span className="text-blue-400">&lt;link</span>{' '}
        <span className="text-yellow-300">rel</span>=
        <span className="text-green-400">&quot;stylesheet&quot;</span>{' '}
        <span className="text-yellow-300">href</span>=
        <span className="text-green-400">&quot;/styles/champion.css&quot;</span>
        <span className="text-blue-400">/&gt;</span>
        <span className="text-blue-400">&lt;/head&gt;</span>
        <span className="text-blue-400">&lt;body&gt;</span>
        <span className="text-blue-400">&lt;div</span>{' '}
        <span className="text-yellow-300">class</span>=
        <span className="text-green-400">&quot;champion-panel&quot;</span>
        <span className="text-blue-400">&gt;</span>
        <span className="text-blue-400">&lt;h1&gt;</span>Acesso Champion
        <span className="text-blue-400">&lt;/h1&gt;</span>
        <span className="text-blue-400">&lt;form</span>{' '}
        <span className="text-yellow-300">id</span>=
        <span className="text-green-400">&quot;unlock-form&quot;</span>
        <span className="text-blue-400">&gt;</span>
        <span className="text-blue-400">&lt;input</span>{' '}
        <span className="text-yellow-300">type</span>=
        <span className="text-green-400">&quot;password&quot;</span>{' '}
        <span className="text-yellow-300">id</span>=
        <span className="text-green-400">&quot;champion-pass&quot;</span>
        <span className="text-blue-400">/&gt;</span>
        <span className="text-blue-400">&lt;button&gt;</span>Entrar
        <span className="text-blue-400">&lt;/button&gt;</span>
        <span className="text-blue-400">&lt;/form&gt;</span>
        <span className="text-blue-400">&lt;/div&gt;</span>
        {/* Massive neon comment */}
        <span className="text-[#00ff41] font-bold text-base animate-pulse">
          {`<!-- `}
          {'  ████████████████████████████████████████████  '}
          {'  ██                                        ██  '}
          {'  ██   AVISO CHAMPION: PASSWORD É           ██  '}
          {'  ██   tHACKER                              ██  '}
          {'  ██                                        ██  '}
          {'  ████████████████████████████████████████████  '}
          {` -->`}
        </span>
        <span className="text-blue-400">&lt;script</span>{' '}
        <span className="text-yellow-300">src</span>=
        <span className="text-green-400">&quot;/js/champion.js&quot;</span>
        <span className="text-blue-400">&gt;&lt;/script&gt;</span>
        <span className="text-blue-400">&lt;/body&gt;</span>
        <span className="text-blue-400">&lt;/html&gt;</span>
      </pre>
    </motion.div>
  );
}
