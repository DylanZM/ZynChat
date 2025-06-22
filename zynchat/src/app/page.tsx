import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Shield, Zap, Users, Lock, Smartphone, Star, ArrowRight, CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Navigation */}
      <nav className="border-b border-secondary bg-primary/80 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/img/ZynChat-Logo.png" alt="ZynChat Logo" width={125} height={125} />
             
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-neutral-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#security" className="text-neutral-300 hover:text-white transition-colors">
                Security
              </Link>
              <Link href="/login"
                className="rounded-md border border-[#4e6bf5] text-[#4e6bf5] hover:bg-[#4e6bf5]/10 font-semibold px-4 py-2 flex items-center justify-center transition-colors"
              >
                Login
              </Link>
              <Link href="/register"
                className="rounded-md bg-[#4e6bf5] hover:bg-[#3d56c5] text-white font-semibold px-4 py-2 flex items-center justify-center transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-6 bg-[#4e6bf5]/10 text-[#6f8aff] border-[#4e6bf5]/20">
              🚀 Now with end-to-end encryption
            </Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">
                Secure Chat
              </span>
              <br />
              <span style={{color: '#4e6bf5'}}>Redefined</span>
            </h1>
            <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of messaging with ZynChat. Military-grade encryption, lightning-fast delivery, and a
              beautiful interface that makes chatting a joy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register"
                className="rounded-xl bg-[#4e6bf5] hover:bg-[#3d56c5] text-white font-semibold text-lg h-12 flex items-center justify-center transition-colors px-8"
              >
                Start Chatting Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/login"
                className="w-full sm:w-auto rounded-xl border border-[#4e6bf5] text-[#4e6bf5] hover:bg-[#4e6bf5]/10 font-semibold text-lg h-12 flex items-center justify-center transition-colors px-8"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span style={{color: '#4e6bf5'}}>ZynChat</span>?
            </h2>
            <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
              Built for the modern world with features that matter most to you and your privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "End-to-End Encryption", text: "Your messages are encrypted before they leave your device. Not even we can read them.", color: "#4e6bf5"},
              { icon: Zap, title: "Lightning Fast", text: "Messages delivered instantly with our global network of servers.", color: "#34d399"},
              { icon: Users, title: "Group Chats", text: "Create groups with up to 1000 members. Perfect for teams and communities.", color: "#a78bfa"},
              { icon: Smartphone, title: "Cross-Platform", text: "Available on all your devices. Sync seamlessly across web, mobile, and desktop.", color: "#f472b6"},
              { icon: Lock, title: "Self-Destructing Messages", text: "Set messages to automatically delete after a specified time for ultimate privacy.", color: "#ef4444"},
              { icon: Star, title: "Rich Media", text: "Share photos, videos, documents, and voice messages with ease.", color: "#f59e0b"}
            ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                    <Card key={index} className="bg-secondary border-secondary hover:border-[#4e6bf5]/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: `${feature.color}1A`}}>
                          <Icon className="w-6 h-6" style={{color: feature.color}} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                        <p className="text-neutral-300">{feature.text}</p>
                      </CardContent>
                    </Card>
                )
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span style={{color: '#4e6bf5'}}>Military-Grade</span> Security
              </h2>
              <p className="text-neutral-300 text-lg mb-8">
                Your privacy is our priority. ZynChat uses the same encryption standards trusted by governments and
                financial institutions worldwide.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-neutral-300">AES-256 encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-neutral-300">Perfect forward secrecy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-neutral-300">Zero-knowledge architecture</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-neutral-300">Open-source security audits</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-primary rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-24 h-24 mx-auto mb-4" style={{color: '#4e6bf5'}} />
                  <p className="text-neutral-300">Your messages are protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Experience <span style={{color: '#4e6bf5'}}>Secure Chatting</span>?
          </h2>
          <p className="text-neutral-300 text-lg mb-8">
            Join millions of users who trust ZynChat for their daily communications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"
                className="rounded-xl bg-[#4e6bf5] hover:bg-[#3d56c5] text-white font-semibold text-lg h-12 flex items-center justify-center transition-colors px-8"
              >
                Register Now
              </Link>
              <Link href="/login"
                className="w-full sm:w-auto rounded-xl border border-[#4e6bf5] text-[#4e6bf5] hover:bg-[#4e6bf5]/10 font-semibold text-lg h-12 flex items-center justify-center transition-colors px-8"
              >
                Login
              </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
