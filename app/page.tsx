'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Heart, Search, Filter } from 'lucide-react'
import Hero from '@/components/hero'

import RatingSection from '@/components/rating-section'
import Footer from '@/components/footer'
import { toast } from 'sonner'

export interface Product {
  _id: string
  name: string
  description: string
  image: string
  category: string
  pinterestUrl: string
  isTrending: boolean
  createdAt: string
}

const categories = ['all', 'clothing', 'sneakers', 'footwear', 'fragrances', 'accessories', 'budget-finds']

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [alreadySubscribed, setAlreadySubscribed] = useState(false)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

  // Load liked product IDs for the logged-in user on mount
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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notifyEmail) return
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: notifyEmail }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.code === 'already_subscribed') {
          setAlreadySubscribed(true)
          setNotifyEmail('')
        } else {
          toast.error(data.error || 'Something went wrong. Please try again.')
        }
        return
      }

      setIsSubscribed(true)
      setNotifyEmail('')
      toast.success('You\'re on the list! 🎉')
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchQuery])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (searchQuery) params.append('query', searchQuery)

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      if (res.ok) {
        setProducts(data)
      } else {
        throw new Error(data.error || 'Failed to fetch products')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Could not load latest discoveries')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewStyle = (url: string) => {
    window.open(url, '_blank')
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DiscoverWithVaibhav',
    url: 'https://dwv-brand.vercel.app/',
    description: 'Discover viral fashion finds before everyone else. Handpicked trending styles curated from Pinterest.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://dwv-brand.vercel.app/?query={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <Hero />

      {/* Discovery Header */}
      <div className="bg-white/80 backdrop-blur-md border-b">
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
            {categories.map((category) => {
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
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap capitalize rounded-full px-4 sm:px-6 text-xs sm:text-sm h-8 sm:h-10 shrink-0"
                >
                  {labels[category] || category}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 animate-in fade-in duration-700">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <h2 className="text-xl sm:text-2xl font-medium text-muted-foreground animate-pulse">
              Loading our finds...
            </h2>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product._id}
                  className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-36 sm:h-60 overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                    {product.isTrending && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                        Trending
                      </div>
                    )}
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



            {products.length > 4 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mt-6 sm:mt-12">
                {products.slice(4).map((product) => (
                  <div
                    key={product._id}
                    className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-36 sm:h-60 overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      {product.isTrending && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                          Trending
                        </div>
                      )}
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
            )}
          </>
        ) : (
          <div className="relative overflow-hidden py-24 flex items-center justify-center">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl w-full text-center relative z-10">
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
                Elevating Your <span className="text-primary italic">Style Discovery</span>
              </h2>

              <p className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-lg mx-auto leading-relaxed px-2">
                We're curating the next wave of viral fashion finds from Pinterest. Stay tuned for a refined discovery experience that transforms your aesthetic.
              </p>

              {alreadySubscribed ? (
                <div className="animate-in fade-in zoom-in duration-500">
                  <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl inline-block max-w-sm shadow-md">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                      <span className="text-3xl">🔖</span>
                    </div>
                    <h3 className="text-2xl font-bold text-amber-900 mb-3">Already in the circle.</h3>
                    <p className="text-amber-800 leading-relaxed text-sm">
                      "You're already woven into our story. The moment our curated collection goes live, you'll be the first to know — sit tight, something beautiful is coming."
                    </p>
                    <p className="mt-4 text-xs text-amber-600 font-medium tracking-wide uppercase">— The DwV Team</p>
                  </div>
                </div>
              ) : !isSubscribed ? (
                <form onSubmit={handleSubscribe} className="max-w-md mx-auto space-y-4">
                  {/* Mobile: stacked. Desktop: pill-inline */}
                  <div className="flex flex-col sm:relative sm:block gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="h-14 pl-6 sm:pr-32 rounded-full border-muted-foreground/20 focus-visible:ring-primary shadow-sm hover:shadow-md transition-all text-lg"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      className="sm:absolute sm:right-1.5 sm:top-1.5 h-11 px-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                    >
                      Notify Me
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    Get early access when we drop our next collection.
                  </p>
                </form>
              ) : (
                <div className="animate-in fade-in zoom-in duration-500">
                  <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl inline-block max-w-sm">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-2xl">✨</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">You're on the list!</h3>
                    <p className="text-muted-foreground">
                      We'll let you know as soon as the curation is live. Check your inbox soon for something special.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Rating Section */}
      <RatingSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
