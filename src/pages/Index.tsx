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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
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
    </div>
  );
};

export default Index;
