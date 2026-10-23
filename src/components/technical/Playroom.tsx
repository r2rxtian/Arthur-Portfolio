import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Map } from 'lucide-react';

const AdventureGameApp = lazy(() => import('./AdventureGame/AdventureGameApp').then((module) => ({ default: module.AdventureGameApp })));
const FullStackGame = lazy(() => import('./FullStack/FullStackGame').then((module) => ({ default: module.FullStackGame })));

const games = [
  { id: 'odyssey', label: 'Project Odyssey', hint: 'Explore the map', icon: Map, component: AdventureGameApp },
  { id: 'fullstack', label: 'Full Stack', hint: 'Stack the layers', icon: Layers, component: FullStackGame },
] as const;
type GameId = (typeof games)[number]['id'];
const STORAGE_KEY = 'playroom_game';

function savedGame(): GameId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return games.some((game) => game.id === saved) ? saved as GameId : 'odyssey';
  } catch { return 'odyssey'; }
}

/** The playroom offers two games; the last one played is remembered. Only the active game is mounted. */
export function Playroom() {
  const [active, setActive] = useState<GameId>(savedGame);
  const game = games.find((candidate) => candidate.id === active) ?? games[0];
  const Game = game.component;

  function choose(id: GameId) {
    setActive(id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch { /* storage unavailable */ }
  }

  return (
    <div className="playroom">
      <div className="playroom-tabs" role="tablist" aria-label="Choose a game">
        {games.map(({ id, label, hint, icon: Icon }, index) => (
          <button key={id} id={`playroom-tab-${id}`} role="tab" aria-selected={active === id} aria-controls="playroom-panel"
            tabIndex={active === id ? 0 : -1} className="playroom-tab" onClick={() => choose(id)}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
              event.preventDefault();
              const next = games[(index + (event.key === 'ArrowRight' ? 1 : -1) + games.length) % games.length].id;
              choose(next);
              requestAnimationFrame(() => document.getElementById(`playroom-tab-${next}`)?.focus());
            }}>
            {active === id && <motion.span className="playroom-tab-selection" layoutId="playroom-tab-selection" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <Icon size={15} strokeWidth={1.6} /><span>{label}</span><small>{hint}</small>
          </button>
        ))}
      </div>
      <div className="playroom-stage" id="playroom-panel" role="tabpanel" aria-labelledby={`playroom-tab-${active}`}>
        <Suspense fallback={<div className="wb-loading" role="status">Loading {game.label}...</div>}>
          <Game key={game.id} />
        </Suspense>
      </div>
    </div>
  );
}
