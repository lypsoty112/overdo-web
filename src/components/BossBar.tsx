// A P1 task's boss, shown at the top of its meta line on the list and the board: the boss's name, its
// bounty, and an HP bar that drains as subtasks are ticked. Once the task is done the boss reads as
// defeated and the bar goes away.
import type { Boss } from "../types";

export function BossBar({ boss }: { boss: Boss }) {
  if (boss.hp === 0) return <span className="boss defeated">☠ {boss.name} · DEFEATED</span>;

  return (
    <span className="boss">
      <span className="boss-name">
        ☠ {boss.name} · {boss.bounty} XP bounty
      </span>
      <span className="boss-hp">
        <span
          className="hp-track"
          role="progressbar"
          aria-label={`${boss.name} HP`}
          aria-valuemin={0}
          aria-valuemax={boss.maxHp}
          aria-valuenow={boss.hp}
        >
          <span className="hp-fill" style={{ width: `${(boss.hp / boss.maxHp) * 100}%` }} />
        </span>
        HP {boss.hp}/{boss.maxHp}
      </span>
    </span>
  );
}
