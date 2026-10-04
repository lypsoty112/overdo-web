// The panel that unfolds under a task: priority, energy and due date selectors, free-form notes (saved on
// blur), tag chips with an autocompleting input, and a subtask checklist. Field edits go through onUpdate,
// which swaps in the task the API returns; tag and subtask edits call onChanged to reload the list.
import { type KeyboardEvent, useEffect, useState } from "react";
import * as api from "../api";
import type { Energy, Tag, Task } from "../types";

export const ENERGY_ICONS: Record<Energy, string> = { low: "🐢", medium: "🚶", high: "⚡", chaotic: "🌪️" };

interface Props {
  task: Task;
  onUpdate: (patch: api.TaskPatch) => void;
  onChanged: () => void;
}

function onEnter(submit: (value: string) => Promise<unknown>) {
  return (event: KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const value = input.value.trim();
    if (event.key !== "Enter" || !value) return;
    input.value = "";
    submit(value);
  };
}

export function TaskDetails({ task, onUpdate, onChanged }: Props) {
  const [knownTags, setKnownTags] = useState<Tag[]>([]);

  useEffect(() => {
    api.listTags().then(setKnownTags);
  }, []);

  return (
    <div className="task-details">
      <div className="detail-row">
        <label>
          Priority
          <select
            value={task.priority}
            onChange={(event) => onUpdate({ priority: Number(event.target.value) })}
          >
            {[1, 2, 3, 4].map((priority) => (
              <option key={priority} value={priority}>
                P{priority}
              </option>
            ))}
          </select>
        </label>
        <label>
          Energy
          <select
            value={task.energy}
            onChange={(event) => onUpdate({ energy: event.target.value as Energy })}
          >
            {Object.entries(ENERGY_ICONS).map(([energy, icon]) => (
              <option key={energy} value={energy}>
                {icon} {energy}
              </option>
            ))}
          </select>
        </label>
        <label>
          Due
          <input
            type="date"
            value={task.dueOn ?? ""}
            onChange={(event) => onUpdate({ dueOn: event.target.value || null })}
          />
        </label>
      </div>

      <textarea
        className="task-notes"
        placeholder="Notes, excuses, a manifesto…"
        defaultValue={task.notes}
        onBlur={(event) => event.target.value !== task.notes && onUpdate({ notes: event.target.value })}
      />

      <div className="task-tags">
        {task.tags.map((tag) => (
          <span key={tag.id} className="tag" style={{ borderColor: tag.color, color: tag.color }}>
            #{tag.name}
            <button
              type="button"
              aria-label={`Remove tag ${tag.name}`}
              onClick={() => api.removeTag(task.id, tag.id).then(onChanged)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          placeholder="+ tag"
          list={`tags-${task.id}`}
          onKeyDown={onEnter((name) => api.addTag(task.id, name).then(onChanged))}
        />
        <datalist id={`tags-${task.id}`}>
          {knownTags.map((tag) => (
            <option key={tag.id} value={tag.name} />
          ))}
        </datalist>
      </div>

      <ul className="subtasks">
        {task.subtasks.map((subtask) => (
          <li key={subtask.id} className={subtask.done ? "done" : undefined}>
            <label>
              <input
                type="checkbox"
                checked={subtask.done}
                onChange={() => api.updateSubtask(subtask.id, { done: !subtask.done }).then(onChanged)}
              />
              {subtask.title}
            </label>
            <button
              type="button"
              aria-label={`Delete subtask ${subtask.title}`}
              onClick={() => api.deleteSubtask(subtask.id).then(onChanged)}
            >
              ×
            </button>
          </li>
        ))}
        <li>
          <input
            placeholder="+ subtask"
            onKeyDown={onEnter((title) => api.addSubtask(task.id, title).then(onChanged))}
          />
        </li>
      </ul>
    </div>
  );
}
