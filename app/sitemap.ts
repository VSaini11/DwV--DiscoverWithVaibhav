import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dwv-brand.vercel.app'
    const today = new Date()

    return [
        {
            url: baseUrl,
            lastModified: today,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/coming-soon`,
            lastModified: today,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/likes`,
            lastModified: today,
            changeFrequency: 'weekly',
            priority: 0.5,
        },
    ]
}
