'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

export default function VideoAdSection() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isMuted, setIsMuted] = useState(true)

    useEffect(() => {
        if (videoRef.current) {
            // Autoplay on mount might fail due to browser policies if not muted, 
            // but we start muted.
            videoRef.current.play().catch(() => setIsPlaying(false))
        }
    }, [])

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    return (
        <section className="w-full bg-background py-8 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-playfair font-black tracking-tight text-foreground italic leading-tight text-center">
                        Discover <span className="text-red-600 not-italic">DwV</span>
                    </h2>
                    <div className="h-1 w-12 sm:h-1.5 sm:w-20 bg-red-600 rounded-full mt-3" />
                </div>

                <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-black group">
                    <video
                        ref={videoRef}
                        src="/DwV Ad.mov"
                        className="w-full h-full object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                        onClick={togglePlay}
                    />

                    {/* Overlay controls */}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
                        <button
                            onClick={togglePlay}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors text-white"
                        >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                        </button>

                        <button
                            onClick={toggleMute}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors text-white"
                        >
                            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Centered Play Button when paused */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-white">
                                <Play className="w-10 h-10 ml-2" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
