import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import { perfumeCategories } from '../../data/homePageData';

const CategoriesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* 3D Background for Categories */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full filter blur-2xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full filter blur-3xl opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full filter blur-xl opacity-35 animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Floating particles */}
        <div className="absolute top-20 right-20 w-1 h-1 bg-pink-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-purple-900 font-semibold">Fragrance Families</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif mb-4">
            Explore Fragrance Families
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover scents organized by their unique characteristics and notes
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {perfumeCategories.map((category, index) => (
            <Link
              key={index}
              to={`/catalog?category=${category.name.toLowerCase()}`}
              className="group"
            >
              <div className={`p-6 rounded-2xl border-2 ${category.color} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden`}>
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-2xl font-bold mb-2">{category.name}</div>
                  <div className="text-sm opacity-75">{category.count} fragrances</div>
                  <ChevronRight className="h-5 w-5 mt-3 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;