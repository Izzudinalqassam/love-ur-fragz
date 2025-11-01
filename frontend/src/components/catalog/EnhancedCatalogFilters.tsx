import React, { useState, useEffect, useMemo } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';
import { AromaService, type AromaCategory } from '@/services/aromaService';

interface EnhancedCatalogFiltersProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  searchTerm: string;
  selectedCategory: string;
  selectedAromas: string[];
  sortBy: string;
  selectedConcentration: string;
  selectedLongevity: string;
  selectedBrand: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAromasChange: (aromas: string[]) => void;
  onSortChange: (value: string) => void;
  onConcentrationChange: (value: string) => void;
  onLongevityChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  totalItems: number;
}

const EnhancedCatalogFilters: React.FC<EnhancedCatalogFiltersProps> = ({
  showFilters,
  onToggleFilters,
  onClearFilters,
  searchTerm,
  selectedCategory,
  selectedAromas,
  sortBy,
  selectedConcentration,
  selectedLongevity,
  selectedBrand,
  onSearchChange,
  onCategoryChange,
  onAromasChange,
  onSortChange,
  onConcentrationChange,
  onLongevityChange,
  onBrandChange,
  totalItems,
}) => {
  const [aromaCategories, setAromaCategories] = useState<AromaCategory[]>([]);
  const [groupedCategories, setGroupedCategories] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [aromaSearch, setAromaSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Load aroma categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const categories = await AromaService.getAromaCategories();
        setAromaCategories(categories);

        const grouped = await AromaService.getGroupedCategories();
        setGroupedCategories(grouped);

        // Auto-expand first few groups
        setExpandedGroups(new Set(grouped.slice(0, 3)));
      } catch (error) {
        console.error('Failed to load aroma categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Get filtered aromas based on search and selected category
  const filteredAromas = useMemo(() => {
    let filtered = aromaCategories;

    // Filter by search term
    if (aromaSearch) {
      filtered = filtered.filter(aroma =>
        aroma.name.toLowerCase().includes(aromaSearch.toLowerCase()) ||
        aroma.slug.toLowerCase().includes(aromaSearch.toLowerCase())
      );
    }

    // Filter by selected category group
    if (selectedCategory) {
      filtered = filtered.filter(aroma =>
        aroma.name.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    return filtered;
  }, [aromaCategories, aromaSearch, selectedCategory]);

  // Group aromas by their main category
  const aromasByGroup = useMemo(() => {
    const groups: Record<string, AromaCategory[]> = {};

    filteredAromas.forEach(aroma => {
      const mainCategory = aroma.name.split(' ')[0];
      if (!groups[mainCategory]) {
        groups[mainCategory] = [];
      }
      groups[mainCategory].push(aroma);
    });

    return groups;
  }, [filteredAromas]);

  const handleAromaToggle = (aromaSlug: string) => {
    if (selectedAromas.includes(aromaSlug)) {
      onAromasChange(selectedAromas.filter(a => a !== aromaSlug));
    } else {
      onAromasChange([...selectedAromas, aromaSlug]);
    }
  };

  const handleGroupToggle = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedConcentration,
    selectedLongevity,
    selectedBrand,
    selectedAromas.length > 0 && 'aromas',
    searchTerm && 'search'
  ].filter(Boolean).length;

  // Common filter options
  const concentrationOptions = ['EDT', 'EDP', 'Parfum', 'Colognes', 'After Shave'];
  const longevityOptions = [
    { value: 'light', label: 'Light (1-2 hours)' },
    { value: 'medium', label: 'Medium (3-5 hours)' },
    { value: 'long', label: 'Long (6-8 hours)' },
    { value: 'very-long', label: 'Very Long (8+ hours)' }
  ];
  const brandOptions = ['Dumont', 'Armaf', 'Creed', 'Tom Ford', 'Dior', 'Chanel', 'Byredo', 'Le Labo'];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header Controls */}
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
              {totalItems} perfumes found
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search perfumes..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="name">Sort by Name</option>
              <option value="brand">Sort by Brand</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="longevity">Longevity</option>
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
                Clear All
              </Button>
            )}

            <div className="text-sm text-gray-600">
              {totalItems} perfumes
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value=""
                      checked={!selectedCategory}
                      onChange={(e) => onCategoryChange(e.target.value)}
                      className="mr-2 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700">All Categories</span>
                  </label>
                  {groupedCategories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700 capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Concentration Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Concentration</h3>
                <div className="space-y-2">
                  {concentrationOptions.map((concentration) => (
                    <label key={concentration} className="flex items-center">
                      <input
                        type="radio"
                        value={concentration}
                        checked={selectedConcentration === concentration}
                        onChange={(e) => onConcentrationChange(e.target.value)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{concentration}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Longevity Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Longevity</h3>
                <div className="space-y-2">
                  {longevityOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        value={option.value}
                        checked={selectedLongevity === option.value}
                        onChange={(e) => onLongevityChange(e.target.value)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Aroma Categories - Expandable */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Aroma Profile</h3>

              {/* Aroma Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search aroma profiles..."
                    value={aromaSearch}
                    onChange={(e) => setAromaSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-1/2"
                  />
                </div>
              </div>

              {/* Grouped Aromas */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-4 text-gray-500">Loading aroma categories...</div>
                ) : Object.keys(aromasByGroup).length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No aroma categories found</div>
                ) : (
                  Object.entries(aromasByGroup).map(([group, aromas]) => (
                    <Card key={group} className="border border-gray-200">
                      <CardContent className="p-3">
                        <button
                          onClick={() => handleGroupToggle(group)}
                          className="w-full flex items-center justify-between text-left hover:bg-gray-50 rounded p-2 transition-colors"
                        >
                          <span className="font-medium text-gray-900 capitalize">{group}</span>
                          {expandedGroups.has(group) ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </button>

                        {expandedGroups.has(group) && (
                          <div className="mt-2 space-y-1 pl-2">
                            {aromas.slice(0, 5).map((aroma) => (
                              <label key={aroma.id} className="flex items-center hover:bg-gray-50 rounded p-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  value={aroma.slug}
                                  checked={selectedAromas.includes(aroma.slug)}
                                  onChange={() => handleAromaToggle(aroma.slug)}
                                  className="mr-2 text-purple-600 focus:ring-purple-500 rounded"
                                />
                                <span className="text-sm text-gray-700">{aroma.name}</span>
                              </label>
                            ))}
                            {aromas.length > 5 && (
                              <div className="text-sm text-gray-500 pl-6">
                                +{aromas.length - 5} more in {group}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCatalogFilters;