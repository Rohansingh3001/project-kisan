"use client";

import { useState, useEffect } from 'react';
import { Camera, Mic, TrendingUp, FileText, Sun, Moon, Home, Bell, User, Zap, MapPin, Calendar, Award, Settings, LogOut, WifiOff, Info } from 'lucide-react';
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
      <div className="p-6 space-y-8">
        {/* User Profile Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 lg:p-6 border border-green-200 dark:border-green-700 shadow-md">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl lg:text-2xl font-bold flex-shrink-0 shadow">
              <User className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">
                {profile?.name || user?.displayName || user?.email?.split('@')[0] || 'User'}
              </h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
                {user?.email ? 'Verified Farmer' : 'Farmer'} • {profile?.location || 'India'}
              </p>
              {!isOnline && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 flex items-center">
                  <WifiOff className="w-4 h-4 mr-1" /> Profile data may be outdated (offline mode)
                </p>
              )}
              {profile?.id && !profile?.email && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center">
                  <Info className="w-4 h-4 mr-1" /> Using fallback profile data
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
                <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Updates (No Emojis, Only Icons) */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-500" />
            Recent Updates
          </h4>
          <div className="space-y-3">
            {[
              {
                icon: <TrendingUp className="w-6 h-6 text-green-600" />, // Market
                title: 'Wheat Market Price Alert',
                description: 'Current price: ₹2,150/quintal (+5% from yesterday)',
                time: '2 hours ago',
                type: 'market'
              },
              {
                icon: <Award className="w-6 h-6 text-purple-600" />, // Scheme
                title: 'New Government Scheme Available',
                description: 'PM-Kisan Samman Nidhi - Apply for ₹6,000 annual benefit',
                time: '1 day ago',
                type: 'scheme'
              },
              {
                icon: <Sun className="w-6 h-6 text-yellow-500" />, // Weather
                title: 'Weather Alert',
                description: 'Light rain expected in your area for next 3 days',
                time: '2 days ago',
                type: 'weather'
              },
              {
                icon: <Mic className="w-6 h-6 text-orange-500" />, // Feature
                title: 'New Feature: Voice Assistant',
                description: 'Now get farming advice in Punjabi language',
                time: '5 days ago',
                type: 'feature'
              }
            ].map((update, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow flex items-center space-x-4">
                <div className="flex-shrink-0">{update.icon}</div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 dark:text-white">{update.title}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{update.description}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {update.time}
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
              { label: 'Total Land', value: '15 Acres', color: 'text-green-600', icon: <MapPin className="w-6 h-6" /> },
              { label: 'Active Crops', value: '3 Types', color: 'text-blue-600', icon: <Camera className="w-6 h-6" /> },
              { label: 'This Season', value: '₹2.8L Income', color: 'text-purple-600', icon: <TrendingUp className="w-6 h-6" /> },
              { label: 'Health Score', value: '92%', color: 'text-orange-600', icon: <Sun className="w-6 h-6" /> }
            ].map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 text-center flex flex-col items-center">
                <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Ensure compatibility with UserProfile by adding an index signature
  type ProfileType = {
    id?: string;
    name?: string;
    location?: string;
    farmSize?: string;
    email?: string;
    [key: string]: unknown;
  };

  function SettingsPage({ profile, theme, setTheme }: { profile: ProfileType, theme: string, setTheme: (t: string) => void }) {
    const [form, setForm] = useState({
      name: profile?.name || "Raj Patel",
      location: profile?.location || "Gujarat, India",
      farmSize: profile?.farmSize || "5.2",
      language: "hi",
      notifications: true,
      voiceAssistant: true,
      theme: theme || "light",
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


   const handleDeleteAccount = async () => {
     setShowDeleteConfirm(false);
     setSaving(true);
     setSuccess("");
     // Simulate delete
     setTimeout(() => {
       setSaving(false);
       setSuccess("Your account has been deleted.");
       // Optionally, trigger logout or redirect
     }, 1200);
   };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      let checked = false;
      if (type === "checkbox" && e.target instanceof HTMLInputElement) {
        checked = e.target.checked;
      }
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleThemeToggle = () => {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      setForm((prev) => ({ ...prev, theme: newTheme }));
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSaving(true);
      setSuccess("");
      try {
        // Update profile in Firebase
        const res = await fetch("/api/update-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": profile?.id || user?.uid || ""
          },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          setSuccess("Settings saved successfully!");
        } else {
          setSuccess("Failed to save settings.");
        }
      } catch {
        setSuccess("Error saving settings.");
      }
      setSaving(false);
    };

    return (
      <div className="p-0 md:p-8 flex justify-center items-center min-h-[80vh]">
        <form className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800 space-y-10" onSubmit={handleSave}>
          {/* Header */}
          <div className="flex items-center mb-8">
            <Settings className="w-8 h-8 text-green-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
          </div>
          {/* Profile (no image) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Farm Size (acres)</label>
              <input type="text" name="farmSize" value={form.farmSize} onChange={handleChange} className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Language</label>
              <select name="language" value={form.language} onChange={handleChange} className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white">
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
          {/* Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center">
              <input type="checkbox" name="voiceAssistant" checked={form.voiceAssistant} onChange={handleChange} className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
              <span className="ml-3 text-gray-700 dark:text-gray-300">Enable voice assistant</span>
              <Mic className="w-5 h-5 text-green-500 ml-2" />
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 dark:text-gray-300 mr-3">Theme</span>
              <button type="button" onClick={handleThemeToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-green-600' : 'bg-gray-200'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="ml-3 text-gray-700 dark:text-gray-300">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </div>
          </div>
          {/* Data & Privacy */}
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            Delete Account
          </button>
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 max-w-sm w-full border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Delete Account</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to permanently delete your account? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                  <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold">Cancel</button>
                  <button onClick={handleDeleteAccount} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold">Delete</button>
                </div>
              </div>
            </div>
          )}
          {/* Support & App Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-3">
              <Link href="/dashboard/help-center" className="w-full block text-left px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Help Center</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Find answers to common questions</div>
              </Link>
              <Link href="/dashboard/contact-support" className="w-full block text-left px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Contact Support</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Get help from our team</div>
              </Link>
              <Link href="/dashboard/get-app" className="w-full block text-left px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Get App</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">DownloadAgrosaathi mobile app</div>
              </Link>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-2 text-sm text-gray-600 dark:text-gray-300">
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
                <span>15 Jul 2025</span>
              </div>
            </div>
          </div>
          {/* Save Button & Success */}
          <div className="flex justify-end mt-8">
            <button type="submit" disabled={saving} className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-8 rounded-xl font-semibold shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50">
              {saving ? (
                <span className="flex items-center"><Settings className="w-5 h-5 mr-2 animate-spin" />Saving...</span>
              ) : (
                <span className="flex items-center"><Settings className="w-5 h-5 mr-2" />Save Changes</span>
              )}
            </button>
          </div>
          {success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center font-medium">
              {success}
            </div>
          )}
        </form>
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
        return <SettingsPage profile={profile ?? {}} theme={theme ?? "light"} setTheme={setTheme} />;
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
              {/* Removed go back arrow */}
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Agrosaathi</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Your AI Farming Companion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
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
            <span className="text-sm font-medium">You&apos;re currently offline. Some features may be limited.</span>
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
