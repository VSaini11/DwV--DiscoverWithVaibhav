'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, ChevronLeft, ExternalLink } from 'lucide-react'
import Hero from '@/components/hero'
import Footer from '@/components/footer'
import { toast } from 'sonner'

interface Product {
    _id: string
    name: string
    description: string
    image: string
    category: string
    pinterestUrl: string
    isTrending: boolean
}

export default function LikesPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('dv_token')
        if (!token) {
            setIsLoading(false)
            setIsLoggedIn(false)
            return
        }
        setIsLoggedIn(true)
        fetch('/api/likes', { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setProducts(data)
            })
            .catch(() => toast.error('Could not load your likes'))
            .finally(() => setIsLoading(false))
    }, [])

    const handleUnlike = async (productId: string) => {
        const token = localStorage.getItem('dv_token')
        if (!token) return
        try {
            await fetch('/api/likes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ productId }),
            })
            setProducts((prev) => prev.filter((p) => p._id !== productId))
            toast.success('Removed from likes')
        } catch {
            toast.error('Something went wrong')
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Hero />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Discover
                        </Button>
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        Your Liked Finds
                    </h1>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 animate-pulse">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="h-[250px] sm:h-[380px] bg-muted rounded-lg" />
                        ))}
                    </div>
                ) : !isLoggedIn ? (
                    <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-400 mb-6">
                            <Heart className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">Sign in to see your likes</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                            Your saved discoveries will appear here once you're signed in.
                        </p>
                        <Link href="/">
                            <Button size="lg" className="rounded-full px-8">
                                Go to Home
                            </Button>
                        </Link>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-400 mb-6">
                            <Heart className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-3 text-foreground">No liked finds yet</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                            Tap the ❤️ on any product to save it here for later.
                        </p>
                        <Link href="/">
                            <Button size="lg" className="rounded-full px-8">
                                Start Discovering
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                            >
                                <div className="relative h-36 sm:h-64 overflow-hidden bg-muted">
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
                                    {/* Unlike button overlay */}
                                    <button
                                        onClick={() => handleUnlike(product._id)}
                                        className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-red-50 transition-colors"
                                        title="Remove from likes"
                                    >
                                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                                    </button>
                                </div>

                                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
                                    <h3 className="font-semibold text-foreground line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 flex-1">{product.description}</p>
                                    <Button
                                        onClick={() => window.open(product.pinterestUrl, '_blank')}
                                        className="w-full gap-2 text-xs sm:text-sm h-8 sm:h-10"
                                        variant="default"
                                    >
                                        View Style
                                        <ExternalLink className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
