"use client";

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Globe, MessageCircle, Loader2, Pause } from 'lucide-react';

interface VoiceMessage {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  language: string;
  timestamp: Date;
  audioUrl?: string;
}

export default function VoiceInterface() {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
    { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startListening = async () => {
    setIsListening(true);
    setIsProcessing(true);

    try {
      // TODO: Implement actual speech-to-text with Google Speech API
      // For now, we'll simulate the voice recognition
      await new Promise(resolve => setTimeout(resolve, 3000));

      const simulatedText = selectedLanguage === 'kn' 
        ? 'ನನ್ನ ಟೊಮೇಟೊ ಗಿಡಗಳಲ್ಲಿ ಹಳದಿ ಎಲೆಗಳು ಕಾಣಿಸುತ್ತಿವೆ. ಇದು ಏನು ಸಮಸ್ಯೆ?'
        : selectedLanguage === 'hi'
        ? 'मेरे टमाटर के पौधों में पीले पत्ते दिख रहे हैं। यह क्या समस्या है?'
        : 'My tomato plants are showing yellow leaves. What could be the problem?';

      const userMessage: VoiceMessage = {
        id: Date.now().toString(),
        type: 'user',
        text: simulatedText,
        language: selectedLanguage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);

      // Simulate AI response
      setTimeout(async () => {
        const aiResponse = selectedLanguage === 'kn'
          ? 'ಹಳದಿ ಎಲೆಗಳು ಸಾಮಾನ್ಯವಾಗಿ ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ ಅಥವಾ ಅತಿಯಾದ ನೀರು ಕಾರಣವಾಗಿರಬಹುದು. ಮಣ್ಣಿನ ಒಳಚರಂಡಿ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಮತೋಲಿತ ಗೊಬ್ಬರ ಬಳಸಿ।'
          : selectedLanguage === 'hi'
          ? 'पीले पत्ते आमतौर पर पोषक तत्वों की कमी या अधिक पानी के कारण हो सकते हैं। मिट्टी की जल निकासी की जांच करें और संतुलित उर्वरक का उपयोग करें।'
          : 'Yellow leaves are commonly caused by nutrient deficiency or overwatering. Check soil drainage and use balanced fertilizer with proper nitrogen levels.';

        const assistantMessage: VoiceMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          text: aiResponse,
          language: selectedLanguage,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsProcessing(false);
      }, 2000);

    } catch (error) {
      console.error('Speech recognition failed:', error);
      setIsProcessing(false);
    } finally {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(false);
  };

  const playMessage = async (message: VoiceMessage) => {
    if (isPlaying && currentPlayingId === message.id) {
      setIsPlaying(false);
      setCurrentPlayingId(null);
      return;
    }

    try {
      // TODO: Implement actual text-to-speech with Google TTS API
      // For now, we'll simulate audio playback
      setIsPlaying(true);
      setCurrentPlayingId(message.id);
      
      // Simulate audio duration based on text length
      const duration = Math.max(2000, message.text.length * 50);
      
      setTimeout(() => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
      }, duration);

    } catch (error) {
      console.error('Text-to-speech failed:', error);
      setIsPlaying(false);
      setCurrentPlayingId(null);
    }
  };

  const getLanguageName = (code: string) => {
    return languages.find(lang => lang.code === code)?.name || 'English';
  };

  const quickQuestions = [
    {
      en: "What's the current tomato price?",
      kn: "ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು?",
      hi: "टमाटर की वर्तमान कीमत क्या है?"
    },
    {
      en: "How to treat fungal infection?",
      kn: "ಶಿಲೀಂಧ್ರ ಸೋಂಕಿನ ಚಿಕಿತ್ಸೆ ಹೇಗೆ?",
      hi: "फंगल संक्रमण का इलाज कैसे करें?"
    },
    {
      en: "Tell me about crop insurance",
      kn: "ಬೆಳೆ ವಿಮೆ ಬಗ್ಗೆ ಹೇಳಿ",
      hi: "फसल बीमा के बारे में बताएं"
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Voice Assistant
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Speak naturally in your preferred language and get instant AI-powered responses
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-white">Select Language</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  selectedLanguage === lang.code
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <div className="text-lg mb-1">{lang.flag}</div>
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Controls */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <div className="text-center">
            <div className="mb-4">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-green-500 hover:bg-green-600'
                } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
              >
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : isListening ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Ready to Listen'}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {isListening
                ? `Speak now in ${getLanguageName(selectedLanguage)}`
                : isProcessing
                ? 'Converting speech to text...'
                : `Tap the microphone to start speaking in ${getLanguageName(selectedLanguage)}`
              }
            </p>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            Quick Questions
          </h3>
          <div className="space-y-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  const text = question[selectedLanguage as keyof typeof question] || question.en;
                  const message: VoiceMessage = {
                    id: Date.now().toString(),
                    type: 'user',
                    text,
                    language: selectedLanguage,
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, message]);
                }}
                className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {question[selectedLanguage as keyof typeof question] || question.en}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white">Conversation</h3>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Start a conversation by speaking or selecting a quick question
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-sm">{message.text}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs opacity-75">
                            {getLanguageName(message.language)}
                          </span>
                          <button
                            onClick={() => playMessage(message)}
                            className="opacity-75 hover:opacity-100 transition-opacity"
                          >
                            {isPlaying && currentPlayingId === message.id ? (
                              <Pause className="w-3 h-3" />
                            ) : (
                              <Volume2 className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Voice Tips */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Voice Assistant Tips:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Speak clearly and at a normal pace</li>
            <li>• Ask about crop diseases, market prices, or government schemes</li>
            <li>• Use your natural dialect - the AI understands local variations</li>
            <li>• You can switch languages anytime during the conversation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
