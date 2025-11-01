import React from 'react';
import { Search, Sparkles, Heart } from 'lucide-react';
import { features } from '../../data/homePageData';
import { Card, CardContent } from '../ui/Card';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
            Why Choose LuxScents
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the future of fragrance discovery with our intelligent recommendation system
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = () => {
              const iconMap: Record<string, React.ComponentType<any>> = {
                'Search': Search,
                'Sparkles': Sparkles,
                'Heart': Heart,
              };
              const Icon = iconMap[feature.icon];
              return <Icon className="h-8 w-8" />;
            };

            return (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full mx-auto mb-6 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;