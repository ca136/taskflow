import { Task } from '../../types';
interface TaskCardProps {
    task: Task;
    onTaskClick: (task: Task) => void;
    onDelete?: (taskId: string) => void;
}
export declare const TaskCard: React.FC<TaskCardProps>;
export {};
