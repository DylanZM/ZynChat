import { Card, CardContent } from "@/components/ui/card";
import { Zap, Smartphone, User2, Users, CheckCircle } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning Fast",
    text: "Messages delivered instantly with our global network of servers.",
    color: "#34d399",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform",
    text: "Available on all your devices. Sync seamlessly across web, mobile, and desktop.",
    color: "#f472b6",
  },
  {
    icon: User2,
    title: "Profile Customization",
    text: "Personalize your profile with your name and avatar.",
    color: "#a78bfa",
  },
  {
    icon: Users,
    title: "Contact List",
    text: "Add and manage your contacts to chat with anyone you want.",
    color: "#4e6bf5",
  },
  {
    icon: CheckCircle,
    title: "Online Status",
    text: "See who is online in real time.",
    color: "#f59e0b",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose <span style={{ color: "#4e6bf5" }}>ZynChat</span>?
          </h2>
          <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
            Built for the modern world with features that matter most to you and your privacy.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="bg-transparent border border-neutral-800 hover:border-[#4e6bf5]/50 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${feature.color}1A` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-neutral-300">{feature.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}