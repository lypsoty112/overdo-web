// The typed client for overdo-api. Vite proxies /api to the API, so every call is same-origin. request
// throws on any non-2xx response, carrying the API's own error message when it sent one.
import type { Task } from "./types";

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
