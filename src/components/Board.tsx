// The kanban view behind #/board: one column per status, every task as a draggable card. A card carries
// its task id in the drag data, and dropping it on another column hands the task and the new status to
// onMove, so moving a card into Done completes it exactly like ticking its checkbox.
import type { DragEvent } from "react";
import type { Status, Task } from "../types";
import { TaskMeta } from "./TaskItem";

const COLUMNS: { status: Status; label: string }[] = [
  { status: "todo", label: "To do" },
  { status: "doing", label: "Doing" },
  { status: "done", label: "Done" },
];

interface Props {
  tasks: Task[];
  onMove: (task: Task, status: Status) => void;
}

export function Board({ tasks, onMove }: Props) {
  const drop = (event: DragEvent, status: Status) => {
    const task = tasks.find((candidate) => candidate.id === event.dataTransfer.getData("text/plain"));
    if (task && task.status !== status) onMove(task, status);
  };

  return (
    <div className="board">
      {COLUMNS.map((column) => {
        const cards = tasks.filter((task) => task.status === column.status);
        return (
          <section
            key={column.status}
            className="board-column"
            aria-label={column.label}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => drop(event, column.status)}
          >
            <h2>
              {column.label} <span>{cards.length}</span>
            </h2>
            {cards.map((task) => (
              <article
                key={task.id}
                className="board-card"
                draggable
                onDragStart={(event) => event.dataTransfer.setData("text/plain", task.id)}
              >
                {task.title}
                <TaskMeta task={task} />
              </article>
            ))}
          </section>
        );
      })}
    </div>
  );
}
