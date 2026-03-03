import React from 'react'

export default function PrivacyPage() {
    const currentYear = new Date().getFullYear()

    return (
        <main className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-medium tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                        Legal Transparency
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white font-playfair">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                        At DiscoverWithVaibhav (DwV), we value your trust and are committed to protecting your privacy. This policy outlines how we handle information on our platform.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto space-y-16">

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">1. Our Role</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-4 text-zinc-600 dark:text-zinc-400">
                            <p>
                                At DwV, we're not selling products directly. We curate the best fashion finds from across the internet—not just clothing, but accessories, fragrances, essentials, and everything you need to complete your look.
                            </p>
                            <p>
                                Think of us like Pinterest, but sharper, filtered, and focused on helping you actually discover your style. We provide inspiration for:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Outfits</li>
                                <li>Accessories</li>
                                <li>Fragrances</li>
                                <li>Weekly Best Finds</li>
                                <li>Complete Style Inspiration</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">2. Affiliate Disclosure</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
                            <p>
                                When you click on any product on our site, you will be redirected to a reputable brand or marketplace's website (such as Amazon, Myntra, or an official brand store) to complete your purchase. We are curators finding the best for you. This website contains affiliate links. When you click on these links and make a purchase, we may earn a commission at no additional cost to you. This helps support our mission to bring you the best fashion discoveries.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">3. Information Collection</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
                            <p>
                                We collect minimal personal information, primarily through our newsletter subscription (email address) and user authentication (if applicable). We also use analytics tools to understand how users interact with our site to improve the curation experience.
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
