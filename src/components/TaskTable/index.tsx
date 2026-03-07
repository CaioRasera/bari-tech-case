"use client";

import { Table, Tag, Checkbox, Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Task, TaskPriority } from "@/types/task";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/constants/task.config";
import styles from "./TaskTable.module.css";

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onRemove: (id: string) => void;
  onToggleDone: (id: string) => void;
}

export default function TaskTable({
  tasks,
  loading,
  onEdit,
  onRemove,
  onToggleDone,
}: TaskTableProps) {
  const columns: ColumnsType<Task> = [
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
      showSorterTooltip: false,
      render: (text: string, record: Task) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Checkbox
            checked={record.done}
            onChange={() => onToggleDone(record.id)}
            id={`checkbox-${record.id}`}
          />
          <span className={styles.titleCell}>{text}</span>
        </div>
      ),
    },
    {
      title: "Prioridade",
      dataIndex: "priority",
      key: "priority",
      width: 140,
      align: "center",
      sorter: (taskA, taskB) => PRIORITY_CONFIG[taskA.priority].score - PRIORITY_CONFIG[taskB.priority].score,
      showSorterTooltip: false,
      render: (priority: TaskPriority) => {
        const config = PRIORITY_CONFIG[priority];
        const isLight = priority === TaskPriority.MEDIUM;
        return (
          <Tag 
            style={{ 
              margin: 0, 
              border: "none", 
              backgroundColor: config.color,
              color: isLight ? "#000" : "#fff", 
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "11px",
              padding: "2px 12px",
              lineHeight: "18px"
            }}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "Data de entrega",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 160,
      sorter: (taskA, taskB) => {
        if (!taskA.dueDate && !taskB.dueDate) return 0;
        if (!taskA.dueDate) return 1;
        if (!taskB.dueDate) return -1;
        return dayjs(taskA.dueDate).valueOf() - dayjs(taskB.dueDate).valueOf();
      },
      showSorterTooltip: false,
      render: (date: string | null, record: Task) => {
        if (!date) return "—";
        
        const isOverdue = !record.done && dayjs(date).isBefore(dayjs(), "day");
        
        return (
          <div className={isOverdue ? styles.overdueText : ""}>
            {dayjs(date).format("DD/MM/YYYY")}
            {isOverdue && <span className={styles.overdueLabel}>Atrasada</span>}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "done",
      key: "done",
      width: 150,
      align: "center",
      sorter: (taskA, taskB) => Number(taskA.done) - Number(taskB.done),
      showSorterTooltip: false,
      render: (done: boolean) => {
        const config = done ? STATUS_CONFIG.DONE : STATUS_CONFIG.PENDING;
        return (
          <Tag 
            style={{ 
              margin: 0, 
              border: "none", 
              backgroundColor: config.color,
              color: "#fff", 
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "11px",
              padding: "2px 12px",
              lineHeight: "18px"
            }}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 130,
      align: "center",
      render: (_: unknown, record: Task) => (
        <div className={styles.actionsCell}>
          <Tooltip title="Editar" color="#1f1f1f">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              id={`edit-${record.id}`}
            />
          </Tooltip>
          <Popconfirm
            title="Excluir tarefa"
            description="Tem certeza que deseja excluir esta tarefa?"
            onConfirm={() => onRemove(record.id)}
            okText="Excluir"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Excluir" color="#1f1f1f">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                id={`delete-${record.id}`}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.tableWrapper}>
      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        scroll={{ x: 650 }}
        rowClassName={(record) => (record.done ? styles.doneRow : "")}
        locale={{ emptyText: "Nenhuma tarefa encontrada" }}
        expandable={{
          expandedRowRender: (record) => (
            <div className={styles.expandedDescription}>
              <label>Descrição</label>
              {record.description || "Nenhuma descrição detalhada fornecida."}
            </div>
          ),
          rowExpandable: (record) => !!record.description,
          expandRowByClick: false,
          expandIcon: ({ expanded, onExpand, record }) => {
            if (!record.description) return null;
            return (
              <Tooltip title={expanded ? "Ocultar descrição" : "Ver descrição"} color="#1f1f1f">
                <Button
                  type="text"
                  size="small"
                  className={styles.expandBtn}
                  icon={expanded ? <MinusOutlined /> : <PlusOutlined />}
                  onClick={(e) => onExpand(record, e)}
                />
              </Tooltip>
            );
          }
        }}
      />
    </div>
  );
}
