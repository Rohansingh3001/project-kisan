"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Upload, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface DiagnosisResult {
  disease: string;
  confidence: number;
  severity: string;
  treatment: string[];
  prevention: string[];
}

export default function CropDiagnosis() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeCrop = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // TODO: Integrate with Google Vertex AI Gemini Vision
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock result - replace with actual Gemini Vision API call
      const mockResult: DiagnosisResult = {
        disease: "Tomato Late Blight (Phytophthora infestans)",
        confidence: 85,
        severity: "Moderate",
        treatment: [
          "Apply copper-based fungicide immediately",
          "Remove affected leaves and dispose properly",
          "Improve air circulation around plants",
          "Reduce watering frequency and avoid overhead watering"
        ],
        prevention: [
          "Plant resistant varieties next season",
          "Ensure proper spacing between plants",
          "Apply preventive fungicide during humid conditions",
          "Monitor weather conditions and act preventively"
        ]
      };

      setResult(mockResult);
    } catch (error) {
      console.error('Failed to analyze the image:', error);
      setError("Failed to analyze the image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const captureFromCamera = () => {
    // TODO: Implement camera capture functionality
    alert("Camera capture will be implemented with proper mobile integration");
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Crop Disease Diagnosis
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Upload a photo of your plant to get instant AI-powered disease identification and treatment recommendations
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              {selectedImage ? (
                <div className="space-y-4">
                  <Image
                    src={selectedImage}
                    alt="Selected crop"
                    width={400}
                    height={256}
                    className="max-w-full h-64 object-contain mx-auto rounded-lg"
                  />
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Change Image
                    </button>
                    <button
                      onClick={analyzeCrop}
                      disabled={isAnalyzing}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Upload Plant Photo
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Choose a clear image of the affected plant part
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </button>
                      <button
                        onClick={captureFromCamera}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Photography Tips:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
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
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Diagnosis Complete</span>
                  </div>
                  <h3 className="text-lg font-bold text-green-900 dark:text-green-100">
                    {result.disease}
                  </h3>
                  <div className="flex gap-4 mt-2">
                    <span className="text-sm bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {result.confidence}% Confidence
                    </span>
                    <span className="text-sm bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                      {result.severity} Severity
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    🔬 Treatment Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {result.treatment.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    🛡️ Prevention Tips
                  </h4>
                  <ul className="space-y-2">
                    {result.prevention.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
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
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload a photo to get started with AI-powered diagnosis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
