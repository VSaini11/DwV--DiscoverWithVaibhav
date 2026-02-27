'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft, Plus, Image as ImageIcon, Link as LinkIcon, Tag, Type, AlignLeft, Upload, X, Camera, Lock, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import Hero from '@/components/hero'
import Footer from '@/components/footer'
import { useRouter } from 'next/navigation'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

export default function AdminPage() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [passwordInput, setPasswordInput] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        pinterestUrl: '',
        isTrending: false
    })

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
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    image: imagePreview,
                    pinterestUrl: formData.pinterestUrl,
                    isTrending: true
                }),
            })

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save product');
            }

            toast.success('Successfully added product!')
            router.push('/')
        } catch (error: any) {
            console.error('Save failed', error)
            toast.error('Error adding product', {
                description: error.message || 'Please try again.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Hero />

            <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="mb-8">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Discover
                        </Button>
                    </Link>
                </div>

                <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                    <div className="p-8 border-b bg-muted/30">
                        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <Plus className="w-6 h-6" />
                            </div>
                            Add New Product
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

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Adding Find...' : 'Add Style to Discoveries'}
                            </Button>
                        </div>

                        <p className="text-xs text-center text-muted-foreground">
                            Note: This is a UI demonstration. Products will not be permanently saved without a backend.
                        </p>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}
