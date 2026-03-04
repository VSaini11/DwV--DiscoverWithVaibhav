import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Subscriber from '@/models/Subscriber'
import { transporter, buildProductNotificationEmail } from '@/lib/mailer'

export async function GET(req: Request) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const category = searchParams.get('category')
        const query = searchParams.get('query')
        const limit = parseInt(searchParams.get('limit') || '12')
        const skip = parseInt(searchParams.get('skip') || '0')

        let filter: any = {}
        if (category && category !== 'all') {
            filter.category = category
        }
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }

        const total = await Product.countDocuments(filter)
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        return NextResponse.json({
            products,
            total,
            hasMore: skip + products.length < total
        })
    } catch (error) {
        console.error('Fetch products error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect()
        const body = await req.json()

        const product = await Product.create(body)

        // Notify all subscribers in the background
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dwv-brand.vercel.app'
        Subscriber.find({}).then(async (subscribers) => {
            if (subscribers.length === 0) return
            const emailHtml = buildProductNotificationEmail(product.name, product.image, siteUrl)
            await Promise.allSettled(
                subscribers.map((sub) =>
                    transporter.sendMail({
                        from: `"DiscoverWithVaibhav" <${process.env.GMAIL_USER}>`,
                        to: sub.email,
                        subject: `✨ New Drop on DwV — ${product.name}`,
                        html: emailHtml,
                    })
                )
            )
            console.log(`[DwV] Notified ${subscribers.length} subscriber(s) about: ${product.name}`)
        }).catch((err) => console.error('[DwV] Subscriber notification failed:', err))

        return NextResponse.json(product, { status: 201 })
    } catch (error) {
        console.error('Create product error:', error)
        return NextResponse.json({ error: 'Failed to create product' }, { status: 400 })
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect()
        const body = await req.json()
        const { _id, ...updateData } = body

        if (!_id) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
        }

        const product = await Product.findByIdAndUpdate(_id, updateData, { new: true })
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        console.error('Update product error:', error)
        return NextResponse.json({ error: 'Failed to update product' }, { status: 400 })
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
        }

        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Product deleted successfully' })
    } catch (error) {
        console.error('Delete product error:', error)
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
}
