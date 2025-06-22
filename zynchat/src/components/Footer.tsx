import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/img/ZynChat-Logo.png" alt="ZynChat Logo" width={125} height={125} />
            </div>
     
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Product</h3>
            <div className="space-y-2">
              <Link href="#features" className="block text-neutral-400 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#security" className="block text-neutral-400 hover:text-white transition-colors">
                Security
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-neutral-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/terms" className="block text-neutral-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-neutral-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Support</h3>
            <div className="space-y-2">
              <Link href="/contact" className="block text-neutral-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-secondary mt-8 pt-8 text-center text-neutral-400">
          <p>&copy; 2024 ZynChat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 