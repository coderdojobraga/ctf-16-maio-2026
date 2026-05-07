'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type NinjaPath = 'scratch' | 'python' | null;
type Level = 1 | 2 | 3 | 4 | 5 | 6;

interface GameState {
  path: NinjaPath;
  currentLevel: Level;
  unlockedTabs: string[];
  fakeBrowserUrl: string;
  credentials: { user: string; pass: string; email: string } | null;
  simulatedCookies: { role: string };
  chatMessageCount: number;
  mentorToken: string | null;
}

interface GameContextValue extends GameState {
  setPath: (path: NinjaPath) => void;
  setLevel: (level: Level) => void;
  unlockTab: (tab: string) => void;
  setFakeBrowserUrl: (url: string) => void;
  setCredentials: (creds: { user: string; pass: string; email: string }) => void;
  setSimulatedCookies: (cookies: { role: string }) => void;
  incrementChatCount: () => void;
  setMentorToken: (token: string) => void;
  resetGame: () => void;
}

const defaultState: GameState = {
  path: null,
  currentLevel: 1,
  unlockedTabs: ['login'],
  fakeBrowserUrl: 'https://dojo.local/login',
  credentials: null,
  simulatedCookies: { role: 'bWVudG9y' },
  chatMessageCount: 0,
  mentorToken: null,
};

const GameContext = createContext<GameContextValue | null>(null);

const STORAGE_KEY = 'ctf-dojo-state';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const setPath = useCallback((path: NinjaPath) => {
    setState(s => ({ ...s, path }));
  }, []);

  const setLevel = useCallback((level: Level) => {
    setState(s => ({ ...s, currentLevel: level }));
  }, []);

  const unlockTab = useCallback((tab: string) => {
    setState(s => ({
      ...s,
      unlockedTabs: s.unlockedTabs.includes(tab) ? s.unlockedTabs : [...s.unlockedTabs, tab],
    }));
  }, []);

  const setFakeBrowserUrl = useCallback((url: string) => {
    setState(s => ({ ...s, fakeBrowserUrl: url }));
  }, []);

  const setCredentials = useCallback((credentials: { user: string; pass: string; email: string }) => {
    setState(s => ({ ...s, credentials }));
  }, []);

  const setSimulatedCookies = useCallback((simulatedCookies: { role: string }) => {
    setState(s => ({ ...s, simulatedCookies }));
  }, []);

  const incrementChatCount = useCallback(() => {
    setState(s => ({ ...s, chatMessageCount: s.chatMessageCount + 1 }));
  }, []);

  const setMentorToken = useCallback((token: string) => {
    setState(s => ({ ...s, mentorToken: token }));
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  }, []);

  if (!hydrated) return null;

  return (
    <GameContext.Provider
      value={{
        ...state,
        setPath,
        setLevel,
        unlockTab,
        setFakeBrowserUrl,
        setCredentials,
        setSimulatedCookies,
        incrementChatCount,
        setMentorToken,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
