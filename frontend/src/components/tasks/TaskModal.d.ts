import { Task, User } from '../../types';
interface TaskModalProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (task: Task) => void;
    onDelete?: (taskId: string) => void;
    users?: User[];
    isEditing?: boolean;
    setIsEditing?: (isEditing: boolean) => void;
}
export declare const TaskModal: React.FC<TaskModalProps>;
export {};
