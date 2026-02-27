'use client'

import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RatingSection() {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const [feedback, setFeedback] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) return
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setRating(0)
            setFeedback('')
        }, 3000)
    }

    return (
        <section className="py-24 bg-[#0a0a0a] text-white overflow-hidden relative">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -ml-48 -mb-48" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8 sm:space-y-12">
                <div className="space-y-4">
                    <h2 className="text-sm font-bold tracking-[0.4em] uppercase text-red-500">
                        Community Voice
                    </h2>
                    <h3 className="text-3xl sm:text-4xl md:text-6xl font-serif font-light leading-tight">
                        Rate Our <span className="font-bold italic">Finds</span>
                    </h3>
                    <p className="max-w-xl mx-auto text-gray-400 text-base sm:text-lg font-light leading-relaxed">
                        How are we doing? Your feedback helps us curate the best viral fashion trends for you.
                    </p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
                        {/* Star Rating */}
                        <div className="flex justify-center gap-2 md:gap-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="relative p-2 focus:outline-none group translate-z-0"
                                >
                                    <Star
                                        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 transition-all duration-300 ease-out transform ${(hover || rating) >= star
                                            ? 'fill-red-500 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                            : 'text-gray-700'
                                            } ${hover === star ? 'scale-110' : 'scale-100'}`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Feedback Input */}
                        <div className="max-w-lg mx-auto flex flex-col gap-3">
                            <Input
                                type="text"
                                placeholder="Share your thoughts..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-14 rounded-none focus:border-red-500 transition-colors"
                            />
                            <Button
                                type="submit"
                                disabled={rating === 0}
                                className="h-12 sm:h-14 px-8 bg-red-600 hover:bg-red-700 text-white rounded-none font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                Submit
                                <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        <div className="h-4 flex items-center justify-center">
                            {rating === 0 && hover === 0 && (
                                <p className="text-xs text-gray-500 animate-pulse tracking-widest">
                                    SELECT A STAR TO RATE
                                </p>
                            )}
                        </div>
                    </form>
                ) : (
                    <div className="animate-in zoom-in fade-in duration-500 py-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
                            <Star className="w-10 h-10 text-red-500 fill-red-500" />
                        </div>
                        <h4 className="text-2xl font-serif font-bold italic mb-2">Thank You!</h4>
                        <p className="text-gray-400">Your rating helps us improve.</p>
                    </div>
                )}
            </div>
        </section>
    )
}
