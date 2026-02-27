import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Otp from '@/models/Otp'
import User from '@/models/User'
import nodemailer from 'nodemailer'

// Create a reusable Gmail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
})

export async function POST(req: Request) {
    try {
        await dbConnect()
        const { email, type } = await req.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const existingUser = await User.findOne({ email })

        // If signing up but user already exists → tell them to sign in
        if (type === 'signup' && existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists. Please sign in instead.', code: 'user_exists' },
                { status: 409 }
            )
        }

        // If signing in but user doesn't exist → tell them to sign up
        if (type === 'signin' && !existingUser) {
            return NextResponse.json(
                { error: 'No account found with this email. Please sign up first.', code: 'user_not_found' },
                { status: 404 }
            )
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // Store OTP in database (overwrites if already exists for this email)
        await Otp.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        )

        // Send OTP via email
        await transporter.sendMail({
            from: `"DiscoverWithVaibhav" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Your OTP Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #eee; border-radius: 12px;">
                    <h2 style="color: #1a1a1a;">Your One-Time Password</h2>
                    <p style="color: #555;">Use the code below to complete your sign-in. It expires in <strong>10 minutes</strong>.</p>
                    <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #000; text-align: center; padding: 24px; background: #f5f5f5; border-radius: 8px; margin: 24px 0;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        })

        return NextResponse.json({ message: 'OTP sent successfully' })
    } catch (error) {
        console.error('Send OTP error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

