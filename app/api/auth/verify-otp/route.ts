import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Otp from '@/models/Otp'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export async function POST(req: Request) {
    try {
        await dbConnect()
        const { email, otp } = await req.json()

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
        }

        // Verify OTP
        const otpRecord = await Otp.findOne({ email, otp })

        if (!otpRecord) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
        }

        // Delete OTP record after successful verification
        await Otp.deleteOne({ _id: otpRecord._id })

        // Find or create user
        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({ email })
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        return NextResponse.json({
            message: 'Verification successful',
            token,
            user: {
                id: user._id,
                email: user.email
            }
        })
    } catch (error) {
        console.error('Verify OTP error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
