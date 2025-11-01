import React from 'react';
import {
  HeroSection,
  FeaturesSection,
  CategoriesSection,
  TestimonialsSection,
  CTASection
} from '../components/home';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
