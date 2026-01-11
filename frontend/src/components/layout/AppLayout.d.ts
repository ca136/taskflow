import { BreadcrumbItem } from '../common/Breadcrumbs';
interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
}
export declare const AppLayout: React.FC<AppLayoutProps>;
export {};
