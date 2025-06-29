import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Heart, 
  Sparkles,
  Pause,
  Play,
  RotateCcw,
  Settings
} from 'lucide-react';
import { MimiBlob } from './MimiBlob';

interface VoiceResponsiveMimiProps {
  isActive?: boolean;
  onToggle?: () => void;
  currentMood?: string;
  className?: string;
}

interface MimiResponse {
  text: string;
  emotion: 'happy' | 'excited' | 'calm' | 'curious' | 'creative';
  audioUrl?: string;
}

export const VoiceResponsiveMimi: React.FC<VoiceResponsiveMimiProps> = ({ 
  isActive = false, 
  onToggle,
  currentMood = 'happy',
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<MimiResponse | null>(null);
  const [volume, setVolume] = useState(70);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [lastHeardText, setLastHeardText] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{child: string, mimi: string}>>([]);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Gentle, neurodivergent-safe responses
  const mimiResponses = {
    greeting: [
      { text: "Hi there! I'm so happy to see you today! 💙", emotion: 'happy' as const },
      { text: "Hello, wonderful you! What's on your mind?", emotion: 'curious' as const },
      { text: "Hey friend! I've been waiting to create with you!", emotion: 'excited' as const }
    ],
    encouragement: [
      { text: "That's such a beautiful thought! Tell me more.", emotion: 'happy' as const },
      { text: "I love how your mind works! Keep going.", emotion: 'excited' as const },
      { text: "You're doing amazing. There's no rush at all.", emotion: 'calm' as const },
      { text: "What a creative idea! I'm so curious about it.", emotion: 'curious' as const }
    ],
    emotional_support: [
      { text: "It's okay to feel however you're feeling. I'm here with you.", emotion: 'calm' as const },
      { text: "You're safe here. We can take our time.", emotion: 'calm' as const },
      { text: "Every feeling is welcome here. You're doing great.", emotion: 'happy' as const },
      { text: "I see you, and you matter so much.", emotion: 'happy' as const }
    ],
    creative_prompts: [
      { text: "What if we drew how that feeling looks?", emotion: 'creative' as const },
      { text: "Would you like to tell a story about that?", emotion: 'curious' as const },
      { text: "I wonder what colors that reminds you of?", emotion: 'creative' as const },
      { text: "That sounds like it could be a magical adventure!", emotion: 'excited' as const }
    ],
    processing: [
      { text: "Hmm, let me think about that...", emotion: 'curious' as const },
      { text: "That's interesting! Give me a moment...", emotion: 'curious' as const },
      { text: "I'm listening carefully...", emotion: 'calm' as const }
    ],
    clarification: [
      { text: "I didn't quite catch that. Could you say it again? No worries!", emotion: 'happy' as const },
      { text: "I want to make sure I understand. Can you tell me more?", emotion: 'curious' as const },
      { text: "Sometimes I need a little help hearing. Try again when you're ready!", emotion: 'calm' as const }
    ]
  };

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition setup
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setLastHeardText(transcript);
          handleChildSpeech(transcript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.log('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error !== 'no-speech') {
            respondToChild(getRandomResponse('clarification'));
          }
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      // Speech Synthesis setup
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const getRandomResponse = (category: keyof typeof mimiResponses): MimiResponse => {
    const responses = mimiResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const analyzeChildSpeech = (text: string): keyof typeof mimiResponses => {
    const lowerText = text.toLowerCase();
    
    // Emotional keywords
    const sadWords = ['sad', 'upset', 'angry', 'mad', 'frustrated', 'worried', 'scared', 'nervous'];
    const happyWords = ['happy', 'excited', 'good', 'great', 'awesome', 'fun', 'love'];
    const creativeWords = ['draw', 'paint', 'story', 'create', 'make', 'imagine', 'pretend'];
    const greetingWords = ['hi', 'hello', 'hey', 'mimi'];
    
    if (greetingWords.some(word => lowerText.includes(word)) && conversationHistory.length === 0) {
      return 'greeting';
    }
    
    if (sadWords.some(word => lowerText.includes(word))) {
      return 'emotional_support';
    }
    
    if (creativeWords.some(word => lowerText.includes(word))) {
      return 'creative_prompts';
    }
    
    if (happyWords.some(word => lowerText.includes(word))) {
      return 'encouragement';
    }
    
    // Default to encouragement for most interactions
    return 'encouragement';
  };

  const handleChildSpeech = (transcript: string) => {
    setIsProcessing(true);
    
    // Simulate processing time for a more natural feel
    setTimeout(() => {
      const responseCategory = analyzeChildSpeech(transcript);
      const response = getRandomResponse(responseCategory);
      
      // Add to conversation history
      setConversationHistory(prev => [...prev, { child: transcript, mimi: response.text }]);
      
      respondToChild(response);
      setIsProcessing(false);
    }, 800 + Math.random() * 1200); // 0.8-2 second processing time
  };

  const respondToChild = (response: MimiResponse) => {
    setCurrentResponse(response);
    
    if (voiceEnabled && synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(response.text);
      
      // Configure voice for child-friendly speech
      utterance.rate = 0.8; // Slightly slower
      utterance.pitch = 1.1; // Slightly higher pitch
      utterance.volume = volume / 100;
      
      // Try to use a female voice if available
      const voices = synthRef.current.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen')
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.log('Error starting recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isActive) {
    return (
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 z-40 ${className}`}
      >
        <Mic className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      {/* Main Mimi Interface */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MimiBlob 
              size="md" 
              emotion={currentResponse?.emotion || 'happy'} 
              animated={isListening || isProcessing || isSpeaking}
              showSparkles={isListening}
            />
            <div>
              <h3 className="font-bold text-gray-800 font-handwritten">Mimi</h3>
              <div className="flex items-center space-x-2">
                {isListening && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-handwritten">Listening...</span>
                  </div>
                )}
                {isProcessing && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-600 font-handwritten">Thinking...</span>
                  </div>
                )}
                {isSpeaking && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-purple-600 font-handwritten">Speaking...</span>
                  </div>
                )}
                {!isListening && !isProcessing && !isSpeaking && (
                  <span className="text-xs text-gray-500 font-handwritten">Ready to chat!</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Current Response */}
        {currentResponse && (
          <div className="mb-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl">
            <p className="text-gray-700 font-handwritten leading-relaxed">
              {currentResponse.text}
            </p>
          </div>
        )}

        {/* Last Heard */}
        {lastHeardText && (
          <div className="mb-4 p-3 bg-gray-50 rounded-2xl">
            <p className="text-xs text-gray-500 font-handwritten mb-1">You said:</p>
            <p className="text-gray-700 font-handwritten text-sm">"{lastHeardText}"</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Microphone Button */}
            <button
              onClick={handleMicToggle}
              disabled={isProcessing}
              className={`p-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Stop Speaking Button */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
              >
                <Pause className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Volume Control */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                voiceEnabled ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Clear Conversation */}
            <button
              onClick={() => {
                setConversationHistory([]);
                setCurrentResponse(null);
                setLastHeardText('');
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Volume Slider */}
        {voiceEnabled && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <VolumeX className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <Volume2 className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 font-handwritten w-8">
                {volume}%
              </span>
            </div>
          </div>
        )}

        {/* Helpful Tips */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 font-handwritten space-y-1">
            <p>💡 Try saying: "Hi Mimi", "I want to draw", or "I feel happy"</p>
            <p>🎯 Speak clearly and take your time - I'm a good listener!</p>
          </div>
        </div>
      </div>

      {/* Floating Conversation Bubbles */}
      {conversationHistory.length > 0 && (
        <div className="absolute bottom-full right-0 mb-4 max-w-xs space-y-2 max-h-64 overflow-y-auto">
          {conversationHistory.slice(-3).map((exchange, index) => (
            <div key={index} className="space-y-2">
              {/* Child's message */}
              <div className="bg-blue-100 text-blue-800 p-3 rounded-2xl rounded-br-sm text-sm font-handwritten">
                {exchange.child}
              </div>
              {/* Mimi's response */}
              <div className="bg-teal-100 text-teal-800 p-3 rounded-2xl rounded-bl-sm text-sm font-handwritten">
                {exchange.mimi}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceResponsiveMimi;