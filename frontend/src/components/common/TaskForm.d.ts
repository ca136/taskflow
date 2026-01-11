interface TaskFormProps {
    onSubmit: (data: FormData) => void;
}
interface FormData {
    title: string;
    description: string;
    assignee: string;
    priority: 'low' | 'medium' | 'high';
}
export declare const TaskForm: ({ onSubmit }: TaskFormProps) => import("react").JSX.Element;
export {};
