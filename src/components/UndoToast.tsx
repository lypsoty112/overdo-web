// The toast that holds a delete for five seconds before it reaches the API. Undo puts the tasks back;
// letting the countdown run out calls onExpire, which sends the delete. onExpire must keep a stable
// identity per pending delete, or every parent render restarts the countdown.
import { useEffect } from "react";
import type { Task } from "../types";

interface Props {
  tasks: Task[];
  onUndo: () => void;
  onExpire: () => void;
}

export function UndoToast({ tasks, onUndo, onExpire }: Props) {
  useEffect(() => {
    const timer = setTimeout(onExpire, 5000);
    return () => clearTimeout(timer);
  }, [onExpire]);

  const label = tasks.length === 1 ? `Deleted “${tasks[0]?.title}”` : `Deleted ${tasks.length} tasks`;
  return (
    <div className="undo-toast" role="status">
      <span>{label}</span>
      <button type="button" className="undo-action" onClick={onUndo}>
        Undo
      </button>
    </div>
  );
}
