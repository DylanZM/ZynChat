import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Ban, User, Lock, Gavel } from 'lucide-react';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-[#232b4a] to-[#1a1d2b] text-white flex flex-col justify-center items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-secondary/80 p-10 rounded-3xl shadow-2xl border border-[#4f6ef7]/20 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none select-none">
            <FileText className="w-48 h-48 text-[#4f6ef7]" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-10 h-10 text-[#4f6ef7]" />
            <h1 className="text-4xl font-extrabold text-[#4f6ef7] tracking-tight drop-shadow-lg">Terms & Conditions</h1>
          </div>
          <div className="prose prose-invert max-w-none text-neutral-200">
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
                </div>
                <p>
                  This project (ZynChat) is a personal learning project created by an individual developer to practice and improve web development skills. By using this app, you acknowledge that it is not a commercial product and is provided for educational and demonstration purposes only.
                </p>
              </section>
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">2. Intellectual Property</h2>
                </div>
                <p>
                  All code and content in this app are owned by the project creator. You may view and use the app for learning, but you may not copy, redistribute, or use it for commercial purposes without permission.
                </p>
              </section>
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Ban className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">3. Restrictions</h2>
                </div>
                <p>You may not:</p>
                <ul className="list-disc pl-6">
                  <li>Use the app for illegal or harmful activities.</li>
                  <li>Copy, sell, or redistribute the app or its content.</li>
                  <li>Attempt to reverse engineer or exploit the app.</li>
                </ul>
              </section>
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">4. User Content</h2>
                </div>
                <p>
                  Any content you submit is for demonstration only and may be deleted at any time. The creator is not responsible for any loss of data.
                </p>
              </section>
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">5. No Warranty</h2>
                </div>
                <p>
                  This app is provided "as is" without any warranties. The creator is not liable for any issues or damages resulting from its use.
                </p>
              </section>
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Gavel className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">6. Governing Law</h2>
                </div>
                <p>
                  These terms are governed by the laws of the creator's country. Any disputes will be resolved in accordance with those laws.
                </p>
              </section>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link href="/">
              <Button
                variant="outline"
                className="text-white border border-white bg-[#232b4a]/80 hover:bg-[#4f6ef7] hover:text-white transition-colors px-8 py-2 text-base font-semibold shadow-md"
              >
                Back to Home
              </Button>
            </Link>
            <p className="text-xs text-neutral-400 mt-3">This is a personal project for learning purposes only.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 