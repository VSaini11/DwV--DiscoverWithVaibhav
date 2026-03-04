'use client'

import Link from 'next/link'
import { Search, User, Heart, ShoppingBag, Phone, Menu, LogOut, UserCircle, ChevronLeft, ChevronRight, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useCallback } from 'react'
import AuthModal from './auth-modal'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface HeroProps {
  searchQuery?: string
  setSearchQuery?: (query: string) => void
  initialSlides?: any[]
}
const marqueeItems = [1, 2, 3, 4, 5, 6, 7, 8]

export default function Hero({ searchQuery, setSearchQuery, initialSlides }: HeroProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  const scrollToProducts = () => {
    const element = document.getElementById('products-section')
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const [slides, setSlides] = useState<any[]>(() => {
    if (initialSlides && initialSlides.length > 0) {
      return initialSlides.map(slide => ({
        ...slide,
        id: slide._id || slide.id
      }))
    }
    return []
  })

  // Function to get the action for a slide
  const getSlideAction = useCallback((slide: any) => {
    return () => {
      if (slide.buttonLink?.startsWith('#')) {
        const element = document.getElementById(slide.buttonLink.substring(1))
        if (element) {
          const headerOffset = 100
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + (typeof window !== 'undefined' ? window.pageYOffset : 0) - headerOffset
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
          }
        }
      } else if (slide.buttonLink) {
        if (typeof window !== 'undefined') {
          window.open(slide.buttonLink, '_blank')
        }
      }
    }
  }, [])

  const fetchSlides = useCallback(async () => {
    try {
      const res = await fetch('/api/hero')
      if (res.ok) {
        const data = await res.json()
        if (data.length > 0) {
          const formattedSlides = data.map((slide: any) => ({
            ...slide,
            id: slide._id,
          }))
          setSlides(formattedSlides)
        }
      }
    } catch (error) {
      console.error('Failed to fetch slides', error)
    }
  }, [])

  const defaultSlides = [
    {
      id: 1,
      title: "Elevated",
      subtitle: "Essentials",
      description: "Discover the perfect balance of comfort and style with our curated essentials.",
      image: "/hero-image.png",
      bg: "#f4f7f9",
      buttonText: "Discover Now",
      buttonLink: "#products-section"
    },
    {
      id: 2,
      title: "Pick of",
      subtitle: "The Week",
      description: "Handpicked style that's making waves this week. Don't miss out on this viral find.",
      image: "/pick-of-the-week.jpg",
      bg: "#fdf8f6",
      buttonText: "Shop the Look",
      buttonLink: "https://amzn.to/4smffny"
    }
  ]

  // Use default slides if no slides provided
  useEffect(() => {
    if (slides.length === 0) {
      setSlides(defaultSlides)
    }
  }, [slides.length])

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return
    setActiveSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = () => {
    if (slides.length === 0) return
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    setIsMounted(true)
    // Optional: Refresh slides on client mounting if needed
    // fetchSlides() 
  }, [])

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(nextSlide, 6000)
      return () => clearInterval(timer)
    }
  }, [nextSlide, slides.length])

  useEffect(() => {
    const storedUser = localStorage.getItem('dv_user')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('dv_token')
    localStorage.removeItem('dv_user')
    setUser(null)
    router.push('/')
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setSearchQuery) {
      setSearchQuery(e.target.value)
      // Optionally scroll to products section on search if it starts a search
      if (e.target.value) {
        scrollToProducts()
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col">
      {/* Moving Marquee to Top - SSR Safe */}
      <div className="fixed top-0 left-0 right-0 z-[110] bg-red-600 py-1 sm:py-2 overflow-hidden shadow-sm">
        <div className="flex whitespace-nowrap animate-marquee">
          {marqueeItems.map((i) => (
            <div key={i} className="flex items-center mx-4">
              <span className="text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                DEAL OF THE DAY • DwV
              </span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {marqueeItems.map((i) => (
            <div key={`dup-${i}`} className="flex items-center mx-4">
              <span className="text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                DEAL OF THE DAY • DwV
              </span>
            </div>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />

      {/* Redesigned Header - Now Offset by Marquee */}
      <nav className="fixed top-6 sm:top-8 left-0 right-0 z-[100] px-3 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl border border-white/20 px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between rounded-full shadow-2xl shadow-gray-200/50">
          {/* Left: Search — hidden on mobile */}
          <div className="hidden sm:flex items-center group">
            <Search className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <input
              type="text"
              placeholder="Search store..."
              className="ml-3 bg-transparent border-none text-sm text-gray-600 focus:outline-none placeholder-gray-400 w-full max-w-[150px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Center: Logo — exact center on desktop via absolute, left on mobile */}
          <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            <span className="text-xl sm:text-2xl md:text-3xl font-serif font-light tracking-tighter text-gray-900 cursor-pointer text-center block" onClick={() => router.push('/')}>
              <span className="font-bold italic text-red-600">DwV</span>
            </span>
          </div>

          <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-3">
            {isMounted && user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" className="hidden lg:flex gap-2 text-sm font-medium text-gray-600 rounded-full">
                  <UserCircle className="w-4 h-4" />
                  {user.email.split('@')[0]}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : isMounted ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 rounded-full px-2 sm:px-4 h-8 sm:h-9"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign In
                </Button>
                <Button
                  className="hidden sm:flex text-sm font-bold bg-black text-white hover:bg-gray-800 rounded-full px-4 sm:px-5 h-8 sm:h-9"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="w-20" /> /* Placeholder while loading user state */
            )}

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-red-500 hover:bg-red-50 h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-colors"
              onClick={() => router.push('/likes')}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Carousel Section - SSR Enabled */}
      <section className="relative flex-1 overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center justify-center pt-32 sm:pt-40 pb-16 sm:pb-12 px-4 sm:px-6 ${index === activeSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95 pointer-events-none'
              }`}
            style={{ backgroundColor: slide.bg }}
          >
            {/* Creative background elements for text-only slides */}
            {slide.isTextOnly && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 -left-12 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 animate-pulse" />
                <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-50 animate-pulse delay-700" />
              </div>
            )}

            <div className={`max-w-7xl mx-auto w-full ${slide.isTextOnly ? 'flex flex-col items-center text-center' : 'grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center'}`}>
              <div
                className={`z-10 ${slide.isTextOnly ? 'max-w-4xl space-y-10' : 'text-center lg:text-left space-y-4 sm:space-y-6'} transition-all duration-1000 delay-300 ${index === activeSlide ? 'translate-x-0 opacity-100' : slide.isTextOnly ? 'translate-y-12 opacity-0' : '-translate-x-12 opacity-0'
                  }`}
              >
                <div className="space-y-0">
                  {slide.isTextOnly ? (
                    <div className="space-y-2">
                      <p className="text-red-600 font-bold tracking-[0.3em] text-xs sm:text-sm uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        Curated for You
                      </p>
                      <h2 className="text-6xl sm:text-8xl md:text-[7rem] lg:text-[9rem] font-playfair font-light italic tracking-tight text-gray-900 leading-[0.85] mb-2">
                        Finds <span className="font-normal not-italic">that</span>
                      </h2>
                      <h2 className="text-7xl sm:text-9xl md:text-[9rem] lg:text-[11rem] font-playfair font-black tracking-tighter text-gray-900 leading-[0.85] uppercase">
                        Fits <span className="text-red-600">you.</span>
                      </h2>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-4xl sm:text-6xl md:text-8xl font-light tracking-tight text-gray-900 leading-none">
                        {slide.title}
                      </h2>
                      <h2 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tight text-gray-900 leading-none">
                        {slide.subtitle}
                      </h2>
                    </>
                  )}
                </div>

                <p className={`text-gray-600 text-sm sm:text-lg lg:text-xl ${slide.isTextOnly ? 'max-w-2xl font-light italic' : 'max-w-md font-medium'} mx-auto ${slide.isTextOnly ? '' : 'lg:mx-0'}`}>
                  {slide.description}
                </p>

                <div className={`pt-4 sm:pt-8 flex justify-center ${slide.isTextOnly ? '' : 'lg:justify-start'}`}>
                  <Button
                    onClick={getSlideAction(slide)}
                    className={`px-10 sm:px-12 py-7 sm:py-8 text-xs sm:text-sm font-bold transition-all rounded-none uppercase tracking-widest active:scale-95 group ${slide.isTextOnly ? 'bg-red-600 text-white hover:bg-black shadow-2xl shadow-red-200' : 'bg-black text-white hover:bg-gray-800'
                      }`}
                  >
                    {'icon' in slide && slide.icon}
                    {slide.buttonText}
                  </Button>
                </div>
              </div>

              {!slide.isTextOnly && (
                <div
                  className={`relative z-0 flex justify-center lg:justify-end transition-all duration-1000 delay-500 ${index === activeSlide ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                    }`}
                >
                  <div className="relative w-full max-w-[320px] sm:max-w-[480px] lg:max-w-[600px] aspect-[4/5] lg:aspect-square">
                    {slide.image && (
                      <Image
                        src={slide.image as string}
                        alt={slide.subtitle}
                        fill
                        priority={index === 0}
                        className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 320px, (max-width: 1024px) 480px, 600px"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-1.5 transition-all duration-300 rounded-full ${index === activeSlide ? 'w-8 bg-black' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Arrow Navigation — hidden on mobile */}
        <div className="hidden lg:block">
          <button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white hover:border-white transition-all text-gray-900 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white hover:border-white transition-all text-gray-900 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>
    </div>
  )
}
