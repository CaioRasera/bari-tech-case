"use client";

import { useState, useEffect, useCallback } from "react";
import { Task } from "@/types/task";

const STORAGE_KEY = "bari-tasks";

function loadFromStorage(): Task[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Task[];
    }
  } catch {
    console.warn("Failed to parse tasks from localStorage");
  }
  return null;
}

function saveToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    console.warn("Failed to save tasks to localStorage");
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored && stored.length > 0) {
      setTasks(stored);
      setLoading(false);
    } else {
      fetch("/tasks.json")
        .then((res) => res.json())
        .then((data: Task[]) => {
          setTasks(data);
          saveToStorage(data);
        })
        .catch((err) => console.error("Failed to load tasks.json:", err))
        .finally(() => setLoading(false));
    }
  }, []);

  const persist = useCallback((updated: Task[]) => {
    setTasks(updated);
    saveToStorage(updated);
  }, []);

  const addTask = useCallback(
    (taskData: Omit<Task, "id" | "done">) => {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        done: false,
      };
      const updated = [newTask, ...tasks];
      persist(updated);
    },
    [tasks, persist]
  );

  const updateTask = useCallback(
    (id: string, data: Partial<Omit<Task, "id">>) => {
      const updated = tasks.map((t) => (t.id === id ? { ...t, ...data } : t));
      persist(updated);
    },
    [tasks, persist]
  );

  const removeTask = useCallback(
    (id: string) => {
      const updated = tasks.filter((t) => t.id !== id);
      persist(updated);
    },
    [tasks, persist]
  );

  const toggleDone = useCallback(
    (id: string) => {
      const updated = tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      );
      persist(updated);
    },
    [tasks, persist]
  );

  return { tasks, loading, addTask, updateTask, removeTask, toggleDone };
}
