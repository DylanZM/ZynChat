import Link from 'next/link';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-secondary p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold text-[#4f6ef7] mb-6">
            Terms of Use
          </h1>
          <div className="prose prose-invert max-w-none text-neutral-300">
            <p className="text-sm text-yellow-400 mb-4">
              <strong>Disclaimer:</strong> This is a placeholder for your Terms of Use. It is highly recommended to consult with a legal professional to draft your actual terms.
            </p>
            
            <h2 className="text-white">1. Introduction</h2>
            <p>
              Welcome to ZynChat! These Terms of Use govern your use of our chat application and services. By using ZynChat, you agree to these terms in full. If you disagree with these terms or any part of these terms, you must not use our application.
            </p>

            <h2 className="text-white">2. Intellectual Property Rights</h2>
            <p>
              Other than the content you own, under these Terms, ZynChat and/or its licensors own all the intellectual property rights and materials contained in this application. You are granted a limited license only for purposes of viewing the material contained on this app.
            </p>

            <h2 className="text-white">3. Restrictions</h2>
            <p>You are specifically restricted from all of the following:</p>
            <ul>
              <li>Publishing any application material in any other media;</li>
              <li>Selling, sublicensing and/or otherwise commercializing any application material;</li>
              <li>Publicly performing and/or showing any application material;</li>
              <li>Using this application in any way that is or may be damaging to this application;</li>
              <li>Using this application contrary to applicable laws and regulations, or in any way may cause harm to the application, or to any person or business entity;</li>
            </ul>

            <h2 className="text-white">4. Your Content</h2>
            <p>
              In these Terms of Use, "Your Content" shall mean any audio, video text, images or other material you choose to display on this application. By displaying Your Content, you grant ZynChat a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
            </p>

            <h2 className="text-white">5. No warranties</h2>
            <p>
              This application is provided "as is," with all faults, and ZynChat expresses no representations or warranties, of any kind related to this application or the materials contained on this application.
            </p>

            <h2 className="text-white">6. Governing Law & Jurisdiction</h2>
            <p>
              These Terms will be governed by and interpreted in accordance with the laws of the State/Country of your choice, and you submit to the non-exclusive jurisdiction of the state and federal courts located in your choice for the resolution of any disputes.
            </p>
          </div>
          <div className="mt-8 text-center">
            <Link href="/register" className="text-[#4f6ef7] hover:underline">
              Back to safety
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 