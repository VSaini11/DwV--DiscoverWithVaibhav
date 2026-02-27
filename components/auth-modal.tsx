'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp'
import { Mail, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (user: any) => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [authType, setAuthType] = useState<'signup' | 'signin'>('signup')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Reset all state whenever the modal is opened
    useEffect(() => {
        if (isOpen) {
            setStep('email')
            setAuthType('signup')
            setEmail('')
            setOtp('')
            setIsLoading(false)
        }
    }, [isOpen])

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, type: authType }),
            })
            const data = await res.json()

            if (!res.ok) {
                // User already has an account — switch to sign in
                if (data.code === 'user_exists') {
                    setAuthType('signin')
                    toast.error('You already have an account! Switched to Sign In — please continue.')
                    return
                }
                // No account found — switch to sign up
                if (data.code === 'user_not_found') {
                    setAuthType('signup')
                    toast.error('No account found! Switched to Sign Up — please continue.')
                    return
                }
                throw new Error(data.error || 'Failed to send OTP')
            }

            toast.success('OTP sent! Check your inbox.')
            setStep('otp')
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOtp = async (value: string) => {
        setOtp(value)
        if (value.length === 6) {
            setIsLoading(true)
            try {
                const res = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp: value }),
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Invalid OTP')

                localStorage.setItem('dv_token', data.token)
                localStorage.setItem('dv_user', JSON.stringify(data.user))

                toast.success(authType === 'signup'
                    ? `Welcome to DwV, ${email.split('@')[0]}! 🎉`
                    : `Welcome back, ${email.split('@')[0]}!`
                )
                onSuccess(data.user)
                onClose()
            } catch (error: any) {
                toast.error(error.message)
                setOtp('')
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleTabSwitch = (type: 'signup' | 'signin') => {
        setAuthType(type)
        setStep('email')
        setOtp('')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-3xl p-8 border-none shadow-2xl overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

                <DialogHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center rotate-3 border border-primary/10">
                        {step === 'email' ? (
                            <Mail className="w-8 h-8 text-primary -rotate-3" />
                        ) : (
                            <ShieldCheck className="w-8 h-8 text-primary -rotate-3" />
                        )}
                    </div>
                    <DialogTitle className="text-3xl font-bold tracking-tight">
                        {step === 'email' ? <>Welcome to <span className="font-serif font-bold italic text-red-600">DwV</span></> : 'Check your inbox'}
                    </DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground px-4">
                        {step === 'email'
                            ? 'Enter your email to get started.'
                            : `We've sent a 6-digit code to ${email}.`}
                    </DialogDescription>
                </DialogHeader>

                {/* Sign Up / Sign In Tabs */}
                {step === 'email' && (
                    <div className="flex rounded-2xl bg-muted p-1 mt-6">
                        <button
                            type="button"
                            onClick={() => handleTabSwitch('signup')}
                            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${authType === 'signup'
                                ? 'bg-background shadow text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Sign Up
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabSwitch('signin')}
                            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${authType === 'signin'
                                ? 'bg-background shadow text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Sign In
                        </button>
                    </div>
                )}

                <div className="mt-4">
                    {step === 'email' ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="relative group">
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="h-14 pl-6 rounded-2xl border-muted-foreground/20 focus:ring-primary shadow-sm group-focus-within:shadow-md transition-all text-lg"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-14 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {authType === 'signup' ? 'Create Account' : 'Sign In'}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center space-y-8">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={handleVerifyOtp}
                                pattern={REGEXP_ONLY_DIGITS}
                                disabled={isLoading}
                            >
                                <InputOTPGroup className="gap-2">
                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <InputOTPSlot
                                            key={index}
                                            index={index}
                                            className="w-12 h-16 text-2xl font-bold rounded-xl border-2 focus:border-primary shadow-sm"
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>

                            <button
                                onClick={() => setStep('email')}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                                disabled={isLoading}
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" />
                                Use a different email
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-muted text-center">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        Experience curated viral finds like never before.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
