import { NextRequest, NextResponse } from 'next/server';

// Hugging Face Inference API for crop disease detection
// Using a specialized plant disease detection model
const HF_API_URL = "https://api-inference.huggingface.co/models/nateraw/food";
const HF_CROP_DISEASE_URL = "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification";
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

interface HuggingFaceResponse {
  label: string;
  score: number;
}

// Disease information database - expanded for more accurate matching
const diseaseInfo: Record<string, { severity: string; treatment: string[]; prevention: string[] }> = {
  'healthy': {
    severity: 'None',
    treatment: ['No treatment needed', 'Continue regular care', 'Monitor plant health regularly'],
    prevention: ['Maintain proper watering', 'Ensure adequate nutrition', 'Monitor regularly for early signs']
  },
  // Tomato diseases
  'tomato___bacterial_spot': {
    severity: 'High',
    treatment: [
      'Apply copper-based bactericide',
      'Remove affected leaves immediately',
      'Improve air circulation',
      'Use drip irrigation instead of overhead watering'
    ],
    prevention: ['Use resistant varieties', 'Avoid overhead irrigation', 'Practice crop rotation', 'Sanitize tools']
  },
  'tomato___early_blight': {
    severity: 'Moderate',
    treatment: [
      'Apply fungicide containing chlorothalonil or copper',
      'Remove lower leaves that touch the ground',
      'Improve air circulation',
      'Water at soil level'
    ],
    prevention: ['Crop rotation', 'Mulching', 'Proper spacing', 'Avoid overhead watering']
  },
  'tomato___late_blight': {
    severity: 'High',
    treatment: [
      'Apply systemic fungicide immediately',
      'Remove all affected plant parts',
      'Destroy infected debris',
      'Ensure good drainage'
    ],
    prevention: ['Use resistant varieties', 'Avoid overhead irrigation', 'Monitor humidity levels', 'Apply preventive fungicides']
  },
  'tomato___leaf_mold': {
    severity: 'Moderate',
    treatment: [
      'Improve greenhouse ventilation',
      'Apply fungicide spray',
      'Remove affected leaves',
      'Reduce humidity levels'
    ],
    prevention: ['Maintain low humidity', 'Ensure good air circulation', 'Avoid overcrowding', 'Use resistant varieties']
  },
  'tomato___septoria_leaf_spot': {
    severity: 'Moderate',
    treatment: [
      'Apply fungicide containing chlorothalonil',
      'Remove affected leaves',
      'Mulch around plants',
      'Water at soil level'
    ],
    prevention: ['Crop rotation', 'Proper plant spacing', 'Avoid overhead watering', 'Remove plant debris']
  },
  'tomato___spider_mites': {
    severity: 'High',
    treatment: [
      'Apply miticide or insecticidal soap',
      'Increase humidity around plants',
      'Use predatory mites',
      'Spray with water to remove mites'
    ],
    prevention: ['Maintain adequate humidity', 'Avoid over-fertilizing with nitrogen', 'Regular monitoring', 'Biological control']
  },
  'tomato___target_spot': {
    severity: 'Moderate',
    treatment: [
      'Apply fungicide with chlorothalonil or copper',
      'Remove affected plant parts',
      'Improve air circulation',
      'Practice crop rotation'
    ],
    prevention: ['Use certified disease-free seeds', 'Crop rotation', 'Proper sanitation', 'Avoid overhead irrigation']
  },
  'tomato___yellow_leaf_curl_virus': {
    severity: 'High',
    treatment: [
      'Remove infected plants immediately',
      'Control whitefly vectors',
      'Use insecticides for whitefly control',
      'Install reflective mulches'
    ],
    prevention: ['Use virus-resistant varieties', 'Control whitefly populations', 'Remove weeds', 'Use reflective mulches']
  },
  'tomato___mosaic_virus': {
    severity: 'High',
    treatment: [
      'Remove infected plants',
      'Sanitize tools between plants',
      'Control aphid vectors',
      'Use virus-free seeds'
    ],
    prevention: ['Use certified virus-free seeds', 'Control insect vectors', 'Sanitize equipment', 'Practice crop rotation']
  },
  // Potato diseases
  'potato___early_blight': {
    severity: 'Moderate',
    treatment: [
      'Apply fungicide with chlorothalonil',
      'Remove affected foliage',
      'Improve air circulation',
      'Ensure proper nutrition'
    ],
    prevention: ['Crop rotation', 'Proper plant spacing', 'Balanced fertilization', 'Avoid overhead irrigation']
  },
  'potato___late_blight': {
    severity: 'High',
    treatment: [
      'Apply systemic fungicide immediately',
      'Destroy infected plants',
      'Improve drainage',
      'Avoid overhead watering'
    ],
    prevention: ['Use resistant varieties', 'Monitor weather conditions', 'Apply preventive fungicides', 'Proper field sanitation']
  },
  // Pepper diseases
  'pepper___bacterial_spot': {
    severity: 'High',
    treatment: [
      'Apply copper-based bactericide',
      'Remove infected plant parts',
      'Improve ventilation',
      'Use drip irrigation'
    ],
    prevention: ['Use resistant varieties', 'Avoid overhead watering', 'Practice crop rotation', 'Sanitize tools']
  },
  // Corn diseases
  'corn___common_rust': {
    severity: 'Moderate',
    treatment: [
      'Apply rust-specific fungicide',
      'Remove infected leaves',
      'Ensure good air circulation',
      'Monitor weather conditions'
    ],
    prevention: ['Plant resistant varieties', 'Proper field spacing', 'Crop rotation', 'Remove crop debris']
  },
  'corn___northern_leaf_blight': {
    severity: 'High',
    treatment: [
      'Apply systemic fungicide',
      'Remove infected plant parts',
      'Improve air circulation',
      'Practice crop rotation'
    ],
    prevention: ['Use resistant hybrids', 'Tillage to bury crop residue', 'Crop rotation', 'Balanced fertilization']
  },
  // General disease categories
  'blight': {
    severity: 'High',
    treatment: [
      'Apply copper-based fungicide immediately',
      'Remove affected leaves and dispose properly',
      'Improve air circulation around plants',
      'Reduce watering frequency and avoid overhead watering'
    ],
    prevention: [
      'Plant resistant varieties',
      'Ensure proper spacing between plants',
      'Apply preventive fungicide during humid conditions',
      'Monitor weather conditions'
    ]
  },
  'spot': {
    severity: 'Moderate',
    treatment: [
      'Apply appropriate fungicide',
      'Remove affected plant parts',
      'Improve ventilation',
      'Adjust watering practices'
    ],
    prevention: [
      'Use drip irrigation',
      'Avoid overhead watering',
      'Practice crop rotation',
      'Use disease-resistant varieties'
    ]
  },
  'rust': {
    severity: 'Moderate',
    treatment: [
      'Apply rust-specific fungicide',
      'Remove infected leaves',
      'Increase air circulation',
      'Reduce humidity around plants'
    ],
    prevention: [
      'Plant rust-resistant varieties',
      'Ensure proper plant spacing',
      'Avoid overhead irrigation',
      'Regular field monitoring'
    ]
  },
  'mosaic': {
    severity: 'High',
    treatment: [
      'Remove infected plants immediately',
      'Control aphid vectors',
      'Use virus-free seeds',
      'Sanitize tools between plants'
    ],
    prevention: [
      'Use certified virus-free seeds',
      'Control insect vectors',
      'Practice crop rotation',
      'Remove weeds that harbor viruses'
    ]
  },
  'bacterial': {
    severity: 'High',
    treatment: [
      'Apply copper-based bactericide',
      'Remove infected plant material',
      'Improve air circulation',
      'Avoid overhead watering'
    ],
    prevention: [
      'Use pathogen-free seeds',
      'Practice crop rotation',
      'Sanitize tools and equipment',
      'Avoid working with wet plants'
    ]
  }
};

