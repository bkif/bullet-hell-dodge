import { spawnSpiral, type Bullet } from "./game/patterns";

export function mountApp(root: HTMLElement): void {
  root.innerHTML = `
    <div style="padding:16px;display:flex;flex-direction:column;align-items:center;gap:10px;">
      <h1 style="margin:0;font-size:18px;">Bullet Hell Dodge</h1>
      <div id="timer" style="font-size:12px;color:#94a3b8;">Survival: 0.0s (Move mouse to dodge)</div>
      <canvas id="bh-canvas" width="520" height="520" style="border:1px solid #334155;border-radius:10px;background:#020617;"></canvas>
    </div>
  `;

  const canvas = root.querySelector<HTMLCanvasElement>("#bh-canvas")!;
  const timerEl = root.querySelector<HTMLElement>("#timer")!;
  const ctx = canvas.getContext("2d")!;
  const pool: Bullet[] = Array.from({ length: 240 }, () => ({ x: 0, y: 0, vx: 0, vy: 0, active: false }));
  const player = { x: 260, y: 420 };
  let survival = 0;
  let angle = 0;
  let last = performance.now();

  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    player.x = e.clientX - rect.left;
    player.y = e.clientY - rect.top;
  });

  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    survival += dt;
    angle += dt * 2.2;
    if (Math.floor(survival * 10) % 2 === 0) {
      spawnSpiral(pool, 260, 100, angle, 6);
    }

    ctx.clearRect(0, 0, 520, 520);
    ctx.fillStyle = "#f43f5e";
    for (const b of pool) {
      if (!b.active) continue;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.x < 0 || b.x > 520 || b.y < 0 || b.y > 520) {
        b.active = false;
        continue;
      }
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
      ctx.fill();
      if (Math.hypot(b.x - player.x, b.y - player.y) < 7) {
        survival = 0;
      }
    }

    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(player.x, player.y, 5, 0, Math.PI * 2);
    ctx.fill();

    timerEl.textContent = `Survival: ${survival.toFixed(1)}s (Move mouse to dodge)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
