import React, { useState, useEffect } from 'react';
import { Palette, Heart, Users, Brain, Sparkles, BookOpen, Shield, ArrowRight, Star, Lightbulb, Target, Zap, Globe, ChevronRight, Play, Pause, Volume2, Smile, Sun, Cloud, Zap as Lightning, Settings, FileText, UserCheck, Wand2, Edit3, Save, RotateCcw, Plus, Pin, Mouse as Museum } from 'lucide-react';
import { MimiBlob } from './components/MimiBlob';
import { CreativeStudio } from './components/CreativeStudio';
import { MimiNotesJournal } from './components/MimiNotesJournal';
import { ParentTherapistPortal } from './components/ParentTherapistPortal';
import { VoiceResponsiveMimi } from './components/VoiceResponsiveMimi';
import { MuseumWall } from './components/MuseumWall';

type AppView = 'home' | 'studio' | 'journal' | 'portal' | 'museum';

interface CustomButton {
  id: string;
  childDrawing?: string;
  childName?: string;
  isCustomized: boolean;
}

interface NewMuseumItem {
  title: string;
  type: 'drawing' | 'story' | 'sensory';
  thumbnail: string;
  mood: string;
  tags: string[];
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [mimiEmotion, setMimiEmotion] = useState<'happy' | 'excited' | 'calm' | 'curious' | 'creative'>('happy');
  const [newMuseumItem, setNewMuseumItem] = useState<NewMuseumItem | null>(null);
  
  // New customization state
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [customButtons, setCustomButtons] = useState<Record<string, CustomButton>>({
    create: { id: 'create', isCustomized: false },
    journal: { id: 'journal', isCustomized: false },
    portal: { id: 'portal', isCustomized: false },
    museum: { id: 'museum', isCustomized: false }
  });
  const [showDrawingPad, setShowDrawingPad] = useState(false);
  const [selectedButtonForCustomization, setSelectedButtonForCustomization] = useState<string | null>(null);
  const [currentDrawingName, setCurrentDrawingName] = useState('');

  // Voice Mimi state
  const [isVoiceMimiActive, setIsVoiceMimiActive] = useState(false);

  const moodOptions = [
    { id: 'happy', emoji: '😊', color: 'bg-yellow-200 hover:bg-yellow-300', label: 'Happy', mimiEmotion: 'happy' as const },
    { id: 'excited', emoji: '🤩', color: 'bg-orange-200 hover:bg-orange-300', label: 'Excited', mimiEmotion: 'excited' as const },
    { id: 'calm', emoji: '😌', color: 'bg-blue-200 hover:bg-blue-300', label: 'Calm', mimiEmotion: 'calm' as const },
    { id: 'curious', emoji: '🤔', color: 'bg-purple-200 hover:bg-purple-300', label: 'Curious', mimiEmotion: 'curious' as const },
    { id: 'creative', emoji: '🎨', color: 'bg-pink-200 hover:bg-pink-300', label: 'Creative', mimiEmotion: 'creative' as const },
    { id: 'quiet', emoji: '🤫', color: 'bg-green-200 hover:bg-green-300', label: 'Quiet', mimiEmotion: 'calm' as const }
  ];

  const handleMoodSelect = (mood: typeof moodOptions[0]) => {
    setSelectedMood(mood.id);
    setMimiEmotion(mood.mimiEmotion);
  };

  const handleStartCreating = () => {
    setCurrentView('studio');
  };

  const handleViewJournal = () => {
    setCurrentView('journal');
  };

  const handleViewPortal = () => {
    setCurrentView('portal');
  };

  const handleViewMuseum = () => {
    setCurrentView('museum');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setNewMuseumItem(null); // Clear any pending museum items
  };

  // Handle creation completion from studio
  const handleCreationComplete = (creation: NewMuseumItem) => {
    setNewMuseumItem(creation);
    setCurrentView('museum');
  };

  // Customization functions
  const handleCustomizeButton = (buttonId: string) => {
    setSelectedButtonForCustomization(buttonId);
    setShowDrawingPad(true);
  };

  const handleSaveCustomization = (drawing: string, name: string) => {
    if (selectedButtonForCustomization) {
      setCustomButtons(prev => ({
        ...prev,
        [selectedButtonForCustomization]: {
          ...prev[selectedButtonForCustomization],
          childDrawing: drawing,
          childName: name,
          isCustomized: true
        }
      }));
      setShowDrawingPad(false);
      setSelectedButtonForCustomization(null);
      setCurrentDrawingName('');
    }
  };