export async function POST(request: NextRequest) {
  let language = 'en'; // Default language
  
  try {
    const { imageData, language: requestLanguage = 'en' } = await request.json();
    language = requestLanguage; // Store language for use in catch block

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    if (!HF_API_KEY) {
      return NextResponse.json(
        { error: 'Hugging Face API key not configured. Please add HUGGING_FACE_API_KEY to environment variables.' },
        { status: 500 }
      );
    }

    // Test API key validity first
    try {
      const testResponse = await fetch('https://api-inference.huggingface.co/models/Professor/CGIAR-Crop-disease', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
        },
      });
      
      if (testResponse.status === 401) {
        return NextResponse.json(
          { error: 'Invalid Hugging Face API key. Please check your HUGGING_FACE_API_KEY.' },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('API key validation error:', error);
    }

    // Test API key validity
    if (!HF_API_KEY.startsWith('hf_')) {
      return NextResponse.json(
        { error: 'Invalid Hugging Face API key format. API key should start with "hf_"' },
        { status: 400 }
      );
    }

    // Convert base64 image to buffer
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    console.log('Sending request to Hugging Face API:', {
      primaryUrl: HF_CROP_DISEASE_URL,
      fallbackUrl: HF_API_URL,
      bufferSize: imageBuffer.length,
      hasApiKey: !!HF_API_KEY
    });

    let response;
    let usedModel = 'crop-disease';

    // Try the specialized crop disease model first
    try {
      response = await fetch(HF_CROP_DISEASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
        },
        body: imageBuffer,
      });

      if (!response.ok && response.status === 503) {
        // Model is loading, wait and retry once
        console.log('Crop disease model is loading, waiting 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        response = await fetch(HF_CROP_DISEASE_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HF_API_KEY}`,
          },
          body: imageBuffer,
        });
      }
    } catch {
      console.log('Crop disease model failed, trying fallback...');
      response = null;
    }

    // If specialized model fails, try the general model
    if (!response || !response.ok) {
      console.log('Using fallback general classification model...');
      usedModel = 'general';
      
      response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
        },
        body: imageBuffer,
      });

      // If binary fails, try JSON format
      if (!response.ok) {
        console.log('Binary upload failed, trying JSON format...');
        response = await fetch(HF_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: imageData
          }),
        });
      }
    }

    if (!response || !response.ok) {
      const errorText = response ? await response.text() : 'No response received';
      console.error('Hugging Face API Error:', {
        status: response?.status,
        statusText: response?.statusText,
        error: errorText
      });
      
      // Handle model loading error (503 - model is loading)
      if (response?.status === 503) {
        throw new Error('Model is currently loading. Please wait a few moments and try again.');
      }
      
      throw new Error(`Hugging Face API error: ${response?.status} - ${errorText}`);
    }

    const predictions: HuggingFaceResponse[] = await response.json();
    
    if (!predictions || predictions.length === 0) {
      throw new Error('No predictions received from model');
    }

    console.log('Received predictions:', predictions.slice(0, 3)); // Log top 3 predictions

    // Get the top prediction
    const topPrediction = predictions[0];
    const confidence = Math.round(topPrediction.score * 100);
    const diseaseLabel = topPrediction.label.toLowerCase();

    // Find matching disease info with improved matching logic
    let diseaseKey = 'healthy';
    let matchScore = 0;

    // First try exact match
    if (diseaseInfo[diseaseLabel]) {
      diseaseKey = diseaseLabel;
      matchScore = 100;
    } else {
      // Try partial matching with scoring
      for (const key of Object.keys(diseaseInfo)) {
        let currentScore = 0;
        
        // Check if the disease label contains the key
        if (diseaseLabel.includes(key)) {
          currentScore = (key.length / diseaseLabel.length) * 100;
        }
        
        // Check individual words
        const labelWords = diseaseLabel.split(/[_\s-]+/);
        const keyWords = key.split(/[_\s-]+/);
        
        for (const labelWord of labelWords) {
          for (const keyWord of keyWords) {
            if (labelWord.includes(keyWord) || keyWord.includes(labelWord)) {
              currentScore += 20;
            }
          }
        }
        
        // Special scoring for common terms
        if (diseaseLabel.includes('blight') && key.includes('blight')) currentScore += 50;
        if (diseaseLabel.includes('spot') && key.includes('spot')) currentScore += 50;
        if (diseaseLabel.includes('rust') && key.includes('rust')) currentScore += 50;
        if (diseaseLabel.includes('mosaic') && key.includes('mosaic')) currentScore += 50;
        if (diseaseLabel.includes('bacterial') && key.includes('bacterial')) currentScore += 50;
        if (diseaseLabel.includes('healthy') && key.includes('healthy')) currentScore += 80;
        
        if (currentScore > matchScore) {
          matchScore = currentScore;
          diseaseKey = key;
          // bestMatch = key; // Removed unused variable
        }
      }
    }

    // If no good match found (score < 30), default to general categories
    if (matchScore < 30) {
      if (diseaseLabel.includes('blight')) {
        diseaseKey = 'blight';
      } else if (diseaseLabel.includes('spot')) {
        diseaseKey = 'spot';
      } else if (diseaseLabel.includes('rust')) {
        diseaseKey = 'rust';
      } else if (diseaseLabel.includes('mosaic') || diseaseLabel.includes('virus')) {
        diseaseKey = 'mosaic';
      } else if (diseaseLabel.includes('bacterial')) {
        diseaseKey = 'bacterial';
      } else if (diseaseLabel.includes('healthy') || confidence < 30) {
        diseaseKey = 'healthy';
      }
    }

    console.log('Disease matching:', {
      originalLabel: topPrediction.label,
      processedLabel: diseaseLabel,
      matchedKey: diseaseKey,
      matchScore,
      confidence
    });

    const info = diseaseInfo[diseaseKey];

    const result = {
      disease: topPrediction.label,
      confidence,
      severity: info.severity,
      treatment: info.treatment,
      prevention: info.prevention,
      modelUsed: usedModel,
      matchScore: matchScore,
      localizedTreatment: language === 'kn' ? getKannadaTreatment(diseaseKey) : undefined,
      allPredictions: predictions.slice(0, 5).map(p => ({
        disease: p.label,
        confidence: Math.round(p.score * 100)
      }))
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Crop diagnosis API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze crop image. Please check your API configuration and try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function getKannadaTreatment(diseaseKey: string): string[] {
  const kannadaTreatments: Record<string, string[]> = {
    'healthy': [
      'ಯಾವುದೇ ಚಿಕಿತ್ಸೆ ಬೇಕಾಗಿಲ್ಲ',
      'ನಿಯಮಿತ ಕಾಳಜಿಯನ್ನು ಮುಂದುವರಿಸಿ'
    ],
    'blight': [
      "ತಾಮ್ರದ ಆಧಾರಿತ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ತಕ್ಷಣವೇ ಅನ್ವಯಿಸಿ",
      "ಬಾಧಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದು ಸರಿಯಾಗಿ ವಿಲೇವಾರಿ ಮಾಡಿ",
      "ಸಸ್ಯಗಳ ಸುತ್ತಲೂ ಗಾಳಿ ಪ್ರಸರಣವನ್ನು ಸುಧಾರಿಸಿ",
      "ನೀರು ಹಾಕುವ ಆವರ್ತನವನ್ನು ಕಡಿಮೆ ಮಾಡಿ"
    ],
    'spot': [
      "ಸೂಕ್ತವಾದ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಅನ್ವಯಿಸಿ",
      "ಬಾಧಿತ ಸಸ್ಯದ ಭಾಗಗಳನ್ನು ತೆಗೆದುಹಾಕಿ",
      "ವಾತಾಯನವನ್ನು ಸುಧಾರಿಸಿ",
      "ನೀರು ಹಾಕುವ ವಿಧಾನಗಳನ್ನು ಹೊಂದಾಣಿಕೆ ಮಾಡಿ"
    ],
    'rust': [
      "ತುಕ್ಕು-ನಿರ್ದಿಷ್ಟ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಅನ್ವಯಿಸಿ",
      "ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ",
      "ಗಾಳಿ ಪ್ರಸರಣವನ್ನು ಹೆಚ್ಚಿಸಿ",
      "ಸಸ್ಯಗಳ ಸುತ್ತಲೂ ತೇವಾಂಶವನ್ನು ಕಡಿಮೆ ಮಾಡಿ"
    ],
    'mosaic': [
      "ಸೋಂಕಿತ ಸಸ್ಯಗಳನ್ನು ತಕ್ಷಣವೇ ತೆಗೆದುಹಾಕಿ",
      "ಗಿಡಹೇನು ವಾಹಕಗಳನ್ನು ನಿಯಂತ್ರಿಸಿ",
      "ವೈರಸ್-ಮುಕ್ತ ಬೀಜಗಳನ್ನು ಬಳಸಿ",
      "ಸಸ್ಯಗಳ ನಡುವೆ ಉಪಕರಣಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ"
    ]
  };

  return kannadaTreatments[diseaseKey] || kannadaTreatments['healthy'];
}

// Example implementation for actual Gemini Vision integration:
/*
import { VertexAI } from '@google-cloud/aiplatform';

export async function POST(request: NextRequest) {
  try {
    const { imageData, language = 'en' } = await request.json();

    const client = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT_ID,
      location: 'us-central1',
    });

    const model = client.preview.getGenerativeModel({
      model: 'gemini-pro-vision',
    });

    const prompt = `
      Analyze this crop image for diseases or pests. Provide:
      1. Disease/pest identification
      2. Confidence level (%)
      3. Severity assessment
      4. Treatment recommendations
      5. Prevention tips
      
      Please respond in ${language === 'kn' ? 'Kannada' : language === 'hi' ? 'Hindi' : 'English'}.
      Format as JSON with fields: disease, confidence, severity, treatment, prevention.
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data: imageData } }
          ]
        }
      ]
    });

    const response = result.response;
    const text = response.text();
    
    // Parse JSON response from Gemini
    const diagnosis = JSON.parse(text);
    
    return NextResponse.json(diagnosis);
  } catch (error) {
    console.error('Gemini Vision API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze crop image' },
      { status: 500 }
    );
  }
}
*/
