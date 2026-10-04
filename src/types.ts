// The shapes overdo-api returns, copied by hand from its routes. Nothing type-checks across the two
// repos, so a change to an API response has to be mirrored here.
export type Status = "todo" | "doing" | "done";
export type Energy = "low" | "medium" | "high" | "chaotic";
export type Mood = "ecstatic" | "fine" | "meh" | "drained" | "feral";

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  notes: string;
  status: Status;
  priority: number;
  energy: Energy;
  dueOn: string | null;
  createdAt: string;
  completedAt: string | null;
  subtasks: Subtask[];
  tags: Tag[];
}

export interface Pomodoro {
  id: string;
  taskId: string;
  plannedMinutes: number;
  startedAt: string;
  endedAt: string | null;
  finished?: boolean;
}

export interface Horoscope {
  date: string;
  sign: string;
  reading: string;
  luckyPriority: number;
  avoid: string;
}

export interface Stats {
  xp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  streakDays: number;
  completedToday: number;
  focusMinutesToday: number;
  moodOfTheDay: Mood | null;
  procrastinationIndex: number;
}
