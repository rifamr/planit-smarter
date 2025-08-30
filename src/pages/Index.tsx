import { Suspense, lazy } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import Features from "@/components/Features";
import SustainabilityMode from "@/components/SustainabilityMode";
import LiveDemo from "@/components/LiveDemo";
import LanguageAssistance from "@/components/LanguageAssistance";
import Testimonials from "@/components/Testimonials";
import TravelBlog from "@/components/TravelBlog";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import VoiceAndGestures from "@/components/VoiceAndGestures";
import AIChatAssistant from "@/components/AIChatAssistant";
import StarrySky from "@/components/StarrySky";

const Recommended = lazy(() => import("@/components/Recommended"));
const TravelTimeline = lazy(() => import("@/components/TravelTimeline"));
const BudgetVisualizer = lazy(() => import("@/components/BudgetVisualizer"));
const Gamification = lazy(() => import("@/components/Gamification"));
const MoodBoard = lazy(() => import("@/components/MoodBoard"));

const Fallback = () => <div className="max-w-6xl mx-auto container-padding py-12"><div className="h-40 skeleton rounded-xl" /></div>;

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Navigation />
      <StarrySky />
      <Hero />
      <Suspense fallback={<Fallback />}>
        <Recommended />
      </Suspense>
      <Suspense fallback={<Fallback />}>
        <TravelTimeline />
      </Suspense>
      <Suspense fallback={<Fallback />}>
        <BudgetVisualizer />
      </Suspense>
      <Suspense fallback={<Fallback />}>
        <Gamification />
      </Suspense>
      <Suspense fallback={<Fallback />}>
        <MoodBoard />
      </Suspense>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="featured-destinations">
        <FeaturedDestinations />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="sustainability-mode">
        <SustainabilityMode />
      </div>
      <div id="itinerary-generator">
        <LiveDemo />
      </div>
      <div id="language-assistance">
        <LanguageAssistance />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="travel-blog">
        <TravelBlog />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <Footer />
      <VoiceAndGestures />
      <AIChatAssistant />
    </div>
  );
};

export default Index;
