'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft, Plus, Image as ImageIcon, Link as LinkIcon, Tag, Type, AlignLeft, Upload, X, Camera, Lock, ShieldCheck, ShoppingCart, LayoutGrid } from 'lucide-react'
import { toast } from 'sonner'
import Hero from '@/components/hero'
import Footer from '@/components/footer'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface DealSlot {
    slot: number
    title: string
    image: string
    link: string
}

interface Product {
    _id: string
    name: string
    description: string
    category: string
    image: string
    pinterestUrl: string
    isTrending: boolean
    badge: 'none' | 'trending' | 'dwv-choice'
}

interface HeroSlide {
    _id?: string
    title: string
    subtitle: string
    description: string
    image?: string
    bg: string
    buttonText: string
    buttonLink: string
    isTextOnly: boolean
    order: number
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

export default function AdminPage() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [passwordInput, setPasswordInput] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'products' | 'deals' | 'hero'>('products')
    const [filterCategory, setFilterCategory] = useState<string>('all')
    const [products, setProducts] = useState<Product[]>([])
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
    const [editingHero, setEditingHero] = useState<HeroSlide | null>(null)
    const [heroForm, setHeroForm] = useState<HeroSlide>({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        bg: '#f4f7f9',
        buttonText: 'Discover Now',
        buttonLink: '',
        isTextOnly: false,
        order: 0
    })
    const [deals, setDeals] = useState<DealSlot[]>([
        { slot: 1, title: '', image: '', link: '' },
        { slot: 2, title: '', image: '', link: '' },
        { slot: 3, title: '', image: '', link: '' },
        { slot: 4, title: '', image: '', link: '' }
    ])

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        pinterestUrl: '',
        isTrending: false,
        badge: 'none' as 'none' | 'trending' | 'dwv-choice'
    })

    useEffect(() => {
        if (isAuthenticated) {
            fetchDeals()
            fetchHeroSlides()
            fetchProducts()
        }
    }, [isAuthenticated])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products')
            if (res.ok) {
                const data = await res.json()
                setProducts(data)
            }
        } catch (error) {
            console.error('Failed to fetch products', error)
        }
    }

    const fetchHeroSlides = async () => {
        try {
            const res = await fetch('/api/hero')
            if (res.ok) {
                const data = await res.json()
                setHeroSlides(data)
            }
        } catch (error) {
            console.error('Failed to fetch hero slides', error)
        }
    }

    const fetchDeals = async () => {
        try {
            const res = await fetch('/api/deals')
            if (res.ok) {
                const data = await res.json()
                if (data.length > 0) {
                    const updatedDeals = [...deals]
                    data.forEach((d: any) => {
                        const index = d.slot - 1
                        if (index >= 0 && index < 4) {
                            updatedDeals[index] = d
                        }
                    })
                    setDeals(updatedDeals)
                }
            }
        } catch (error) {
            console.error('Failed to fetch deals', error)
        }
    }

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordInput === ADMIN_PASSWORD) {
            setIsAuthenticated(true)
            setPasswordError(false)
        } else {
            setPasswordError(true)
            setPasswordInput('')
        }
    }

    // ─── Password Gate ───────────────────────────────────────────────────────
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Hero />
                <main className="flex-1 flex items-center justify-center px-4 py-20">
                    <div className="w-full max-w-sm">
                        <div className="bg-card rounded-3xl border shadow-xl overflow-hidden">
                            <div className="p-8 border-b bg-muted/30 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="w-8 h-8 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight">Admin Access</h1>
                                <p className="text-sm text-muted-foreground mt-2">Enter the admin password to continue.</p>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="p-8 space-y-4">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    autoFocus
                                    value={passwordInput}
                                    onChange={(e) => {
                                        setPasswordInput(e.target.value)
                                        setPasswordError(false)
                                    }}
                                    className={`h-12 rounded-xl text-center tracking-widest text-lg ${passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    required
                                />
                                {passwordError && (
                                    <p className="text-sm text-red-500 text-center">Incorrect password. Try again.</p>
                                )}
                                <Button type="submit" className="w-full h-12 rounded-xl font-semibold gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    Unlock Admin
                                </Button>
                                <div className="text-center">
                                    <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                        ← Back to site
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    // ─── Admin Panel ─────────────────────────────────────────────────────────


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setImagePreview(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!imagePreview) {
            toast.error('Image Required', {
                description: 'Please upload an image for the product.'
            })
            return
        }

        setIsSubmitting(true)

        try {
            const method = editingProduct ? 'PUT' : 'POST'
            const payload = {
                ...formData,
                image: imagePreview,
                _id: editingProduct?._id
            }

            const res = await fetch('/api/products', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save product');
            }

            toast.success(editingProduct ? 'Successfully updated product!' : 'Successfully added product!')

            // Reset form
            setFormData({
                name: '',
                description: '',
                category: '',
                pinterestUrl: '',
                isTrending: false,
                badge: 'none'
            })
            setImagePreview(null)
            setEditingProduct(null)
            fetchProducts()

            if (!editingProduct) {
                router.push('/')
            }
        } catch (error: any) {
            console.error('Save failed', error)
            toast.error(editingProduct ? 'Error updating product' : 'Error adding product', {
                description: error.message || 'Please try again.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const deleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete product')
            toast.success('Product deleted successfully')
            fetchProducts()
        } catch (error: any) {
            toast.error('Error deleting product', { description: error.message })
        }
    }

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            pinterestUrl: product.pinterestUrl,
            isTrending: product.isTrending,
            badge: product.badge || 'none'
        })
        setImagePreview(product.image)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDealSubmit = async (slot: number) => {
        const deal = deals[slot - 1]
        if (!deal.image || !deal.title || !deal.link) {
            toast.error('Missing Information', { description: `Please provide all details for Deal Slot ${slot}.` })
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/deals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(deal),
            })
            if (!res.ok) throw new Error('Failed to update deal')
            toast.success(`Slot ${slot} Updated Successfully!`)
        } catch (error: any) {
            toast.error('Error updating deal', { description: error.message })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDealImageChange = (slot: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const updatedDeals = [...deals]
                updatedDeals[slot - 1].image = reader.result as string
                setDeals(updatedDeals)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleHeroSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/hero', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(heroForm),
            })

            if (!res.ok) throw new Error('Failed to save hero slide')

            toast.success(heroForm._id ? 'Hero Slide Updated!' : 'Hero Slide Added!')
            fetchHeroSlides()
            setEditingHero(null)
            setHeroForm({
                title: '',
                subtitle: '',
                description: '',
                image: '',
                bg: '#f4f7f9',
                buttonText: 'Discover Now',
                buttonLink: '',
                isTextOnly: false,
                order: heroSlides.length
            })
        } catch (error: any) {
            toast.error('Error saving hero slide', { description: error.message })
        } finally {
            setIsSubmitting(false)
        }
    }

    const deleteHeroSlide = async (id: string) => {
        if (!confirm('Are you sure you want to delete this hero slide?')) return

        try {
            const res = await fetch(`/api/hero?id=${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete slide')
            toast.success('Slide Deleted')
            fetchHeroSlides()
        } catch (error: any) {
            toast.error('Error deleting slide', { description: error.message })
        }
    }

    const importOriginalSlides = async () => {
        if (!confirm('This will replace all your current slides with the 4 original slides. Continue?')) return
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/hero', { method: 'PATCH' })
            if (!res.ok) throw new Error('Failed to import')
            toast.success('Original Slides Imported!')
            fetchHeroSlides()
        } catch (error: any) {
            toast.error('Import failed', { description: error.message })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Hero />

            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Discover
                        </Button>
                    </Link>

                    <div className="flex bg-muted/50 p-1 rounded-xl border w-fit">
                        <Button
                            variant={activeTab === 'products' ? 'default' : 'ghost'}
                            size="sm"
                            className="rounded-lg gap-2"
                            onClick={() => setActiveTab('products')}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Products
                        </Button>
                        <Button
                            variant={activeTab === 'deals' ? 'default' : 'ghost'}
                            size="sm"
                            className="rounded-lg gap-2"
                            onClick={() => setActiveTab('deals')}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Deals of the Day
                        </Button>
                        <Button
                            variant={activeTab === 'hero' ? 'default' : 'ghost'}
                            size="sm"
                            className="rounded-lg gap-2"
                            onClick={() => setActiveTab('hero')}
                        >
                            <ImageIcon className="w-4 h-4" />
                            Hero Section
                        </Button>
                    </div>
                </div>

                {activeTab === 'products' ? (
                    <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                        <div className="p-8 border-b bg-muted/30">
                            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <LayoutGrid className="w-6 h-6" />
                                </div>
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Enter the details of the viral fashion find you discovered on Pinterest.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Type className="w-4 h-4 text-muted-foreground" />
                                    Product Name
                                </label>
                                <Input
                                    placeholder="e.g., Oversized Wool Coat"
                                    required
                                    className="rounded-xl"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <AlignLeft className="w-4 h-4 text-muted-foreground" />
                                    Description
                                </label>
                                <Textarea
                                    placeholder="Briefly describe why this item is a viral find..."
                                    className="min-h-32 rounded-xl resize-none"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-muted-foreground" />
                                        Category
                                    </label>
                                    <select
                                        className="w-full h-10 rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem_1rem]"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="clothing">Clothing</option>
                                        <option value="sneakers">Sneakers</option>
                                        <option value="footwear">Footwear</option>
                                        <option value="fragrances">Fragrances</option>
                                        <option value="accessories">Accessories</option>
                                        <option value="budget-finds">Budget Finds</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Camera className="w-4 h-4 text-muted-foreground" />
                                        Product Image
                                    </label>
                                    <div className="relative group">
                                        {imagePreview ? (
                                            <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted/30">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all shadow-lg"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 hover:bg-muted/10 hover:border-primary/50 transition-all cursor-pointer group/upload">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <div className="p-3 rounded-full bg-primary/5 text-primary mb-3 group-hover/upload:scale-110 transition-transform">
                                                        <Upload className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-sm font-medium">Click to upload image</p>
                                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    required
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4 text-muted-foreground" />
                                    Pinterest Link
                                </label>
                                <Input
                                    type="url"
                                    placeholder="https://pinterest.com/pin/..."
                                    required
                                    className="rounded-xl"
                                    value={formData.pinterestUrl}
                                    onChange={(e) => setFormData({ ...formData, pinterestUrl: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-muted-foreground" />
                                    Product Badge (Display Style)
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div
                                        onClick={() => setFormData({ ...formData, badge: 'none' })}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.badge === 'none' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/20'}`}
                                    >
                                        <div className="w-full text-center py-1 rounded bg-muted text-[10px] font-bold uppercase text-muted-foreground">No Badge</div>
                                        <span className="text-xs font-medium">Original View</span>
                                    </div>
                                    <div
                                        onClick={() => setFormData({ ...formData, badge: 'trending' })}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.badge === 'trending' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/20'}`}
                                    >
                                        <div className="w-full text-center py-1 rounded bg-black text-white text-[10px] font-bold uppercase">Trending</div>
                                        <span className="text-xs font-medium">Black & White</span>
                                    </div>
                                    <div
                                        onClick={() => setFormData({ ...formData, badge: 'dwv-choice' })}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.badge === 'dwv-choice' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/20'}`}
                                    >
                                        <div className="w-full text-center py-1 rounded bg-red-600 text-white text-[10px] font-bold uppercase">DWV Choice</div>
                                        <span className="text-xs font-medium">Red & White</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (editingProduct ? 'Updating...' : 'Adding Find...') : (editingProduct ? 'Update Product' : 'Add Style to Discoveries')}
                                </Button>
                                {editingProduct && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full mt-3 h-12 rounded-xl font-medium"
                                        onClick={() => {
                                            setEditingProduct(null)
                                            setFormData({
                                                name: '',
                                                description: '',
                                                category: '',
                                                pinterestUrl: '',
                                                isTrending: false,
                                                badge: 'none'
                                            })
                                            setImagePreview(null)
                                        }}
                                    >
                                        Cancel Edit
                                    </Button>
                                )}
                            </div>
                        </form>

                        <div className="p-8 border-t bg-muted/10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <LayoutGrid className="w-5 h-5 text-primary" />
                                    Existing Products ({products.length})
                                </h3>
                                <select
                                    className="h-9 rounded-lg border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:0.8rem_0.8rem] pr-8 min-w-[140px]"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="sneakers">Sneakers</option>
                                    <option value="footwear">Footwear</option>
                                    <option value="fragrances">Fragrances</option>
                                    <option value="accessories">Accessories</option>
                                    <option value="budget-finds">Budget Finds</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {products
                                    .filter(p => filterCategory === 'all' || p.category === filterCategory)
                                    .map((product) => (
                                        <div key={product._id} className="bg-card rounded-xl border p-4 flex gap-4 items-center">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden border bg-muted shrink-0">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm truncate">{product.name}</h4>
                                                <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditProduct(product)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteProduct(product._id)}
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                {products.length === 0 && (
                                    <p className="text-muted-foreground text-center py-8 col-span-2">No products added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'deals' ? (
                    <div className="space-y-8">
                        <div className="bg-card rounded-2xl border shadow-sm p-8 bg-muted/30">
                            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6" />
                                </div>
                                Manage Deals of the Day
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Update the 4 spotlight products featured in the home page carousel.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {deals.map((deal) => (
                                <div key={deal.slot} className="bg-card rounded-2xl border shadow-sm overflow-hidden flex flex-col">
                                    <div className="p-6 border-b bg-muted/10 flex items-center justify-between">
                                        <h3 className="font-semibold text-lg">Slot {deal.slot}</h3>
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full uppercase font-bold tracking-wider">Spotlight</span>
                                    </div>
                                    <div className="p-6 space-y-4 flex-1">
                                        <div className="relative group">
                                            {deal.image ? (
                                                <div className="relative aspect-video rounded-xl overflow-hidden border">
                                                    <img src={deal.image} alt="Deal Preview" className="w-full h-full object-cover" />
                                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                        <Camera className="w-8 h-8 text-white" />
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => handleDealImageChange(deal.slot, e)}
                                                        />
                                                    </label>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 hover:bg-muted/10 hover:border-primary/50 transition-all cursor-pointer">
                                                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                                    <p className="text-xs font-medium">Upload Image</p>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleDealImageChange(deal.slot, e)}
                                                    />
                                                </label>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase text-muted-foreground px-1">Product Title</label>
                                                <Input
                                                    placeholder="e.g. Premium Leather Sneakers"
                                                    value={deal.title}
                                                    onChange={(e) => {
                                                        const updated = [...deals]
                                                        updated[deal.slot - 1].title = e.target.value
                                                        setDeals(updated)
                                                    }}
                                                    className="rounded-lg h-9"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase text-muted-foreground px-1">Buy Page / Pinterest Link</label>
                                                <Input
                                                    placeholder="https://..."
                                                    value={deal.link}
                                                    onChange={(e) => {
                                                        const updated = [...deals]
                                                        updated[deal.slot - 1].link = e.target.value
                                                        setDeals(updated)
                                                    }}
                                                    className="rounded-lg h-9"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-muted/5 border-t">
                                        <Button
                                            onClick={() => handleDealSubmit(deal.slot)}
                                            className="w-full rounded-lg"
                                            disabled={isSubmitting}
                                        >
                                            Update Slot {deal.slot}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="bg-card rounded-2xl border shadow-sm p-8 bg-muted/30">
                            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                Manage Hero Section
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Add, update, or remove slides from the homepage hero carousel.
                            </p>
                            {heroSlides.length === 0 && (
                                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                            <Upload className="w-4 h-4" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-semibold">Import Original Slides</p>
                                            <p className="text-muted-foreground">Start by importing the 4 slides that were previously hardcoded.</p>
                                        </div>
                                    </div>
                                    <Button size="sm" onClick={importOriginalSlides} disabled={isSubmitting}>
                                        Import Now
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden p-8">
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                {editingHero ? 'Edit Slide' : 'Add New Slide'}
                            </h3>
                            <form onSubmit={handleHeroSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Title</label>
                                        <Input
                                            value={heroForm.title}
                                            onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                                            placeholder="e.g. Elevated"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subtitle</label>
                                        <Input
                                            value={heroForm.subtitle}
                                            onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                                            placeholder="e.g. Essentials"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <Textarea
                                        value={heroForm.description}
                                        onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                                        placeholder="Describe the slide..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">BG Color (Hex)</label>
                                        <Input
                                            value={heroForm.bg}
                                            onChange={(e) => setHeroForm({ ...heroForm, bg: e.target.value })}
                                            placeholder="#f4f7f9"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Button Text</label>
                                        <Input
                                            value={heroForm.buttonText}
                                            onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                                            placeholder="Discover Now"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Button Link</label>
                                        <Input
                                            value={heroForm.buttonLink}
                                            onChange={(e) => setHeroForm({ ...heroForm, buttonLink: e.target.value })}
                                            placeholder="#products-section"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isTextOnly"
                                            checked={heroForm.isTextOnly}
                                            onChange={(e) => setHeroForm({ ...heroForm, isTextOnly: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="isTextOnly" className="text-sm font-medium">Text Only Slide</label>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-medium">Order</label>
                                        <Input
                                            type="number"
                                            value={heroForm.order}
                                            onChange={(e) => setHeroForm({ ...heroForm, order: parseInt(e.target.value) })}
                                            className="w-24"
                                        />
                                    </div>
                                </div>

                                {!heroForm.isTextOnly && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Hero Image (Optional but recommended)</label>
                                        {heroForm.image ? (
                                            <div className="relative aspect-video rounded-xl overflow-hidden border w-full max-w-sm">
                                                <img src={heroForm.image} alt="Preview" className="w-full h-full object-contain bg-muted" />
                                                <button
                                                    type="button"
                                                    onClick={() => setHeroForm({ ...heroForm, image: '' })}
                                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 hover:bg-muted/10 transition-all cursor-pointer w-full max-w-sm">
                                                <Upload className="w-6 h-6 mb-2" />
                                                <span className="text-xs">Upload Hero Image</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            const reader = new FileReader()
                                                            reader.onloadend = () => setHeroForm({ ...heroForm, image: reader.result as string })
                                                            reader.readAsDataURL(file)
                                                        }
                                                    }}
                                                />
                                            </label>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                        {heroForm._id ? 'Update Hero Slide' : 'Add Hero Slide'}
                                    </Button>
                                    {editingHero && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setEditingHero(null)
                                                setHeroForm({
                                                    title: '',
                                                    subtitle: '',
                                                    description: '',
                                                    image: '',
                                                    bg: '#f4f7f9',
                                                    buttonText: 'Discover Now',
                                                    buttonLink: '',
                                                    isTextOnly: false,
                                                    order: heroSlides.length
                                                })
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {heroSlides.map((slide) => (
                                <div key={slide._id} className="bg-card rounded-2xl border shadow-sm overflow-hidden flex flex-col">
                                    <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
                                        <h3 className="font-semibold">Order: {slide.order}</h3>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingHero(slide)
                                                    setHeroForm(slide)
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => slide._id && deleteHeroSlide(slide._id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-4 flex gap-4 items-center">
                                        {!slide.isTextOnly && slide.image && (
                                            <div className="w-20 h-20 rounded-lg overflow-hidden border bg-muted shrink-0">
                                                <img src={slide.image} alt={slide.title} className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{slide.title} {slide.subtitle}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{slide.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
