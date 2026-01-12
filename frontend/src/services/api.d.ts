/**
 * API Client Service for TaskFlow
 *
 * Provides axios-based HTTP methods for communicating with the backend API.
 * Handles request/response transformations, error handling, and configuration.
 */
import type { Project, Task } from '@/types';
/**
 * API error response structure
 */
export interface ApiErrorResponse {
    detail: string | {
        [key: string]: string[];
    };
    status_code?: number;
}
/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}
/**
 * Pagination parameters
 */
export interface PaginationParams {
    skip?: number;
    limit?: number;
}
/**
 * API Client Class
 *
 * Provides methods for all CRUD operations on Projects and Tasks
 */
export declare class ApiClient {
    private client;
    private baseURL;
    constructor(baseURL?: string);
    /**
     * Handle API errors and extract meaningful error messages
     */
    private handleError;
    /**
     * Extract error message from various error formats
     */
    private extractErrorMessage;
    /**
     * Make a generic request
     */
    private request;
    /**
     * List all projects
     * GET /projects
     */
    listProjects(params?: PaginationParams): Promise<Project[]>;
    /**
     * Get a specific project by ID
     * GET /projects/:id
     */
    getProject(projectId: string): Promise<Project>;
    /**
     * Create a new project
     * POST /projects
     */
    createProject(data: {
        name: string;
        description?: string;
    }): Promise<Project>;
    /**
     * Update an existing project
     * PUT /projects/:id
     */
    updateProject(projectId: string, data: {
        name?: string;
        description?: string;
    }): Promise<Project>;
    /**
     * Delete a project
     * DELETE /projects/:id
     */
    deleteProject(projectId: string): Promise<void>;
    /**
     * List all tasks, optionally filtered by project
     * GET /tasks or GET /projects/:projectId/tasks
     */
    listTasks(projectId?: string, params?: PaginationParams): Promise<Task[]>;
    /**
     * Get a specific task by ID
     * GET /tasks/:id
     */
    getTask(taskId: string): Promise<Task>;
    /**
     * Create a new task
     * POST /projects/:projectId/tasks or POST /tasks
     */
    createTask(data: {
        title: string;
        description?: string;
        priority?: 'low' | 'medium' | 'high';
        status?: 'todo' | 'in-progress' | 'done';
        projectId?: string;
        boardId?: string;
    }): Promise<Task>;
    /**
     * Update an existing task
     * PUT /tasks/:id
     */
    updateTask(taskId: string, data: {
        title?: string;
        description?: string;
        priority?: 'low' | 'medium' | 'high';
        status?: 'todo' | 'in-progress' | 'done';
    }): Promise<Task>;
    /**
     * Update only the status of a task
     * PATCH /tasks/:id/status
     */
    updateTaskStatus(taskId: string, status: 'todo' | 'in-progress' | 'done'): Promise<Task>;
    /**
     * Delete a task
     * DELETE /tasks/:id
     */
    deleteTask(taskId: string): Promise<void>;
}
/**
 * Default API client instance
 * Use this singleton for all API calls throughout the application
 */
export declare const apiClient: ApiClient;
export default apiClient;
