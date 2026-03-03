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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="flex items-center justify-between mb-10 sm:mb-16">
                <div className="space-y-2">
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-black tracking-tight text-foreground italic">
                        Deal of the <span className="text-red-600 not-italic">Day</span>
                    </h2>
                    <div className="h-1.5 w-24 bg-red-600 rounded-full" />
                </div>
            </div>

            <Carousel
                opts={{
                    align: 'start',
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4 sm:-ml-6">
                    {deals.map((deal) => (
                        <CarouselItem key={deal._id} className="pl-4 sm:pl-6 basis-full sm:basis-1/2 lg:basis-1/4">
                            <div
                                className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/10"
                                onClick={() => window.open(deal.link, '_blank')}
                            >
                                <img
                                    src={deal.image}
                                    alt={deal.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2 drop-shadow-md">
                                        {deal.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-red-500 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>Shop Now</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                </div>

                                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-red-500/50">
                                    Exclusive Deal
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    )
}
