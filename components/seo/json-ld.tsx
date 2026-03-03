import { Metadata } from 'next'

export function JSONLD() {
    const siteUrl = 'https://dwv-brand.vercel.app/'
    const siteName = 'DwV'

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': siteName,
        'alternateName': 'DiscoverWithVaibhav',
        'url': siteUrl,
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
    )
}
