import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Марки авточасти | Auto Parts Store',
  description: 'Разгледайте всички марки авточасти в нашия магазин',
}

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 