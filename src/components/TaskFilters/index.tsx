"use client";

import React from "react";
import { Input, Select, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { TaskFilterStatus, TaskPriority } from "@/types/task";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/constants/task.config";
import styles from "./TaskFilters.module.css";

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: TaskFilterStatus;
  onStatusFilterChange: (value: TaskFilterStatus) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  dateFilter: string | null;
  onDateFilterChange: (dateStr: string | null) => void;
}

export default function TaskFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  dateFilter,
  onDateFilterChange,
}: TaskFiltersProps) {
  return (
    <div className={styles.filtersWrapper}>
      <div className={`${styles.filterGroup} ${styles.searchGroup}`}>
        <label className={styles.filterLabel}>Buscar</label>
        <Input
          className={styles.searchInput}
          placeholder="Pesquisar por título..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          id="search-input"
        />
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Vencimento</label>
        <DatePicker
          className={styles.selectFilter}
          placeholder="Filtrar por data"
          format="DD/MM/YYYY"
          value={dateFilter ? dayjs(dateFilter) : null}
          onChange={(date) => {
            onDateFilterChange(date ? date.format("YYYY-MM-DD") : null);
          }}
          allowClear
        />
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Status</label>
        <Select
          className={styles.selectFilter}
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={[
            { value: TaskFilterStatus.ALL, label: "Todas" },
            { value: TaskFilterStatus.PENDING, label: STATUS_CONFIG.PENDING.label },
            { value: TaskFilterStatus.DONE, label: STATUS_CONFIG.DONE.label },
          ]}
          id="status-filter"
        />
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Prioridade</label>
        <Select
          className={styles.selectFilter}
          value={priorityFilter}
          onChange={onPriorityFilterChange}
          options={[
            { value: TaskFilterStatus.ALL, label: "Todas" },
            { value: TaskPriority.HIGH, label: PRIORITY_CONFIG[TaskPriority.HIGH].label },
            { value: TaskPriority.MEDIUM, label: PRIORITY_CONFIG[TaskPriority.MEDIUM].label },
            { value: TaskPriority.LOW, label: PRIORITY_CONFIG[TaskPriority.LOW].label },
          ]}
          id="priority-filter"
        />
      </div>
    </div>
  );
}
