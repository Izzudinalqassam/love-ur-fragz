import React from 'react';
import { Lightbulb, Clock, Users, Star } from 'lucide-react';

const QuizTips: React.FC = () => {
  const tips = [
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: "Be Honest",
      description: "Your authentic preferences will give the best recommendations"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Quick & Easy",
      description: "Only 3 simple steps, takes just 2-3 minutes"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Proven Results",
      description: "95% of users love their recommended fragrances"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Expert Curation",
      description: "Powered by fragrance specialists and AI matching"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Lightbulb className="h-6 w-6 text-purple-600" />
        Quick Tips for Best Results
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="text-purple-600 mt-0.5">
              {tip.icon}
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">{tip.title}</div>
              <div className="text-sm text-gray-600">{tip.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizTips;