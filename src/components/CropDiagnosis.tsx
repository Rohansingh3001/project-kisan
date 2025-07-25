"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Upload, Loader2, AlertCircle, CheckCircle, X, Shield } from 'lucide-react';

interface DiagnosisResult {
  disease: string;
  confidence: number;
  severity: string;
  treatment: string[];
  prevention: string[];
  description?: string;
  plantType?: string;
  affectedParts?: string[];
  symptoms?: string[];
  modelUsed?: string;
  analysisMethod?: string;
  additionalInfo?: {
    region: string;
    season: string;
    commonInRegion: boolean;
  };
}

export default function CropDiagnosis() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const processFile = (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError('File size must be less than 10MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      processFile(imageFile);
    } else {
      setError('Please drop a valid image file');
    }
  };

  const analyzeCrop = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('Starting Groq-powered crop analysis...');
      
      const response = await fetch('/api/crop-diagnosis-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: selectedImage,
          language: 'en'
        }),
      });

      const result = await response.json();
      
      console.log('API Response:', result);

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`);
      }

      // Validate the response structure
      if (!result.disease || !result.treatment || !result.prevention) {
        throw new Error('Invalid response format from server');
      }

      setResult(result);
    } catch (error) {
      console.error('Failed to analyze the image:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze the image. Please try again.";
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const captureFromCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Failed to access camera:', error);
      setError("Failed to access camera. Please try uploading an image instead.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageData);
        stopCamera();
        setResult(null);
        setError(null);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Crop Disease Diagnosis
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Upload a photo of your plant to get instant AI-powered disease identification and treatment recommendations
          </p>
        </div>

        {/* Upload Section */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 sm:gap-8">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-8 text-center">
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="w-full flex justify-center">
                    <Image
                      src={selectedImage}
                      alt="Selected crop"
                      width={400}
                      height={256}
                      className="max-w-full h-48 sm:h-64 object-contain mx-auto rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                    >
                      Change Image
                    </button>
                    <button
                      onClick={analyzeCrop}
                      disabled={isAnalyzing}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm sm:text-base"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Crop'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className={`border-2 border-dashed rounded-xl p-4 sm:p-8 text-center transition-all duration-300 ${
                    isDragOver 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {isDragOver ? 'Drop your image here' : 'Upload Crop Image'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {isDragOver 
                          ? 'Release to upload the image' 
                          : 'Drag and drop an image here, or tap to browse'
                        }
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                        Supports: JPG, PNG, WEBP (Max: 10MB)
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md text-sm sm:text-base"
                      >
                        <Upload className="w-4 h-4" />
                        Choose File
                      </button>
                      <button
                        onClick={captureFromCamera}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md text-sm sm:text-base"
                      >
                        <Camera className="w-4 h-4" />
                        Take Photo
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 text-sm sm:text-base">
                Photography Tips:
              </h4>
              <ul className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Take photos in good lighting conditions</li>
                <li>• Focus on the affected area clearly</li>
                <li>• Include some healthy parts for comparison</li>
                <li>• Avoid blurry or overexposed images</li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-700 dark:text-red-300 mt-1 text-xs sm:text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Diagnosis Complete</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-green-900 dark:text-green-100">
                    {result.disease}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs sm:text-sm bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {result.confidence}% Confidence
                    </span>
                    <span className="text-xs sm:text-sm bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                      {result.severity} Severity
                    </span>
                    {result.plantType && (
                      <span className="text-xs sm:text-sm bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {result.plantType} Plant
                      </span>
                    )}
                    {result.modelUsed && (
                      <span className="text-xs sm:text-sm bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                        {result.modelUsed.toUpperCase()} AI
                      </span>
                    )}
                    {result.additionalInfo?.season && (
                      <span className="text-xs sm:text-sm bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                        {result.additionalInfo.season} Season
                      </span>
                    )}
                  </div>
                </div>

                {/* Analysis Details */}
                {(result.symptoms && result.symptoms.length > 0) || (result.affectedParts && result.affectedParts.length > 0) || result.description && (
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm sm:text-base flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-500" /> Analysis Details
                    </h4>
                    {result.affectedParts && result.affectedParts.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Affected Parts:</h5>
                        <div className="flex flex-wrap gap-2">
                          {result.affectedParts.map((part, index) => (
                            <span key={index} className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                              {part}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.symptoms && result.symptoms.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Observed Symptoms:</h5>
                        <div className="flex flex-wrap gap-2">
                          {result.symptoms.map((symptom, index) => (
                            <span key={index} className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.description && (
                      <div>
                        <h5 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">AI Analysis:</h5>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 italic">
                          {result.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm sm:text-base flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Treatment Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {result.treatment.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm sm:text-base flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" /> Prevention Tips
                  </h4>
                  <ul className="space-y-2">
                    {result.prevention.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!result && !error && !isAnalyzing && (
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Upload a photo to get started with AI-powered diagnosis
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full mx-2 sm:mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Take Photo
                </h3>
                <button
                  onClick={stopCamera}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={capturePhoto}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Camera className="w-4 h-4" />
                    Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
