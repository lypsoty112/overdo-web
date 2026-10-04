// Overdo's root: the TodoMVC app (add, toggle, toggle all, edit, delete, filter, clear completed) wired to
// overdo-api, plus everything bolted on around it: the stats bar, the kanban board behind #/board, the
// horoscope, the running pomodoro, the mood check-in and the boss victory banner. Tasks are held exactly
// as the API returned them; every update swaps in the row it sends back. A status change refreshes the
// stats, and completing a task fires confetti, announces a fallen boss, and asks how it felt.
import confetti from "canvas-confetti";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import * as api from "./api";
import { Board } from "./components/Board";
import { HoroscopeCard } from "./components/HoroscopeCard";
import { MoodPrompt } from "./components/MoodPrompt";
import { PomodoroWidget } from "./components/PomodoroWidget";
import { StatsBar } from "./components/StatsBar";
import { TaskItem } from "./components/TaskItem";
import { VictoryBanner } from "./components/VictoryBanner";
import type { Boss, Pomodoro, Stats, Task } from "./types";
import { type Filter, useHashFilter } from "./useHashFilter";

const FILTERS: { filter: Filter; href: string; label: string }[] = [
  { filter: "all", href: "#/", label: "All" },
  { filter: "active", href: "#/active", label: "Active" },
  { filter: "completed", href: "#/completed", label: "Completed" },
  { filter: "board", href: "#/board", label: "Board" },
];

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [pomodoro, setPomodoro] = useState<Pomodoro | null>(null);
  const [moodFor, setMoodFor] = useState<Task | null>(null);
  const [fallenBoss, setFallenBoss] = useState<Boss | null>(null);
  const filter = useHashFilter();

  const reload = useCallback(() => api.listTasks().then(setTasks), []);
  const refreshStats = useCallback(() => api.getStats().then(setStats), []);
  const clearFallenBoss = useCallback(() => setFallenBoss(null), []);

  useEffect(() => {
    reload();
    refreshStats();
    api.currentPomodoro().then(setPomodoro);
  }, [reload, refreshStats]);

  const celebrate = (task: Task) => {
    confetti({
      particleCount: 60 + (4 - task.priority) * 40,
      spread: 80,
      origin: { y: 0.35 },
      disableForReducedMotion: true,
    });
    setMoodFor(task);
    if (!task.boss) return;
    setFallenBoss(task.boss);
    confetti({ particleCount: 200, spread: 160, startVelocity: 55, disableForReducedMotion: true });
  };

  const update = async (id: string, patch: api.TaskPatch) => {
    const wasDone = tasks.find((task) => task.id === id)?.status === "done";
    const updated = await api.updateTask(id, patch);
    setTasks((current) => current.map((task) => (task.id === id ? updated : task)));
    if (patch.status === undefined) return;
    refreshStats();
    if (updated.status === "done" && !wasDone) celebrate(updated);
  };

  const startFocus = async (task: Task) => {
    setPomodoro(await api.startPomodoro(task.id));
    reload();
  };

  const stopFocus = useCallback(async () => {
    if (!pomodoro) return;
    const stopped = await api.stopPomodoro(pomodoro.id);
    setPomodoro(null);
    refreshStats();
    if (!stopped.finished) return;
    confetti({ particleCount: 40, origin: { x: 0.9, y: 0.9 }, disableForReducedMotion: true });
  }, [pomodoro, refreshStats]);

  const remove = async (id: string) => {
    await api.deleteTask(id);
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const add = async (event: FormEvent) => {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setDraft("");
    const created = await api.createTask(title);
    setTasks((current) => [...current, created]);
  };

  const completed = tasks.filter((task) => task.status === "done");
  const remaining = tasks.length - completed.length;
  const visible = tasks.filter(
    (task) => filter === "all" || (filter === "completed") === (task.status === "done"),
  );

  const toggleAll = () => {
    const status = remaining > 0 ? "done" : "todo";
    const flipping = tasks.filter((task) => (task.status === "done") !== (status === "done"));
    for (const task of flipping) update(task.id, { status });
  };

  const clearCompleted = () => {
    for (const task of completed) remove(task.id);
  };

  return (
    <>
      {stats && <StatsBar stats={stats} />}
      {fallenBoss && <VictoryBanner boss={fallenBoss} onDone={clearFallenBoss} />}
      <section className="todoapp">
        <header className="header">
          <h1>overdo</h1>
          <form onSubmit={add}>
            <input
              className="new-todo"
              placeholder="What needs to be overdone?"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
          </form>
        </header>
        {tasks.length > 0 && filter === "board" && (
          <Board tasks={tasks} onMove={(task, status) => update(task.id, { status })} />
        )}
        {tasks.length > 0 && filter !== "board" && (
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              checked={remaining === 0}
              onChange={toggleAll}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
              {visible.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={(patch) => update(task.id, patch)}
                  onDelete={() => remove(task.id)}
                  onChanged={reload}
                  onStartFocus={() => startFocus(task)}
                />
              ))}
            </ul>
          </section>
        )}
        {tasks.length > 0 && (
          <footer className="footer">
            <span className="todo-count">
              <strong>{remaining}</strong> {remaining === 1 ? "item" : "items"} left
            </span>
            <ul className="filters">
              {FILTERS.map((link) => (
                <li key={link.filter}>
                  <a href={link.href} className={filter === link.filter ? "selected" : undefined}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            {completed.length > 0 && (
              <button type="button" className="clear-completed" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </footer>
        )}
      </section>
      <HoroscopeCard />
      <footer className="info">
        <p>Double-click to edit a task</p>
        <p>Overdo: a to-do list that does far too much</p>
      </footer>
      {pomodoro && (
        <PomodoroWidget
          session={pomodoro}
          taskTitle={tasks.find((task) => task.id === pomodoro.taskId)?.title ?? "a task"}
          onStop={stopFocus}
        />
      )}
      {moodFor && (
        <MoodPrompt
          task={moodFor}
          onDone={() => {
            setMoodFor(null);
            refreshStats();
          }}
        />
      )}
    </>
  );
}
