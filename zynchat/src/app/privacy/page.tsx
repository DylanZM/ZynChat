import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-secondary p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold text-[#4f6ef7] mb-6">
            Privacy Policy
          </h1>
          <div className="prose prose-invert max-w-none text-neutral-300">
            <p className="text-sm text-yellow-400 mb-4">
              <strong>Disclaimer:</strong> This is a placeholder for your Privacy Policy. It is highly recommended to consult with a legal professional to draft your actual policy.
            </p>

            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-white">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you create an account, such as your name, email address, and username. We also collect information automatically when you use our services, including your IP address, device information, and usage data. Messages sent through ZynChat are stored to provide the chat history feature.
            </p>

            <h2 className="text-white">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate, maintain, and provide you with the features and functionality of ZynChat. This includes:
            </p>
            <ul>
              <li>Authenticating your account and processing transactions.</li>
              <li>Personalizing your experience and delivering content relevant to you.</li>
              <li>Communicating with you about service updates, offers, and promotions.</li>
              <li>Monitoring and analyzing trends, usage, and activities in connection with our services.</li>
            </ul>

            <h2 className="text-white">3. How We Share Your Information</h2>
            <p>
              We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
            </p>

            <h2 className="text-white">4. Data Security</h2>
            <p>
              We use reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration, and destruction.
            </p>
            
            <h2 className="text-white">5. Your Choices</h2>
            <p>
              You may update or correct your account information at any time by logging into your account. You may also disable your account, but please note that some information may remain in our archived records after your account has been disabled.
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