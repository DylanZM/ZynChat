"use client";

import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import Hyperspeed from "@/animations/Hyperspeed/Hyperspeed";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import SecuritySection from "@/components/SecuritySection";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-primary text-white relative overflow-hidden">
      {/* Fondo animado */}
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
      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-secondary bg-primary/80 backdrop-blur-sm fixed w-full z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/img/ZynChat-Logo.png" alt="ZynChat Logo" width={125} height={125} />
              </Link>
            </div>
          </div>
        </nav>

        <HeroSection />
        <FeaturesGrid />
        <SecuritySection />
        <CTASection />

        <Footer />
      </div>
    </div>
  );
}