import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function PerfumeSection() {
    return (
        <section id="perfume-best-sellers" className="py-12 px-6">
            <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden relative group cursor-pointer transition-shadow duration-500 hover:shadow-2xl hover:shadow-gray-200">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="/perfume-banner.png"
                        alt="Perfume Collection"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-12 md:p-24 flex flex-col justify-center items-start space-y-8 min-h-[400px] md:min-h-[600px]">
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400">
                            New Arrival
                        </h2>
                        <h3 className="text-5xl md:text-8xl font-serif font-light text-white leading-tight">
                            Best <br />
                            <span className="font-bold italic">Perfumes</span>
                        </h3>
                    </div>

                    <p className="max-w-md text-gray-300 text-lg md:text-xl leading-relaxed font-light">
                        Indulge in our curated collection of luxury aromas. Your signature scent is waiting to be discovered.
                    </p>

                    <Button
                        className="px-10 py-7 bg-white text-black hover:bg-gray-100 rounded-none text-sm font-bold uppercase tracking-widest transition-all active:scale-95"
                    >
                        Discover Now
                    </Button>
                </div>
            </div>
        </section>
    )
}
