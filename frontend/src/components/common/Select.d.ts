import React from 'react';
export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options: SelectOption[];
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    onChange?: (value: string | number) => void;
}
export declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;
export {};
