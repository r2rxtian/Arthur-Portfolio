import assert from 'node:assert/strict';
import test from 'node:test';
import { createOSState, getWindowGeometry, osReducer, TASKBAR_HEIGHT } from '../src/context/osState.ts';

const open = (state, id) => osReducer(state, { type: 'OPEN', id });

test('opening and focusing windows maintains a single foreground window', () => {
  let state = open(open(createOSState(), 'terminal'), 'projects');
  assert.equal(state.activeWindowId, 'projects');
  state = osReducer(state, { type: 'FOCUS', id: 'terminal' });
  assert.equal(state.activeWindowId, 'terminal');
  assert.ok(state.windows.terminal.zIndex > state.windows.projects.zIndex);
  assert.strictEqual(osReducer(state, { type: 'FOCUS', id: 'terminal' }), state);
});

test('closing the foreground window focuses the highest visible window', () => {
  let state = open(open(open(createOSState(), 'terminal'), 'projects'), 'ide');
  state = osReducer(state, { type: 'CLOSE', id: 'ide' });
  assert.equal(state.activeWindowId, 'projects');
  state = osReducer(state, { type: 'MINIMIZE', id: 'projects' });
  assert.equal(state.activeWindowId, 'terminal');
  state = osReducer(state, { type: 'CLOSE', id: 'terminal' });
  assert.equal(state.activeWindowId, null);
});

test('closing a background window leaves foreground focus intact', () => {
  const state = osReducer(open(open(createOSState(), 'terminal'), 'projects'), { type: 'CLOSE', id: 'terminal' });
  assert.equal(state.activeWindowId, 'projects');
});

test('restoring a minimized window retains its position and maximized state', () => {
  let state = open(createOSState(), 'terminal');
  state = osReducer(state, { type: 'MOVE', id: 'terminal', position: { x: 320, y: 150 }, viewport: { width: 1440, height: 900 } });
  state = osReducer(state, { type: 'MAXIMIZE', id: 'terminal' });
  state = osReducer(state, { type: 'MINIMIZE', id: 'terminal' });
  assert.equal(state.activeWindowId, null);
  assert.equal(state.windows.terminal.isOpen, true);
  state = open(state, 'terminal');
  assert.equal(state.windows.terminal.isMinimized, false);
  assert.equal(state.windows.terminal.isMaximized, true);
  state = osReducer(state, { type: 'MAXIMIZE', id: 'terminal' });
  assert.deepEqual(state.windows.terminal.position, { x: 320, y: 150 });
});

test('Show desktop restores only windows that it minimized', () => {
  let state = open(open(open(createOSState(), 'terminal'), 'projects'), 'ide');
  state = osReducer(state, { type: 'MINIMIZE', id: 'terminal' });
  state = osReducer(state, { type: 'DESKTOP' });
  assert.equal(state.activeWindowId, null);
  assert.deepEqual(new Set(state.desktopHiddenIds), new Set(['projects', 'ide']));
  state = osReducer(state, { type: 'DESKTOP' });
  assert.equal(state.windows.terminal.isMinimized, true);
  assert.equal(state.windows.projects.isMinimized, false);
  assert.equal(state.windows.ide.isMinimized, false);
  assert.equal(state.activeWindowId, 'ide');
});

test('Show desktop never reopens a window that was closed while hidden', () => {
  let state = osReducer(open(open(createOSState(), 'terminal'), 'projects'), { type: 'DESKTOP' });
  state = osReducer(state, { type: 'CLOSE', id: 'projects' });
  state = osReducer(state, { type: 'DESKTOP' });
  assert.equal(state.windows.projects.isOpen, false);
  assert.equal(state.activeWindowId, 'terminal');
});

test('project inspection opens the correct source and can repeat the same request', () => {
  let state = osReducer(createOSState(), { type: 'INSPECT', projectId: 'itms' });
  assert.equal(state.activeWindowId, 'ide');
  assert.deepEqual(state.editorRequest, { fileId: 'file-itms', revision: 1 });
  state = osReducer(state, { type: 'MINIMIZE', id: 'ide' });
  state = osReducer(state, { type: 'INSPECT', projectId: 'itms' });
  assert.equal(state.windows.ide.isMinimized, false);
  assert.deepEqual(state.editorRequest, { fileId: 'file-itms', revision: 2 });
});

test('desktop window geometry stays inside the viewport and above the taskbar', () => {
  const win = { ...createOSState().windows.ide, position: { x: 3000, y: 3000 } };
  for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 500 }]) {
    const geometry = getWindowGeometry(win, viewport);
    assert.ok(geometry.x >= 0 && geometry.y >= 0);
    assert.ok(geometry.x + geometry.width <= viewport.width);
    assert.ok(geometry.y + geometry.height <= viewport.height - TASKBAR_HEIGHT);
  }
});

test('phone windows use all available space while preserving desktop placement', () => {
  const win = createOSState().windows.ide;
  assert.deepEqual(getWindowGeometry(win, { width: 390, height: 844 }), { x: 0, y: 0, width: 390, height: 800 });
  assert.deepEqual(win.position, { x: 180, y: 72 });
});

test('dragging and viewport resizing clamp saved positions without mutating old state', () => {
  const previous = open(createOSState(), 'terminal');
  const moved = osReducer(previous, { type: 'MOVE', id: 'terminal', position: { x: -100, y: 3000 }, viewport: { width: 1000, height: 700 } });
  assert.deepEqual(previous.windows.terminal.position, { x: 120, y: 90 });
  assert.deepEqual(moved.windows.terminal.position, { x: 0, y: 206 });
  const fitted = osReducer(moved, { type: 'FIT', viewport: { width: 800, height: 500 } });
  assert.equal(fitted.windows.terminal.position.y, 24);
});

test('focusing a closed window does not accidentally reopen it', () => {
  const state = createOSState();
  assert.strictEqual(osReducer(state, { type: 'FOCUS', id: 'terminal' }), state);
});
