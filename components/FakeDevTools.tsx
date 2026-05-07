'use client';

import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { ChevronRight } from 'lucide-react';

const MENTOR_COOKIE  = 'bWVudG9y';
const CHAMPION_COOKIE = 'Y2hhbXBpb24';

export default function FakeDevTools() {
  const game = useGame();
  const [tab, setTab] = useState<'elements' | 'console' | 'application'>('application');
  const [appSection, setAppSection] = useState<'cookies' | 'storage'>('cookies');
  const [cookieValue, setCookieValue] = useState(game.simulatedCookies.role);
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(cookieValue);
  const [success, setSuccess] = useState(false);

  function saveEdit() {
    setCookieValue(editVal);
    game.setSimulatedCookies({ role: editVal });
    setEditing(false);
    if (editVal === CHAMPION_COOKIE) setSuccess(true);
  }

  return (
    <div className="flex flex-col h-full text-xs font-mono bg-gray-900 text-gray-300">
      <div className="flex items-center gap-1 px-3 py-2 bg-gray-950 border-b border-gray-700">
        <span className="text-gray-500">DevTools</span>
        <span className="text-gray-700">—</span>
        <span className="text-blue-400">dojo.local/champion</span>
      </div>
      <div className="flex border-b border-gray-700 bg-gray-950">
        {(['elements', 'console', 'application'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-2 capitalize transition-colors ${
              tab === t ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'
            }`}
          >{t}</button>
        ))}
      </div>

      {tab === 'elements' && (
        <div className="p-3 flex-1 overflow-y-auto text-gray-500">
          <span className="text-blue-400">{'<html>'}</span>
          <div className="pl-4">
            <span className="text-blue-400">{'<body>'}</span>
            <div className="pl-4">
              <div className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3" />
                <span className="text-blue-400">{'<div '}</span>
                <span className="text-yellow-300">class</span>
                <span className="text-gray-500">=</span>
                <span className="text-green-400">"champion-panel"</span>
                <span className="text-blue-400">{'>'}</span>
              </div>
            </div>
            <span className="text-blue-400">{'</body>'}</span>
          </div>
          <span className="text-blue-400">{'</html>'}</span>
        </div>
      )}

      {tab === 'console' && (
        <div className="p-3 flex-1 overflow-y-auto space-y-1">
          <div className="text-gray-600">{'>'} Champion panel loaded</div>
          <div className="text-yellow-400">⚠ No champion role detected in cookies</div>
          <div className="text-gray-600">{'>'} Hint: Check Application → Cookies</div>
        </div>
      )}

      {tab === 'application' && (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-36 border-r border-gray-700 p-2 space-y-1 bg-gray-900">
            <p className="text-gray-600 uppercase text-xs px-1 mb-2">Storage</p>
            {(['cookies', 'storage'] as const).map(s => (
              <button key={s} onClick={() => setAppSection(s)}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  appSection === s ? 'bg-gray-700 text-purple-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >{s === 'cookies' ? '🍪 Cookies' : '💾 Local Storage'}</button>
            ))}
          </div>
          <div className="flex-1 overflow-auto bg-gray-900">
            {appSection === 'cookies' && (
              <div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-500">
                      <th className="text-left px-2 py-1.5">Name</th>
                      <th className="text-left px-2 py-1.5">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="px-2 py-1.5 text-yellow-300">role</td>
                      <td className="px-2 py-1.5">
                        {editing ? (
                          <div className="flex gap-1">
                            <input autoFocus
                              className="bg-gray-800 border border-purple-500 rounded px-1 py-0.5 text-green-400 w-36"
                              value={editVal} onChange={e => setEditVal(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false); }}
                            />
                            <button onClick={saveEdit} className="text-green-400 hover:text-green-300">✓</button>
                          </div>
                        ) : (
                          <span onDoubleClick={() => { setEditing(true); setEditVal(cookieValue); }}
                            className="text-green-400 cursor-pointer hover:bg-gray-700 px-1 rounded" title="Duplo clique para editar"
                          >{cookieValue}</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-gray-600 px-2 pt-2">Duplo clique no valor para editar.</p>
                {success && (
                  <div className="mt-3 mx-2 bg-green-900/40 border border-green-700 rounded-xl p-2 text-green-400">
                    Cookie alterado para champion! Panel desbloqueado.
                  </div>
                )}
                <div className="mt-4 mx-2 p-2 bg-gray-800 rounded-xl border border-gray-700 space-y-1">
                  <p className="text-gray-500">Dica:</p>
                  <p><span className="text-gray-500">mentor   =</span> <span className="text-blue-300">{MENTOR_COOKIE}</span></p>
                  <p><span className="text-gray-500">champion =</span> <span className="text-blue-300">???</span></p>
                  <p className="text-gray-600 text-xs">Base64 encode para descobrir o valor correcto.</p>
                </div>
              </div>
            )}
            {appSection === 'storage' && (
              <div className="p-3 text-gray-500">
                <p>ctf-dojo-state: <span className="text-gray-400">[object]</span></p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
