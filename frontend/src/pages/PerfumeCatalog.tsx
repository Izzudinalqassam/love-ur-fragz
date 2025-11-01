import React from 'react';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { Pagination } from '../components/ui/Pagination';
import { usePerfumeCatalog } from '../hooks/usePerfumeCatalog';
import {
  CatalogHeader,
  PerfumeCard,
  EmptyState
} from '../components/catalog';
import EnhancedCatalogFilters from '../components/catalog/EnhancedCatalogFilters';
import EnhancedPerfumeCard from '../components/catalog/EnhancedPerfumeCard';

const PerfumeCatalog = () => {
  const {
    perfumes,
    filteredPerfumes,
    loading,
    pagination,
    currentPage,
    showFilters,
    filters,
    updateFilters,
    clearFilters,
    handlePageChange,
    toggleFilters,
  } = usePerfumeCatalog();

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">Perfume Collection</h1>
            <p className="text-gray-600">Discover luxury fragrances</p>
          </div>
          <LoadingSkeleton count={8} variant="perfume" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CatalogHeader
        searchTerm={filters.searchTerm}
        onSearchChange={(value) => updateFilters({ searchTerm: value })}
        totalItems={pagination.total_items}
      />

      <EnhancedCatalogFilters
        showFilters={showFilters}
        onToggleFilters={toggleFilters}
        onClearFilters={clearFilters}
        searchTerm={filters.searchTerm}
        selectedCategory={filters.selectedCategory}
        selectedAromas={filters.selectedAromas}
        sortBy={filters.sortBy}
        selectedConcentration={filters.selectedConcentration}
        selectedLongevity={filters.selectedLongevity}
        selectedBrand={filters.selectedBrand}
        onSearchChange={(value) => updateFilters({ searchTerm: value })}
        onCategoryChange={(value) => updateFilters({ selectedCategory: value })}
        onAromasChange={(aromas) => updateFilters({ selectedAromas: aromas })}
        onSortChange={(value) => updateFilters({ sortBy: value })}
        onConcentrationChange={(value) => updateFilters({ selectedConcentration: value })}
        onLongevityChange={(value) => updateFilters({ selectedLongevity: value })}
        onBrandChange={(value) => updateFilters({ selectedBrand: value })}
        totalItems={pagination.total_items}
      />

      {/* Perfume Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && currentPage > 1 ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : filteredPerfumes.length === 0 ? (
          <EmptyState onClearFilters={clearFilters} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPerfumes.map((perfume) => (
                <EnhancedPerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  variant="detailed"
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination?.total_pages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.total_pages}
                  totalItems={pagination.total_items}
                  itemsPerPage={pagination.per_page}
                  hasNext={pagination.has_next}
                  hasPrev={pagination.has_prev}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PerfumeCatalog;
