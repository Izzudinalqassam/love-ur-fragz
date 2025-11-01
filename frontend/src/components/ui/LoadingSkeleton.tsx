import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', animation = 'pulse', ...props }, ref) => {
    const variantClasses = {
      text: 'h-4 w-full',
      circular: 'h-12 w-12 rounded-full',
      rectangular: 'h-16 w-full',
      rounded: 'h-16 w-full rounded-lg',
    };

    const animationClasses = {
      pulse: 'animate-pulse',
      wave: 'animate-shimmer',
      none: '',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-gray-200',
          variantClasses[variant],
          animationClasses[animation],
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

interface LoadingSkeletonProps {
  count?: number;
  variant?: 'card' | 'list' | 'perfume';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 3, variant = 'card' }) => {
  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="luxury-card">
            <Skeleton variant="rectangular" className="h-48 rounded-t-lg" />
            <div className="p-6 space-y-3">
              <Skeleton variant="text" className="h-6 w-3/4" />
              <Skeleton variant="text" className="h-4 w-1/2" />
              <Skeleton variant="text" className="h-4 w-full" />
              <Skeleton variant="text" className="h-4 w-5/6" />
              <div className="flex justify-between items-center pt-4">
                <Skeleton variant="text" className="h-6 w-20" />
                <Skeleton variant="rounded" className="h-10 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="luxury-card p-6">
            <div className="flex items-center space-x-4">
              <Skeleton variant="circular" className="h-16 w-16" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="h-6 w-1/3" />
                <Skeleton variant="text" className="h-4 w-1/2" />
                <Skeleton variant="text" className="h-4 w-2/3" />
              </div>
              <Skeleton variant="rounded" className="h-10 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'perfume') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="luxury-card">
            <Skeleton variant="rectangular" className="h-64 rounded-t-lg" />
            <div className="p-6 space-y-4">
              <div>
                <Skeleton variant="text" className="h-6 w-3/4 mb-2" />
                <Skeleton variant="text" className="h-4 w-1/2" />
              </div>
              <Skeleton variant="text" className="h-4 w-full" />
              <Skeleton variant="text" className="h-4 w-5/6" />
              <div className="flex flex-wrap gap-2">
                <Skeleton variant="rounded" className="h-6 w-16" />
                <Skeleton variant="rounded" className="h-6 w-20" />
                <Skeleton variant="rounded" className="h-6 w-14" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <Skeleton variant="text" className="h-6 w-24" />
                <Skeleton variant="rounded" className="h-10 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
export { Skeleton, LoadingSkeleton };
