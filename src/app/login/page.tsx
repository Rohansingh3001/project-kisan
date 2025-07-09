"use client";

import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Phone, ArrowRight, Leaf, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  signInWithEmail, 
  signInWithGoogle, 
  initializeRecaptcha, 
  sendSMSVerification, 
  verifyOTP, 
  getAuthErrorMessage 
} from '@/lib/auth';
import { ConfirmationResult } from 'firebase/auth';

type LoginStep = 'input' | 'otp';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('email');
  const [step, setStep] = useState<LoginStep>('input');
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const router = useRouter();
  const { login } = useAuth();

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleEmailLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    const { user, profile } = await signInWithEmail(formData.email, formData.password);
    
    if (profile) {
      login(user, profile);
      router.push('/dashboard');
    } else {
      setError('Profile not found. Please contact support.');
    }
  };

  const handlePhoneLogin = async () => {
    if (!formData.phone) {
      setError('Please enter your phone number');
      return;
    }

    // Initialize reCAPTCHA
    const recaptchaVerifier = initializeRecaptcha('recaptcha-container');
    
    try {
      const confirmation = await sendSMSVerification(formData.phone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
      setOtpTimer(60);
      setError('');
    } catch (error: any) {
      setError(getAuthErrorMessage(error));
      recaptchaVerifier.clear();
    }
  };

  const handleOtpVerification = async () => {
    if (!formData.otp || !confirmationResult) {
      setError('Please enter the OTP code');
      return;
    }

    try {
      const { user, profile } = await verifyOTP(confirmationResult, formData.otp);
      
      if (profile) {
        login(user, profile);
        router.push('/dashboard');
      } else {
        setError('Profile not found. Please create an account first.');
      }
    } catch (error: any) {
      setError(getAuthErrorMessage(error));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { user, profile } = await signInWithGoogle();
      
      if (profile) {
        login(user, profile);
        router.push('/dashboard');
      }
    } catch (error: any) {
      setError(getAuthErrorMessage(error));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (step === 'otp') {
        await handleOtpVerification();
      } else if (loginMethod === 'email') {
        await handleEmailLogin();
      } else {
        await handlePhoneLogin();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (otpTimer > 0) return;
    
    setLoading(true);
    try {
      const recaptchaVerifier = initializeRecaptcha('recaptcha-container');
      const confirmation = await sendSMSVerification(formData.phone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtpTimer(60);
      setError('');
    } catch (error: any) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep('input');
    setConfirmationResult(null);
    setFormData(prev => ({ ...prev, otp: '' }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Back to Home Button */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* App-like Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Sign in to continue to AgriSaarthi</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20">
          {step === 'otp' ? (
            // OTP Verification Step
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Phone</h3>
                <p className="text-gray-600">Enter the 6-digit code sent to {formData.phone}</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                    placeholder="123456"
                    className="w-full text-center py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || formData.otp.length !== 6}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Verify & Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={goBack}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  ← Change Number
                </button>
                <button
                  onClick={resendOTP}
                  disabled={otpTimer > 0}
                  className={`font-medium ${
                    otpTimer > 0 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-green-600 hover:text-green-500'
                  }`}
                >
                  {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          ) : (
            // Login Input Step
            <div>
              {/* Login Method Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    loginMethod === 'email'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Email Address
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    loginMethod === 'phone'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Phone Number
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone/Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {loginMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                      {loginMethod === 'phone' ? (
                        <Phone className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Mail className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <input
                      type={loginMethod === 'phone' ? 'tel' : 'email'}
                      value={loginMethod === 'phone' ? formData.phone : formData.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [loginMethod]: e.target.value
                      }))}
                      placeholder={loginMethod === 'phone' ? '+91 98765 43210' : 'farmer@example.com'}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Password Input (only for email) */}
                {loginMethod === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Forgot Password (only for email) */}
                {loginMethod === 'email' && (
                  <div className="text-right">
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-green-600 hover:text-green-500"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{loginMethod === 'phone' ? 'Send OTP' : 'Sign In'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-200"></div>
                <div className="px-4 text-sm text-gray-500">or</div>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <span className="text-gray-600">Don't have an account? </span>
                <Link
                  href="/signup"
                  className="font-semibold text-green-600 hover:text-green-500"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* reCAPTCHA container (hidden) */}
        <div id="recaptcha-container"></div>

        {/* Language Toggle */}
        <div className="mt-6 text-center">
          <button className="text-sm text-gray-600 hover:text-gray-800">
            🌐 हिन्दी | English | ਪੰਜਾਬੀ
          </button>
        </div>
      </div>
    </div>
  );
}
