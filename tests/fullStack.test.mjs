import assert from 'node:assert/strict';
import test from 'node:test';
import { createGame, drop, perfectTolerance, resume, start, step } from '../src/components/technical/FullStack/engine.ts';

const kinds = ['data', 'application', 'interface'];
const levelsFor = (projects) => Array.from({ length: projects * 3 }, (_, index) => ({
  projectIndex: Math.floor(index / 3), projectName: `Project ${Math.floor(index / 3)}`, kind: kinds[index % 3], label: `Tech ${index}`, hue: 160,
}));

const playing = (projects = 2) => { const state = createGame(levelsFor(projects), 500); start(state); return state; };
const alignWithTop = (state, shift = 0) => { state.moving.x = state.tower.at(-1).x + shift; };

test('a new game waits on the foundation, then spawns a layer as wide as the tower top', () => {
  const state = createGame(levelsFor(1), 500);
  assert.equal(state.status, 'ready');
  assert.equal(state.tower.length, 1);
  start(state);
  assert.equal(state.status, 'playing');
  assert.equal(state.moving.width, state.tower[0].width);
});

test('the sliding layer bounces between the stage edges', () => {
  const state = playing();
  for (let i = 0; i < 400; i++) step(state, 1 / 60);
  assert.ok(state.moving.x >= 0 && state.moving.x + state.moving.width <= state.stage);
});

test('an off-centre drop keeps only the overlap and drops the overhang', () => {
  const state = playing();
  const top = state.tower[0];
  alignWithTop(state, 40);
  const [event] = drop(state);
  const placed = state.tower.at(-1);
  assert.equal(event.type, 'place');
  assert.equal(placed.x, top.x + 40);
  assert.equal(placed.width, top.width - 40);
  assert.equal(state.fragments.length, 1);
  assert.equal(state.fragments[0].width, 40);
  assert.equal(state.combo, 0);
});

test('a drop within tolerance is perfect, keeps full width and builds a combo', () => {
  const state = playing();
  alignWithTop(state, perfectTolerance(state.tower[0].width) - 1);
  const [event] = drop(state);
  assert.equal(event.type, 'perfect');
  assert.equal(state.tower.at(-1).width, state.tower[0].width);
  assert.equal(state.combo, 1);
});

test('missing the tower entirely ends the game', () => {
  const state = playing();
  state.moving.x = state.stage - state.moving.width;
  state.tower[0].x = 0;
  state.tower[0].width = 50;
  const [event] = drop(state);
  assert.equal(event.type, 'miss');
  assert.equal(state.status, 'over');
});

test('finishing a project pauses on a milestone with a width bonus, then continues', () => {
  const state = playing(2);
  for (let i = 0; i < 2; i++) { alignWithTop(state); drop(state); }
  alignWithTop(state, 60);
  const widthBefore = state.tower.at(-1).width - 60;
  const events = drop(state);
  assert.deepEqual(events.map((event) => event.type), ['place', 'shipped']);
  assert.equal(state.status, 'milestone');
  assert.deepEqual(state.shipped, [0]);
  assert.ok(state.tower.at(-1).width > widthBefore);
  resume(state);
  assert.equal(state.status, 'playing');
  assert.ok(state.moving);
});

test('building every project wins the game', () => {
  const state = playing(2);
  for (let i = 0; i < 6; i++) {
    if (state.status === 'milestone') resume(state);
    alignWithTop(state);
    drop(state);
  }
  assert.equal(state.status, 'won');
  assert.deepEqual(state.shipped, [0, 1]);
  assert.equal(state.events.at(-1).type, 'won');
});
