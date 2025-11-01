import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

interface CatalogFiltersProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  searchTerm: string;
  selectedCategory: string;
  selectedAromas: string[];
  priceRange: [number, number];
  sortBy: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAromasChange: (aromas: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onSortChange: (value: string) => void;
  totalItems: number;
}

const categories = [
  "Floral",
  "Woody",
  "Citrus",
  "Oriental",
  "Fresh",
  "Spicy",
  "Sweet",
  "Green",
];

const aromaOptions = [
  "floral",
  "woody",
  "citrus",
  "sweet",
  "spicy",
  "fresh",
  "oriental",
  "aquatic",
];

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  showFilters,
  onToggleFilters,
  onClearFilters,
  searchTerm,
  selectedCategory,
  selectedAromas,
  priceRange,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onAromasChange,
  onPriceRangeChange,
  onSortChange,
  totalItems,
}) => {
  const handleAromaToggle = (aroma: string) => {
    if (selectedAromas.includes(aroma)) {
      onAromasChange(selectedAromas.filter((a) => a !== aroma));
    } else {
      onAromasChange([...selectedAromas, aroma]);
    }
  };

  const activeFiltersCount = (selectedCategory ? 1 : 0) + selectedAromas.length;

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onToggleFilters}
              className="lg:hidden flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            <div className="text-sm text-gray-600">
              {totalItems} total perfumes
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="name">Sort by Name</option>
              <option value="brand">Sort by Brand</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <Button
              variant="outline"
              onClick={onToggleFilters}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}

            <div className="text-sm text-gray-600">
              {totalItems} total perfumes
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="mr-2 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Aroma Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Aroma Profile
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {aromaOptions.map((aroma) => (
                    <label key={aroma} className="flex items-center">
                      <input
                        type="checkbox"
                        value={aroma}
                        checked={selectedAromas.includes(aroma)}
                        onChange={() => handleAromaToggle(aroma)}
                        className="mr-2 text-yellow-600 focus:ring-yellow-500 rounded"
                      />
                      <span className="text-gray-700 capitalize">{aroma}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Price Range
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) =>
                      onPriceRangeChange([
                        priceRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogFilters;
