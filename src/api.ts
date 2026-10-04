// The typed client for overdo-api. Vite proxies /api to the API, so every call is same-origin. request
// throws on any non-2xx response, carrying the API's own error message when it sent one.
import type { Mood, Pomodoro, Stats, Subtask, Tag, Task } from "./types";

export type TaskPatch = Partial<Pick<Task, "title" | "notes" | "status" | "priority" | "energy" | "dueOn">>;

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method,
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    const { error } = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export const listTasks = () => request<Task[]>("GET", "/tasks");
export const createTask = (title: string) => request<Task>("POST", "/tasks", { title });
export const updateTask = (id: string, patch: TaskPatch) => request<Task>("PATCH", `/tasks/${id}`, patch);
export const deleteTask = (id: string) => request<void>("DELETE", `/tasks/${id}`);

export const addSubtask = (taskId: string, title: string) =>
  request<Subtask>("POST", `/tasks/${taskId}/subtasks`, { title });
export const updateSubtask = (id: string, patch: Partial<Omit<Subtask, "id">>) =>
  request<Subtask>("PATCH", `/subtasks/${id}`, patch);
export const deleteSubtask = (id: string) => request<void>("DELETE", `/subtasks/${id}`);

export const listTags = () => request<Tag[]>("GET", "/tags");
export const addTag = (taskId: string, name: string) =>
  request<Tag>("POST", `/tasks/${taskId}/tags`, { name });
export const removeTag = (taskId: string, tagId: string) =>
  request<void>("DELETE", `/tasks/${taskId}/tags/${tagId}`);

export const startPomodoro = (taskId: string) => request<Pomodoro>("POST", `/tasks/${taskId}/pomodoros`, {});
export const currentPomodoro = () => request<Pomodoro | null>("GET", "/pomodoros/current");
export const stopPomodoro = (id: string) => request<Pomodoro>("POST", `/pomodoros/${id}/stop`);

export const logMood = (mood: Mood, taskId: string) => request<void>("POST", "/moods", { mood, taskId });
export const getStats = () => request<Stats>("GET", "/stats");
