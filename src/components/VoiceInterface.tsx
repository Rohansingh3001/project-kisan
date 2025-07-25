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
      // Get audio from user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      let audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        audioChunks.push(event.data);
      };

      const stopped = new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => resolve();
      });

      mediaRecorder.start();

      // Listen for 4 seconds or until user stops
      await new Promise(resolve => setTimeout(resolve, 4000));
      mediaRecorder.stop();
      await stopped;
      stream.getTracks().forEach(track => track.stop());

      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioBase64 = await blobToBase64(audioBlob);

      // Send audio to speech-to-text API
      const sttRes = await fetch('/api/speech-to-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioData: audioBase64, language: selectedLanguage })
      });
      const sttData = await sttRes.json();
      if (!sttData.transcript) throw new Error('No transcript');

      // Add user message to conversation and get full conversation for context
      const newUserMessage: VoiceMessage = {
        id: Date.now().toString(),
        type: 'user',
        text: sttData.transcript,
        language: selectedLanguage,
        timestamp: new Date()
      };
      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);

      // Prepare conversation for Groq API (send all messages for context)
      const groqMessages = [
        { role: 'system', content: 'You are a helpful agricultural assistant for Indian farmers.' },
        ...updatedMessages.map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      ];

      setIsProcessing(true);
      const aiRes = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: groqMessages, language: selectedLanguage })
      });
      const aiData = await aiRes.json();
      const aiText = aiData.text || 'Sorry, I could not find an answer.';

      const assistantMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: aiText,
        language: selectedLanguage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    } catch (error) {
      console.error('Speech recognition failed:', error);
      setIsProcessing(false);
    } finally {
      setIsListening(false);
    }
  };

  // Helper to convert Blob to base64
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(false);
  };

  // Browser-based TTS (like FullChat)
  const playMessage = async (message: VoiceMessage) => {
    if (isPlaying && currentPlayingId === message.id) {
      setIsPlaying(false);
      setCurrentPlayingId(null);
      window.speechSynthesis.cancel();
      return;
    }
    try {
      setIsPlaying(true);
      setCurrentPlayingId(message.id);
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(message.text);
      // Use language code for best match
      utterance.lang = message.language === 'kn' ? 'kn-IN' : message.language === 'hi' ? 'hi-IN' : message.language === 'te' ? 'te-IN' : message.language === 'ta' ? 'ta-IN' : 'en-IN';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      // Try to use a matching voice
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(v => v.lang.toLowerCase() === utterance.lang.toLowerCase());
      if (match) utterance.voice = match;
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
      };
      window.speechSynthesis.speak(utterance);
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
    <div className="p-6 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight drop-shadow-sm">
            <span className="inline-flex items-center gap-2">
              <Mic className="w-8 h-8 text-green-600 dark:text-green-400 animate-pulse" />
              Voice Assistant
            </span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Speak naturally in your preferred language and get instant AI-powered responses for farming, prices, and more.
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-6 h-6 text-blue-500" />
            <span className="font-semibold text-gray-900 dark:text-white text-lg">Select Language</span>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl text-base font-semibold shadow-sm border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/60
                  ${selectedLanguage === lang.code
                    ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-400'}
                `}
                style={{ minWidth: 110 }}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Controls */}
        <div className="bg-gradient-to-br from-green-100/60 via-white/80 to-blue-100/60 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 border border-green-200 dark:border-green-900 rounded-2xl p-8 mb-8 shadow-md">
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 border-4 border-white dark:border-gray-950 shadow-xl focus:outline-none
                ${isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-300/40'
                  : 'bg-green-500 hover:bg-green-600 ring-4 ring-green-300/40'}
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isProcessing ? (
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              ) : isListening ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </button>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Ready to Listen'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base">
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
        <div className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-lg">
            <MessageCircle className="w-5 h-5 text-green-500" />
            Quick Questions
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
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
                className="px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/30 border border-gray-200 dark:border-gray-700 text-base font-medium text-gray-800 dark:text-gray-100 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-400/60"
                style={{ minWidth: 220 }}
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  {question[selectedLanguage as keyof typeof question] || question.en}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Conversation</h3>
          </div>
          <div className="h-96 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                  <Mic className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-base">
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
                    className={`relative max-w-xs md:max-w-md px-5 py-3 rounded-2xl shadow-md transition-all
                      ${message.type === 'user'
                        ? 'bg-gradient-to-br from-green-500 via-green-400 to-green-600 text-white rounded-tr-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-md'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-base leading-relaxed">{message.text}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs opacity-80 font-medium">
                            {getLanguageName(message.language)}
                          </span>
                          <button
                            onClick={() => playMessage(message)}
                            className="opacity-80 hover:opacity-100 transition-opacity p-1 rounded-full bg-white/70 dark:bg-gray-700/70 shadow"
                            title="Play message"
                          >
                            {isPlaying && currentPlayingId === message.id ? (
                              <Pause className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <span className="absolute -bottom-3 right-4 text-xs text-gray-400 dark:text-gray-500 select-none">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Voice Tips */}
        <div className="mt-8 bg-blue-50/80 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-sm">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 text-lg flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-blue-500" />
            Voice Assistant Tips
          </h4>
          <ul className="text-base text-blue-800 dark:text-blue-200 space-y-1 pl-4 list-disc">
            <li>Speak clearly and at a normal pace</li>
            <li>Ask about crop diseases, market prices, or government schemes</li>
            <li>Use your natural dialect - the AI understands local variations</li>
            <li>You can switch languages anytime during the conversation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
