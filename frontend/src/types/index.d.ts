export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: string;
}
export interface Project {
    id: string;
    name: string;
    description: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}
export interface Board {
    id: string;
    projectId: string;
    name: string;
    order: number;
    createdAt: string;
}
export interface Task {
    id: string;
    boardId: string;
    title: string;
    description?: string;
    assignee?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in-progress' | 'done';
    createdAt: string;
    updatedAt: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
