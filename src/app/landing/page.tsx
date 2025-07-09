"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Camera, TrendingUp, FileText, Mic, Smartphone, Star, PlayCircle, Users, Shield, Globe, CheckCircle, Sprout, Wheat } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Simple crop type definition
interface Crop {
  name: string;
  emoji: string;
  season: string;
}

// Enhanced Crop Card with better visual design
const CropCard = ({ crop, onClick, isSelected }: { crop: Crop; onClick: () => void; isSelected: boolean }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-lg cursor-pointer border transition-all duration-300 hover:shadow-xl overflow-hidden ${
        isSelected 
          ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-green-200 ring-2 ring-green-200' 
          : 'border-gray-200 dark:border-gray-700 hover:border-green-300 hover:shadow-green-100'
      }`}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 dark:to-gray-900/20"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="text-3xl sm:text-4xl mb-3 text-center transform transition-transform duration-300 hover:scale-110">{crop.emoji}</div>
        <h3 className="font-bold text-center text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-1">{crop.name}</h3>
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center font-medium">{crop.season}</p>
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
};

export default function LandingPage() {
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const features = [
    {
      icon: Camera,
      title: "AI Crop Doctor",
      description: "Snap a photo of your crop and get instant disease diagnosis with treatment recommendations.",
      titleHi: "एआई फसल डॉक्टर",
      color: "bg-emerald-500"
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence",
      description: "Real-time mandi prices, trend analysis, and profit optimization strategies.",
      titleHi: "बाजार जानकारी",
      color: "bg-blue-500"
    },
    {
      icon: FileText,
      title: "Government Schemes",
      description: "Find and apply for agricultural subsidies, loans, and schemes.",
      titleHi: "सरकारी योजना",
      color: "bg-purple-500"
    },
    {
      icon: Mic,
      title: "Voice Assistant",
      description: "Talk to AgriSaarthi in 22+ Indian languages including Hindi, Tamil, Telugu.",
      titleHi: "आवाज सहायक",
      color: "bg-orange-500"
    }
  ];

  const crops = [
    { name: "Wheat", emoji: "🌾", season: "Rabi" },
    { name: "Rice", emoji: "🌾", season: "Kharif" },
    { name: "Cotton", emoji: "🌱", season: "Kharif" },
    { name: "Sugarcane", emoji: "🎋", season: "Annual" },
    { name: "Maize", emoji: "🌽", season: "Kharif" },
    { name: "Tomato", emoji: "🍅", season: "All Season" }
  ];

  const stats = [
    { number: "500K+", label: "Active Farmers", labelHi: "सक्रिय किसान", icon: Users },
    { number: "100+", label: "Crop Diseases", labelHi: "फसल रोग", icon: Shield },
    { number: "₹2000Cr+", label: "Farmer Income", labelHi: "किसान आय", icon: TrendingUp },
    { number: "22+", label: "Languages", labelHi: "भाषाएं", icon: Globe }
  ];

  const testimonials = [
    {
      name: "Ramesh Kumar",
      location: "Punjab",
      quote: "AgriSaarthi saved my 5-acre wheat crop from disease. Great market alerts too!",
      rating: 5,
      crop: "Wheat",
      savings: "₹2.5L saved"
    },
    {
      name: "Priya Sharma",
      location: "UP",
      quote: "Got ₹75,000 solar pump subsidy through the app. Very helpful guidance.",
      rating: 5,
      crop: "Rice",
      savings: "₹75K subsidy"
    },
    {
      name: "Suresh Patel",
      location: "Gujarat",
      quote: "Voice feature in Gujarati is perfect for my father. Easy to use.",
      rating: 5,
      crop: "Cotton",
      savings: "30% yield ↑"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-green-50/30 dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 relative overflow-hidden">
      
      {/* Desktop Navigation Header */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🌾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">AgriSaarthi</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-6xl">🌾</div>
        <div className="absolute top-40 right-20 text-4xl">🚜</div>
        <div className="absolute bottom-40 left-1/4 text-5xl">🌽</div>
        <div className="absolute bottom-20 right-1/3 text-4xl">🌱</div>
      </div>

      {/* Enhanced Mobile App-style Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        {/* App Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white text-lg">AgriSaarthi</span>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">Your AI Farm Assistant</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm rounded-lg font-medium shadow-md"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <section ref={heroRef} className="pt-20 lg:pt-24 pb-8 lg:pb-20 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-gray-50/90 to-green-50/60 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-emerald-900/20"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/15 dark:bg-green-700/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-emerald-200/15 dark:bg-emerald-700/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: heroInView ? 1 : 0, scale: heroInView ? 1 : 0.8 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-800 dark:text-green-200 px-6 py-3 rounded-full text-sm font-semibold mb-6 lg:mb-8 border border-green-200 dark:border-green-700 shadow-lg"
            >
              <Sprout className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">AI-Powered Smart Farming Assistant</span>
              <span className="sm:hidden">AI Farming Assistant</span>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 30 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 lg:mb-6 leading-tight text-gray-900 dark:text-white"
            >
              Meet{' '}
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                AgriSaarthi
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto mb-3 lg:mb-4 px-2 leading-relaxed font-medium"
            >
              Your intelligent farming companion that speaks your language and guides you to better harvests
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: heroInView ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-green-700 dark:text-green-300 font-semibold mb-8 lg:mb-12 text-sm sm:text-base px-2"
            >
              आपका AI कृषि साथी • உங்கள் AI விவசாய துணை • మీ AI వ్యవసాయ సహాయి
            </motion.p>

            {/* Enhanced Mobile Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:hidden mb-8"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  ✨ Quick Features
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">Tap to explore our AI-powered tools</p>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                {features.slice(0, 4).map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div 
                      key={index} 
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 group"
                    >
                      <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">{feature.title}</h3>
                      <p className="text-xs text-green-700 dark:text-green-300 font-medium">{feature.titleHi}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Crop Selection */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-8 lg:mb-12"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 px-2">
                🌾 Choose Your Crop for Personalized Advice
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-4xl mx-auto mb-6">
                {crops.map((crop, index) => (
                  <CropCard
                    key={index}
                    crop={crop}
                    onClick={() => setSelectedCrop(crop)}
                    isSelected={selectedCrop?.name === crop.name}
                  />
                ))}
              </div>
              
              {selectedCrop && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl max-w-md mx-auto border-2 border-green-500 dark:border-green-400 ring-2 ring-green-200 dark:ring-green-600/20"
                >
                  <div className="text-4xl mb-3 text-center">{selectedCrop.emoji}</div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2 text-center">
                    {selectedCrop.name} - {selectedCrop.season} Season
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                    Get AI-powered insights for your {selectedCrop.name} farming!
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col gap-4 justify-center items-center mb-12 lg:mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/login"
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white px-12 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl hover:shadow-2xl max-w-sm group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Wheat className="w-6 h-6 group-hover:scale-110 transition-transform relative z-10" />
                  <span className="relative z-10">Start Farming Smarter</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>
              </motion.div>
              
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 py-3 px-8 rounded-2xl hover:bg-green-50 dark:hover:bg-green-900/20 group border border-transparent hover:border-green-200 dark:hover:border-green-700"
              >
                <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Watch Demo (2 min)</span>
              </motion.button>
            </motion.div>

            {/* Desktop Preview - Hidden on Mobile */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-4xl mx-auto"
            >
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-6 text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-green-600" />
                    AgriSaarthi Dashboard
                  </div>
                </div>
              </div>
              <div className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{feature.title}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section ref={statsRef} className="py-16 lg:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: statsInView ? 1 : 0, y: statsInView ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 lg:mb-20"
          >
            <div className="inline-flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-green-200 dark:border-green-700">
              <Star className="w-4 h-4 mr-2" />
              <span>Trusted by Farmers Nationwide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Empowering Agriculture Across India 🇮🇳
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join the growing community of progressive farmers who are transforming their agricultural practices with AI
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: statsInView ? 1 : 0, y: statsInView ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-6 lg:p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <p className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-300 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {stat.labelHi}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful AI Features 🚀
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need for modern farming
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${feature.color} p-3 rounded-2xl flex-shrink-0 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-3">
                        {feature.titleHi}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 lg:py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Why Choose AgriSaarthi? 🌟
            </h2>
            <p className="text-lg text-green-100">
              Everything you need in one intelligent farming app
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Free to use forever",
              "Works offline too", 
              "Expert agricultural advice",
              "Government scheme alerts",
              "Community support",
              "Regular updates"
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
              >
                <CheckCircle className="w-5 h-5 text-green-200 flex-shrink-0" />
                <span className="text-white font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 lg:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Success Stories from Real Farmers 👨‍🌾
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See how AgriSaarthi is transforming lives across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-3xl p-6 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">👨‍🌾</div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-gray-600 dark:text-gray-300 mb-4 text-sm italic leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="flex items-center justify-between text-xs">
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full font-medium">
                    {testimonial.crop}
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    {testimonial.savings}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Ready to Transform Your Farming? 🚀
          </h2>
          <p className="text-lg text-green-100 mb-8">
            Join thousands of farmers already using AgriSaarthi to increase yields and profits
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 text-white">
              <Smartphone className="w-5 h-5" />
              <span className="font-medium">Available on Web & Mobile</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Download */}
      <div className="lg:hidden bg-gray-100 dark:bg-gray-800 py-4">
        <div className="max-w-sm mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Get the mobile app for the best experience
          </p>
          <div className="flex gap-3 justify-center">
            <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <div className="text-white">📱</div>
              <div>
                <div className="text-xs text-gray-300">Get it on</div>
                <div className="font-semibold">App Store</div>
              </div>
            </div>
            <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <div className="text-white">🤖</div>
              <div>
                <div className="text-xs text-gray-300">Get it on</div>
                <div className="font-semibold">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">AgriSaarthi</span>
              </div>
              <p className="text-gray-400 mb-4 text-sm leading-relaxed max-w-md">
                Empowering Indian farmers with AI-powered agricultural intelligence. From disease diagnosis to market insights - your complete farming companion.
              </p>
              <div className="text-green-400 font-medium text-sm">
                कृषि सारथी • ਖੇਤੀ ਸਾਰਥੀ • কৃষি সারথী
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 text-green-400">Features</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>🔬 AI Crop Doctor</li>
                <li>📈 Market Intelligence</li>
                <li>🏛️ Government Schemes</li>
                <li>🎤 Voice Assistant</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 text-green-400">Languages</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>🇮🇳 Hindi (हिन्दी)</li>
                <li>🇮🇳 English</li>
                <li>🇮🇳 Tamil (தமிழ்)</li>
                <li>🇮🇳 Telugu (తెలుగు)</li>
                <li className="text-green-400">+ 18 more languages</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0 text-sm flex items-center gap-2">
              <span>© 2025 AgriSaarthi.</span>
              <span className="hidden sm:inline">Built with ❤️ for Indian Farmers 🇮🇳</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <span className="hover:text-green-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-green-400 cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-green-400 cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
