import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-bg-card border-t border-white/10 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-white tracking-tighter">
              Bazaar<span className="text-emerald-500">BD</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              The premium e-commerce destination in Bangladesh. We bring you the finest products with uncompromising quality.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 transition-colors text-white text-sm font-bold">f</a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 transition-colors text-white text-sm font-bold">in</a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 transition-colors text-white text-sm font-bold">tw</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Shop', href: '/shop' },
                { label: 'Categories', href: '/categories' },
                { label: 'About Us', href: '/about' },
                { label: 'Sale 🔥', href: '/shop?sale=1', emerald: true },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={`text-sm ${link.emerald ? 'text-emerald-400 hover:text-emerald-300' : 'text-gray-400 hover:text-white'} transition-colors`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Customer Care</h3>
            <ul className="space-y-2">
              {[
                { label: 'Track Order', href: '/orders/track' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Shipping Policy', href: '/shipping' },
                { label: 'Return Policy', href: '/returns' },
                { label: 'Contact Us', href: '/contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>123 Gulshan Avenue, Dhaka 1212, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+8801234567890" className="hover:text-white transition-colors">+880 1234 567890</a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:support@bazaarbd.com" className="hover:text-white transition-colors">support@bazaarbd.com</a>
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">We Accept</p>
              <div className="flex gap-2 flex-wrap">
                {['bKash', 'Nagad', 'Rocket', 'VISA', 'MC'].map(method => (
                  <span key={method} className="bg-white/10 text-white text-xs px-2 py-1 rounded font-medium">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} BazaarBD. All rights reserved. Made in Bangladesh 🇧🇩</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
