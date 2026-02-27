import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'

export async function POST(req: Request) {
    try {
        await dbConnect()
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Check if already subscribed
        const existing = await Subscriber.findOne({ email })
        if (existing) {
            return NextResponse.json(
                { error: 'This email is already subscribed!', code: 'already_subscribed' },
                { status: 409 }
            )
        }

        await Subscriber.create({ email })

        return NextResponse.json({ message: 'Subscribed successfully!' })
    } catch (error) {
        console.error('Subscribe error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
