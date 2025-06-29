export interface CityMetrics {
  id: string;
  name: string;
  state: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
  population: number;
  
  // Economic Indicators
  gdp: number; // in billions USD
  gni: number; // in billions USD
  gdpPerCapita: number; // in USD
  unemploymentRate: number; // percentage
  inflationRate: number; // percentage
  fdi: number; // in millions USD
  exportImportRatio: number; // ratio
  publicDebt: number; // percentage of GDP
  
  // Social Development
  hdi: number; // 0-1 scale
  lifeExpectancy: number; // years
  infantMortalityRate: number; // per 1000 births
  literacyRate: number; // percentage
  educationIndex: number; // 0-1 scale
  genderInequalityIndex: number; // 0-1 scale (lower is better)
  populationGrowthRate: number; // percentage
  urbanPopulation: number; // percentage
  
  // Health & Well-being
  healthcareExpenditure: number; // per capita USD
  physiciansPerThousand: number; // per 1000 people
  hospitalBedsPerThousand: number; // per 1000 people
  cleanWaterAccess: number; // percentage
  vaccinationCoverage: number; // percentage
  
  // Environment & Sustainability
  co2EmissionsPerCapita: number; // tons per capita
  renewableEnergy: number; // percentage
  forestArea: number; // percentage
  airQualityIndex: number; // 0-500 scale (lower is better)
  environmentalPerformanceIndex: number; // 0-100 scale
  
  // Governance & Infrastructure
  corruptionIndex: number; // 0-100 scale (higher is better)
  internetPenetration: number; // percentage
  mobileSubscriptions: number; // per 100 people
  infrastructureQuality: number; // 1-7 scale
  politicalStability: number; // -2.5 to 2.5 scale
  
  // Economic Equality
  giniCoefficient: number; // 0-1 scale (lower is better)
  povertyRate: number; // percentage
  socialProtectionCoverage: number; // percentage
  
  // Historical data (5 years)
  historicalData: HistoricalMetrics[];
}

export interface HistoricalMetrics {
  year: number;
  gdp: number;
  hdi: number;
  populationGrowthRate: number;
  unemploymentRate: number;
  co2EmissionsPerCapita: number;
  literacyRate: number;
}

export interface MetricInfo {
  key: keyof CityMetrics;
  name: string;
  category: 'economic' | 'social' | 'health' | 'environment' | 'governance' | 'equality';
  unit: string;
  description: string;
  higherIsBetter: boolean;
}

export interface FilterOptions {
  regions: string[];
  states: string[];
  populationRange: [number, number];
  metrics: string[];
}

export interface ComparisonCity {
  id: string;
  name: string;
  color: string;
}