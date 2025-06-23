import Image from 'next/image'
import { Product } from '@/types/db'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'

type ProductDetailsProps = {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug || product.id,
      price: product.price,
      image: product.images?.[0] || '',
      stock: product.stock || 0,
      sku: product.sku
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <div className="text-2xl font-semibold">
            {product.price.toLocaleString('bg-BG', {
              style: 'currency',
              currency: 'BGN'
            })}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">В наличност:</span>
            <span className="font-semibold">{product.stock} бр.</span>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full md:w-auto px-6 py-3"
          >
            {product.stock > 0 ? 'Добави в количката' : 'Няма наличност'}
          </Button>
        </div>
      </div>
    </div>
  )
} 