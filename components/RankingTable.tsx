import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { CityMetrics } from '../types';
import { metricDefinitions } from '../data/cities';

interface RankingTableProps {
  cities: CityMetrics[];
  selectedMetric: string;
  onCitySelect: (cityId: string) => void;
}

export default function RankingTable({ cities, selectedMetric, onCitySelect }: RankingTableProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const currentMetric = metricDefinitions.find(m => m.key === selectedMetric);
  
  const sortedCities = React.useMemo(() => {
    return [...cities].sort((a, b) => {
      const aValue = a[selectedMetric as keyof CityMetrics] as number;
      const bValue = b[selectedMetric as keyof CityMetrics] as number;
      
      if (sortOrder === 'desc') {
        return bValue - aValue;
      }
      return aValue - bValue;
    });
  }, [cities, selectedMetric, sortOrder]);

  const toggleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 bg-yellow-50';
    if (rank === 2) return 'text-gray-600 bg-gray-50';
    if (rank === 3) return 'text-orange-600 bg-orange-50';
    return 'text-gray-500 bg-gray-50';
  };

  const formatValue = (value: number, unit: string) => {
    if (unit.includes('Billion')) {
      return `$${value.toFixed(1)}B`;
    }
    if (unit.includes('Million')) {
      return `$${value.toFixed(0)}M`;
    }
    if (unit.includes('USD')) {
      return `$${value.toLocaleString()}`;
    }
    if (unit.includes('%')) {
      return `${value.toFixed(1)}%`;
    }
    if (unit.includes('Scale')) {
      return value.toFixed(3);
    }
    return value.toFixed(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">City Rankings</h3>
        <p className="text-sm text-gray-500">
          Ranked by {currentMetric?.name || selectedMetric}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Rank</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">City</th>
              <th 
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={toggleSort}
              >
                <div className="flex items-center">
                  {currentMetric?.name || selectedMetric}
                  {sortOrder === 'desc' ? (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Region</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedCities.map((city, index) => {
              const rank = index + 1;
              const value = city[selectedMetric as keyof CityMetrics] as number;
              
              return (
                <motion.tr
                  key={city.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(rank)}`}>
                      {rank}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{city.name}</div>
                      <div className="text-sm text-gray-500">{city.state}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {formatValue(value, currentMetric?.unit || '')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {city.region}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onCitySelect(city.id)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Compare
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}