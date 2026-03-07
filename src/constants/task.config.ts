import { TaskPriority } from "@/types/task";

export const PRIORITY_CONFIG = {
  [TaskPriority.HIGH]: {
    label: "Alta",
    color: "#ef4444",
    score: 3,
  },
  [TaskPriority.MEDIUM]: {
    label: "Média",
    color: "#f59e0b",
    score: 2,
  },
  [TaskPriority.LOW]: {
    label: "Baixa",
    color: "#3b82f6",
    score: 1,
  },
};

export const STATUS_CONFIG = {
  DONE: {
    label: "Concluída",
    color: "#10b981",
  },
  PENDING: {
    label: "Pendente",
    color: "#475569",
  },
};
