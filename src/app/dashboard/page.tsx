"use client";

import { useState, useEffect } from 'react';
import { Camera, Mic, TrendingUp, FileText, Sun, Moon, ArrowLeft, Home, Bell, User, Zap, MapPin, Calendar, Award, Settings, LogOut, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import CropDiagnosis from '@/components/CropDiagnosis';
import MarketAnalysis from '@/components/MarketAnalysis';
import GovernmentSchemes from '@/components/GovernmentSchemes';
import VoiceInterface from '@/components/VoiceInterface';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

type TabType = 'home' | 'diagnosis' | 'market' | 'schemes' | 'voice' | 'settings';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, profile, logout, isLoading } = useAuth();
  const isOnline = useNetworkStatus();

  useEffect(() => {
    setMounted(true);
    console.log('Current theme:', theme);
  }, [theme]);

  // Show loading spinner while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'diagnosis' as TabType, label: 'Crop Diagnosis', icon: Camera },
    { id: 'market' as TabType, label: 'Market Prices', icon: TrendingUp },
    { id: 'schemes' as TabType, label: 'Gov. Schemes', icon: FileText },
    { id: 'voice' as TabType, label: 'Voice Assistant', icon: Mic },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  const renderHomeContent = () => {
    return (
      <div className="p-6 space-y-6">
        {/* User Profile Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 lg:p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl lg:text-2xl font-bold flex-shrink-0">
              <User className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">{profile?.name || 'User'}</h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">Farmer • {profile?.location || 'India'}</p>
              {!isOnline && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  ⚠️ Profile data may be outdated (offline mode)
                </p>
              )}
              {profile?.id && !profile?.email && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  ℹ️ Using fallback profile data
                </p>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center mt-2 space-y-1 sm:space-y-0 sm:space-x-4 text-xs lg:text-sm">
                <span className="flex items-center text-green-600 dark:text-green-400">
                  <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{profile?.location || 'Location not set'}</span>
                </span>
                <span className="flex items-center text-blue-600 dark:text-blue-400">
                  <Award className="w-3 h-3 lg:w-4 lg:h-4 mr-1 flex-shrink-0" />
                  <span>Premium Member</span>
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">12</div>
              <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 leading-tight">Crops<br className="lg:hidden" /><span className="hidden lg:inline"> </span>Monitored</div>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Quick Access
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Camera, label: 'Scan Crop', color: 'bg-emerald-500', action: () => setActiveTab('diagnosis') },
              { icon: TrendingUp, label: 'Market Prices', color: 'bg-blue-500', action: () => setActiveTab('market') },
              { icon: FileText, label: 'Schemes', color: 'bg-purple-500', action: () => setActiveTab('schemes') },
              { icon: Mic, label: 'Voice Help', color: 'bg-orange-500', action: () => setActiveTab('voice') }
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-600"
              >
                <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Updates */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-500" />
            Recent Updates
          </h4>
          <div className="space-y-3">
            {[
              {
                icon: '🌾',
                title: 'Wheat Market Price Alert',
                description: 'Current price: ₹2,150/quintal (+5% from yesterday)',
                time: '2 hours ago',
                type: 'market'
              },
              {
                icon: '🏛️',
                title: 'New Government Scheme Available',
                description: 'PM-Kisan Samman Nidhi - Apply for ₹6,000 annual benefit',
                time: '1 day ago',
                type: 'scheme'
              },
              {
                icon: '🌱',
                title: 'Weather Alert',
                description: 'Light rain expected in your area for next 3 days',
                time: '2 days ago',
                type: 'weather'
              },
              {
                icon: '💡',
                title: 'New Feature: Voice Assistant',
                description: 'Now get farming advice in Punjabi language',
                time: '5 days ago',
                type: 'feature'
              }
            ].map((update, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{update.icon}</div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 dark:text-white">{update.title}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{update.description}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      {update.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Farm Statistics */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Farm Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Land', value: '15 Acres', color: 'text-green-600' },
              { label: 'Active Crops', value: '3 Types', color: 'text-blue-600' },
              { label: 'This Season', value: '₹2.8L Income', color: 'text-purple-600' },
              { label: 'Health Score', value: '92%', color: 'text-orange-600' }
            ].map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSettingsContent = () => {
    return (
      <div className="p-6 space-y-6">
        {/* Settings Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 lg:p-6 border border-blue-200 dark:border-blue-700">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
          <p className="text-gray-600 dark:text-gray-300">Customize your AgriSaarthi experience</p>
        </div>

        {/* User Profile Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-green-600" />
            Profile Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
              <input 
                type="text" 
                defaultValue={profile?.name || "राज पटेल"} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
              <input 
                type="text" 
                defaultValue={profile?.location || "गुजरात, भारत"} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Farm Size (acres)</label>
              <input 
                type="text" 
                defaultValue={profile?.farmSize || "5.2"} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-600" />
            Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Toggle dark/light theme</div>
              </div>
              <button
                onClick={() => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark';
                  setTheme(newTheme);
                  console.log('Settings: Switching to theme:', newTheme);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  mounted && theme === 'dark' ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    mounted && theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Push Notifications</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Receive alerts and updates</div>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Voice Assistant</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Enable voice commands</div>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Language Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Language</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="en">English</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data & Privacy</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="font-medium text-gray-900 dark:text-white">Download My Data</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Get a copy of your data</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="font-medium text-gray-900 dark:text-white">Privacy Policy</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Review our privacy practices</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <div className="font-medium text-red-600 dark:text-red-400">Delete Account</div>
              <div className="text-sm text-red-500 dark:text-red-300">Permanently delete your account</div>
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="font-medium text-gray-900 dark:text-white">Help Center</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Find answers to common questions</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="font-medium text-gray-900 dark:text-white">Contact Support</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Get help from our team</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="font-medium text-gray-900 dark:text-white">Rate App</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Help us improve AgriSaarthi</div>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">App Information</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Version</span>
              <span>1.2.0</span>
            </div>
            <div className="flex justify-between">
              <span>Build</span>
              <span>120.24.01</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated</span>
              <span>15 Jan 2024</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'diagnosis':
        return <CropDiagnosis />;
      case 'market':
        return <MarketAnalysis />;
      case 'schemes':
        return <GovernmentSchemes />;
      case 'voice':
        return <VoiceInterface />;
      case 'settings':
        return renderSettingsContent();
      default:
        return renderHomeContent();
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-green-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link 
                href="/" 
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mr-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Link>
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">AgriSaarthi</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Your AI Farming Companion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Network Status Indicator */}
              <div className={`p-2 rounded-lg ${isOnline ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`} title={isOnline ? 'Online' : 'Offline'}>
                {isOnline ? (
                  <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark';
                  setTheme(newTheme);
                  console.log('Switching to theme:', newTheme);
                }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {mounted && theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">You're currently offline. Some features may be limited.</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Tab Navigation */}
        <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 mb-8">
          <nav className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Component */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-20 lg:mb-0">
          {renderActiveComponent()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <nav className="grid grid-cols-6 gap-1 p-2 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-green-600 text-white shadow-md scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-semibold leading-tight text-center">
                  {tab.label.split(' ').map((word, index) => (
                    <div key={index}>{word}</div>
                  ))}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <footer className="hidden lg:block bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p className="mb-2">
              Powered by Google AI • Built for Indian Farmers
            </p>
            <p className="text-sm">
              Supporting local languages: English, ಕನ್ನಡ (Kannada), हिन्दी (Hindi)
            </p>
          </div>
        </div>
      </footer>
      </div>
    </ProtectedRoute>
  );
}
