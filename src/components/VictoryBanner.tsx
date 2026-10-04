// The banner that announces a defeated boss across the top of the list, then dismisses itself after a
// few seconds by calling onDone, which must keep a stable identity or every parent render restarts the
// countdown.
import { useEffect } from "react";
import type { Boss } from "../types";

interface Props {
  boss: Boss;
  onDone: () => void;
}

export function VictoryBanner({ boss, onDone }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3500);
    return () => clearTimeout(timer);
  }, [onDone]);

  const [name] = boss.name.split(",");
  return (
    <div className="victory" role="status">
      ⚔ {name} HAS FALLEN. +{boss.bounty} XP ⚔
    </div>
  );
}
