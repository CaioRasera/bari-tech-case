"use client";

import { useState, useMemo } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTasks } from "@/hooks/useTasks";
import { Task, TaskPriority, TaskFilterStatus } from "@/types/task";
import dayjs from "dayjs";
import TaskFilters from "@/components/TaskFilters";
import TaskTable from "@/components/TaskTable";
import TaskCards from "@/components/TaskCards";
import TaskModalForm from "@/components/TaskModalForm";
import AppLayout from "@/components/AppLayout";
import { STATUS_CONFIG } from "@/constants/task.config";
import styles from "./tasks.module.css";

export default function TasksPage() {
  const { tasks, loading, addTask, updateTask, removeTask, toggleDone } =
    useTasks();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskFilterStatus>(TaskFilterStatus.ALL);
  const [priorityFilter, setPriorityFilter] = useState<string>(TaskFilterStatus.ALL);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === TaskFilterStatus.ALL ||
        (statusFilter === TaskFilterStatus.DONE && task.done) ||
        (statusFilter === TaskFilterStatus.PENDING && !task.done);

      const matchesPriority =
        priorityFilter === TaskFilterStatus.ALL || task.priority === priorityFilter;

      const matchesDate =
        !dateFilter ||
        (task.dueDate && dayjs(task.dueDate).format("YYYY-MM-DD") === dateFilter);

      return matchesSearch && matchesStatus && matchesPriority && matchesDate;
    });
  }, [tasks, search, statusFilter, priorityFilter, dateFilter]);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;
  const pendingTasks = totalTasks - doneTasks;

  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = (values: {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: string | null;
  }) => {
    if (editingTask) {
      updateTask(editingTask.id, values);
    } else {
      addTask({
        title: values.title,
        description: values.description,
        priority: values.priority,
        dueDate: values.dueDate ?? null,
      });
    }
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  return (
    <AppLayout
      title="Tarefas"
      subtitle="Gerencie suas demandas do dia a dia"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className={styles.newTaskBtn}
          onClick={handleOpenCreate}
          id="new-task-btn"
        >
          Nova tarefa
        </Button>
      }
    >
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{totalTasks}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{pendingTasks}</span>
          <span className={styles.statLabel}>{STATUS_CONFIG.PENDING.label}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber + " " + styles.statDone}>
            {doneTasks}
          </span>
          <span className={styles.statLabel}>{STATUS_CONFIG.DONE.label}</span>
        </div>
      </div>

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />

      <div className={styles.desktopView}>
        <TaskTable
          tasks={filteredTasks}
          loading={loading}
          onEdit={handleOpenEdit}
          onRemove={removeTask}
          onToggleDone={toggleDone}
        />
      </div>

      <div className={styles.mobileView}>
        <TaskCards
          tasks={filteredTasks}
          onEdit={handleOpenEdit}
          onRemove={removeTask}
          onToggleDone={toggleDone}
        />
      </div>

      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        className={styles.fabButton}
        onClick={handleOpenCreate}
      />

      <TaskModalForm
        open={modalOpen}
        editingTask={editingTask}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </AppLayout>
  );
}
