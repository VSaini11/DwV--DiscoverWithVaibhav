'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, Sparkles, Send, Bell } from 'lucide-react'
import Hero from '@/components/hero'
import Footer from '@/components/footer'

export default function ComingSoonPage() {
    const [email, setEmail] = useState('')
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) {
            setIsSubscribed(true)
            setEmail('')
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Hero />

            <main className="flex-1 flex items-center justify-center relative overflow-hidden px-4 py-20">
                {/* Background Decorative Elements */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

                <div className="max-w-2xl w-full text-center relative z-10">

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
                        Elevating Your <span className="text-primary italic">Style Discovery</span>
                    </h1>

                    <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
                        We're curating the next wave of viral fashion finds from Pinterest. Stay tuned for a refined discovery experience that transforms your aesthetic.
                    </p>

                    {!isSubscribed ? (
                        <form onSubmit={handleSubscribe} className="max-w-md mx-auto space-y-4">
                            <div className="relative group">
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="h-14 pl-6 pr-32 rounded-full border-muted-foreground/20 focus-visible:ring-primary shadow-sm group-hover:shadow-md transition-all text-lg"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="absolute right-1.5 top-1.5 h-11 px-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Notify Me
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                                <Bell className="w-3 h-3" />
                                Get early access when we drop our next collection.
                            </p>
                        </form>
                    ) : (
                        <div className="animate-in fade-in zoom-in duration-500">
                            <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl inline-block max-w-sm">
                                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-2">You're on the list!</h3>
                                <p className="text-muted-foreground">
                                    We'll let you know as soon as the curation is live. Check your inbox soon for something special.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-16 pt-8 border-t border-muted-foreground/10">
                        <Link href="/">
                            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                                <ChevronLeft className="w-4 h-4" />
                                Return to Discover Board
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
