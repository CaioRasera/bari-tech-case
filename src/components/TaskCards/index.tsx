"use client";

import React from "react";
import { Checkbox, Button, Popconfirm, Tooltip, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Task, TaskPriority } from "@/types/task";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/constants/task.config";
import styles from "./TaskCards.module.css";

const priorityConfig = PRIORITY_CONFIG;

interface TaskCardsProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onRemove: (id: string) => void;
  onToggleDone: (id: string) => void;
}

export default function TaskCards({
  tasks,
  onEdit,
  onRemove,
  onToggleDone,
}: TaskCardsProps) {
  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>
        Nenhuma tarefa encontrada
      </div>
    );
  }

  return (
    <div className={styles.cardsContainer}>
      {tasks.map((task) => {
        const prioritySettings = priorityConfig[task.priority];
        const isOverdue = !task.done && task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), "day");
        const statusConfig = task.done ? STATUS_CONFIG.DONE : STATUS_CONFIG.PENDING;

        return (
          <div key={task.id} className={styles.taskCard}>
            <div className={styles.cardHeader}>
              <Checkbox
                checked={task.done}
                onChange={() => onToggleDone(task.id)}
              />
              <div className={styles.titleWrapper}>
                <span className={`${styles.cardTitle} ${task.done ? styles.doneTitle : ""}`}>
                  {task.title}
                </span>
              </div>
              <div className={styles.cardActions}>
                <Button
                  type="text"
                  icon={<EditOutlined style={{ color: "rgba(255,255,255,0.6)" }} />}
                  onClick={() => onEdit(task)}
                />
                <Popconfirm
                  title="Excluir tarefa"
                  description="Tem certeza que deseja excluir esta tarefa?"
                  onConfirm={() => onRemove(task.id)}
                  okText="Excluir"
                  cancelText="Cancelar"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.tagsRow}>
                <Tag 
                  style={{ 
                    margin: 0, border: "none", backgroundColor: prioritySettings.color,
                    color: task.priority === TaskPriority.MEDIUM ? "#000" : "#fff",
                    fontWeight: 700, textTransform: "uppercase", fontSize: "10px",
                    padding: "1px 8px"
                  }}
                >
                  {prioritySettings.label}
                </Tag>
                <Tag 
                  style={{ 
                    margin: 0, border: "none", backgroundColor: statusConfig.color,
                    color: "#fff", fontWeight: 700, textTransform: "uppercase",
                    fontSize: "10px", padding: "1px 8px"
                  }}
                >
                  {statusConfig.label}
                </Tag>
              </div>
              
              <div className={styles.cardFooter}>
                <div className={`${styles.dateInfo} ${isOverdue ? styles.overdueText : ""}`}>
                  {task.dueDate ? dayjs(task.dueDate).format("DD/MM/YYYY") : "Sem data"}
                  {isOverdue && <span style={{ marginLeft: 8, fontSize: "10px" }}>(ATRASADA)</span>}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
