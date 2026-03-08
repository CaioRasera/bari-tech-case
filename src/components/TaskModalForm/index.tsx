"use client";

import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { Task, TaskPriority } from "@/types/task";
import { PRIORITY_CONFIG } from "@/constants/task.config";
import styles from "./TaskModalForm.module.css";

interface TaskModalFormProps {
  open: boolean;
  editingTask: Task | null;
  onSave: (values: {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: string | null;
  }) => void;
  onCancel: () => void;
}

export default function TaskModalForm({
  open,
  editingTask,
  onSave,
  onCancel,
}: TaskModalFormProps) {
  const [form] = Form.useForm();
  const isEditing = !!editingTask;

  useEffect(() => {
    if (open) {
      if (editingTask) {
        form.setFieldsValue({
          title: editingTask.title,
          description: editingTask.description || "",
          priority: editingTask.priority,
          dueDate: editingTask.dueDate ? dayjs(editingTask.dueDate) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingTask, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSave({
      title: values.title,
      description: values.description || undefined,
      priority: values.priority,
      dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : null,
    });
    form.resetFields();
  };

  return (
    <Modal
      title={isEditing ? "Editar Tarefa" : "Nova Tarefa"}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Salvar"
      cancelText="Cancelar"
      destroyOnHidden
      mask={{ closable: true }}
      modalRender={(node) => (
        <div className={styles.modalContainer}>{node}</div>
      )}
    >
      <div className={styles.modalBody}>
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          initialValues={{ priority: TaskPriority.MEDIUM }}
        >
          <Form.Item
            name="title"
            label="Título"
            rules={[
              { required: true, message: "O título é obrigatório" },
              {
                min: 3,
                message: "O título deve ter no mínimo 3 caracteres",
              },
            ]}
          >
            <Input
              placeholder="Ex.: Revisar documentos"
              id="task-title-input"
            />
          </Form.Item>

          <Form.Item name="description" label="Descrição">
            <Input.TextArea
              rows={3}
              placeholder="Descrição da tarefa (opcional)"
              id="task-description-input"
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Prioridade"
            rules={[{ required: true, message: "Selecione a prioridade" }]}
          >
            <Select
              placeholder="Selecione"
              id="task-priority-select"
              options={[
                { value: TaskPriority.LOW, label: PRIORITY_CONFIG[TaskPriority.LOW].label },
                { value: TaskPriority.MEDIUM, label: PRIORITY_CONFIG[TaskPriority.MEDIUM].label },
                { value: TaskPriority.HIGH, label: PRIORITY_CONFIG[TaskPriority.HIGH].label },
              ]}
            />
          </Form.Item>

          <Form.Item name="dueDate" label="Data de entrega">
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Selecione a data"
              style={{ width: "100%" }}
              id="task-duedate-picker"
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
