import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  filters = {},
  setFilters,
  filterOptions = [],
  placeholder = "Search...",
  loading = false,
  className = ""
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value =>
      value && value !== 'all' && value !== ''
    ).length;
  }, [filters]);

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters(prev => {
      const cleared = {};
      Object.keys(prev).forEach(key => {
        cleared[key] = filterOptions.find(opt => opt.key === key)?.defaultValue || '';
      });
      return cleared;
    });
  };

  const hasActiveFilters = searchTerm || activeFiltersCount > 0;

  return (
    <div className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700 p-4 shadow-lg ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:text-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2 items-center">
          {/* Filter Dropdowns */}
          {filterOptions.map((option) => (
            <select
              key={option.key}
              value={filters[option.key] || ''}
              onChange={(e) => handleFilterChange(option.key, e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-slate-900 border dark:text-white border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all min-w-[150px]"
              disabled={loading}
            >
              <option value="">{option.placeholder}</option>
              {option.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          {/* Filters Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden px-4 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2.5 text-sm bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filters Panel */}
      {showFilters && (
        <div className="lg:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filterOptions.map((option) => (
              <div key={option.key}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {option.label}
                </label>
                <select
                  value={filters[option.key] || ''}
                  onChange={(e) => handleFilterChange(option.key, e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                  disabled={loading}
                >
                  <option value="">{option.placeholder}</option>
                  {option.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-sm">
              Search: "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1 hover:text-cyan-700 dark:hover:text-cyan-300"
              >
                ×
              </button>
            </span>
          )}
          {Object.entries(filters).map(([key, value]) => {
            if (!value || value === 'all' || value === '') return null;
            const option = filterOptions.find(opt => opt.key === key);
            const selectedOption = option?.options?.find(opt => opt.value === value);

            return (
              <span key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-sm">
                {option?.label}: {selectedOption?.label || value}
                <button
                  onClick={() => handleFilterChange(key, option?.defaultValue || '')}
                  className="ml-1 hover:text-cyan-700 dark:hover:text-cyan-300"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
