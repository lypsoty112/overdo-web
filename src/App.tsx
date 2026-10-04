// Overdo's root: the TodoMVC app (add, toggle, toggle all, edit, delete, filter, clear completed) wired to
// overdo-api. Tasks are held exactly as the API returned them; every update swaps in the row it sends back.
import { type FormEvent, useCallback, useEffect, useState } from "react";
import * as api from "./api";
import { TaskItem } from "./components/TaskItem";
import type { Task } from "./types";
import { type Filter, useHashFilter } from "./useHashFilter";

const FILTERS: { filter: Filter; href: string; label: string }[] = [
  { filter: "all", href: "#/", label: "All" },
  { filter: "active", href: "#/active", label: "Active" },
  { filter: "completed", href: "#/completed", label: "Completed" },
];

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState("");
  const filter = useHashFilter();

  const reload = useCallback(() => api.listTasks().then(setTasks), []);

  useEffect(() => {
    reload();
  }, [reload]);

  const update = async (id: string, patch: api.TaskPatch) => {
    const updated = await api.updateTask(id, patch);
    setTasks((current) => current.map((task) => (task.id === id ? updated : task)));
  };

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
        {tasks.length > 0 && (
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
      <footer className="info">
        <p>Double-click to edit a task</p>
        <p>Overdo: a to-do list that does far too much</p>
      </footer>
    </>
  );
}
