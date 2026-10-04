// The shapes overdo-api returns, copied by hand from its routes. Nothing type-checks across the two
// repos, so a change to an API response has to be mirrored here.
export type Status = "todo" | "doing" | "done";
export type Energy = "low" | "medium" | "high" | "chaotic";

export interface Task {
  id: string;
  title: string;
  notes: string;
  status: Status;
  priority: number;
  energy: Energy;
  dueOn: string | null;
  createdAt: string;
  completedAt: string | null;
}
