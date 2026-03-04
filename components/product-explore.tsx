'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/app/page'
import { ProductSkeleton } from './skeletons'

interface ProductExploreProps {
    initialProducts: Product[]
    initialTotal: number
    initialHasMore: boolean
}

const categories = ['all', 'clothing', 'sneakers', 'footwear', 'fragrances', 'accessories', 'budget-finds']

export default function ProductExplore({ initialProducts, initialTotal, initialHasMore }: ProductExploreProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        const token = localStorage.getItem('dv_token')
        if (!token) return
        fetch('/api/likes', { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data: any[]) => {
                if (Array.isArray(data)) setLikedIds(new Set(data.map((p) => p._id)))
            })
            .catch(() => { })
    }, [])

    const handleToggleLike = async (productId: string) => {
        const token = localStorage.getItem('dv_token')
        if (!token) {
            toast.error('Sign in to save your favourite finds!')
            return
        }
        try {
            const res = await fetch('/api/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ productId }),
            })
            const data = await res.json()
            setLikedIds((prev) => {
                const next = new Set(prev)
                data.liked ? next.add(productId) : next.delete(productId)
                return next
            })
            toast.success(data.liked ? 'Added to your likes ❤️' : 'Removed from likes')
        } catch {
            toast.error('Something went wrong. Please try again.')
        }
    }

    const fetchProducts = async (isLoadMore = false) => {
        if (isLoadMore) setIsLoadingMore(true)
        else setIsLoading(true)

        try {
            const params = new URLSearchParams()
            if (selectedCategory !== 'all') params.append('category', selectedCategory)
            if (searchQuery) params.append('query', searchQuery)
            if (isLoadMore) params.append('skip', products.length.toString())
            params.append('limit', '12')

            const res = await fetch(`/api/products?${params.toString()}`)
            const data = await res.json()

            if (res.ok) {
                if (isLoadMore) {
                    setProducts((prev) => [...prev, ...data.products])
                } else {
                    setProducts(data.products)
                }
                setHasMore(data.hasMore)
            } else {
                throw new Error(data.error || 'Failed to fetch products')
            }
        } catch (error) {
            console.error('Fetch error:', error)
            toast.error('Could not load latest discoveries')
        } finally {
            setIsLoading(false)
            setIsLoadingMore(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [selectedCategory, searchQuery])

    const handleViewStyle = (url: string) => {
        window.open(url, '_blank')
    }

    const labels: { [key: string]: string } = {
        all: 'All Collections',
        clothing: 'Clothing',
        sneakers: 'Sneakers',
        footwear: 'Footwear',
        fragrances: 'Fragrances',
        accessories: 'Accessories',
        'budget-finds': 'Budget Finds'
    }

    return (
        <>
            <div id="products-section" className="bg-white/80 backdrop-blur-md border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                        <h1 className="text-lg sm:text-2xl font-semibold tracking-tight text-foreground">
                            Discover Pinterest-Inspired Finds
                        </h1>

                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search trending styles..."
                                    className="pl-10 w-full rounded-full bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 sm:mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory(category)}
                                className="whitespace-nowrap capitalize rounded-full px-4 sm:px-6 text-xs sm:text-sm h-8 sm:h-10 shrink-0"
                            >
                                {labels[category] || category}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {isLoading && products.length === 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="space-y-12">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                                >
                                    <div className="relative h-36 sm:h-60 overflow-hidden bg-muted">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                        {product.badge && product.badge !== 'none' ? (
                                            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold ${product.badge === 'dwv-choice'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-black text-white'
                                                }`}>
                                                {product.badge === 'dwv-choice' ? 'DWV Choice' : 'Trending'}
                                            </div>
                                        ) : product.isTrending ? (
                                            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm">
                                                Trending
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
                                        <h3 className="font-semibold text-foreground line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 flex-1">{product.description}</p>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleViewStyle(product.pinterestUrl)}
                                                className="flex-1 text-xs sm:text-sm h-8 sm:h-10"
                                                variant="default"
                                            >
                                                View Style
                                            </Button>
                                            <Button
                                                onClick={() => handleToggleLike(product._id)}
                                                variant="outline"
                                                size="icon"
                                                className={`shrink-0 h-8 w-8 sm:h-10 sm:w-10 transition-colors ${likedIds.has(product._id)
                                                    ? 'text-red-500 border-red-500 bg-red-50'
                                                    : 'hover:text-red-500 hover:border-red-500'
                                                    }`}
                                            >
                                                <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${likedIds.has(product._id) ? 'fill-red-500' : ''}`} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {hasMore && (
                            <div className="flex justify-center pt-8">
                                <Button
                                    onClick={() => fetchProducts(true)}
                                    disabled={isLoadingMore}
                                    variant="outline"
                                    className="rounded-full px-8 h-12 text-sm font-semibold"
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin mr-2" />
                                            Loading More...
                                        </>
                                    ) : (
                                        'Show More Discoveries'
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <h2 className="text-2xl font-semibold text-muted-foreground">No matches found for "{searchQuery}"</h2>
                        <p className="mt-2 text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                )}
            </main>
        </>
    )
}
