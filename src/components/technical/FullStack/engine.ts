/**
 * Full Stack: a timing game. A layer slides across the stage; dropping it onto the tower keeps
 * only the part that overlaps the layer below. Each project is built bottom-up from its real
 * architecture (data → application → interface). Pure logic with no DOM, so it can be unit tested.
 */
export type LayerKind = 'data' | 'application' | 'interface';
export type GameStatus = 'ready' | 'playing' | 'milestone' | 'over' | 'won';

export interface LayerDef {
  projectIndex: number;
  projectName: string;
  kind: LayerKind;
  label: string;
  hue: number;
}

export interface Block { x: number; width: number; level: LayerDef | null; perfect: boolean }
export interface Moving { x: number; width: number; dir: 1 | -1; speed: number }
export interface Fragment { x: number; width: number; floor: number; offsetY: number; vx: number; vy: number; rotation: number; spin: number; level: LayerDef }

export type GameEvent =
  | { type: 'place'; level: LayerDef; trimmed: number }
  | { type: 'perfect'; level: LayerDef; combo: number; grew: boolean }
  | { type: 'shipped'; projectIndex: number }
  | { type: 'miss'; level: LayerDef }
  | { type: 'won' };

export interface GameState {
  status: GameStatus;
  stage: number;
  baseWidth: number;
  tower: Block[];
  moving: Moving | null;
  fragments: Fragment[];
  levels: LayerDef[];
  next: number;
  score: number;
  combo: number;
  perfects: number;
  shipped: number[];
  events: GameEvent[];
}

const GRAVITY = 1800;
const START_SPEED = 0.5; // stage widths per second
const SPEED_STEP = 0.045;
const MAX_SPEED = 1.15;
const PERFECT_GROWTH = 0.08; // of base width, after 3 perfects in a row
const DEPLOY_BONUS = 0.14; // of base width, after each shipped project

export const perfectTolerance = (width: number) => Math.max(4, width * 0.035);

export function createGame(levels: LayerDef[], stage: number): GameState {
  const baseWidth = Math.round(stage * 0.56);
  return {
    status: 'ready', stage, baseWidth,
    tower: [{ x: (stage - baseWidth) / 2, width: baseWidth, level: null, perfect: false }],
    moving: null, fragments: [], levels, next: 0,
    score: 0, combo: 0, perfects: 0, shipped: [], events: [],
  };
}

function spawn(state: GameState) {
  const top = state.tower[state.tower.length - 1];
  const fromLeft = state.next % 2 === 0;
  const speed = Math.min(MAX_SPEED, START_SPEED + SPEED_STEP * state.next) * state.stage;
  state.moving = { x: fromLeft ? 0 : state.stage - top.width, width: top.width, dir: fromLeft ? 1 : -1, speed };
}

export function start(state: GameState) {
  if (state.status !== 'ready') return;
  state.status = 'playing';
  spawn(state);
}

/** Advances the sliding layer and any falling offcuts by `dt` seconds. */
export function step(state: GameState, dt: number) {
  const delta = Math.min(dt, 0.05);
  const moving = state.moving;
  if (state.status === 'playing' && moving) {
    moving.x += moving.dir * moving.speed * delta;
    if (moving.x <= 0) { moving.x = 0; moving.dir = 1; }
    if (moving.x + moving.width >= state.stage) { moving.x = state.stage - moving.width; moving.dir = -1; }
  }
  for (const fragment of state.fragments) {
    fragment.vy += GRAVITY * delta;
    fragment.offsetY += fragment.vy * delta;
    fragment.x += fragment.vx * delta;
    fragment.rotation += fragment.spin * delta;
  }
  state.fragments = state.fragments.filter((fragment) => fragment.offsetY < 2400);
}

/** Drops the sliding layer. Returns the events it caused (also appended to state.events). */
export function drop(state: GameState): GameEvent[] {
  const moving = state.moving;
  if (state.status !== 'playing' || !moving) return [];
  const level = state.levels[state.next];
  const top = state.tower[state.tower.length - 1];
  const floor = state.tower.length;
  const overlapStart = Math.max(moving.x, top.x);
  const overlap = Math.min(moving.x + moving.width, top.x + top.width) - overlapStart;
  const events: GameEvent[] = [];
  state.moving = null;

  if (overlap <= 0) {
    state.fragments.push({ x: moving.x, width: moving.width, floor, offsetY: 0, vx: moving.dir * 60, vy: -80, rotation: 0, spin: moving.dir * 1.6, level });
    state.status = 'over';
    events.push({ type: 'miss', level });
    state.events.push(...events);
    return events;
  }

  const perfect = Math.abs(moving.x - top.x) <= perfectTolerance(top.width);
  if (perfect) {
    state.combo += 1;
    state.perfects += 1;
    let width = top.width;
    let x = top.x;
    const grew = state.combo >= 3 && width < state.baseWidth;
    if (grew) {
      width = Math.min(state.baseWidth, width + state.baseWidth * PERFECT_GROWTH);
      x = clampX(top.x - (width - top.width) / 2, width, state.stage);
    }
    state.tower.push({ x, width, level, perfect: true });
    state.score += 1 + state.combo;
    events.push({ type: 'perfect', level, combo: state.combo, grew });
  } else {
    state.combo = 0;
    state.tower.push({ x: overlapStart, width: overlap, level, perfect: false });
    // The overhang breaks off on whichever side missed.
    const leftOverhang = moving.x < top.x;
    const offcutWidth = moving.width - overlap;
    state.fragments.push({
      x: leftOverhang ? moving.x : overlapStart + overlap, width: offcutWidth, floor,
      offsetY: 0, vx: (leftOverhang ? -1 : 1) * 90, vy: -60, rotation: 0, spin: (leftOverhang ? -1 : 1) * 2.4, level,
    });
    state.score += 1;
    events.push({ type: 'place', level, trimmed: offcutWidth });
  }

  state.next += 1;
  const finishedProject = state.levels[state.next]?.projectIndex !== level.projectIndex;
  if (finishedProject) {
    state.shipped.push(level.projectIndex);
    events.push({ type: 'shipped', projectIndex: level.projectIndex });
    if (state.next >= state.levels.length) {
      state.status = 'won';
      events.push({ type: 'won' });
    } else {
      // Deploy bonus: the new top widens back toward full width before the next project starts.
      const placed = state.tower[state.tower.length - 1];
      const width = Math.min(state.baseWidth, placed.width + state.baseWidth * DEPLOY_BONUS);
      placed.x = clampX(placed.x - (width - placed.width) / 2, width, state.stage);
      placed.width = width;
      state.status = 'milestone';
    }
  } else {
    spawn(state);
  }
  state.events.push(...events);
  return events;
}

/** Leaves the between-projects card and starts the next project. */
export function resume(state: GameState) {
  if (state.status !== 'milestone') return;
  state.status = 'playing';
  spawn(state);
}

function clampX(x: number, width: number, stage: number) {
  return Math.max(0, Math.min(stage - width, x));
}
