
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User2, Code2, MessageCircle, HeartHandshake, ArrowLeftCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-[#232b4a] to-[#1a1d2b] text-white flex flex-col justify-center items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-secondary/80 p-10 rounded-3xl shadow-2xl border border-[#4f6ef7]/20 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none select-none">
            <User2 className="w-48 h-48 text-[#4f6ef7]" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <User2 className="w-10 h-10 text-[#4f6ef7]" />
            <h1 className="text-4xl font-extrabold text-[#4f6ef7] tracking-tight drop-shadow-lg">About ZynChat</h1>
          </div>
          <div className="prose prose-invert max-w-none text-neutral-200">
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">What is ZynChat?</h2>
                </div>
                <p>
                  ZynChat is a personal project created to learn and practice modern web development. It is not a commercial product, but a demonstration of how to build a secure, beautiful, and user-friendly chat application using the latest technologies.
                </p>
              </section>
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">Features</h2>
                </div>
                <ul className="list-disc pl-6">
                  <li>End-to-end encrypted messaging</li>
                  <li>Modern, responsive UI</li>
                  <li>Profile customization</li>
                  <li>Contact management</li>
                  <li>Real-time updates</li>
                </ul>
              </section>
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <HeartHandshake className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">Who Made This?</h2>
                </div>
                <p>
                  This app was designed and developed by a passionate web developer eager to learn, experiment, and share knowledge. The project is open for feedback and suggestions!
                </p>
              </section>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
}