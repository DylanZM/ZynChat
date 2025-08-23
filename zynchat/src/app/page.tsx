"use client";

import Footer from "@/components/footer";
import Hyperspeed from "@/animations/Hyperspeed/Hyperspeed";
import HeroSection from "@/components/heroSection";
import FeaturesGrid from "@/components/featuresGrid";
import SecuritySection from "@/components/securitySection";
import CTASection from "@/components/ctaSection";
import Header from "@/components/header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";



export default function HomePage() {
  const router = useRouter();

useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push("/chat");
      }
    });
  }, [router]);


  return (
    <div className="min-h-screen bg-primary relative overflow-hidden">
      <div
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        style={{ minHeight: "100vh", minWidth: "100vw" }}
      >
        <Hyperspeed
          effectOptions={{
            onSpeedUp: () => {},
            onSlowDown: () => {},
            distortion: "turbulentDistortion",
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.03, 400 * 0.2],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0xffffff,
              brokenLines: 0xffffff,
              leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
              rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
              sticks: 0x03b3c3,
            },
          }}
        />
      </div>

      <div className="relative z-10">
        <Header />
        <HeroSection />
        <FeaturesGrid />
        <SecuritySection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}