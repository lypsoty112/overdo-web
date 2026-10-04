// One row of the TodoMVC list: a completion checkbox, a title that becomes an input on double-click, a
// TaskMeta line (boss bar for P1 tasks, priority, energy, due date, subtask progress, tags), a 🍅 button
// that starts a focus session, a button that unfolds TaskDetails and a destroy button. A title saves
// only on blur: Enter blurs, Escape restores the old title and then blurs, and an emptied title deletes
// the task, as the TodoMVC spec asks.
import { useState } from "react";
import type { TaskPatch } from "../api";
import type { Task } from "../types";
import { BossBar } from "./BossBar";
import { ENERGY_ICONS, TaskDetails } from "./TaskDetails";

interface Props {
  task: Task;
  onUpdate: (patch: TaskPatch) => void;
  onDelete: () => void;
  onChanged: () => void;
  onStartFocus: () => void;
}

export function TaskMeta({ task }: { task: Task }) {
  const today = new Date().toISOString().slice(0, 10);
  const overdue = task.dueOn !== null && task.status !== "done" && task.dueOn < today;
  const subtasksDone = task.subtasks.filter((subtask) => subtask.done).length;

  return (
    <span className="task-meta">
      {task.boss && <BossBar boss={task.boss} />}
      <span className={`priority p${task.priority}`}>P{task.priority}</span>
      <span>
        {ENERGY_ICONS[task.energy]} {task.energy}
      </span>
      {task.dueOn && <span className={overdue ? "overdue" : undefined}>due {task.dueOn}</span>}
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

export function TaskItem({ task, onUpdate, onDelete, onChanged, onStartFocus }: Props) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const done = task.status === "done";
  const classes = [done && "completed", editing && "editing", expanded && "expanded"].filter(Boolean);

  const save = (value: string) => {
    setEditing(false);
    const title = value.trim();
    if (!title) onDelete();
    else if (title !== task.title) onUpdate({ title });
  };

  return (
    <li className={classes.join(" ")}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={done}
          onChange={() => onUpdate({ status: done ? "todo" : "done" })}
        />
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
