import React from 'react';
import { Badge } from '@/components/ui/Badge';

interface AromaTagsProps {
  aromaTags: Array<{ id: number; name: string; slug?: string }>;
  maxVisible?: number;
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
}

const AromaTags: React.FC<AromaTagsProps> = ({
  aromaTags,
  maxVisible = 3,
  variant = 'default',
  className = ''
}) => {
  if (!aromaTags || aromaTags.length === 0) {
    return null;
  }

  const visibleTags = aromaTags.slice(0, maxVisible);
  const remainingCount = aromaTags.length - maxVisible;

  if (variant === 'minimal') {
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {visibleTags.map((aroma, index) => (
          <span
            key={aroma.id || index}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
          >
            {aroma.name}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="text-xs text-gray-500">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {visibleTags.map((aroma, index) => (
          <Badge
            key={aroma.id || index}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {aroma.name}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge
            variant="outline"
            size="sm"
            className="text-xs bg-gray-50"
          >
            +{remainingCount}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {visibleTags.map((aroma, index) => (
          <Badge
            key={aroma.id || index}
            variant="outline"
          >
            {aroma.name}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge variant="outline">
            +{remainingCount} more
          </Badge>
        )}
      </div>
    </div>
  );
};

export default AromaTags;