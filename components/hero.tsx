import Link from 'next/link'
import { Search, User, Heart, ShoppingBag, Phone, Menu, LogOut, UserCircle, ChevronLeft, ChevronRight, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useCallback } from 'react'
import AuthModal from './auth-modal'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const router = useRouter()

  const slides = [
    {
      id: 1,
      title: "Elevated",
      subtitle: "Essentials",
      description: "Discover the perfect balance of comfort and style with our curated essentials.",
      image: "/hero-image.png",
      bg: "#f4f7f9",
      buttonText: "Discover Now",
      action: () => {
        const element = document.getElementById('products-section')
        element?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    {
      id: 2,
      title: "Pick of",
      subtitle: "The Week",
      description: "Handpicked style that's making waves this week. Don't miss out on this viral find.",
      image: "/pick-of-the-week.jpg",
      bg: "#fdf8f6",
      buttonText: "Shop the Look",
      action: () => {
        window.open('https://amzn.in/d/0bGmvkaM', '_blank')
      }
    },
    {
      id: 3,
      title: "Follow Us",
      subtitle: "On Insta",
      description: "Get daily style inspiration and behind-the-scenes content on our social feed.",
      image: "/instagram-follow.png",
      bg: "#f9f4fd",
      buttonText: "@dwvfinds_official",
      icon: <Instagram className="mr-2 h-4 w-4" />,
      action: () => {
        window.open('https://www.instagram.com/dwvfinds_official?igsh=MWxlaTlqazBicWMzMQ==', '_blank')
      }
    }
  ]

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide])

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

  return (
    <div className="flex flex-col min-h-screen">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />
      {/* Redesigned Header - Now Fixed */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl border border-white/20 px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between rounded-full shadow-2xl shadow-gray-200/50">
          {/* Left: Search — hidden on mobile */}
          <div className="hidden sm:flex items-center group">
            <Search className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <input
              type="text"
              placeholder="Search store..."
              className="ml-3 bg-transparent border-none text-sm text-gray-600 focus:outline-none placeholder-gray-400 w-full max-w-[150px]"
            />
          </div>

          {/* Center: Logo — exact center on desktop via absolute, left on mobile */}
          <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            <span className="text-xl sm:text-2xl md:text-3xl font-serif font-light tracking-tighter text-gray-900 cursor-pointer">
              <span className="font-bold italic text-red-600">DwV</span>
            </span>
          </div>

          <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-3">
            {user ? (
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
            ) : (
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
            )}

            <Link href="/likes">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-red-500 hover:bg-red-50 h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-colors">
                <Heart className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Carousel Section */}
      <section className="relative flex-1 overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center justify-center py-16 sm:py-12 px-4 sm:px-6 ${index === activeSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95 pointer-events-none'
              }`}
            style={{ backgroundColor: slide.bg }}
          >
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div
                className={`z-10 text-center lg:text-left space-y-4 sm:space-y-6 transition-all duration-1000 delay-300 ${index === activeSlide ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
              >
                <div className="space-y-0 sm:space-y-1">
                  <h2 className="text-4xl sm:text-6xl md:text-8xl font-light tracking-tight text-gray-900 leading-none">
                    {slide.title}
                  </h2>
                  <h2 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tight text-gray-900 leading-none">
                    {slide.subtitle}
                  </h2>
                </div>

                <p className="text-gray-600 text-sm sm:text-lg max-w-md mx-auto lg:mx-0 font-medium">
                  {slide.description}
                </p>

                <div className="pt-2 sm:pt-4 flex justify-center lg:justify-start">
                  <Button
                    onClick={slide.action}
                    className="px-8 sm:px-10 py-6 sm:py-7 text-xs sm:text-sm font-bold bg-black text-white hover:bg-gray-800 transition-all rounded-none uppercase tracking-widest active:scale-95 group"
                  >
                    {'icon' in slide && slide.icon}
                    {slide.buttonText}
                  </Button>
                </div>
              </div>

              <div
                className={`relative z-0 flex justify-center lg:justify-end transition-all duration-1000 delay-500 ${index === activeSlide ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                  }`}
              >
                <div className="relative w-full max-w-[320px] sm:max-w-[480px] lg:max-w-[600px] aspect-[4/5] lg:aspect-square">
                  <img
                    src={slide.image}
                    alt={slide.subtitle}
                    className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
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
