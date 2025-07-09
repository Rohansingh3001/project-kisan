"use client";

import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Phone, Mail, MapPin, ArrowRight, Leaf, Briefcase, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  signupWithEmail, 
  signupWithPhone,
  loginWithGoogle, 
  setupRecaptcha, 
  sendOTP, 
  getAuthErrorMessage 
} from '@/lib/auth';
import { ConfirmationResult, AuthError } from 'firebase/auth';

type SignupStep = 'personal' | 'farm' | 'security' | 'otp';
type SignupMethod = 'email' | 'phone';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<SignupStep>('personal');
  const [signupMethod, setSignupMethod] = useState<SignupMethod>('email');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    farmSize: '',
    cropTypes: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
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

  const validateStep = (step: SignupStep): boolean => {
    switch (step) {
      case 'personal':
        if (!formData.name.trim()) {
          setError('Please enter your full name');
          return false;
        }
        if (signupMethod === 'email' && !formData.email.trim()) {
          setError('Please enter your email address');
          return false;
        }
        if (signupMethod === 'phone' && !formData.phone.trim()) {
          setError('Please enter your phone number');
          return false;
        }
        return true;
      case 'farm':
        if (!formData.location.trim()) {
          setError('Please enter your location');
          return false;
        }
        if (!formData.farmSize.trim()) {
          setError('Please enter your farm size');
          return false;
        }
        return true;
      case 'security':
        if (signupMethod === 'email') {
          if (!formData.password) {
            setError('Please enter a password');
            return false;
          }
          if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
          }
          if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
          }
        }
        if (!formData.agreeTerms) {
          setError('Please agree to the terms and conditions');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    setError('');
    if (!validateStep(currentStep)) return;

    const steps: SignupStep[] = ['personal', 'farm', 'security'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: SignupStep[] = ['personal', 'farm', 'security'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const sendOTPForSignup = async () => {
    if (!formData.phone) {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      const recaptchaVerifier = setupRecaptcha('recaptcha-container');
      const confirmation = await sendOTP(formData.phone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setCurrentStep('otp');
      setOtpTimer(60);
      setError('');
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error as AuthError));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async () => {
    const { user, profile } = await signupWithEmail(formData.email, formData.password, formData.name);
    login(user, profile);
    router.push('/dashboard');
  };

  const handlePhoneSignup = async () => {
    if (!confirmationResult || !formData.otp) {
      setError('Please enter the OTP code');
      return;
    }

    const { user, profile } = await signupWithPhone(
      confirmationResult, 
      formData.otp, 
      { name: formData.name }
    );
    login(user, profile);
    router.push('/dashboard');
  };

  const handleGoogleSignup = async () => {
    try {
      const { user, profile } = await loginWithGoogle();
      
      if (profile) {
        login(user, profile);
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error as AuthError));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (currentStep === 'otp') {
      setLoading(true);
      try {
        await handlePhoneSignup();
      } catch (error: unknown) {
        setError(getAuthErrorMessage(error as AuthError));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!validateStep('security')) return;
    
    setLoading(true);
    
    try {
      if (signupMethod === 'email') {
        await handleEmailSignup();
      } else {
        await sendOTPForSignup();
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      setError(getAuthErrorMessage(error as AuthError));
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (otpTimer > 0) return;
    
    setLoading(true);
    try {
      const recaptchaVerifier = setupRecaptcha('recaptcha-container');
      const confirmation = await sendOTP(formData.phone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtpTimer(60);
      setError('');
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error as AuthError));
    } finally {
      setLoading(false);
    }
  };

  const goBackFromOTP = () => {
    setCurrentStep('security');
    setConfirmationResult(null);
    setFormData(prev => ({ ...prev, otp: '' }));
    setError('');
  };

  const getCurrentStepNumber = (step: SignupStep): number => {
    switch (step) {
      case 'personal': return 1;
      case 'farm': return 2;
      case 'security': return 3;
      case 'otp': return 3;
      default: return 1;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Signup Method Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Primary Contact Method</label>
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setSignupMethod('email')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              signupMethod === 'email'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Email Address
          </button>
          <button
            type="button"
            onClick={() => setSignupMethod('phone')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              signupMethod === 'phone'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Phone Number
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your full name"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            required
          />
        </div>
      </div>

      {signupMethod === 'phone' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
              <Phone className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+91 98765 43210"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              required
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="farmer@example.com"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              required
            />
          </div>
        </div>
      )}

      {/* Optional secondary field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {signupMethod === 'phone' ? 'Email Address (Optional)' : 'Phone Number (Optional)'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
            {signupMethod === 'phone' ? (
              <Mail className="w-5 h-5 text-gray-400" />
            ) : (
              <Phone className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <input
            type={signupMethod === 'phone' ? 'email' : 'tel'}
            value={signupMethod === 'phone' ? formData.email : formData.phone}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              [signupMethod === 'phone' ? 'email' : 'phone']: e.target.value 
            }))}
            placeholder={signupMethod === 'phone' ? 'farmer@example.com' : '+91 98765 43210'}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="District, State"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
            <Briefcase className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.farmSize}
            onChange={(e) => setFormData(prev => ({ ...prev, farmSize: e.target.value }))}
            placeholder="e.g., 5 acres"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Main Crops</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
            <Leaf className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.cropTypes}
            onChange={(e) => setFormData(prev => ({ ...prev, cropTypes: e.target.value }))}
            placeholder="Wheat, Rice, Cotton..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {signupMethod === 'email' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Create a strong password"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your password"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {signupMethod === 'phone' && (
        <div className="text-center p-6 bg-blue-50 rounded-xl">
          <Phone className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Verification</h3>
          <p className="text-gray-600">
            We&apos;ll send a verification code to your phone number to complete the registration.
          </p>
        </div>
      )}

      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="agreeTerms"
          checked={formData.agreeTerms}
          onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
          className="mt-1 w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
          required
        />
        <label htmlFor="agreeTerms" className="text-sm text-gray-600">
          I agree to the{' '}
          <Link href="/terms" className="text-green-600 hover:text-green-500">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-green-600 hover:text-green-500">
            Privacy Policy
          </Link>
        </label>
      </div>
    </div>
  );

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join AgriSaarthi</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Progress Bar */}
        {currentStep !== 'otp' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {['personal', 'farm', 'security'].map((step, index) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    getCurrentStepNumber(currentStep) > index + 1
                      ? 'bg-green-600 text-white'
                      : getCurrentStepNumber(currentStep) === index + 1
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(getCurrentStepNumber(currentStep) / 3) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Personal</span>
              <span>Farm Info</span>
              <span>Security</span>
            </div>
          </div>
        )}

        {/* Signup Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20">
          {currentStep === 'otp' ? (
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

              <form onSubmit={handleSignup} className="space-y-6">
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
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={goBackFromOTP}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  ← Go Back
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
            // Regular Signup Steps
            <div>
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <form onSubmit={currentStep === 'security' ? handleSignup : (e) => { e.preventDefault(); handleNext(); }}>
                {currentStep === 'personal' && renderStep1()}
                {currentStep === 'farm' && renderStep2()}
                {currentStep === 'security' && renderStep3()}

                {/* Navigation Buttons */}
                <div className="flex space-x-4 mt-8">
                  {currentStep !== 'personal' && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : currentStep === 'security' ? (
                      <>
                        <span>{signupMethod === 'phone' ? 'Send OTP' : 'Create Account'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <span>Next</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Social Login (only on first step) */}
              {currentStep === 'personal' && (
                <>
                  <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <div className="px-4 text-sm text-gray-500">or</div>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>

                  <button
                    onClick={handleGoogleSignup}
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

                  {/* Sign In Link */}
                  <div className="mt-6 text-center">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link
                      href="/login"
                      className="font-semibold text-green-600 hover:text-green-500"
                    >
                      Sign In
                    </Link>
                  </div>
                </>
              )}
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
