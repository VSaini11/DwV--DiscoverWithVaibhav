'use client'

import { useState } from 'react'
import { Mail, Instagram, Twitter, Linkedin, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [alreadySubscribed, setAlreadySubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.code === 'already_subscribed') {
          setAlreadySubscribed(true)
          setEmail('')
        } else {
          toast.error(data.error || 'Something went wrong. Please try again.')
        }
        return
      }

      setIsSubscribed(true)
      setEmail('')
      toast.success('Welcome to the circle! 🎉')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="bg-primary text-primary-foreground py-16 px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4 tracking-tight">DiscoverWithVaibhav</h3>
            <p className="text-sm opacity-80 leading-relaxed max-w-xs">
              Your curated fashion marketplace, powered by Pinterest trends. Elevating your style discovery.
            </p>
          </div>

          {/* Subscription Section */}
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-4 text-primary-foreground/90">Stay Inspired</h4>
            {isSubscribed ? (
              <div className="bg-white/10 border border-white/20 p-4 rounded-2xl animate-in fade-in zoom-in duration-500">
                <p className="text-sm font-medium flex items-center gap-2">
                  <span className="text-xl">✨</span> You're on the list! We'll keep you updated.
                </p>
              </div>
            ) : alreadySubscribed ? (
              <div className="bg-white/10 border border-white/20 p-4 rounded-2xl animate-in fade-in zoom-in duration-500">
                <p className="text-sm font-medium flex items-center gap-2">
                  <span className="text-xl">🔖</span> You're already part of our story.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <p className="text-sm opacity-80 mb-2">Get notified when we drop our next collections.</p>
                <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <Input
                    type="email"
                    placeholder="E-mail address"
                    className="h-11 bg-white/10 border-white/20 placeholder:text-white/40 text-white rounded-full px-5 focus-visible:ring-white/40"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="rounded-full h-11 px-8 font-semibold shadow-lg hover:shadow-xl transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Wait...' : 'Notify Me'}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Social Section */}
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-4 text-primary-foreground/90">Keep in Touch</h4>
            <div className="flex gap-5">
              {[
                { icon: Mail, label: 'Email', href: 'mailto:vaibhavsaini709@gmail.com' },
                { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/dwvstyle?igsh=MWxlaTlqazBicWMzMQ==' },
                { icon: Twitter, label: 'Twitter', href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/dwv-brand' }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
                  aria-label={item.label}
                >
                  <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 mt-12 space-y-4 text-sm opacity-70">
          <p>
            <strong>Affiliate Disclosure:</strong> This website contains affiliate links. When you click on these links and make a purchase, we may earn a commission at no additional cost to you.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5">
            <p className="text-xs opacity-60">
              © {currentYear} DiscoverWithVaibhav. All rights reserved. Fashion curated with love from Pinterest.
            </p>
            <div className="flex gap-6 text-xs font-medium uppercase tracking-wider">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
