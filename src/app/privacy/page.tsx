"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal information (name, phone, email)</li>
              <li>Farm-related data (location, crop types, farm size)</li>
              <li>Usage data and app interactions</li>
              <li>Images uploaded for crop diagnosis</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide personalized agricultural recommendations</li>
              <li>Improve our AI models and services</li>
              <li>Send relevant notifications and updates</li>
              <li>Ensure service security and prevent abuse</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data Protection</h2>
            <p>We implement industry-standard security measures to protect your data and never sell your personal information to third parties.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Contact Us</h2>
            <p>If you have questions about this privacy policy, please contact us at privacy@Agrosaathi.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
