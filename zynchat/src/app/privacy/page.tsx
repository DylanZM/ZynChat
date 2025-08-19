import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, UserCheck, Lock, Settings, ArrowLeftCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-[#232b4a] to-[#1a1d2b] text-white flex flex-col justify-center items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-secondary/80 p-10 rounded-3xl shadow-2xl border border-[#4f6ef7]/20 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none select-none">
            <ShieldCheck className="w-48 h-48 text-[#4f6ef7]" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-10 h-10 text-[#4f6ef7]" />
            <h1 className="text-4xl font-extrabold text-[#4f6ef7] tracking-tight drop-shadow-lg">Privacy Policy</h1>
          </div>
          <div className="prose prose-invert max-w-none text-neutral-200">
            <p className="text-xs text-neutral-400 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">1. Information Collected</h2>
                </div>
                <p>
                  This project is a personal learning exercise. Any information you provide (such as name, email, or username) is only used for demonstration and learning purposes. Some technical data (like IP or device info) may be collected for app functionality, but is not used commercially.
                </p>
              </section>
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">2. How Your Information is Used</h2>
                </div>
                <p>This app uses your information only to provide basic chat features and to help me learn about web development. No data is sold or used for advertising.</p>
                <ul className="list-disc pl-6">
                  <li>Account authentication and basic functionality.</li>
                  <li>Personalizing your experience for demonstration purposes.</li>
                  <li>Learning and improving my coding skills.</li>
                </ul>
              </section>
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <ArrowLeftCircle className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">3. Information Sharing</h2>
                </div>
                <p>Your information is not shared with third parties, except as needed for the app to function (e.g., hosting providers). No commercial use is made of your data.</p>
              </section>
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
                </div>
                <p>Reasonable measures are taken to protect your information, but as this is a learning project, no guarantees can be made about data security.</p>
              </section>
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="w-6 h-6 text-[#4f6ef7]" />
                  <h2 className="text-2xl font-bold text-white">5. Your Choices</h2>
                </div>
                <p>You can update or delete your information at any time. Since this is a demo, some data may remain in backups or logs for a short period.</p>
              </section>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
} 