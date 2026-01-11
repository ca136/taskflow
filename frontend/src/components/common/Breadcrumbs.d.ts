export interface BreadcrumbItem {
    label: string;
    href?: string;
    current?: boolean;
}
interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}
export declare const Breadcrumbs: React.FC<BreadcrumbsProps>;
export {};
