// One row of the TodoMVC list: a completion checkbox, a title that becomes an input on double-click and a
// destroy button. Saving happens only on blur: Enter blurs, Escape restores the old title and then blurs,
// and an emptied title deletes the task, as the TodoMVC spec asks.
import { useState } from "react";
import type { TaskPatch } from "../api";
import type { Task } from "../types";

interface Props {
  task: Task;
  onUpdate: (patch: TaskPatch) => void;
  onDelete: () => void;
}

export function TaskItem({ task, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const done = task.status === "done";

  const save = (value: string) => {
    setEditing(false);
    const title = value.trim();
    if (!title) onDelete();
    else if (title !== task.title) onUpdate({ title });
  };

  return (
    <li className={[done && "completed", editing && "editing"].filter(Boolean).join(" ")}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={done}
          onChange={() => onUpdate({ status: done ? "todo" : "done" })}
        />
        {/* biome-ignore lint/a11y/noLabelWithoutControl: TodoMVC's CSS styles this label; binding it to the checkbox would toggle the task on every double-click to edit. */}
        <label onDoubleClick={() => setEditing(true)}>{task.title}</label>
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
    </li>
  );
}
