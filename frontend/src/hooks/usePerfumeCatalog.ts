import { useState, useEffect, useMemo } from 'react';
import type { Perfume } from '../types';
import type { PaginatedResponse, PaginationInfo } from '../lib/api';
import { api } from '../lib/api';

export interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  selectedAromas: string[];
  sortBy: string;
  selectedConcentration: string;
  selectedLongevity: string;
  selectedBrand: string;
}

export interface CatalogState {
  perfumes: Perfume[];
  filteredPerfumes: Perfume[];
  loading: boolean;
  pagination: PaginationInfo;
  currentPage: number;
  showFilters: boolean;
}

export const usePerfumeCatalog = () => {
  const [state, setState] = useState<CatalogState>({
    perfumes: [],
    filteredPerfumes: [],
    loading: true,
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: 0,
      per_page: 12,
      has_next: false,
      has_prev: false,
    },
    currentPage: 1,
    showFilters: false,
  });

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategory: '',
    selectedAromas: [],
    sortBy: 'name',
    selectedConcentration: '',
    selectedLongevity: '',
    selectedBrand: '',
  });

  const updateState = (updates: Partial<CatalogState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const fetchPerfumes = async () => {
    try {
      updateState({ loading: true });
      const response: PaginatedResponse<Perfume> = await api.getPerfumes(
        state.currentPage,
        state.pagination?.per_page || 12,
        filters.searchTerm || undefined,
        filters.selectedCategory || undefined,
        filters.selectedAromas.length > 0 ? filters.selectedAromas[0] : undefined
      );

      updateState({
        perfumes: response.data,
        filteredPerfumes: response.data,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching perfumes:', error);
      updateState({ loading: false });
    }
  };

  // Enhanced perfume data with realistic pricing
  
  const filterAndSortPerfumes = () => {
    let filtered = state.perfumes.filter(perfume => {
      // Search filter
      const matchesSearch = filters.searchTerm === '' ||
                          perfume.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          perfume.brand.toLowerCase().includes(filters.searchTerm.toLowerCase());

      // Aroma filter
      const matchesAromas = filters.selectedAromas.length === 0 ||
                           filters.selectedAromas.some(aroma =>
                             perfume.aroma_tags.some(tag => tag.slug === aroma)
                           );

      // Category filter
      const matchesCategory = !filters.selectedCategory ||
                           perfume.aroma_tags.some(tag =>
                             tag.name.toLowerCase().includes(filters.selectedCategory.toLowerCase())
                           );

      // Concentration filter
      const matchesConcentration = !filters.selectedConcentration ||
                                 (perfume.type && perfume.type.toLowerCase() === filters.selectedConcentration.toLowerCase());

      // Longevity filter
      let matchesLongevity = true;
      if (filters.selectedLongevity) {
        const longevityMap: Record<string, string[]> = {
          'light': ['Light'],
          'medium': ['Medium'],
          'long': ['Long', 'High'],
          'very-long': ['Very Long', 'Very High']
        };
        const validLongevities = longevityMap[filters.selectedLongevity] || [];
        matchesLongevity = validLongevities.length === 0 ||
                          Boolean(perfume.longevity && validLongevities.includes(perfume.longevity));
      }

      // Brand filter
      const matchesBrand = !filters.selectedBrand ||
                        perfume.brand.toLowerCase().includes(filters.selectedBrand.toLowerCase());

      return matchesSearch && matchesAromas && matchesCategory &&
             matchesConcentration && matchesLongevity && matchesBrand;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'longevity':
          return (b.longevity || '').localeCompare(a.longevity || '');
        default:
          return 0;
      }
    });

    updateState({ filteredPerfumes: filtered });
  };

  
  const clearFilters = () => {
    updateFilters({
      searchTerm: '',
      selectedCategory: '',
      selectedAromas: [],
      sortBy: 'name',
      selectedConcentration: '',
      selectedLongevity: '',
      selectedBrand: '',
    });
    updateState({ currentPage: 1 });
  };

  const handlePageChange = (page: number) => {
    updateState({ currentPage: page });
  };

  const toggleFilters = () => {
    updateState({ showFilters: !state.showFilters });
  };

  useEffect(() => {
    fetchPerfumes();
  }, [state.currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.currentPage === 1) {
        filterAndSortPerfumes();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [
    filters.searchTerm,
    filters.selectedCategory,
    filters.selectedAromas,
    filters.sortBy,
    filters.selectedConcentration,
    filters.selectedLongevity,
    filters.selectedBrand,
    state.perfumes
  ]);

  return {
    // State
    ...state,
    filters,

    // Actions
    updateFilters,
    clearFilters,
    handlePageChange,
    toggleFilters,
  };
};