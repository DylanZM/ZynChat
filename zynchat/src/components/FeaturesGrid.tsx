import SpotlightCard from "@/animations/SpotlightCard/SpotlightCard";
import { Zap, Smartphone, User2, Users, CheckCircle, Laptop } from "lucide-react";
import features from "@/locales/Features.json";


const ICONS: Record<string, React.ElementType> = {
  Zap,
  Smartphone,
  User2,
  Users,
  CheckCircle,
  Laptop
};


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
        {features.map((feature, index) => {
  const Icon = ICONS[feature.icon];
  return (
    <SpotlightCard
      key={index}
      className="bg-transparent border-none"
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: "transparent" }}
      >
        {Icon ? (
          <Icon className="w-6 h-6" style={{ color: feature.color }} />
        ) : (
          <span className="w-6 h-6" />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2 ">{feature.title}</h3>
      <p>{feature.text}</p>
    </SpotlightCard>
  );
})}
        </div>
      </div>
    </section>
  );
}