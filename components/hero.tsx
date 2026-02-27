import Link from 'next/link'
import { Search, User, Heart, ShoppingBag, Phone, Menu, LogOut, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import AuthModal from './auth-modal'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('dv_user')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const handleExplore = () => {
    const element = document.getElementById('products-section')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

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

      {/* Hero Section */}
      <section className="relative flex-1 bg-[#f4f7f9] overflow-hidden flex items-center justify-center py-16 sm:py-12 px-4 sm:px-6 min-h-[500px] sm:min-h-[600px]">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="z-10 text-center lg:text-left space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-light tracking-tight text-gray-900 leading-none">
                Elevated
              </h2>
              <h2 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tight text-gray-900 leading-none">
                Essentials
              </h2>
            </div>

            <div className="pt-2 sm:pt-4 flex justify-center lg:justify-start">
              <Button
                onClick={handleExplore}
                className="px-8 sm:px-10 py-6 sm:py-7 text-xs sm:text-sm font-bold bg-black text-white hover:bg-gray-800 transition-all rounded-none uppercase tracking-widest active:scale-95"
              >
                Discover Now
              </Button>
            </div>
          </div>

          <div className="relative z-0 flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="relative w-full max-w-[320px] sm:max-w-[480px] lg:max-w-[600px] aspect-[4/5] lg:aspect-square">
              <img
                src="/hero-image.png"
                alt="Elevated Essentials Collection"
                className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
