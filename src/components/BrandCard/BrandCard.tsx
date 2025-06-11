'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Brand } from '@/types/db'

type BrandCardProps = {
  brand: Brand
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link 
      href={`/brands/${brand.slug}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="aspect-square relative p-6 bg-gray-50">
        {brand.logo_url ? (
          <Image
            src={brand.logo_url}
            alt={brand.name}
            width={128}
            height={128}
            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-xl font-semibold text-gray-900 text-center group-hover:text-blue-600 transition-colors">
              {brand.name}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4 text-center">
        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {brand.name}
        </h3>
      </div>
    </Link>
  )
} 