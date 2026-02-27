import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Product from '@/models/Product'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

function getUserFromRequest(req: Request) {
    const auth = req.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    try {
        return jwt.verify(auth.slice(7), JWT_SECRET) as { id: string; email: string }
    } catch {
        return null
    }
}

// GET /api/likes — fetch liked products for the logged-in user
export async function GET(req: Request) {
    const user = getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await dbConnect()
    const dbUser = await User.findById(user.id).populate('likedDiscoveries')
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json(dbUser.likedDiscoveries)
}

// POST /api/likes — toggle like on a product
export async function POST(req: Request) {
    const user = getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await dbConnect()
    const { productId } = await req.json()
    if (!productId) return NextResponse.json({ error: 'productId is required' }, { status: 400 })

    const dbUser = await User.findById(user.id)
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const alreadyLiked = dbUser.likedDiscoveries.some(
        (id: any) => id.toString() === productId
    )

    if (alreadyLiked) {
        // Unlike
        dbUser.likedDiscoveries = dbUser.likedDiscoveries.filter(
            (id: any) => id.toString() !== productId
        )
        await dbUser.save()
        return NextResponse.json({ liked: false })
    } else {
        // Like
        dbUser.likedDiscoveries.push(productId)
        await dbUser.save()
        return NextResponse.json({ liked: true })
    }
}
