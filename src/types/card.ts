import { LucideIcon } from 'lucide-react';

export interface CardProps {
  icon?: LucideIcon;
  iconColor?: string;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'hover' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
}

export interface CardVariants {
  default: string;
  hover: string;
  bordered: string;
}

export interface CardSizes {
  sm: string;
  md: string;
  lg: string;
}

export interface CardIconSizes {
  sm: string;
  md: string;
  lg: string;
}

export interface CardTitleSizes {
  sm: string;
  md: string;
  lg: string;
}

export interface CardDescriptionSizes {
  sm: string;
  md: string;
  lg: string;
} 