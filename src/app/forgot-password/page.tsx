"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Forgot Password</h1>
          <p className="text-gray-600 mb-6">
            This feature is coming soon! For now, you can use any credentials to login.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-500 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
