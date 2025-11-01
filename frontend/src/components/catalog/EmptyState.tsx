import React from "react";
import { Search } from "lucide-react";
import { Button } from "../ui/Button";

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="text-center py-16">
      <div className="text-gray-400 mb-4">
        <Search className="h-16 w-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No perfumes found
      </h3>
      <p className="text-gray-600 mb-6">
        Try adjusting your filters or search terms
      </p>
      <Button onClick={onClearFilters}>Clear all filters</Button>
    </div>
  );
};

export default EmptyState;
