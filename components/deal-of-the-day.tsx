'use client'

import React, { useEffect, useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

interface Deal {
    _id: string
    slot: number
    title: string
    image: string
    link: string
}

export default function DealOfTheDay() {
    const [deals, setDeals] = useState<Deal[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/deals')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setDeals(data)
                }
                setLoading(false)
            })
            .catch((err) => {
                console.error('Failed to fetch deals', err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="h-10 w-64 bg-muted animate-pulse mb-8 rounded-lg" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-2xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (deals.length === 0) return null

    return (
        <section className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-1 sm:py-24">
            <div className="px-4 sm:px-0">
                <div className="flex items-center justify-between mb-1 sm:mb-16">
                    <div className="space-y-0.5">
                        <h2 className="text-base sm:text-5xl md:text-6xl font-playfair font-black tracking-tight text-foreground italic">
                            Deal of the <span className="text-red-600 not-italic">Day</span>
                        </h2>
                        <div className="h-0.5 w-8 sm:h-1.5 sm:w-24 bg-red-600 rounded-full" />
                    </div>
                </div>

                <Carousel
                    opts={{
                        align: 'center',
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-1 sm:-ml-6">
                        {deals.map((deal) => (
                            <CarouselItem key={deal._id} className="pl-1 sm:pl-6 basis-[82%] sm:basis-[48%] lg:basis-[24%]">
                                <div
                                    className="group relative w-full max-w-[280px] mx-auto aspect-[4/5] rounded-xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 bg-[#f8f8f8]"
                                    onClick={() => window.open(deal.link, '_blank')}
                                >
                                    <img
                                        src={deal.image}
                                        alt={deal.title}
                                        className="w-full h-full object-contain sm:object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 sm:opacity-80 sm:group-hover:opacity-90 transition-opacity" />

                                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-8 transform translate-y-0 transition-transform duration-500">
                                        <h3 className="text-sm sm:text-2xl font-bold text-white mb-0.5 sm:mb-2 line-clamp-1 sm:line-clamp-2 drop-shadow-md">
                                            {deal.title}
                                        </h3>
                                        <div className="flex items-center gap-1 text-red-500 font-bold text-[9px] sm:text-sm uppercase tracking-widest opacity-100 transition-opacity">
                                            <span>Shop Now</span>
                                            <ExternalLink className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                                        </div>
                                    </div>

                                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg border border-red-500/50">
                                        Exclusive
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    )
}
