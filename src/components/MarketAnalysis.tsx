"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MapPin, Calendar, RefreshCw, Search } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MarketPrice {
  commodity: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  market: string;
  date: string;
  unit: string;
}

interface PriceHistory {
  date: string;
  price: number;
}

export default function MarketAnalysis() {
  const [selectedCommodity, setSelectedCommodity] = useState('tomato');
  const [selectedMarket, setSelectedMarket] = useState('bangalore');
  const [priceData, setPriceData] = useState<MarketPrice[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const commodities = [
    { id: 'tomato', name: 'Tomato', icon: '🍅' },
    { id: 'onion', name: 'Onion', icon: '🧅' },
    { id: 'potato', name: 'Potato', icon: '🥔' },
    { id: 'rice', name: 'Rice', icon: '🌾' },
    { id: 'wheat', name: 'Wheat', icon: '🌾' },
    { id: 'cotton', name: 'Cotton', icon: '🌱' },
  ];

  const markets = [
    { id: 'bangalore', name: 'Bangalore', state: 'Karnataka' },
    { id: 'mysore', name: 'Mysore', state: 'Karnataka' },
    { id: 'hubli', name: 'Hubli', state: 'Karnataka' },
    { id: 'mangalore', name: 'Mangalore', state: 'Karnataka' },
    { id: 'delhi', name: 'Delhi', state: 'Delhi' },
    { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  ];

  useEffect(() => {
    fetchMarketData();
  }, [selectedCommodity, selectedMarket]);

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      // TODO: Integrate with actual market data API
      // For now, we'll simulate the API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockPriceData: MarketPrice[] = [
        {
          commodity: 'Tomato',
          currentPrice: 2500,
          previousPrice: 2200,
          change: 300,
          changePercent: 13.6,
          market: 'Bangalore',
          date: '2025-07-09',
          unit: 'per quintal'
        },
        {
          commodity: 'Tomato',
          currentPrice: 2400,
          previousPrice: 2300,
          change: 100,
          changePercent: 4.3,
          market: 'Mysore',
          date: '2025-07-09',
          unit: 'per quintal'
        },
        {
          commodity: 'Tomato',
          currentPrice: 2600,
          previousPrice: 2500,
          change: 100,
          changePercent: 4.0,
          market: 'Hubli',
          date: '2025-07-09',
          unit: 'per quintal'
        }
      ];

      const mockHistory: PriceHistory[] = [
        { date: '2025-07-03', price: 2000 },
        { date: '2025-07-04', price: 2100 },
        { date: '2025-07-05', price: 2200 },
        { date: '2025-07-06', price: 2150 },
        { date: '2025-07-07', price: 2300 },
        { date: '2025-07-08', price: 2200 },
        { date: '2025-07-09', price: 2500 },
      ];

      setPriceData(mockPriceData);
      setPriceHistory(mockHistory);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCommodities = commodities.filter(commodity =>
    commodity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Market Price Analysis
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time market prices and trends to help you make informed selling decisions
          </p>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Commodity Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Commodity
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Market Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Market
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {markets.map(market => (
                <option key={market.id} value={market.id}>
                  {market.name}, {market.state}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <div className="flex items-end">
            <button
              onClick={fetchMarketData}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Updating...' : 'Refresh Prices'}
            </button>
          </div>
        </div>

        {/* Commodity Category Filters (Oval Pills) */}
        <div className="flex flex-row flex-wrap gap-2 mb-8 overflow-x-auto scrollbar-hide py-2">
          {filteredCommodities.map(commodity => (
            <button
              key={commodity.id}
              onClick={() => setSelectedCommodity(commodity.id)}
              className={`px-5 py-2 rounded-xl border text-sm font-semibold transition-all whitespace-nowrap shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:ring-offset-2
                ${selectedCommodity === commodity.id
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-400'}
              `}
              style={{ minWidth: 0 }}
            >
              {commodity.name}
            </button>
          ))}
        </div>

        {/* Price Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {priceData.map((price, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {price.market}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4" />
                    Karnataka
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  Today
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{price.currentPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {price.unit}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {price.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    price.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {price.change >= 0 ? '+' : ''}₹{price.change} ({price.changePercent >= 0 ? '+' : ''}{price.changePercent}%)
                  </span>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Previous: ₹{price.previousPrice.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price History Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            7-Day Price Trend
          </h3>
          <div className="h-64">
            <Line
              data={{
                labels: priceHistory.map(point =>
                  new Date(point.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                ),
                datasets: [
                  {
                    label: 'Price (₹)',
                    data: priceHistory.map(point => point.price),
                    borderColor: '#16a34a',
                    backgroundColor: 'rgba(34,197,94,0.1)',
                    pointBackgroundColor: '#16a34a',
                    pointBorderColor: '#16a34a',
                    fill: true,
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `₹${context.parsed.y}`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      color: '#e5e7eb',
                    },
                    ticks: {
                      callback: function(value) {
                        return `₹${value}`;
                      }
                    }
                  }
                },
              }}
            />
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            🤖 AI Market Insights
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Price Trend:</strong> Tomato prices have increased by 13.6% in Bangalore market. 
                This upward trend is likely due to reduced supply from rain-affected regions.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Recommendation:</strong> Consider selling your tomato harvest this week as prices 
                are expected to remain high due to seasonal demand.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Best Market:</strong> Hubli market is offering the highest price at ₹2,600 per quintal. 
                Consider transport costs when making decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
