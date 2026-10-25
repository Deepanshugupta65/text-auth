
import api from './axios';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  owner_id: number;
}

export interface TaskResponse {
  total: number;
  page: number;
  limit: number;
  data: Task[];
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  completed?: boolean;
  search?: string;
}

export const taskApi = {
  // Get all tasks
  getTasks: async (
    filters: TaskFilters = {}
  ): Promise<TaskResponse> => {
    const response = await api.get<TaskResponse>('/tasks/', {
      params: filters,
    });

    return response.data;
  },

  // Create a new task
  createTask: async (title: string): Promise<Task> => {
    const response = await api.post<Task>('/tasks/', {
      title,
    });

    return response.data;
  },

  // Update a task
  updateTask: async (
    id: number,
    data: Partial<Pick<Task, 'title' | 'completed'>>
  ): Promise<Task> => {
    const response = await api.put<Task>(
      `/tasks/${id}`,
      data
    );

    return response.data;
  },

  // Delete a task
  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
