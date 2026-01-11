export interface Task {
    id: string;
    title: string;
    description?: string;
    assignee?: string;
    priority?: 'low' | 'medium' | 'high';
}
export declare const KanbanBoard: () => import("react").JSX.Element;
