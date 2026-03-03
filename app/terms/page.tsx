import React from 'react'

export default function TermsPage() {
    const currentYear = new Date().getFullYear()

    return (
        <main className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-medium tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                        Platform Guidelines
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white font-playfair">
                        Terms & Conditions
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                        By using DiscoverWithVaibhav (DwV), you agree to the following terms and conditions. Please read them carefully to understand our curation model.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto space-y-16">

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">1. Curation Model</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-4 text-zinc-600 dark:text-zinc-400">
                            <p>
                                DwV is a style discovery platform. We do not sell products; we curate the best fashion finds from across the internet, including clothing, accessories, fragrances, and essentials.
                            </p>
                            <p>
                                Think of us like Pinterest, but sharper, filtered, and focused on helping you actually discover your style.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">2. Redirects to External Platforms</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
                            <p>
                                When you click on any product, you will be redirected to the respective brand or marketplace (such as Amazon, Myntra, etc.) to complete your purchase. We are finding the best for you and are not responsible for the transaction, shipping, or returns handled by these third-party retailers.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">3. Platform Use</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
                            <p>
                                The content on DwV, including curation, outfits, and style inspiration, is for informational and inspirational purposes. We aim to keep our weekly best finds and complete style inspiration up to date, but prices and availability are subject to change on the external brand's site.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">4. Affiliate Disclosure</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
                            <p>
                                This website contains affiliate links. When you click on these links and make a purchase, we may earn a commission at no additional cost to you.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 pt-12 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-500">
                        <p>Last updated: March 3, 2026</p>
                        <p>© {currentYear} DiscoverWithVaibhav. All rights reserved.</p>
                    </div>
                </div>
            </section>
        </main>
    )
}
