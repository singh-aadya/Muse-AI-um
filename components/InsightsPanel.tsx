import React from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Leaf, AlertTriangle, BarChart3, Users } from 'lucide-react';
import { CityMetrics } from '../types';

interface InsightsPanelProps {
  insights: {
    hdiTop: CityMetrics[];
    inequalityWorst: CityMetrics[];
    healthcareBest: CityMetrics[];
    environmentBest: CityMetrics[];
  };
  filteredCities: CityMetrics[];
  selectedMetric: string;
}

export default function InsightsPanel({ insights, filteredCities, selectedMetric }: InsightsPanelProps) {
  const totalPopulation = filteredCities.reduce((sum, city) => sum + city.population, 0);
  const avgHDI = filteredCities.reduce((sum, city) => sum + city.hdi, 0) / filteredCities.length;
  const avgUnemployment = filteredCities.reduce((sum, city) => sum + city.unemploymentRate, 0) / filteredCities.length;
  
  const insightCards = [
    {
      title: 'HDI Champions',
      icon: Award,
      color: 'bg-yellow-50 text-yellow-600',
      items: insights.hdiTop.slice(0, 3).map(city => ({
        name: city.name,
        value: city.hdi.toFixed(3),
        subtitle: city.state
      }))
    },
    {
      title: 'Healthcare Leaders',
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
      items: insights.healthcareBest.slice(0, 3).map(city => ({
        name: city.name,
        value: `$${city.healthcareExpenditure}`,
        subtitle: 'per capita'
      }))
    },
    {
      title: 'Environment Champions',
      icon: Leaf,
      color: 'bg-emerald-50 text-emerald-600',
      items: insights.environmentBest.slice(0, 3).map(city => ({
        name: city.name,
        value: city.environmentalPerformanceIndex.toFixed(1),
        subtitle: 'EPI Score'
      }))
    },
    {
      title: 'Inequality Concerns',
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600',
      items: insights.inequalityWorst.slice(0, 3).map(city => ({
        name: city.name,
        value: city.giniCoefficient.toFixed(3),
        subtitle: 'Gini Coefficient'
      }))
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Summary Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">
              {(totalPopulation / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-blue-600">Total Population</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">
              {avgHDI.toFixed(3)}
            </div>
            <div className="text-sm text-green-600">Average HDI</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-orange-50 rounded-lg text-center">
          <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">
            {avgUnemployment.toFixed(1)}%
          </div>
          <div className="text-sm text-orange-600">Average Unemployment</div>
        </div>
      </div>

      {/* Insight Cards */}
      {insightCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-lg ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <h4 className="ml-3 font-semibold text-gray-900">{card.title}</h4>
          </div>
          
          <div className="space-y-3">
            {card.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.subtitle}</div>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Key Takeaways */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Key Takeaways</h4>
        <div className="space-y-2 text-sm">
          <p className="text-blue-800">
            • {insights.hdiTop[0]?.name} leads in human development with HDI of {insights.hdiTop[0]?.hdi.toFixed(3)}
          </p>
          <p className="text-blue-800">
            • Healthcare investment varies significantly across cities
          </p>
          <p className="text-blue-800">
            • Environmental performance correlates with urban planning quality
          </p>
          <p className="text-blue-800">
            • Income inequality remains a challenge in major urban centers
          </p>
        </div>
      </div>
    </motion.div>
  );
}