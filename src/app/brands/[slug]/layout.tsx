import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Capitalize and clean up the slug for the title
  const brandName = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return {
    title: `${brandName} авточасти | Auto Parts Store`,
    description: `Разгледайте всички авточасти от марка ${brandName} в нашия магазин`,
  }
}

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 