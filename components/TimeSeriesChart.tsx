import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CityMetrics, ComparisonCity } from '../types';
import { metricDefinitions } from '../data/cities';

interface TimeSeriesChartProps {
  cities: CityMetrics[];
  comparisonCities: ComparisonCity[];
  selectedMetric: string;
}

export default function TimeSeriesChart({ 
  cities, 
  comparisonCities, 
  selectedMetric 
}: TimeSeriesChartProps) {
  const currentMetric = metricDefinitions.find(m => m.key === selectedMetric);
  
  // Prepare time series data
  const timeSeriesData = React.useMemo(() => {
    const years = [2019, 2020, 2021, 2022, 2023];
    
    return years.map(year => {
      const dataPoint: any = { year };
      
      comparisonCities.forEach(compCity => {
        const city = cities.find(c => c.id === compCity.id);
        if (city) {
          const historicalData = city.historicalData.find(h => h.year === year);
          if (historicalData && selectedMetric in historicalData) {
            dataPoint[city.name] = historicalData[selectedMetric as keyof typeof historicalData];
          }
        }
      });
      
      return dataPoint;
    });
  }, [cities, comparisonCities, selectedMetric]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Trend Analysis</h3>
        <p className="text-sm text-gray-500">
          Historical data for {currentMetric?.name || selectedMetric}
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
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
                ''
              ]}
            />
            <Legend />
            {comparisonCities.map(compCity => (
              <Line
                key={compCity.id}
                type="monotone"
                dataKey={compCity.name}
                stroke={compCity.color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {comparisonCities.length === 0 && (
        <div className="flex items-center justify-center h-80 text-gray-500">
          <div className="text-center">
            <p className="text-sm">Select cities to view trend analysis</p>
            <p className="text-xs mt-1">Use the comparison chart to add cities</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}