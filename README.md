#Agrosaathi - AI-Powered Farming Assistant 🌾

**Your personal agronomist, market analyst, and government scheme navigator - all in your pocket, speaking your language.**

## 🚀 Overview

AgriSaarthi is a comprehensive AI-powered farming assistant built specifically for Indian farmers. It combines the power of Google AI technologies to provide instant crop disease diagnosis, real-time market analysis, government scheme navigation, and voice-first interaction in local languages.

### 🎯 Core Features

1. **🔬 AI Crop Doctor**: Instant AI-powered plant disease identification using Gemini Vision
2. **📈 Smart Market Intelligence**: Real-time market trends and selling recommendations  
3. **🏛️ Government Scheme Helper**: Simplified access to agricultural subsidies and schemes
4. **🎤 Voice Assistant**: Complete voice interaction in 22+ Indian languages

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **AI Services**: Google Vertex AI, Gemini Pro, Gemini Vision
- **Cloud Platform**: Firebase (Auth, Firestore, Functions, Hosting)
- **Speech Services**: Google Speech-to-Text, Text-to-Speech APIs
- **Mobile-First**: Responsive design optimized for smartphones

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Google Cloud Platform account
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd agri-saarthi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   
   # Google Cloud Configuration
   GOOGLE_CLOUD_PROJECT_ID=your_project_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Google Cloud Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the following APIs:
     - Vertex AI API
     - Speech-to-Text API
     - Text-to-Speech API
     - Cloud Storage API

2. **Create Service Account**
   ```bash
   gcloud iam service-accounts create agri-saarthi-service
   gcloud projects add-iam-policy-binding PROJECT_ID \
     --member="serviceAccount:agri-saarthi-service@PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"
   ```

3. **Download Service Account Key**
   - Go to IAM & Admin > Service Accounts
   - Create key for your service account
   - Download JSON file and set path in `GOOGLE_APPLICATION_CREDENTIALS`

### Firebase Setup

1. **Create Firebase Project**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   ```

2. **Configure Firebase Services**
   - Authentication: Enable Email/Password and Google Sign-in
   - Firestore: Set up database rules
   - Storage: Configure for image uploads
   - Hosting: Enable for web deployment

## 📱 Features Deep Dive

### 🔬 AI Crop Doctor

- **Upload or capture** plant images
- **AI-powered analysis** using Gemini Vision
- **Instant diagnosis** with confidence scores
- **Treatment recommendations** in local language
- **Prevention tips** for future crops

### 📈 Smart Market Intelligence

- **Real-time price data** from major mandis across India
- **Price trend analysis** with AI insights
- **Best market recommendations** for selling
- **Historical price charts** for decision making
- **Multi-commodity support** (rice, wheat, sugarcane, cotton, etc.)

### 🏛️ Government Scheme Helper

- **Comprehensive scheme database** with latest updates
- **Eligibility checker** based on farmer profile
- **Document requirement** lists
- **Direct application links** to government portals
- **Multilingual scheme descriptions**

### 🎤 Voice Assistant

- **Speech-to-Text** in 22+ Indian languages
- **Natural language processing** for farming queries
- **Text-to-Speech** responses in local dialects
- **Quick question** templates for common queries
- **Conversation history** for reference

## 🌐 Deployment

### Firebase Hosting

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   npm run deploy
   ```

### Environment Variables for Production

Ensure all environment variables are set in your production environment:

```env
# Firebase (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Google Cloud (from GCP Console)
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_APPLICATION_CREDENTIALS=
GEMINI_API_KEY=

# Market Data API (optional)
MARKET_API_URL=
MARKET_API_KEY=
```

## 🗣️ Language Support

AgriSaarthi supports **22+ Indian languages** to ensure every farmer can use the app in their native language:

- **Hindi (हिन्दी)** - National language
- **English** - Primary development language  
- **Tamil (தமிழ்)** - Tamil Nadu
- **Telugu (తెలుగు)** - Andhra Pradesh/Telangana
- **Bengali (বাংলা)** - West Bengal/Bangladesh
- **Gujarati (ગુજરાતી)** - Gujarat
- **Marathi (मराठी)** - Maharashtra
- **Kannada (ಕನ್ನಡ)** - Karnataka
- **Malayalam (മലയാളം)** - Kerala
- **Punjabi (ਪੰਜਾਬੀ)** - Punjab
- **Odia (ଓଡ଼ିଆ)** - Odisha
- **Assamese (অসমীয়া)** - Assam
- **Urdu (اردو)** - Multiple states
- **Nepali (नेपाली)** - West Bengal hills
- **Konkani (कोंकणी)** - Goa
- **Manipuri (মণিপুরী)** - Manipur
- **Bodo (बर')** - Assam
- **Santhali (ᱥᱟᱱᱛᱟᱲᱤ)** - Jharkhand
- **Maithili (मैथिली)** - Bihar
- **Dogri (डोगरी)** - Jammu & Kashmir
- **Kashmiri (کٲشُر)** - Jammu & Kashmir
- **Sindhi (سنڌي)** - Multiple states

*And many more regional dialects and languages coming soon!*

## 🤝 Contributing

We welcome contributions toAgrosaathi! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Ensure mobile-first responsive design
- Add proper error handling for AI APIs
- Include proper loading states
- Follow accessibility guidelines

## 📊 API Documentation

### Crop Diagnosis API

```typescript
POST /api/crop-diagnosis
{
  "imageData": "base64_encoded_image",
  "language": "hi" // en, hi, ta, te, bn, gu, mr, etc.
}
```

### Market Analysis API

```typescript
GET /api/market-analysis?commodity=rice&market=delhi&language=hi
```

### Speech APIs

```typescript
POST /api/speech-to-text
{
  "audioData": "base64_encoded_audio",
  "language": "hi"
}

POST /api/text-to-speech
{
  "text": "आपकी फसल स्वस्थ है",
  "language": "hi"
}
```

## 🔒 Security & Privacy

- **Data Encryption**: All API communications are encrypted
- **Privacy First**: No personal farming data is stored without consent
- **Local Processing**: Image analysis can work offline when possible
- **Secure Authentication**: Firebase Auth with proper security rules

## 📈 Roadmap

- [ ] **Offline Mode**: Core features available without internet
- [ ] **Weather Integration**: Weather-based crop recommendations
- [ ] **Pest Alerts**: Community-based pest outbreak warnings
- [ ] **Yield Prediction**: AI-powered harvest forecasting
- [ ] **Farm Management**: Complete farm record keeping
- [ ] **Marketplace**: Direct farmer-to-consumer platform

## 🆘 Support

For support, email support@agrisaarthi.com or join our community:

- **Telegram**: [AgriSaarthi Community](https://t.me/agrisaarthi)
- **WhatsApp**: +91-XXXX-XXXXXX (Farmer Support)
- **Website**: [www.agrisaarthi.com](https://agrisaarthi.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Cloud AI** for providing powerful AI APIs
- **Firebase** for comprehensive backend services
- **Indian Farmers** for inspiration and feedback
- **Open Source Community** for amazing tools and libraries

---

**Built with ❤️ for Indian Farmers**

*AgriSaarthi - Empowering Agriculture through AI*
