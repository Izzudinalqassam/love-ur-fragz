import React from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';

interface CatalogHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalItems: number;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  searchTerm,
  onSearchChange,
  totalItems,
}) => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Enhanced 3D Animated Background Elements - Same as Home */}
      <div className="absolute inset-0">
        {/* Floating orbs with different sizes and animations */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-bounce"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-pulse"></div>
        <div
          className="absolute bottom-10 left-1/4 w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Magic particles */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-white rounded-full animate-ping"></div>
        <div
          className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-pink-300 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Gradient waves */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent animate-pulse"></div>
        <div
          className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-600/20 via-transparent to-transparent animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Rotating elements */}
        <div
          className="absolute top-20 left-1/2 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-spin"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/3 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-screen filter blur-lg opacity-30 animate-spin"
          style={{ animationDuration: "6s", animationDirection: "reverse" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
            Perfume
            <span className="block text-yellow-400">Collection</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore our curated selection of luxury fragrances
          </p>

          {/* Search Bar - Same style as home but smaller */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search perfumes, brands, or notes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default CatalogHeader;