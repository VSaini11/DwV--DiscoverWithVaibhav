'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
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

interface DealOfTheDayProps {
    initialDeals?: Deal[]
}

export default function DealOfTheDay({ initialDeals = [] }: DealOfTheDayProps) {
    const [deals, setDeals] = useState<Deal[]>(initialDeals)
    const [loading, setLoading] = useState(initialDeals.length === 0)

    useEffect(() => {
        if (initialDeals.length > 0) return

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
    }, [initialDeals])

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
        <section className="w-full bg-background py-12 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-start mb-8 sm:mb-16">
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-black tracking-tight text-foreground italic leading-tight text-left">
                        Deal of the <span className="text-red-600 not-italic">Day</span>
                    </h2>
                    <div className="h-1 w-12 sm:h-1.5 sm:w-24 bg-red-600 rounded-full mt-2" />
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
                            <CarouselItem key={deal._id} className="pl-4 sm:pl-6 basis-[85%] sm:basis-1/2 lg:basis-1/4">
                                <div
                                    className="group relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-black/[0.03] bg-white"
                                    onClick={() => window.open(deal.link, '_blank')}
                                >
                                    <Image
                                        src={deal.image}
                                        alt={deal.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity" />

                                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                        <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3 line-clamp-2 drop-shadow-xl leading-tight">
                                            {deal.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-red-500 font-black text-xs sm:text-sm uppercase tracking-[0.2em]">
                                            <span>Shop Now</span>
                                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </div>
                                    </div>

                                    <div className="absolute top-5 right-5 bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl border border-white/10">
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
