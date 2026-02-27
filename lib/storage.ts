export interface Product {
    id: number
    name: string
    description: string
    image: string
    category: string
    pinterestUrl: string
    isTrending: boolean
    createdAt: number
}

const STORAGE_KEY = 'dv_viral_finds'

export const getProducts = (): Product[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    try {
        return JSON.parse(stored)
    } catch (e) {
        console.error('Failed to parse stored products', e)
        return []
    }
}

export const saveProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    if (typeof window === 'undefined') return
    const products = getProducts()
    const newProduct: Product = {
        ...product,
        id: Date.now(),
        createdAt: Date.now()
    }
    const updatedProducts = [newProduct, ...products]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts))
    return newProduct
}
