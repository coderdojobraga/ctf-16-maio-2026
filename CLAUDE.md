# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm run lint      # ESLint (Next.js config)
```

No test suite is configured. There is no `npm test` command.

## Environment

Create `.env.local` with:
```
GEMINI_API_KEY=<your_key>
```

The Gemini key must stay server-side only — it is consumed exclusively in `app/api/chat/route.ts`.

## Architecture

This is a **CoderDojo CTF game** — a 100% client-side simulation of a website with fake auth, fake cookies, fake DevTools, and a real LLM chat. There is no database. All state lives in React Context + `localStorage`.

### State: `context/GameContext.tsx`

The single source of truth. `GameState` tracks:
- `path`: `'scratch' | 'python' | null` — chosen by the player on the landing page
- `currentLevel`: 1–6
- `unlockedTabs`: which sidebar tabs are visible (start: `['login']`)
- `fakeBrowserUrl`: text shown in the simulated URL bar
- `credentials`: `{ user, pass, email }` stored in plaintext intentionally (that's the CTF lesson)
- `simulatedCookies`: `{ role }` — base64 encoded role, editable by players (Level 5 Python path)
- `chatMessageCount`: drives adaptive difficulty of DojoBOT

Access via `useGame()`. State is hydrated from `localStorage` on mount; `GameProvider` renders `null` until hydrated (prevents SSR mismatch).

### Routing

- `/` — landing page, path selection (Scratch vs Python)
- `/dashboard` — redirects based on `unlockedTabs`; requires `game.path` to be set
- `/dashboard/[tab]` — dynamic segment; each tab is a component in `components/`
- `app/api/chat/route.ts` — the only real server route; proxies Gemini API

`app/dashboard/layout.tsx` handles sidebar rendering (only unlocked tabs shown), URL bar, toast notifications on tab unlock, and redirect to `/` if no path selected.

### Level Map

| Level | Tab route       | Component               | Key mechanic |
|-------|----------------|-------------------------|--------------|
| 1     | `login`        | `LoginTab` + `QuizSim`  | Quiz → register with secret code |
| 2     | `blog`         | `BlogTab`               | Hidden text → type `/mentores` in URL bar |
| 3     | `mentores`     | `SecretMentorsPage`     | Fake file metadata → Caesar cipher (key=5) |
| 4     | `emails`       | `InboxTab`              | Phishing simulation (Scratch: hover; Python: email list) |
| 5     | `champion_panel` | `ChampionPanel`       | Scratch: Ctrl+U fake view-source; Python: edit base64 cookie in FakeDevTools |
| 6     | `dojobot`      | `UnlockedChampion` + `DojoBOT` | Social-engineer DojoBOT to extract `DELETAR-TUDO-2026` |

### Path-specific behaviour

Components check `game.path` to branch between `'scratch'` and `'python'` experiences. Both paths go through the same 6 levels but with different UI mechanics (as specified in `spec.md`).

### Key components

- `FakeDevTools.tsx` — split-pane DevTools simulation with editable cookie table (Level 5 Python)
- `FakeViewSource.tsx` — full-screen HTML overlay with visible password comment (Level 5 Scratch)
- `TerminalGlitch.tsx` — animated "hack detected" screen that prints credentials (Level 6)
- `DojoBOT.tsx` — chat UI that calls `/api/chat`; adaptive difficulty via `chatMessageCount`
- `Toast.tsx` — global toast provider; trigger with `useToast().toast(type, title, message)`

### Styling

Tailwind CSS v4 (PostCSS plugin, no `tailwind.config.js`). Animations via `framer-motion`. Icons from `lucide-react`.
