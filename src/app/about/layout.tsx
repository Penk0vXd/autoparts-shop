import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'За нас | Auto Parts Store',
  description: 'Научете повече за нашата компания и нашата мисия да предоставяме качествени авточасти на достъпни цени.',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 