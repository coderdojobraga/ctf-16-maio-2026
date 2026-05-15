'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, FolderOpen, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface DirectoryFeedbackProps {
  type: 'test' | 'false';
  title: string;
  message: string;
  explanation?: string;
}

export default function DirectoryFeedback({ type, title, message, explanation }: DirectoryFeedbackProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-gray-200 rounded-3xl p-10 max-w-lg w-full text-center shadow-sm space-y-6"
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${type === 'test' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
          <FolderOpen className="w-8 h-8" />
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-2">{message}</p>
        </div>

        {explanation && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 leading-relaxed">{explanation}</p>
          </div>
        )}

        <button
          onClick={() => router.push('/dashboard/blog')}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Blog
        </button>
      </motion.div>
    </div>
  );
}