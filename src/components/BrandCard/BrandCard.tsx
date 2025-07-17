'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRightIcon, MapPinIcon, CalendarIcon, CogIcon } from '@heroicons/react/24/outline';
import { SafeImage } from '../ui/SafeImage';

export interface BrandCardProps {
  brand: {
    name: string;
    slug: string;
    country: string;
    founded: number;
    description?: string;
    productCount?: number;
    popularModels?: string[];
    logoUrl?: string;
    isPopular?: boolean;
    isPremium?: boolean;
  };
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
  showStats?: boolean;
  showDescription?: boolean;
}

export const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  onClick,
  className = '',
  variant = 'default',
  showStats = true,
  showDescription = true,
}) => {
  const {
    name,
    slug,
    country,
    founded,
    description,
    productCount = 0,
    popularModels = [],
    logoUrl,
    isPopular = false,
    isPremium = false,
  } = brand;

  // Generate logo URL if not provided - use PNG as default since most logos are PNG
  const brandLogoUrl = logoUrl || `/logos/${slug}.png`;
  const fallbackLogoUrl = logoUrl || `/logos/${slug}.svg`;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const cardVariants = {
    default: 'p-6',
    compact: 'p-4',
    featured: 'p-8',
  };

  const logoSizes = {
    default: 'w-16 h-16',
    compact: 'w-12 h-12',
    featured: 'w-20 h-20',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        relative bg-white rounded-2xl shadow-lg border border-gray-100 
        hover:shadow-xl hover:border-blue-200 transition-all duration-300
        cursor-pointer group overflow-hidden
        ${cardVariants[variant]}
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Premium/Popular Badge */}
      {(isPremium || isPopular) && (
        <div className="absolute top-4 right-4 z-10">
          {isPremium && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Premium
            </span>
          )}
          {isPopular && !isPremium && (
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Popular
            </span>
          )}
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header with Logo */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Brand Logo */}
            <div className={`${logoSizes[variant]} relative rounded-xl bg-gray-50 p-2 group-hover:bg-gray-100 transition-colors`}>
              <SafeImage
                src={brandLogoUrl}
                fallbackSrc={fallbackLogoUrl}
                alt={`${name} logo`}
                className="w-full h-full object-contain"
                width={80}
                height={80}
                fallbackClassName="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center"
                showFallbackIcon={false}
              />
            </div>

            {/* Brand Name */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {name}
              </h3>
              <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{country}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Since {founded}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow Icon */}
          <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Description */}
        {showDescription && description && variant !== 'compact' && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Stats */}
        {showStats && (
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl mb-4">
            <div className="flex items-center space-x-2">
              <CogIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {productCount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Parts Available</p>
              </div>
            </div>
            
            {popularModels.length > 0 && variant !== 'compact' && (
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {popularModels.length}
                </p>
                <p className="text-xs text-gray-500">Popular Models</p>
              </div>
            )}
          </div>
        )}

        {/* Popular Models */}
        {popularModels.length > 0 && variant === 'featured' && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Models</h4>
            <div className="flex flex-wrap gap-2">
              {popularModels.slice(0, 3).map((model, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {model}
                </span>
              ))}
              {popularModels.length > 3 && (
                <span className="text-xs text-gray-500 px-2.5 py-0.5">
                  +{popularModels.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          href={`/brands/${slug}`}
          className="block w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105">
            View {productCount.toLocaleString()} Parts
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default BrandCard; 