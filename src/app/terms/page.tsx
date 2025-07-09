"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20">
          <div className="mb-6">
            <Link
              href="/signup"
              className="inline-flex items-center space-x-2 text-green-600 hover:text-green-500 font-medium mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Signup</span>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>Welcome to AgriSaarthi. By using our service, you agree to these terms.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Service Description</h2>
            <p>AgriSaarthi provides AI-powered agricultural assistance including crop diagnosis, market analysis, and farming guidance.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. User Responsibilities</h2>
            <p>Users are responsible for providing accurate information and using the service responsibly.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Privacy</h2>
            <p>We respect your privacy and protect your personal information as described in our Privacy Policy.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Disclaimer</h2>
            <p>AgriSaarthi provides information for educational purposes. Always consult with agricultural experts for critical decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
