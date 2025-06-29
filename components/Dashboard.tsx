import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Menu, Download, Share2, TrendingUp, Users, Award, Leaf } from 'lucide-react';
import Sidebar from './Sidebar';
import MetricCard from './MetricCard';
import ComparisonChart from './ComparisonChart';
import RankingTable from './RankingTable';
import TimeSeriesChart from './TimeSeriesChart';
import InsightsPanel from './InsightsPanel';
import { cities, metricDefinitions } from '../data/cities';
import { FilterOptions, CityMetrics, ComparisonCity } from '../types';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    regions: [],
    states: [],
    populationRange: [0, 50000000],
    metrics: []
  });
  const [selectedMetric, setSelectedMetric] = useState('hdi');
  const [comparisonCities, setComparisonCities] = useState<ComparisonCity[]>([
    { id: 'mumbai', name: 'Mumbai', color: '#2563EB' },
    { id: 'bangalore', name: 'Bangalore', color: '#059669' },
    { id: 'delhi', name: 'Delhi', color: '#DC2626' }
  ]);

  const filteredCities = useMemo(() => {
    return cities.filter(city => {
      const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           city.state.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = filters.regions.length === 0 || filters.regions.includes(city.region);
      const matchesState = filters.states.length === 0 || filters.states.includes(city.state);
      const matchesPopulation = city.population >= filters.populationRange[0] && 
                               city.population <= filters.populationRange[1];
      
      return matchesSearch && matchesRegion && matchesState && matchesPopulation;
    });
  }, [searchTerm, filters]);

  const currentMetric = metricDefinitions.find(m => m.key === selectedMetric);
  
  // Calculate key insights
  const insights = useMemo(() => {
    const hdiTop = [...cities].sort((a, b) => b.hdi - a.hdi).slice(0, 3);
    const inequalityWorst = [...cities].sort((a, b) => b.giniCoefficient - a.giniCoefficient).slice(0, 3);
    const healthcareBest = [...cities].sort((a, b) => b.healthcareExpenditure - a.healthcareExpenditure).slice(0, 3);
    const environmentBest = [...cities].sort((a, b) => b.environmentalPerformanceIndex - a.environmentalPerformanceIndex).slice(0, 3);
    
    return { hdiTop, inequalityWorst, healthcareBest, environmentBest };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        cities={cities}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Main Content */}
      <div className="lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="ml-4 lg:ml-0">
                  <h1 className="text-2xl font-bold text-gray-900">
                    India Growth Metrics
                  </h1>
                  <p className="text-sm text-gray-500">
                    Data-driven insights across {filteredCities.length} cities
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button className="hidden sm:flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button className="hidden sm:flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="hidden lg:flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Menu className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Key Insights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="HDI Leader"
              value={insights.hdiTop[0]?.name || 'N/A'}
              subtitle={`HDI: ${insights.hdiTop[0]?.hdi.toFixed(3) || 'N/A'}`}
              icon={Award}
              trend={12}
              color="blue"
            />
            <MetricCard
              title="Healthcare Leader"
              value={insights.healthcareBest[0]?.name || 'N/A'}
              subtitle={`$${insights.healthcareBest[0]?.healthcareExpenditure || 0}/capita`}
              icon={TrendingUp}
              trend={8}
              color="green"
            />
            <MetricCard
              title="Environment Leader"
              value={insights.environmentBest[0]?.name || 'N/A'}
              subtitle={`EPI: ${insights.environmentBest[0]?.environmentalPerformanceIndex || 0}`}
              icon={Leaf}
              trend={15}
              color="emerald"
            />
            <MetricCard
              title="Total Cities"
              value={filteredCities.length.toString()}
              subtitle="In current view"
              icon={Users}
              trend={0}
              color="purple"
            />
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Comparison Chart */}
            <div className="lg:col-span-2">
              <ComparisonChart
                cities={filteredCities}
                comparisonCities={comparisonCities}
                selectedMetric={selectedMetric}
                onMetricChange={setSelectedMetric}
                onComparisonChange={setComparisonCities}
              />
            </div>

            {/* Time Series Chart */}
            <div>
              <TimeSeriesChart
                cities={filteredCities}
                comparisonCities={comparisonCities}
                selectedMetric={selectedMetric}
              />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ranking Table */}
            <div className="lg:col-span-2">
              <RankingTable
                cities={filteredCities}
                selectedMetric={selectedMetric}
                onCitySelect={(cityId) => {
                  const city = cities.find(c => c.id === cityId);
                  if (city && !comparisonCities.find(c => c.id === cityId)) {
                    const colors = ['#2563EB', '#059669', '#DC2626', '#7C3AED', '#EA580C', '#0891B2'];
                    const newColor = colors[comparisonCities.length % colors.length];
                    setComparisonCities([...comparisonCities, {
                      id: cityId,
                      name: city.name,
                      color: newColor
                    }]);
                  }
                }}
              />
            </div>

            {/* Insights Panel */}
            <div>
              <InsightsPanel
                insights={insights}
                filteredCities={filteredCities}
                selectedMetric={selectedMetric}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
