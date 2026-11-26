export interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

export function spawnSpiral(pool: Bullet[], cx: number, cy: number, angle: number, count = 8): void {
  let spawned = 0;
  for (const b of pool) {
    if (!b.active) {
      const a = angle + (spawned / count) * Math.PI * 2;
      b.x = cx;
      b.y = cy;
      b.vx = Math.cos(a) * 140;
      b.vy = Math.sin(a) * 140;
      b.active = true;
      spawned++;
      if (spawned >= count) break;
    }
  }
}
