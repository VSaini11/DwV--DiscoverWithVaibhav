import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Deal from '@/models/Deal'

export async function GET() {
    try {
        await dbConnect()
        const deals = await Deal.find({}).sort({ slot: 1 })
        return NextResponse.json(deals)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect()
        const body = await request.json()
        const { slot, title, image, link } = body

        if (!slot || slot < 1 || slot > 4) {
            return NextResponse.json({ error: 'Invalid slot number (1-4 required)' }, { status: 400 })
        }

        const deal = await Deal.findOneAndUpdate(
            { slot },
            { title, image, link, updatedAt: new Date() },
            { upsert: true, new: true, runValidators: true }
        )

        return NextResponse.json(deal)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
