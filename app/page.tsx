import Hero from '@/components/hero'
import RatingSection from '@/components/rating-section'
import Footer from '@/components/footer'
import DealOfTheDay from '@/components/deal-of-the-day'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Deal from '@/models/Deal'
import HeroSlide from '@/models/HeroSlide'
import ProductExplore from '@/components/product-explore'
import VideoAdSection from '@/components/video-ad-section'
import { Suspense } from 'react'
import { ProductSkeleton, DealSkeleton } from '@/components/skeletons'

export interface Product {
  _id: string
  name: string
  description: string
  image: string
  category: string
  pinterestUrl: string
  isTrending: boolean
  badge?: 'none' | 'trending' | 'dwv-choice'
  createdAt: string
}

async function getInitialData() {
  await dbConnect()
  const [productsData, dealsData, slidesData] = await Promise.all([
    Product.find({}).sort({ createdAt: -1 }).limit(12).lean(),
    Deal.find({}).sort({ slot: 1 }).lean(),
    HeroSlide.find({}).sort({ order: 1 }).lean()
  ])

  return {
    products: JSON.parse(JSON.stringify(productsData)),
    deals: JSON.parse(JSON.stringify(dealsData)),
    slides: JSON.parse(JSON.stringify(slidesData)),
    total: await Product.countDocuments({})
  }
}

export default async function Home() {
  const { products, deals, slides, total } = await getInitialData()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <Hero initialSlides={slides} />

      {/* Video Ad Section */}
      <VideoAdSection />

      {/* Deal of the Day Section */}
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><DealSkeleton /><DealSkeleton /><DealSkeleton /><DealSkeleton /></div>}>
        <DealOfTheDay initialDeals={deals} />
      </Suspense>

      {/* Product Explore Section (Search, Categories, Grid) */}
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">Loading discoveries...</div>}>
        <ProductExplore
          initialProducts={products}
          initialTotal={total}
          initialHasMore={total > products.length}
        />
      </Suspense>

      {/* Rating Section */}
      <RatingSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