  const handleResetButton = (buttonId: string) => {
    setCustomButtons(prev => ({
      ...prev,
      [buttonId]: {
        ...prev[buttonId],
        childDrawing: undefined,
        childName: undefined,
        isCustomized: false
      }
    }));
  };

  // Render customizable button wrapper
  const renderCustomizableButton = (
    buttonId: string,
    children: React.ReactNode,
    onClick: () => void,
    className: string = ''
  ) => {
    const customButton = customButtons[buttonId];
    
    if (customButton?.isCustomized && customButton.childDrawing) {
      return (
        <div className="relative group">
          <button
            onClick={isCustomizeMode ? () => handleCustomizeButton(buttonId) : onClick}
            className={`relative ${className} ${isCustomizeMode ? 'ring-4 ring-dashed ring-teal-300' : ''}`}
          >
            {/* Custom Drawing Display */}
            <div className="bg-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-1">🎨</div>
                  <div className="text-xs text-gray-600 font-handwritten">
                    {customButton.childName?.slice(0, 8)}
                  </div>
                </div>
              </div>
            </div>
          </button>
          
          {/* Customize Mode Controls */}
          {isCustomizeMode && (
            <div className="absolute -top-2 -right-2 flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCustomizeButton(buttonId);
                }}
                className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetButton(buttonId);
                }}
                className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative group">
        <button
          onClick={isCustomizeMode ? () => handleCustomizeButton(buttonId) : onClick}
          className={`${className} ${isCustomizeMode ? 'ring-4 ring-dashed ring-yellow-300' : ''} relative`}
        >
          {children}
        </button>
        
        {/* Customize Mode Add Button */}
        {isCustomizeMode && (
          <div className="absolute -top-2 -right-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCustomizeButton(buttonId);
              }}
              className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* "Draw me!" hint */}
        {isCustomizeMode && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-handwritten shadow-md animate-pulse">
              Draw me! ✨
            </div>
          </div>
        )}
      </div>
    );
  };

  // Drawing pad modal
  const renderDrawingPad = () => {
    if (!showDrawingPad) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <MimiBlob size="md" emotion="excited" animated={true} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 font-handwritten">
                    Draw Your Button!
                  </h2>
                  <p className="text-gray-600 font-handwritten">
                    Make this button uniquely yours!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDrawingPad(false)}
                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Simple Drawing Area */}
            <div className="mb-6">
              <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-4 border-dashed border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Palette className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-handwritten">
                    Draw your button design here!
                  </p>
                  <p className="text-sm text-gray-400 font-handwritten mt-2">
                    (Full drawing pad coming soon)
                  </p>
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-handwritten">
                What should we call your creation?
              </label>
              <input
                type="text"
                placeholder="My Rocket Ship, Magic Notebook, etc."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-teal-400 focus:outline-none font-handwritten"
                value={currentDrawingName}
                onChange={(e) => setCurrentDrawingName(e.target.value)}
              />
            </div>

            {/* Quick Templates */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 font-handwritten">
                Or pick a quick doodle:
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { emoji: '🚀', name: 'Rocket Ship' },
                  { emoji: '🦄', name: 'Unicorn' },
                  { emoji: '🌟', name: 'Magic Star' },
                  { emoji: '🎨', name: 'Paint Brush' },
                  { emoji: '📚', name: 'Story Book' },
                  { emoji: '🌈', name: 'Rainbow' },
                  { emoji: '🦋', name: 'Butterfly' },
                  { emoji: '🏛️', name: 'My Museum' }
                ].map((template) => (
                  <button
                    key={template.name}
                    onClick={() => setCurrentDrawingName(template.name)}
                    className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl hover:shadow-md transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    <div className="text-2xl mb-1">{template.emoji}</div>
                    <div className="text-xs text-gray-600 font-handwritten">
                      {template.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => handleSaveCustomization('drawing-data', currentDrawingName)}
                disabled={!currentDrawingName.trim()}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-handwritten"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Save className="w-5 h-5" />
                  <span>Make it My Button!</span>
                </div>
              </button>
              <button
                onClick={() => setShowDrawingPad(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors font-handwritten"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (currentView === 'studio') {
    return (
      <>
        <CreativeStudio 
          selectedMood={selectedMood} 
          onBack={handleBackToHome}
          onCreationComplete={handleCreationComplete}
        />
        <VoiceResponsiveMimi 
          isActive={isVoiceMimiActive}
          onToggle={() => setIsVoiceMimiActive(!isVoiceMimiActive)}
          currentMood={selectedMood || 'happy'}
        />
      </>
    );
  }

  if (currentView === 'journal') {
    return (
      <>
        <MimiNotesJournal onBack={handleBackToHome} />
        <VoiceResponsiveMimi 
          isActive={isVoiceMimiActive}
          onToggle={() => setIsVoiceMimiActive(!isVoiceMimiActive)}
          currentMood={selectedMood || 'happy'}
        />
      </>
    );
  }

  if (currentView === 'portal') {
    return <ParentTherapistPortal onBack={handleBackToHome} userRole="parent" />;
  }

  if (currentView === 'museum') {
    return (
      <>
        <MuseumWall onBack={handleBackToHome} newItem={newMuseumItem} />
        <VoiceResponsiveMimi 
          isActive={isVoiceMimiActive}
          onToggle={() => setIsVoiceMimiActive(!isVoiceMimiActive)}
          currentMood={selectedMood || 'happy'}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Gentle Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <MimiBlob size="sm" emotion="happy" animated={false} />
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent font-handwritten">
                Muse-AI-um
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={handleViewJournal}
                className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium font-handwritten"
              >
                <FileText className="w-4 h-4" />
                <span>My Journal</span>
              </button>
              <button 
                onClick={handleViewMuseum}
                className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium font-handwritten"
              >
                <Museum className="w-4 h-4" />
                <span>My Museum</span>
              </button>
              <button 
                onClick={handleViewPortal}
                className="text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium font-handwritten"
              >
                For Parents & Teachers
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              
              {/* NEW: Customize Mode Toggle */}
              <button
                onClick={() => setIsCustomizeMode(!isCustomizeMode)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 transform hover:scale-105 font-handwritten ${
                  isCustomizeMode 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                {isCustomizeMode ? (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Done Decorating</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Decorate</span>
                  </>
                )}
              </button>
              
              <button 
                onClick={handleViewPortal}
                className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <UserCheck className="w-4 h-4" />
                <span className="text-sm font-handwritten">Professional Portal</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - The Emotional Invitation */}
      <section className="relative overflow-hidden py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Main Tagline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-800 leading-tight font-handwritten">
                {isCustomizeMode ? (
                  <>
                    Make it
                    <span className="block bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                      yours!
                    </span>
                  </>
                ) : (
                  <>
                    No wrong way
                    <span className="block bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                      to wonder
                    </span>
                  </>
                )}
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-handwritten">
                {isCustomizeMode ? (
                  "Click on any button to draw your own version! Make this space feel like home. ✨"
                ) : (
                  "Hi there! I'm Mimi, your creative friend. Let's make something amazing together!"
                )}
              </p>
            </div>

            {/* Mimi Introduction */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-2xl mx-auto relative">
                <div className="flex flex-col items-center space-y-6">
                  <MimiBlob 
                    size="xl" 
                    emotion={mimiEmotion} 
                    animated={true} 
                    showSparkles={true}
                  />
                  
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold text-gray-800 font-handwritten">
                      Meet Mimi!
                    </h2>
                    <p className="text-gray-600 leading-relaxed font-handwritten">
                      I'm here to help you create, explore, and express yourself in your own special way. 
                      There's no right or wrong - just you being wonderfully you!
                    </p>
                    
                    {/* Voice Interaction Hint */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                      <p className="text-sm text-purple-700 font-handwritten">
                        💬 Try talking to me! Click the microphone button to start a conversation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mood Check-in */}
            {!isCustomizeMode && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg max-w-4xl mx-auto">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 font-handwritten">
                      How are you feeling today?
                    </h3>
                    <p className="text-gray-600 font-handwritten">
                      Pick what feels right - I'll help make our time together perfect for you!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.id}
                        onClick={() => handleMoodSelect(mood)}
                        className={`
                          ${mood.color} 
                          ${selectedMood === mood.id ? 'ring-4 ring-teal-400 scale-105' : 'hover:scale-105'}
                          p-4 rounded-2xl transition-all duration-300 transform
                          flex flex-col items-center space-y-2 shadow-md
                        `}
                      >
                        <span className="text-3xl">{mood.emoji}</span>
                        <span className="text-sm font-medium text-gray-700 font-handwritten">
                          {mood.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {selectedMood && (
                    <div className="text-center p-4 bg-teal-50 rounded-2xl">
                      <p className="text-teal-700 font-handwritten">
                        Perfect! I can see you're feeling {moodOptions.find(m => m.id === selectedMood)?.label.toLowerCase()}. 
                        Let's create something that matches your mood! ✨
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons - Now Customizable! */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center flex-wrap">
              {renderCustomizableButton(
                'create',
                <>
                  <Sparkles className="w-6 h-6 group-hover:animate-spin" />
                  <span>Start Creating!</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>,
                handleStartCreating,
                "group bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 font-handwritten"
              )}
              
              {renderCustomizableButton(
                'journal',
                <>
                  <FileText className="w-6 h-6" />
                  <span>My Memory Journal</span>
                </>,
                handleViewJournal,
                "group border-3 border-purple-300 text-purple-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-all duration-300 flex items-center space-x-3 font-handwritten"
              )}

              {renderCustomizableButton(
                'museum',
                <>
                  <Pin className="w-6 h-6" />
                  <span>My Museum Wall</span>
                </>,
                handleViewMuseum,
                "group border-3 border-pink-300 text-pink-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-50 transition-all duration-300 flex items-center space-x-3 font-handwritten"
              )}
              
              <button className="group border-3 border-teal-300 text-teal-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-50 transition-all duration-300 flex items-center space-x-3 font-handwritten">
                <Play className="w-6 h-6" />
                <span>Meet Mimi First</span>
              </button>
            </div>

            {/* Customization Hint */}
            {isCustomizeMode && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-6 shadow-lg max-w-lg mx-auto">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-xl font-bold text-gray-800 font-handwritten">
                    Decoration Mode!
                  </h3>
                </div>
                <p className="text-gray-700 font-handwritten mb-4">
                  Click the yellow + buttons to draw your own versions! 
                  Turn the "Create" button into your rocket ship, the "Journal" into your magic notebook, or the "Museum" into your castle!
                </p>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="flex justify-center items-center space-x-8 pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-sm font-medium text-gray-700 font-handwritten">Safe & Private</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-sm font-medium text-gray-700 font-handwritten">No Judgment</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-sm font-medium text-gray-700 font-handwritten">Just for You</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes This Special */}
      <section className="py-16 bg-white/50 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 font-handwritten">
              What makes Mimi special?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-handwritten">
              I understand that every mind works differently, and that's what makes you amazing!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 font-handwritten">Create Your Way</h3>
              <p className="text-gray-600 text-sm font-handwritten">
                Draw, write, or make collages - whatever feels right for you today!
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 font-handwritten">Feelings First</h3>
              <p className="text-gray-600 text-sm font-handwritten">
                I check in with how you're feeling and adapt to help you feel your best.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 font-handwritten">Your Unique Mind</h3>
              <p className="text-gray-600 text-sm font-handwritten">
                I celebrate how your brain works - there's no "normal" way to think!
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Pin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 font-handwritten">Museum Curator</h3>
              <p className="text-gray-600 text-sm font-handwritten">
                Pin your creations to your personal museum with voice labels!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Parent/Therapist Section */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-handwritten">
              For Parents, Teachers & Therapists
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed font-handwritten">
              Muse-AI-um provides a safe, therapeutic space for neurodivergent children to explore creativity. 
              Built with input from special education experts and designed with privacy and dignity at its core.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleViewPortal}
                className="bg-gray-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors font-handwritten"
              >
                Access Professional Portal
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors font-handwritten">
                Safety & Privacy Info
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-8 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <MimiBlob size="sm" emotion="happy" animated={false} />
            <span className="text-xl font-bold font-handwritten">Muse-AI-um</span>
          </div>
          <p className="text-teal-100 mb-4 font-handwritten">
            Where every child's creativity can flourish with their AI friend Mimi
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="text-teal-100 hover:text-white transition-colors font-handwritten">Privacy</a>
            <a href="#" className="text-teal-100 hover:text-white transition-colors font-handwritten">Safety</a>
            <a href="#" className="text-teal-100 hover:text-white transition-colors font-handwritten">Support</a>
            <a href="#" className="text-teal-100 hover:text-white transition-colors font-handwritten">Contact</a>
          </div>
        </div>
      </footer>

      {/* Drawing Pad Modal */}
      {renderDrawingPad()}

      {/* Voice-Responsive Mimi */}
      <VoiceResponsiveMimi 
        isActive={isVoiceMimiActive}
        onToggle={() => setIsVoiceMimiActive(!isVoiceMimiActive)}
        currentMood={selectedMood || 'happy'}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes blob {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .font-handwritten {
          font-family: 'Patrick Hand', 'Gloria Hallelujah', 'Architect\'s Daughter', cursive;
        }
      `}</style>
    </div>
  );
}

export default App;