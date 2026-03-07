export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum TaskFilterStatus {
  ALL = "all",
  PENDING = "pending",
  DONE = "done",
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string | null;
  done: boolean;
}
