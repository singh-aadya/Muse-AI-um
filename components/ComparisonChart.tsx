import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react';
import { CityMetrics, ComparisonCity } from '../types';
import { metricDefinitions } from '../data/cities';

interface ComparisonChartProps {
  cities: CityMetrics[];
  comparisonCities: ComparisonCity[];
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
  onComparisonChange: (cities: ComparisonCity[]) => void;
}

export default function ComparisonChart({ 
  cities, 
  comparisonCities, 
  selectedMetric, 
  onMetricChange,
  onComparisonChange 
}: ComparisonChartProps) {
  const currentMetric = metricDefinitions.find(m => m.key === selectedMetric);
  
  const chartData = comparisonCities.map(compCity => {
    const city = cities.find(c => c.id === compCity.id);
    if (!city) return null;
    
    return {
      name: city.name,
      value: city[selectedMetric as keyof CityMetrics] as number,
      fill: compCity.color
    };
  }).filter(Boolean);

  const removeCity = (cityId: string) => {
    onComparisonChange(comparisonCities.filter(c => c.id !== cityId));
  };

  const categoryMetrics = metricDefinitions.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, typeof metricDefinitions>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">City Comparison</h3>
          <p className="text-sm text-gray-500">
            Compare cities across different metrics
          </p>
        </div>
        
        <select
          value={selectedMetric}
          onChange={(e) => onMetricChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {Object.entries(categoryMetrics).map(([category, metrics]) => (
            <optgroup key={category} label={category.charAt(0).toUpperCase() + category.slice(1)}>
              {metrics.map(metric => (
                <option key={metric.key} value={metric.key}>
                  {metric.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Selected Cities */}
      <div className="flex flex-wrap gap-2 mb-6">
        {comparisonCities.map(city => (
          <div 
            key={city.id}
            className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
          >
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: city.color }}
            />
            <span className="text-gray-700">{city.name}</span>
            <button
              onClick={() => removeCity(city.id)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [
                `${value.toFixed(2)} ${currentMetric?.unit || ''}`,
                currentMetric?.name || 'Value'
              ]}
            />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              stroke="none"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Metric Info */}
      {currentMetric && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900">{currentMetric.name}</h4>
          <p className="text-sm text-gray-600 mt-1">{currentMetric.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">Unit: {currentMetric.unit}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              currentMetric.higherIsBetter 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {currentMetric.higherIsBetter ? 'Higher is Better' : 'Lower is Better'}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}