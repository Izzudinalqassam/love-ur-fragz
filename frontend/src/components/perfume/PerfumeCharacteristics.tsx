import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Clock, Droplets, Sparkles } from 'lucide-react';
import type { Perfume } from '@/types';

interface PerfumeCharacteristicsProps {
  perfume: Perfume;
  variant?: 'detailed' | 'compact' | 'minimal';
  showLabels?: boolean;
}

const PerfumeCharacteristics: React.FC<PerfumeCharacteristicsProps> = ({
  perfume,
  variant = 'detailed',
  showLabels = true
}) => {
  // Determine longevity display - handling null/undefined values
  const getLongevityDisplay = (longevity: string | null | undefined) => {
    if (!longevity) {
      return { label: 'Unknown', color: 'text-gray-600 bg-gray-50 border-gray-200' };
    }

    const normalizedLongevity = longevity.toString().toLowerCase();
    switch (normalizedLongevity) {
      case 'very high':
        return { label: 'Very Long', color: 'text-green-600 bg-green-50 border-green-200' };
      case 'high':
        return { label: 'Long', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'medium':
        return { label: 'Medium', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
      case 'light':
        return { label: 'Light', color: 'text-gray-600 bg-gray-50 border-gray-200' };
      default:
        return { label: longevity, color: 'text-gray-600 bg-gray-50 border-gray-200' };
    }
  };

  // Determine sillage display - handling null/undefined values
  const getSillageDisplay = (sillage: string | null | undefined) => {
    if (!sillage) {
      return { label: 'Unknown', color: 'text-gray-600 bg-gray-50 border-gray-200' };
    }

    const normalizedSillage = sillage.toString().toLowerCase();
    switch (normalizedSillage) {
      case 'high':
        return { label: 'Heavy', color: 'text-purple-600 bg-purple-50 border-purple-200' };
      case 'medium':
        return { label: 'Moderate', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
      case 'light':
        return { label: 'Light', color: 'text-pink-600 bg-pink-50 border-pink-200' };
      case 'soft':
        return { label: 'Soft', color: 'text-gray-600 bg-gray-50 border-gray-200' };
      default:
        return { label: sillage, color: 'text-gray-600 bg-gray-50 border-gray-200' };
    }
  };

  const longevity = getLongevityDisplay(perfume.longevity);
  const sillage = getSillageDisplay(perfume.sillage);

  const characteristics = [
    {
      key: 'concentration',
      label: 'Type',
      value: perfume.concentration || perfume.type,
      icon: <Sparkles className="h-3 w-3 mr-1" />,
      color: 'border-gray-200 text-gray-700'
    },
    {
      key: 'longevity',
      label: 'Longevity',
      value: longevity.label,
      icon: <Clock className="h-3 w-3 mr-1" />,
      color: longevity.color
    },
    {
      key: 'sillage',
      label: 'Sillage',
      value: sillage.label,
      icon: <Droplets className="h-3 w-3 mr-1" />,
      color: sillage.color
    }
  ];

  if (variant === 'minimal') {
    return (
      <div className="flex gap-2">
        {characteristics.slice(0, 2).map((char) => (
          <Badge
            key={char.key}
            variant="outline"
            size="sm"
            className={char.color}
          >
            {char.value}
          </Badge>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {characteristics.map((char) => (
          <Badge
            key={char.key}
            variant="outline"
            size="sm"
            className={char.color}
          >
            {showLabels && char.icon}
            {char.value}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {characteristics.map((char) => (
        <div key={char.key} className="flex items-center gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Badge
              variant="outline"
              size="sm"
              className={char.color}
            >
              {char.icon}
              {char.value}
            </Badge>
            {showLabels && (
              <span className="text-sm text-gray-600 capitalize">{char.label}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerfumeCharacteristics;