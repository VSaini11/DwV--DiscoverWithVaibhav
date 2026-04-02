import { NextResponse } from 'next/server'
import HeroSlide from '@/models/HeroSlide'
import dbConnect from '@/lib/mongodb'
import { revalidatePath } from 'next/cache'

export async function GET() {
    try {
        await dbConnect()
        const slides = await HeroSlide.find({}).sort({ order: 1 })
        return NextResponse.json(slides)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect()
        const body = await req.json()

        if (body._id) {
            // Update existing slide
            const updatedSlide = await HeroSlide.findByIdAndUpdate(body._id, body, { new: true })
            revalidatePath('/')
            return NextResponse.json(updatedSlide)
        } else {
            // Create new slide
            const newSlide = await HeroSlide.create(body)
            revalidatePath('/')
            return NextResponse.json(newSlide)
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        await HeroSlide.findByIdAndDelete(id)
        revalidatePath('/')
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH() {
    try {
        await dbConnect()
        const defaults = [
            {
                title: "Elevated",
                subtitle: "Essentials",
                description: "Discover the perfect balance of comfort and style with our curated essentials.",
                image: "/hero-image.png",
                bg: "#f4f7f9",
                buttonText: "Discover Now",
                buttonLink: "#products-section",
                order: 0
            },
            {
                title: "Pick of",
                subtitle: "The Week",
                description: "Handpicked style that's making waves this week. Don't miss out on this viral find.",
                image: "/pick-of-the-week.jpg",
                bg: "#fdf8f6",
                buttonText: "Shop the Look",
                buttonLink: "https://amzn.to/4smffny",
                order: 1
            },
            {
                title: "Follow Us",
                subtitle: "On Insta",
                description: "Get daily style inspiration and behind-the-scenes content on our social feed.",
                image: "/instagram-follow.png",
                bg: "#f9f4fd",
                buttonText: "@dwvfinds_official",
                buttonLink: "https://www.instagram.com/dwvfinds_official?igsh=MWxlaTlqazBicWMzMQ==",
                order: 2
            },
            {
                title: "Finds that",
                subtitle: "Fits you",
                description: "Curated styles tailored to your unique personality. Discover the fashion that truly speaks to you.",
                bg: "#ffffff",
                buttonText: "Explore Collection",
                buttonLink: "#products-section",
                isTextOnly: true,
                order: 3
            }
        ]

        await HeroSlide.deleteMany({}) // Clear existing if any
        await HeroSlide.insertMany(defaults)
        revalidatePath('/')
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
