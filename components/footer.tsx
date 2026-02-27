import { Mail, Instagram, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-semibold mb-3">DiscoverWithVaibhav</h3>
            <p className="text-sm opacity-90">
              Your curated fashion marketplace, powered by Pinterest trends.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <a
              href="mailto:contact@discover.fashion"
              className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
            >
              <Mail size={16} />
              contact@discover.fashion
            </a>
          </div>

          {/* Social Section */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Pinterest"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8 space-y-2 text-sm opacity-90">
          <p>
            <strong>Affiliate Disclosure:</strong> This website contains affiliate links. When you click on these links and make a purchase, we may earn a commission at no additional cost to you.
          </p>
          <p className="text-xs opacity-75">
            © {currentYear} DiscoverWithVaibhav. All rights reserved. Fashion curated with love from Pinterest.
          </p>
        </div>
      </div>
    </footer>
  )
}
