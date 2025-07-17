'use client';

import React, { useState } from 'react';
import { BrandCard, BrandCardProps } from './BrandCard';
import { motion } from 'framer-motion';

// Sample brand data based on our logo downloader
const sampleBrands = [
  {
    name: 'BMW',
    slug: 'bmw',
    country: 'Germany',
    founded: 1916,
    description: 'Bavarian Motor Works - Premium German engineering focused on performance, luxury, and innovation.',
    productCount: 15420,
    popularModels: ['3 Series', '5 Series', 'X3', 'X5', 'M3'],
    isPopular: true,
    isPremium: true,
  },
  {
    name: 'Mercedes-Benz',
    slug: 'mercedes-benz',
    country: 'Germany',
    founded: 1926,
    description: 'The best or nothing - German luxury automotive brand known for innovation and prestige.',
    productCount: 18750,
    popularModels: ['C-Class', 'E-Class', 'GLC', 'A-Class', 'S-Class'],
    isPopular: true,
    isPremium: true,
  },
  {
    name: 'Toyota',
    slug: 'toyota',
    country: 'Japan',
    founded: 1937,
    description: 'Reliable Japanese engineering focused on quality, durability, and environmental sustainability.',
    productCount: 22340,
    popularModels: ['Camry', 'Corolla', 'RAV4', 'Prius', 'Highlander'],
    isPopular: true,
  },
  {
    name: 'Honda',
    slug: 'honda',
    country: 'Japan',
    founded: 1948,
    description: 'The power of dreams - Japanese manufacturer known for fuel efficiency and reliability.',
    productCount: 19280,
    popularModels: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit'],
    isPopular: true,
  },
  {
    name: 'Ford',
    slug: 'ford',
    country: 'USA',
    founded: 1903,
    description: 'Built tough American automotive heritage with a focus on trucks and performance vehicles.',
    productCount: 21150,
    popularModels: ['F-150', 'Mustang', 'Explorer', 'Edge', 'Escape'],
    isPopular: true,
  },
  {
    name: 'Volkswagen',
    slug: 'volkswagen',
    country: 'Germany',
    founded: 1937,
    description: 'Das Auto - German people\'s car brand focused on practicality and engineering excellence.',
    productCount: 16890,
    popularModels: ['Golf', 'Jetta', 'Passat', 'Tiguan', 'Atlas'],
  },
  {
    name: 'Audi',
    slug: 'audi',
    country: 'Germany',
    founded: 1909,
    description: 'Vorsprung durch Technik - German luxury brand known for Quattro technology and design.',
    productCount: 14320,
    popularModels: ['A4', 'A6', 'Q5', 'Q7', 'A3'],
    isPremium: true,
  },
  {
    name: 'Tesla',
    slug: 'tesla',
    country: 'USA',
    founded: 2003,
    description: 'Accelerating the world\'s transition to sustainable energy through electric vehicles.',
    productCount: 8450,
    popularModels: ['Model S', 'Model 3', 'Model Y', 'Model X', 'Cybertruck'],
    isPopular: true,
  },
  {
    name: 'Ferrari',
    slug: 'ferrari',
    country: 'Italy',
    founded: 1939,
    description: 'Italian excellence in racing and luxury sports cars with unmatched performance.',
    productCount: 3250,
    popularModels: ['488', '812', 'Roma', 'Portofino', 'LaFerrari'],
    isPremium: true,
  },
  {
    name: 'Porsche',
    slug: 'porsche',
    country: 'Germany',
    founded: 1931,
    description: 'Sports car manufacturer with legendary 911 and racing heritage.',
    productCount: 9180,
    popularModels: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
    isPremium: true,
  },
  {
    name: 'Hyundai',
    slug: 'hyundai',
    country: 'South Korea',
    founded: 1967,
    description: 'New thinking, new possibilities - Korean automotive innovation and value.',
    productCount: 17650,
    popularModels: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Genesis'],
  },
  {
    name: 'Škoda',
    slug: 'skoda',
    country: 'Czech Republic',
    founded: 1895,
    description: 'Simply clever - Czech automotive brand known for practical and reliable vehicles.',
    productCount: 12450,
    popularModels: ['Octavia', 'Superb', 'Kodiaq', 'Fabia', 'Kamiq'],
  },
];

const BrandCardDemo: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<'default' | 'compact' | 'featured'>('default');
  const [showStats, setShowStats] = useState(true);
  const [showDescription, setShowDescription] = useState(true);

  const handleBrandClick = (brand: typeof sampleBrands[0]) => {
    console.log(`Clicked on ${brand.name}`);
  };

  const featuredBrands = sampleBrands.filter(brand => brand.isPopular || brand.isPremium).slice(0, 3);
  const regularBrands = sampleBrands.slice(3, 9);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Brand Card Component Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive showcase of the BrandCard component with real automotive data,
            multiple variants, and customizable features.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Controls</h2>
          <div className="flex flex-wrap gap-6">
            {/* Variant Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variant
              </label>
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="default">Default</option>
                <option value="compact">Compact</option>
                <option value="featured">Featured</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showStats}
                  onChange={(e) => setShowStats(e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Show Statistics</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showDescription}
                  onChange={(e) => setShowDescription(e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Show Description</span>
              </label>
            </div>
          </div>
        </div>

        {/* Featured Brands Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBrands.map((brand, index) => (
              <motion.div
                key={brand.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BrandCard
                  brand={brand}
                  onClick={() => handleBrandClick(brand)}
                  variant="featured"
                  showStats={showStats}
                  showDescription={showDescription}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Regular Brands Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Brands ({selectedVariant} variant)
          </h2>
          <div className={`grid gap-6 ${
            selectedVariant === 'compact' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {regularBrands.map((brand, index) => (
              <motion.div
                key={brand.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BrandCard
                  brand={brand}
                  onClick={() => handleBrandClick(brand)}
                  variant={selectedVariant}
                  showStats={showStats}
                  showDescription={showDescription}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Compact Layout Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Compact Layout</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {sampleBrands.slice(0, 6).map((brand, index) => (
              <motion.div
                key={`compact-${brand.slug}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <BrandCard
                  brand={brand}
                  onClick={() => handleBrandClick(brand)}
                  variant="compact"
                  showStats={true}
                  showDescription={false}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Examples</h2>
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Basic Usage</h3>
              <pre className="text-sm text-gray-600 overflow-x-auto">
{`<BrandCard 
  brand={brandData} 
  onClick={() => handleBrandClick(brandData)}
/>`}
              </pre>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Featured Card</h3>
              <pre className="text-sm text-gray-600 overflow-x-auto">
{`<BrandCard 
  brand={brandData}
  variant="featured"
  showStats={true}
  showDescription={true}
/>`}
              </pre>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Compact Layout</h3>
              <pre className="text-sm text-gray-600 overflow-x-auto">
{`<BrandCard 
  brand={brandData}
  variant="compact"
  showDescription={false}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCardDemo; 