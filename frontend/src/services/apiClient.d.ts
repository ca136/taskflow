export interface ApiError {
    message: string;
    status: number;
    code?: string;
    details?: Record<string, unknown>;
}
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}
declare class ApiClient {
    private client;
    private errorCallbacks;
    constructor(baseURL?: string);
    private handleError;
    onError(callback: (error: ApiError) => void): () => void;
    get<T>(url: string, config?: any): Promise<ApiResponse<T>>;
    post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
    put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
    patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
    delete<T>(url: string, config?: any): Promise<ApiResponse<T>>;
}
export declare const apiClient: ApiClient;
export {};
