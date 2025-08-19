import { Shield, CheckCircle } from "lucide-react";

const ENCRYPTION_FEATURES = [
  "AES-256 encryption",
  "Perfect forward secrecy",
  "Zero-knowledge architecture",
  "Open-source security audits",
];

export default function SecuritySection() {
  return (
    <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span style={{ color: "#4e6bf5" }}>Military-Grade</span> Security
            </h2>
            <p className="text-neutral-300 text-lg mb-8">
              Your privacy is our priority. ZynChat uses the same encryption standards trusted by governments and
              financial institutions worldwide.
            </p>
            <div className="space-y-4">
              {ENCRYPTION_FEATURES.map((item, idx) => (
                <div className="flex items-center space-x-3" key={idx}>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-neutral-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-80 bg-primary rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Shield className="w-24 h-24 mx-auto mb-4" style={{ color: "#4e6bf5" }} />
                <p className="text-neutral-300">Your messages are protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}