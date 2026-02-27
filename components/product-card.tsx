'use client'

import { Button } from '@/components/ui/button'

interface Product {
  id: number
  name: string
  description: string
  image: string
  category: string
  pinterestUrl: string
  isTrending: boolean
}

interface ProductCardProps {
  product: Product
  onViewStyle: (url: string) => void
}

export default function ProductCard({ product, onViewStyle }: ProductCardProps) {
  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-80 overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        
        {/* Trending Badge */}
        {product.isTrending && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              Trending
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-48">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wide">
            {product.category}
          </p>
        </div>

        {/* Button */}
        <Button
          onClick={() => onViewStyle(product.pinterestUrl)}
          className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
        >
          View Style
        </Button>
      </div>
    </div>
  )
}
