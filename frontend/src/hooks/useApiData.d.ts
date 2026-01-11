import { ApiError } from '../services/apiClient';
export interface UseApiDataState<T> {
    data: T | null;
    isLoading: boolean;
    error: ApiError | null;
    retry: () => Promise<void>;
}
interface UseApiDataOptions {
    showError?: boolean;
    showSuccess?: boolean;
    successMessage?: string;
    errorMessage?: string;
}
export declare const useApiData: <T>(url: string | null, options?: UseApiDataOptions) => UseApiDataState<T>;
export {};
