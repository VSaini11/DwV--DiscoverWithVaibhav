'use client'

import { useState, useMemo } from 'react'
import ProductCard from './product-card'
import CategoryFilter from './category-filter'
import SearchBar from './search-bar'

interface Product {
  id: number
  name: string
  description: string
  image: string
  category: string
  pinterestUrl: string
  isTrending: boolean
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Minimalist Black Blazer',
    description: 'Classic tailored blazer perfect for any occasion',
    image: 'https://images.unsplash.com/photo-1591047990852-2d825657a07f?w=500&h=600&fit=crop',
    category: 'Women',
    pinterestUrl: 'https://pinterest.com',
    isTrending: true
  },
  {
    id: 2,
    name: 'Oversized Cream Sweater',
    description: 'Cozy and comfortable knit for layering',
    image: 'https://images.unsplash.com/photo-1434664072143-81f4f4aaf022?w=500&h=600&fit=crop',
    category: 'Women',
    pinterestUrl: 'https://pinterest.com',
    isTrending: true
  },
  {
    id: 3,
    name: 'Vintage Denim Jacket',
    description: 'Timeless piece for effortless cool',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=600&fit=crop',
    category: 'Streetwear',
    pinterestUrl: 'https://pinterest.com',
    isTrending: false
  },
  {
    id: 4,
    name: 'White Linen Shirt',
    description: 'Elegant and breathable for summer style',
    image: 'https://images.unsplash.com/photo-1596786411405-82f27acb6dff?w=500&h=600&fit=crop',
    category: 'Women',
    pinterestUrl: 'https://pinterest.com',
    isTrending: false
  },
  {
    id: 5,
    name: 'Black Tailored Trousers',
    description: 'Premium fit for professional looks',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop',
    category: 'Women',
    pinterestUrl: 'https://pinterest.com',
    isTrending: true
  },
  {
    id: 6,
    name: 'Casual Joggers',
    description: 'Comfort meets style in neutral tones',
    image: 'https://images.unsplash.com/photo-1516621318914-c7d277eaac4f?w=500&h=600&fit=crop',
    category: 'Streetwear',
    pinterestUrl: 'https://pinterest.com',
    isTrending: false
  },
  {
    id: 7,
    name: 'Gold Layered Necklace',
    description: 'Delicate and versatile accessory',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=600&fit=crop',
    category: 'Accessories',
    pinterestUrl: 'https://pinterest.com',
    isTrending: true
  },
  {
    id: 8,
    name: 'Structured Leather Handbag',
    description: 'Timeless investment piece',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop',
    category: 'Accessories',
    pinterestUrl: 'https://pinterest.com',
    isTrending: false
  },
  {
    id: 9,
    name: 'Classic White Sneakers',
    description: 'Versatile base for any outfit',
    image: 'https://images.unsplash.com/photo-1548062407-f961713ee56e?w=500&h=600&fit=crop',
    category: 'Budget Picks',
    pinterestUrl: 'https://pinterest.com',
    isTrending: true
  },
  {
    id: 10,
    name: 'Men\'s Linen Shirt',
    description: 'Breathable style for warm weather',
    image: 'https://images.unsplash.com/photo-1594741898269-22b2903fde9f?w=500&h=600&fit=crop',
    category: 'Men',
    pinterestUrl: 'https://pinterest.com',
    isTrending: false
  },
  {
    id: 11,
    name: 'Vintage Band Tee',
    description: 'Iconic streetwear statement piece',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
    category: 'Streetwear',
    pinterestUrl: 'https://pinterest.com',
    isTrending: true
  },
  {
    id: 12,
    name: 'Budget Friendly Basics Set',
    description: 'Essential neutral pieces at great value',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500&h=600&fit=crop',
    category: 'Budget Picks',
    pinterestUrl: 'https://pinterest.com',
    isTrending: false
  }
]

interface ProductGridProps {
  onViewStyle: (url: string) => void
}

export default function ProductGrid({ onViewStyle }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const categories = ['All', 'Women', 'Men', 'Streetwear', 'Accessories', 'Budget Picks']

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <section id="products-section" className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-balance font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Curated Collection
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover trending fashion pieces handpicked just for you
          </p>
        </div>

        <div className="mb-8 space-y-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewStyle={onViewStyle}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found matching your search.</p>
          </div>
        )}
      </div>
    </section>
  )
}
