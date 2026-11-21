// Pointer and keyboard. One job: turn a browser event into a point in the stage
// that the game can reason about, in CSS pixels of the stage.

export function createInput(canvas, stageW, stageH, onPick, onKey, onMove) {
  const toStage = (ev) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((ev.clientX - rect.left) / rect.width) * stageW,
      y: ((ev.clientY - rect.top) / rect.height) * stageH,
      inside: true,
    };
  };

  canvas.addEventListener('pointermove', (ev) => {
    const p = toStage(ev);
    if (onMove) onMove(p);
  });

  canvas.addEventListener('pointerleave', () => {
    if (onMove) onMove({ x: -1, y: -1, inside: false });
  });

  canvas.addEventListener('pointerdown', (ev) => {
    ev.preventDefault();
    canvas.focus();
    onPick(toStage(ev));
  });

  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Tab') return;
    onKey(ev.key);
    if (ev.key === ' ' || ev.key === 'Enter') ev.preventDefault();
  });
}
