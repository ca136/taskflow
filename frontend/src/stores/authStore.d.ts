import { User } from '../types';
interface AuthState {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}
export declare const useAuthStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AuthState>>;
export {};
