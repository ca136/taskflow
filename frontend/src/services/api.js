/**
 * API Client Service for TaskFlow
 *
 * Provides axios-based HTTP methods for communicating with the backend API.
 * Handles request/response transformations, error handling, and configuration.
 */
import axios from 'axios';
/**
 * API Client configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_V1_PREFIX = '/api/v1';
/**
 * API Client Class
 *
 * Provides methods for all CRUD operations on Projects and Tasks
 */
export class ApiClient {
    constructor(baseURL = `${API_BASE_URL}${API_V1_PREFIX}`) {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "baseURL", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.baseURL = baseURL;
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Add response interceptor for error handling
        this.client.interceptors.response.use((response) => response, (error) => this.handleError(error));
        // Add request interceptor for auth tokens (if available)
        this.client.interceptors.request.use((config) => {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => Promise.reject(error));
    }
    /**
     * Handle API errors and extract meaningful error messages
     */
    handleError(error) {
        const message = this.extractErrorMessage(error);
        const apiError = new Error(message);
        apiError.status = error.response?.status;
        apiError.originalError = error;
        return Promise.reject(apiError);
    }
    /**
     * Extract error message from various error formats
     */
    extractErrorMessage(error) {
        if (!error.response) {
            return error.message || 'Network error';
        }
        const data = error.response.data;
        if (typeof data.detail === 'string') {
            return data.detail;
        }
        if (typeof data.detail === 'object') {
            const messages = Object.values(data.detail).flat();
            return messages.join(', ') || 'Validation error';
        }
        return `Error ${error.response.status}: ${error.response.statusText}`;
    }
    /**
     * Make a generic request
     */
    async request(method, url, config) {
        const response = await this.client[method](url, config);
        return response.data;
    }
    // ============================================================
    // PROJECTS ENDPOINTS
    // ============================================================
    /**
     * List all projects
     * GET /projects
     */
    async listProjects(params) {
        return this.request('get', '/projects', { params });
    }
    /**
     * Get a specific project by ID
     * GET /projects/:id
     */
    async getProject(projectId) {
        return this.request('get', `/projects/${projectId}`);
    }
    /**
     * Create a new project
     * POST /projects
     */
    async createProject(data) {
        return this.request('post', '/projects', { data });
    }
    /**
     * Update an existing project
     * PUT /projects/:id
     */
    async updateProject(projectId, data) {
        return this.request('put', `/projects/${projectId}`, { data });
    }
    /**
     * Delete a project
     * DELETE /projects/:id
     */
    async deleteProject(projectId) {
        await this.request('delete', `/projects/${projectId}`);
    }
    // ============================================================
    // TASKS ENDPOINTS
    // ============================================================
    /**
     * List all tasks, optionally filtered by project
     * GET /tasks or GET /projects/:projectId/tasks
     */
    async listTasks(projectId, params) {
        const url = projectId ? `/projects/${projectId}/tasks` : '/tasks';
        return this.request('get', url, { params });
    }
    /**
     * Get a specific task by ID
     * GET /tasks/:id
     */
    async getTask(taskId) {
        return this.request('get', `/tasks/${taskId}`);
    }
    /**
     * Create a new task
     * POST /projects/:projectId/tasks or POST /tasks
     */
    async createTask(data) {
        const projectId = data.projectId;
        delete data.projectId;
        const url = projectId ? `/projects/${projectId}/tasks` : '/tasks';
        return this.request('post', url, { data });
    }
    /**
     * Update an existing task
     * PUT /tasks/:id
     */
    async updateTask(taskId, data) {
        return this.request('put', `/tasks/${taskId}`, { data });
    }
    /**
     * Update only the status of a task
     * PATCH /tasks/:id/status
     */
    async updateTaskStatus(taskId, status) {
        return this.request('patch', `/tasks/${taskId}/status`, {
            data: { status },
        });
    }
    /**
     * Delete a task
     * DELETE /tasks/:id
     */
    async deleteTask(taskId) {
        await this.request('delete', `/tasks/${taskId}`);
    }
}
/**
 * Default API client instance
 * Use this singleton for all API calls throughout the application
 */
export const apiClient = new ApiClient();
export default apiClient;
