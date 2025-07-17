import React from 'react';
import Link from 'next/link';
import { CardProps } from '@/types/card';

export const Card: React.FC<CardProps> = ({
  icon: Icon,
  iconColor = 'text-blue-500',
  title,
  description,
  href,
  onClick,
  className = '',
  variant = 'default',
  size = 'md'
}) => {
  const baseClasses = 'group relative overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50';
  
  const variantClasses = {
    default: 'bg-white hover:bg-gray-50 shadow-sm hover:shadow-md',
    hover: 'bg-white hover:bg-blue-50 shadow-sm hover:shadow-lg hover:border-blue-200',
    bordered: 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
  };

  const sizeClasses = {
    sm: 'p-4 rounded-lg',
    md: 'p-6 rounded-xl',
    lg: 'p-8 rounded-2xl'
  };

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const titleSizes = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-semibold',
    lg: 'text-2xl font-bold'
  };

  const descriptionSizes = {
    sm: 'text-sm text-gray-600',
    md: 'text-base text-gray-600',
    lg: 'text-lg text-gray-700'
  };

  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const CardContent = (
    <div className="flex flex-col space-y-3">
      {Icon && (
        <div className="flex-shrink-0">
          <Icon className={`${iconSizes[size]} ${iconColor} group-hover:scale-110 transition-transform duration-200`} />
        </div>
      )}
      
      <div className="flex-1">
        <h3 className={`${titleSizes[size]} text-gray-900 group-hover:text-blue-600 transition-colors duration-200`}>
          {title}
        </h3>
        <p className={`${descriptionSizes[size]} mt-1 line-clamp-3`}>
          {description}
        </p>
      </div>

      {/* Hover effect indicator */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {CardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={`${cardClasses} text-left w-full`}>
        {CardContent}
      </button>
    );
  }

  return (
    <div className={cardClasses}>
      {CardContent}
    </div>
  );
};

export default Card; 