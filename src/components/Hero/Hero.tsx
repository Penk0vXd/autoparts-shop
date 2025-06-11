import { Button } from '@/components/ui/button'
import Link from 'next/link'
import BlurredBlobs from './BlurredBlobs'

type HeroProps = {
  className?: string
}

/**
 * Hero section component for the homepage
 * Full viewport height design with animated blurred blobs and centered content
 */
export function Hero({ className = '' }: HeroProps) {
  return (
    <section className={`relative isolate flex flex-col justify-center min-h-screen overflow-hidden ${className}`}>
      {/* Blurred blobs */}
      <BlurredBlobs />
      
      {/* Content wrapper */}
      <div className="container mx-auto relative z-10 text-center px-4">
        <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-foreground max-w-4xl mx-auto">
          Намерете точната част<br/>за вашия автомобил
        </h1>
        
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          100k+ quality parts • експресна доставка • гарантирано съвпадение
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/catalog">Разгледай каталога</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/brands">Виж марките</Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 