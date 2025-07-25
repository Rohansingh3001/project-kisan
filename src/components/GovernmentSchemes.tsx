"use client";

import { useState } from 'react';
import { Search, ExternalLink, FileText, CheckCircle, Clock, DollarSign, Users } from 'lucide-react';

interface Scheme {
  id: string;
  name: string;
  description: string;
  category: string;
  subsidy: string;
  eligibility: string[];
  documents: string[];
  applicationLink: string;
  deadline: string;
  status: 'active' | 'upcoming' | 'expired';
  beneficiaries: number;
}

export default function GovernmentSchemes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const categories = [
    { id: 'all', name: 'All Schemes' },
    { id: 'subsidy', name: 'Subsidies' },
    { id: 'irrigation', name: 'Irrigation' },
    { id: 'seeds', name: 'Seeds & Fertilizers' },
    { id: 'insurance', name: 'Insurance' },
    { id: 'technology', name: 'Technology' },
    { id: 'credit', name: 'Credit & Loans' },
  ];

  const schemes: Scheme[] = [
    {
      id: 'pmkisan',
      name: 'PM-KISAN Samman Nidhi',
      description: 'Direct income support to farmer families. ₹6,000 per year in three equal installments.',
      category: 'subsidy',
      subsidy: '₹6,000 per year',
      eligibility: [
        'All landholding farmer families',
        'Family should own cultivable land',
        'Valid Aadhaar card required',
        'Bank account linked with Aadhaar'
      ],
      documents: [
        'Aadhaar Card',
        'Bank Account Details',
        'Land Records (Khatauni/Khasra)',
        'Passport Size Photo'
      ],
      applicationLink: 'https://pmkisan.gov.in',
      deadline: 'Open throughout the year',
      status: 'active',
      beneficiaries: 110000000
    },
    {
      id: 'drip-irrigation',
      name: 'Pradhan Mantri Krishi Sinchayee Yojana (Drip Irrigation)',
      description: 'Subsidy for micro-irrigation systems including drip and sprinkler irrigation.',
      category: 'irrigation',
      subsidy: 'Up to 55% for small farmers',
      eligibility: [
        'All categories of farmers',
        'Minimum 0.5 acres of land',
        'Access to water source',
        'Should not have availed similar subsidy in last 7 years'
      ],
      documents: [
        'Land Records',
        'Aadhaar Card',
        'Bank Account Details',
        'Water Source Certificate',
        'Quotation from approved vendor'
      ],
      applicationLink: 'https://pmksy.gov.in',
      deadline: 'March 31, 2025',
      status: 'active',
      beneficiaries: 2500000
    },
    {
      id: 'crop-insurance',
      name: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Comprehensive crop insurance scheme providing financial support to farmers in case of crop loss.',
      category: 'insurance',
      subsidy: 'Premium subsidy up to 50%',
      eligibility: [
        'All farmers (sharecroppers and tenant farmers included)',
        'Cultivating notified crops',
        'In notified areas',
        'Coverage for pre-sowing to post-harvest'
      ],
      documents: [
        'Aadhaar Card',
        'Bank Account Details',
        'Land Records',
        'Sowing Certificate',
        'Revenue Record Extract'
      ],
      applicationLink: 'https://pmfby.gov.in',
      deadline: 'Kharif: July 31, Rabi: December 31',
      status: 'active',
      beneficiaries: 36000000
    },
    {
      id: 'solar-pump',
      name: 'PM-KUSUM (Solar Pump)',
      description: 'Subsidy for solar-powered irrigation pumps to reduce dependence on grid electricity.',
      category: 'technology',
      subsidy: 'Up to 60% subsidy',
      eligibility: [
        'Individual farmers',
        'FPOs, Cooperatives, Panchayats',
        'Existing grid-connected pump',
        'Minimum 3 HP pump capacity'
      ],
      documents: [
        'Land Ownership Documents',
        'Electricity Connection Details',
        'Aadhaar Card',
        'Bank Account Details',
        'Technical Feasibility Report'
      ],
      applicationLink: 'https://pmkusum.mnre.gov.in',
      deadline: 'Rolling basis',
      status: 'active',
      beneficiaries: 180000
    },
    {
      id: 'kisan-credit',
      name: 'Kisan Credit Card (KCC)',
      description: 'Easy access to credit for farmers to meet agricultural and allied activities expenses.',
      category: 'credit',
      subsidy: 'Interest subsidy 2%',
      eligibility: [
        'All farmers (individual/joint)',
        'Tenant farmers with valid documents',
        'Self Help Group members',
        'Sharecroppers with proper agreements'
      ],
      documents: [
        'Land Records',
        'Aadhaar Card',
        'PAN Card',
        'Bank Account Details',
        'Passport Size Photos'
      ],
      applicationLink: 'https://kcc.gov.in',
      deadline: 'Open throughout the year',
      status: 'active',
      beneficiaries: 69000000
    },
    {
      id: 'organic-farming',
      name: 'Paramparagat Krishi Vikas Yojana (Organic Farming)',
      description: 'Promotion of organic farming through cluster-based approach.',
      category: 'seeds',
      subsidy: '₹50,000 per hectare over 3 years',
      eligibility: [
        'Groups of 50 farmers',
        'Cluster of 50 hectares',
        'Willing to adopt organic farming',
        'Located in same village/block'
      ],
      documents: [
        'Group Formation Certificate',
        'Land Records of all farmers',
        'Aadhaar Cards',
        'Bank Account Details',
        'Organic Farming Plan'
      ],
      applicationLink: 'https://pgsindia-ncof.gov.in',
      deadline: 'April 30, 2025',
      status: 'active',
      beneficiaries: 885000
    }
  ];

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Government Schemes Navigator
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Discover and apply for agricultural subsidies, loans, and support schemes
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search schemes by name or description..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Category Filters - Simple Pills */}
          <div className="flex flex-row flex-wrap gap-2 mb-8 overflow-x-auto scrollbar-hide py-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all whitespace-nowrap focus:outline-none
                  ${selectedCategory === category.id
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-400'}
                `}
                style={{ minWidth: 0 }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Scheme Cards - New Improved Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchemes.map(scheme => (
            <div
              key={scheme.id}
              className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all flex flex-col gap-4 group hover:ring-2 hover:ring-green-400"
              onClick={() => setSelectedScheme(scheme)}
            >
              {/* Status Badge */}
              <span className={`absolute top-4 right-4 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(scheme.status)}`}>
                {scheme.status}
              </span>

              {/* Title & Category */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
                  {scheme.name}
                </h3>
                <div className={`inline-block text-sm px-3 py-1 rounded-full font-semibold min-w-0 w-auto truncate
      ${
        scheme.category === 'subsidy'
          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200'
          : scheme.category === 'insurance'
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200'
          : scheme.category === 'irrigation'
          ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-200'
          : scheme.category === 'technology'
          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200'
          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
      }
    `}>
                  {categories.find(c => c.id === scheme.category)?.name || scheme.category}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                {scheme.description}
              </p>

              {/* Scheme Info Pills */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                  <DollarSign className="w-4 h-4" />
                  {scheme.subsidy}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4" />
                  {(scheme.beneficiaries / 1_000_000).toFixed(1)}M+
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  {scheme.deadline}
                </span>
              </div>

              {/* CTA Button */}
              <button
                className="mt-auto w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedScheme(scheme);
                }}
              >
                <FileText className="w-4 h-4" />
                View Details
              </button>
            </div>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No schemes found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search criteria or browse different categories
            </p>
          </div>
        )}

        {/* Scheme Detail Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedScheme.name}
                  </h2>
                  <button
                    onClick={() => setSelectedScheme(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {selectedScheme.description}
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      Subsidy Amount
                    </h3>
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      {selectedScheme.subsidy}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      Eligibility Criteria
                    </h3>
                    <ul className="space-y-1">
                      {selectedScheme.eligibility.map((criteria, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-500" />
                      Required Documents
                    </h3>
                    <ul className="space-y-1">
                      {selectedScheme.documents.map((doc, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={selectedScheme.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Apply Online
                    </a>
                    <button
                      onClick={() => setSelectedScheme(null)}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
