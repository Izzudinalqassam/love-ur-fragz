import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* 3D Background for CTA */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full mix-blend-screen filter blur-2xl opacity-25 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-36 h-36 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Rotating elements */}
        <div className="absolute top-20 left-1/3 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-spin" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-screen filter blur-lg opacity-35 animate-spin" style={{ animationDuration: '7s', animationDirection: 'reverse' }}></div>

        {/* Magic particles */}
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 right-1/2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '2.5s' }}></div>

        {/* Gradient waves */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-600/20 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full mb-6">
          <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
          <span className="text-yellow-300 font-semibold">Get Started</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">
          Ready to Find Your Perfect Scent?
        </h2>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Take our personalized quiz and discover fragrances that truly represent you
        </p>
        <Link to="/quiz">
          <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold px-10 py-4 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Heart className="h-5 w-5 mr-2" />
            Start Your Journey
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;