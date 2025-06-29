import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BarChart3, TrendingUp, Users, Leaf, Building, Scale, X } from 'lucide-react';
import { FilterOptions, CityMetrics } from '../types';
import { metricDefinitions } from '../data/cities';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  cities: CityMetrics[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const categoryIcons = {
  economic: BarChart3,
  social: Users,
  health: TrendingUp,
  environment: Leaf,
  governance: Building,
  equality: Scale,
};

const categoryColors = {
  economic: 'text-blue-600',
  social: 'text-green-600',
  health: 'text-red-600',
  environment: 'text-emerald-600',
  governance: 'text-purple-600',
  equality: 'text-orange-600',
};

export default function Sidebar({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  cities, 
  searchTerm, 
  onSearchChange 
}: SidebarProps) {
  const regions = [...new Set(cities.map(city => city.region))];
  const states = [...new Set(cities.map(city => city.state))];
  const populationRange: [number, number] = [
    Math.min(...cities.map(city => city.population)),
    Math.max(...cities.map(city => city.population))
  ];

  const metricsByCategory = metricDefinitions.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, typeof metricDefinitions>);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filters & Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Cities
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Type city name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Region Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Filter className="inline w-4 h-4 mr-2" />
              Regions
            </label>
            <div className="space-y-2">
              {regions.map(region => (
                <label key={region} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.regions.includes(region)}
                    onChange={(e) => {
                      const newRegions = e.target.checked
                        ? [...filters.regions, region]
                        : filters.regions.filter(r => r !== region);
                      onFiltersChange({ ...filters, regions: newRegions });
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{region}</span>
                </label>
              ))}
            </div>
          </div>

          {/* State Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              States
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {states.map(state => (
                <label key={state} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.states.includes(state)}
                    onChange={(e) => {
                      const newStates = e.target.checked
                        ? [...filters.states, state]
                        : filters.states.filter(s => s !== state);
                      onFiltersChange({ ...filters, states: newStates });
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{state}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Population Range */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Population Range
            </label>
            <input
              type="range"
              min={populationRange[0]}
              max={populationRange[1]}
              value={filters.populationRange[1]}
              onChange={(e) => {
                onFiltersChange({
                  ...filters,
                  populationRange: [filters.populationRange[0], parseInt(e.target.value)]
                });
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{(filters.populationRange[0] / 1000000).toFixed(1)}M</span>
              <span>{(filters.populationRange[1] / 1000000).toFixed(1)}M</span>
            </div>
          </div>

          {/* Metrics Categories */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Available Metrics</h3>
            
            {Object.entries(metricsByCategory).map(([category, metrics]) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
              const colorClass = categoryColors[category as keyof typeof categoryColors];
              
              return (
                <div key={category} className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <IconComponent className={`w-5 h-5 mr-2 ${colorClass}`} />
                    <h4 className="font-medium text-gray-900 capitalize">
                      {category === 'equality' ? 'Economic Equality' : category}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {metrics.map(metric => (
                      <div key={metric.key} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">{metric.name}</span>
                          <span className="text-xs text-gray-500">{metric.unit}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}