// One row of the TodoMVC list: a completion checkbox, a title that becomes an input on double-click, a
// TaskMeta line (boss bar for P1 tasks, priority, energy, due date, subtask progress, tags), a 🍅 button
// that starts a focus session, a button that unfolds TaskDetails and a destroy button. A title saves
// only on blur: Enter blurs, Escape restores the old title and then blurs, and an emptied title deletes
// the task, as the TodoMVC spec asks. describeDue turns a due date into "due tomorrow" or "3 days
// overdue", counted from the viewer's local date rather than UTC so "today" flips at their midnight.
// The selected row answers x (toggle), e (edit) and Delete, and scrolls itself into view.
import { useEffect, useRef, useState } from "react";
import type { TaskPatch } from "../api";
import type { Task } from "../types";
import { useShortcuts } from "../useShortcuts";
import { BossBar } from "./BossBar";
import { ENERGY_ICONS, TaskDetails } from "./TaskDetails";

interface Props {
  task: Task;
  selected: boolean;
  onUpdate: (patch: TaskPatch) => void;
  onDelete: () => void;
  onChanged: () => void;
  onStartFocus: () => void;
}

const DAY_MS = 86_400_000;

function localToday(): string {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join("-");
}

function plural(count: number, unit: string): string {
  return `${count} ${unit}${count === 1 ? "" : "s"}`;
}

function describeDue(dueOn: string, today: string, done: boolean): string {
  const days = Math.round((Date.parse(dueOn) - Date.parse(today)) / DAY_MS);
  if (days === 0) return "due today";
  if (days === 1) return "due tomorrow";
  if (days > 1) return `due in ${plural(days, "day")}`;
  return done ? `was due ${plural(-days, "day")} ago` : `${plural(-days, "day")} overdue`;
}

export function TaskMeta({ task }: { task: Task }) {
  const today = localToday();
  const done = task.status === "done";
  const overdue = task.dueOn !== null && !done && task.dueOn < today;
  const subtasksDone = task.subtasks.filter((subtask) => subtask.done).length;

  return (
    <span className="task-meta">
      {task.boss && <BossBar boss={task.boss} />}
      <span className={`priority p${task.priority}`}>P{task.priority}</span>
      <span>
        {ENERGY_ICONS[task.energy]} {task.energy}
      </span>
      {task.dueOn && (
        <span className={overdue ? "overdue" : undefined} title={task.dueOn}>
          {describeDue(task.dueOn, today, done)}
        </span>
      )}
      {task.subtasks.length > 0 && (
        <span>
          ☑ {subtasksDone}/{task.subtasks.length}
        </span>
      )}
      {task.tags.map((tag) => (
        <span key={tag.id} style={{ color: tag.color }}>
          #{tag.name}
        </span>
      ))}
    </span>
  );
}

export function TaskItem({ task, selected, onUpdate, onDelete, onChanged, onStartFocus }: Props) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const row = useRef<HTMLLIElement>(null);
  const done = task.status === "done";
  const classes = [done && "completed", editing && "editing", expanded && "expanded", selected && "selected"];
  const toggle = () => onUpdate({ status: done ? "todo" : "done" });

  useShortcuts({ x: toggle, e: () => setEditing(true), Delete: onDelete }, selected && !editing);

  useEffect(() => {
    if (selected) row.current?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const save = (value: string) => {
    setEditing(false);
    const title = value.trim();
    if (!title) onDelete();
    else if (title !== task.title) onUpdate({ title });
  };

  return (
    <li ref={row} className={classes.filter(Boolean).join(" ")}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={done} onChange={toggle} />
        {/* biome-ignore lint/a11y/noLabelWithoutControl: TodoMVC's CSS styles this label; binding it to the checkbox would toggle the task on every double-click to edit. */}
        <label onDoubleClick={() => setEditing(true)}>
          {task.title}
          <TaskMeta task={task} />
        </label>
        {!done && (
          <button
            type="button"
            className="focus"
            aria-label="Start a 25-minute focus session"
            onClick={onStartFocus}
          >
            🍅
          </button>
        )}
        <button
          type="button"
          className="expand"
          aria-label="Task details"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "▴" : "▾"}
        </button>
        <button type="button" className="destroy" aria-label="Delete task" onClick={onDelete} />
      </div>
      {editing && (
        <input
          className="edit"
          defaultValue={task.title}
          ref={(input) => input?.focus()}
          onBlur={(event) => save(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") event.currentTarget.value = task.title;
            if (event.key === "Enter" || event.key === "Escape") event.currentTarget.blur();
          }}
        />
      )}
      {expanded && <TaskDetails task={task} onUpdate={onUpdate} onChanged={onChanged} />}
    </li>
  );
}
