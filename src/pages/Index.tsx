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
import Recommended from "@/components/Recommended";
import TravelTimeline from "@/components/TravelTimeline";
import BudgetVisualizer from "@/components/BudgetVisualizer";
import Gamification from "@/components/Gamification";
import VirtualTours from "@/components/VirtualTours";
import MoodBoard from "@/components/MoodBoard";
import VoiceAndGestures from "@/components/VoiceAndGestures";
import AIChatAssistant from "@/components/AIChatAssistant";
import StarrySky from "@/components/StarrySky";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Navigation />
      <StarrySky />
      <Hero />
      <Recommended />
      <TravelTimeline />
      <BudgetVisualizer />
      <Gamification />
      <VirtualTours />
      <MoodBoard />
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
