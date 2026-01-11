import { Project } from '../types';
interface ProjectState {
    projects: Project[];
    currentProject: Project | null;
    setProjects: (projects: Project[]) => void;
    setCurrentProject: (project: Project | null) => void;
}
export declare const useProjectStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ProjectState>>;
export {};
