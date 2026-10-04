// The strip pinned to the top of the page: level and XP progress, streak, today's completions and focus
// minutes, the mood of the day, the procrastination index, and the light/dark toggle. The stats are
// whatever App hands it; the theme is global, so the toggle drives useTheme directly.
import type { Stats } from "../types";
import { useTheme } from "../useTheme";
import { MOOD_EMOJI } from "./MoodPrompt";

export function StatsBar({ stats }: { stats: Stats }) {
  const [theme, toggleTheme] = useTheme();
  const progress = Math.round((stats.xpIntoLevel / stats.xpForNextLevel) * 100);

  return (
    <header className="stats-bar">
      <span className="level">Lv {stats.level}</span>
      <span
        className="xp-track"
        role="progressbar"
        aria-label="XP to next level"
        aria-valuenow={progress}
        title={`${stats.xpIntoLevel} / ${stats.xpForNextLevel} XP`}
      >
        <span className="xp-fill" style={{ width: `${progress}%` }} />
      </span>
      <span>{stats.xp} XP</span>
      <span>🔥 {stats.streakDays}-day streak</span>
      <span>✅ {stats.completedToday} today</span>
      <span>🍅 {stats.focusMinutesToday} min</span>
      {stats.moodOfTheDay && (
        <span>
          {MOOD_EMOJI[stats.moodOfTheDay]} {stats.moodOfTheDay}
        </span>
      )}
      <span className={stats.procrastinationIndex >= 50 ? "procrastinating" : undefined}>
        Procrastination {stats.procrastinationIndex}%
      </span>
      <button
        type="button"
        className="theme-toggle"
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggleTheme}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </header>
  );
}
