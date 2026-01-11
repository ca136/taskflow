import { ApiError } from '../services/apiClient';
export interface UseApiActionState {
    isLoading: boolean;
    error: ApiError | null;
    isSuccess: boolean;
}
interface UseApiActionOptions {
    onSuccess?: () => Promise<void> | void;
    onError?: (error: ApiError) => void;
    successMessage?: string;
    errorMessage?: string;
    showSuccess?: boolean;
    showError?: boolean;
}
export declare const useApiAction: (options?: UseApiActionOptions) => {
    execute: <T>(apiCall: () => Promise<T>) => Promise<{
        success: boolean;
        data?: T;
        error?: ApiError;
    }>;
    isLoading: boolean;
    error: ApiError;
    isSuccess: boolean;
    reset: () => void;
};
export {};
