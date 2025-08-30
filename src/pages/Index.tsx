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
      <Hero />
      <HowItWorks />
      <FeaturedDestinations />
      <Features />
      <SustainabilityMode />
      <LiveDemo />
      <LanguageAssistance />
      <Testimonials />
      <TravelBlog />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
