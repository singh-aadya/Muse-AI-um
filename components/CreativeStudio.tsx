import React, { useState, useRef, useEffect } from 'react';
import { 
  Palette, 
  PenTool, 
  Eraser, 
  RotateCcw, 
  BookOpen, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Image, 
  Sparkles, 
  Heart, 
  Star,
  ArrowLeft,
  Save,
  Headphones,
  Waves,
  Circle,
  Square,
  Triangle,
  Pin,
  CheckCircle
} from 'lucide-react';
import { MimiBlob } from './MimiBlob';

interface CreativeStudioProps {
  selectedMood: string | null;
  onBack: () => void;
  onCreationComplete?: (creation: {
    title: string;
    type: 'drawing' | 'story' | 'sensory';
    thumbnail: string;
    mood: string;
    tags: string[];
  }) => void;
}

type StudioMode = 'drawing' | 'story' | 'sensory';

export const CreativeStudio: React.FC<CreativeStudioProps> = ({ 
  selectedMood, 
  onBack, 
  onCreationComplete 
}) => {
  const [activeMode, setActiveMode] = useState<StudioMode>('drawing');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#06B6D4');
  const [brushSize, setBrushSize] = useState(5);
  const [selectedTool, setSelectedTool] = useState<'brush' | 'eraser'>('brush');
  const [storyText, setStoryText] = useState('');
  const [sensoryVolume, setSensoryVolume] = useState(50);
  const [selectedSensoryMode, setSelectedSensoryMode] = useState<'rain' | 'ocean' | 'forest' | 'white'>('rain');
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [currentCreation, setCurrentCreation] = useState<any>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = [
    '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
    '#3B82F6', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#F472B6'
  ];

  const storyPrompts = [
    "Tell a story about a quiet hero who saves the day in their own special way...",
    "Once upon a time, there was a child who could see colors that others couldn't...",
    "In a world where everyone was different, there lived a young explorer who...",
    "The magic paintbrush only worked when someone painted with their heart...",
    "Deep in the forest of feelings, a small creature discovered..."
  ];

  const sensoryModes = [
    { id: 'rain', name: 'Gentle Rain', icon: '🌧️', color: 'bg-blue-100' },
    { id: 'ocean', name: 'Ocean Waves', icon: '🌊', color: 'bg-cyan-100' },
    { id: 'forest', name: 'Forest Sounds', icon: '🌲', color: 'bg-green-100' },
    { id: 'white', name: 'White Noise', icon: '☁️', color: 'bg-gray-100' }
  ];

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (selectedTool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (!canvasRef.current) return;
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const getMimiEncouragement = () => {
    const encouragements = [
      "I love how you're expressing yourself!",
      "Your creativity is amazing!",
      "There's no wrong way to create!",
      "You're doing great - keep going!",
      "I can feel your imagination flowing!"
    ];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  };

  const handleSaveCreation = () => {
    let creation;
    
    if (activeMode === 'drawing') {
      creation = {
        title: `My ${selectedMood || 'Creative'} Drawing`,
        type: 'drawing' as const,
        thumbnail: canvasRef.current?.toDataURL() || '/api/placeholder/200/150',
        mood: selectedMood || 'creative',
        tags: ['drawing', selectedMood || 'creative', 'artwork']
      };
    } else if (activeMode === 'story') {
      creation = {
        title: storyText.split(' ').slice(0, 4).join(' ') || 'My Story',
        type: 'story' as const,
        thumbnail: '/api/placeholder/200/150',
        mood: selectedMood || 'creative',
        tags: ['story', 'writing', selectedMood || 'creative']
      };
    } else {
      creation = {
        title: `${sensoryModes.find(m => m.id === selectedSensoryMode)?.name} Session`,
        type: 'sensory' as const,
        thumbnail: '/api/placeholder/200/150',
        mood: selectedMood || 'calm',
        tags: ['sensory', selectedSensoryMode, selectedMood || 'calm']
      };
    }

    setCurrentCreation(creation);
    setShowPinPrompt(true);
  };

  const handlePinToMuseum = () => {
    if (currentCreation && onCreationComplete) {
      onCreationComplete(currentCreation);
    }
    setShowPinPrompt(false);
    setCurrentCreation(null);
  };

  const renderPinPrompt = () => {
    if (!showPinPrompt || !currentCreation) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <MimiBlob size="md" emotion="excited" animated={true} showSparkles={true} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800 font-handwritten">
                  Amazing Work!
                </h2>
                <p className="text-gray-600 font-handwritten">
                  You've created something wonderful!
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl">
            <h3 className="font-semibold text-gray-800 mb-2 font-handwritten">
              "{currentCreation.title}"
            </h3>
            <p className="text-sm text-gray-600 font-handwritten">
              Would you like to pin this to your Museum Wall? You can add a voice note about what it means to you!
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handlePinToMuseum}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-handwritten"
            >
              <div className="flex items-center justify-center space-x-2">
                <Pin className="w-5 h-5" />
                <span>Pin to Museum!</span>
              </div>
            </button>
            <button
              onClick={() => setShowPinPrompt(false)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors font-handwritten"
            >
              Keep Creating
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDrawingPad = () => (
    <div className="bg-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 font-handwritten">Drawing Pad</h3>
        <div className="flex items-center space-x-2">
          <MimiBlob size="sm" emotion="creative" animated={true} />
          <span className="text-sm text-gray-600 font-handwritten">Draw what you feel!</span>
        </div>
      </div>

      {/* Drawing Tools */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
        {/* Tool Selection */}
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTool('brush')}
            className={`p-3 rounded-xl transition-all duration-300 ${
              selectedTool === 'brush' 
                ? 'bg-teal-500 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PenTool className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSelectedTool('eraser')}
            className={`p-3 rounded-xl transition-all duration-300 ${
              selectedTool === 'eraser' 
                ? 'bg-teal-500 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Eraser className="w-5 h-5" />
          </button>
        </div>

        {/* Color Palette */}
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full transition-all duration-300 ${
                selectedColor === color ? 'ring-4 ring-gray-300 scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-handwritten">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-20"
          />
          <div 
            className="w-6 h-6 bg-gray-400 rounded-full"
            style={{ 
              width: `${Math.max(6, brushSize)}px`, 
              height: `${Math.max(6, brushSize)}px`,
              backgroundColor: selectedColor 
            }}
          />
        </div>

        {/* Clear Button */}
        <button
          onClick={clearCanvas}
          className="flex items-center space-x-2 bg-red-100 text-red-600 px-4 py-2 rounded-xl hover:bg-red-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm font-handwritten">Clear</span>
        </button>

        {/* Save Button */}
        <button
          onClick={handleSaveCreation}
          className="flex items-center space-x-2 bg-green-100 text-green-600 px-4 py-2 rounded-xl hover:bg-green-200 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span className="text-sm font-handwritten">Save</span>
        </button>
      </div>

      {/* Canvas */}
      <div className="relative bg-white rounded-2xl border-4 border-dashed border-gray-200 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-80 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        
        {/* Mimi's Encouragement */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
          <div className="flex items-center space-x-2">
            <MimiBlob size="sm" emotion="happy" animated={false} />
            <span className="text-sm text-gray-700 font-handwritten max-w-32">
              {getMimiEncouragement()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStoryBuilder = () => (
    <div className="bg-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 font-handwritten">Story Builder</h3>
        <div className="flex items-center space-x-2">
          <MimiBlob size="sm" emotion="curious" animated={true} />
          <span className="text-sm text-gray-600 font-handwritten">Tell your story!</span>
        </div>
      </div>

      {/* Story Prompts */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-3 font-handwritten">Story Starters</h4>
        <div className="grid gap-3">
          {storyPrompts.slice(0, 3).map((prompt, index) => (
            <button
              key={index}
              onClick={() => setStoryText(prompt)}
              className="text-left p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:shadow-md transition-all duration-300 transform hover:scale-102"
            >
              <p className="text-gray-700 font-handwritten leading-relaxed">{prompt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Text Area */}
      <div className="mb-6">
        <textarea
          value={storyText}
          onChange={(e) => setStoryText(e.target.value)}
          placeholder="Start writing your story here... or choose a story starter above!"
          className="w-full h-40 p-4 border-2 border-gray-200 rounded-2xl resize-none focus:border-teal-400 focus:outline-none font-handwritten text-lg leading-relaxed"
        />
      </div>

      {/* Voice Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="font-handwritten">
              {isRecording ? 'Stop Recording' : 'Record Voice'}
            </span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="font-handwritten">
              {isPlaying ? 'Pause' : 'Play Back'}
            </span>
          </button>

          <button
            onClick={handleSaveCreation}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="font-handwritten">Save Story</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-sm text-gray-600 font-handwritten">
            Mimi can help continue your story!
          </span>
        </div>
      </div>

      {/* Mimi's Story Suggestions */}
      {storyText.length > 50 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl">
          <div className="flex items-start space-x-3">
            <MimiBlob size="sm" emotion="excited" animated={true} />
            <div>
              <h5 className="font-semibold text-gray-800 mb-2 font-handwritten">
                Mimi's Idea:
              </h5>
              <p className="text-gray-700 font-handwritten leading-relaxed">
                "What if your character discovers they have a special power that only works when they're being kind to others?"
              </p>
              <button className="mt-2 text-teal-600 hover:text-teal-700 font-handwritten text-sm">
                Add this to my story →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSensoryCollage = () => (
    <div className="bg-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 font-handwritten">Sensory Space</h3>
        <div className="flex items-center space-x-2">
          <MimiBlob size="sm" emotion="calm" animated={true} />
          <span className="text-sm text-gray-600 font-handwritten">Find your calm</span>
        </div>
      </div>

      {/* Sensory Mode Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {sensoryModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSelectedSensoryMode(mode.id as any)}
            className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              selectedSensoryMode === mode.id 
                ? `${mode.color} ring-4 ring-teal-300 scale-105` 
                : `${mode.color} hover:shadow-md`
            }`}
          >
            <div className="text-3xl mb-2">{mode.icon}</div>
            <div className="text-sm font-semibold text-gray-700 font-handwritten">
              {mode.name}
            </div>
          </button>
        ))}
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-2xl">
        <VolumeX className="w-5 h-5 text-gray-500" />
        <input
          type="range"
          min="0"
          max="100"
          value={sensoryVolume}
          onChange={(e) => setSensoryVolume(Number(e.target.value))}
          className="flex-1"
        />
        <Volume2 className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-600 font-handwritten w-12">
          {sensoryVolume}%
        </span>
        <button
          onClick={handleSaveCreation}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span className="font-handwritten">Save Session</span>
        </button>
      </div>

      {/* Visual Elements */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="aspect-square bg-gradient-to-br from-blue-200 to-blue-400 rounded-2xl flex items-center justify-center">
          <Waves className="w-8 h-8 text-white animate-pulse" />
        </div>
        <div className="aspect-square bg-gradient-to-br from-green-200 to-green-400 rounded-2xl flex items-center justify-center">
          <Circle className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div className="aspect-square bg-gradient-to-br from-purple-200 to-purple-400 rounded-2xl flex items-center justify-center">
          <Triangle className="w-8 h-8 text-white animate-bounce" />
        </div>
      </div>

      {/* Texture Buttons */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-gray-700 font-handwritten">
          Touch & Feel (Visual Textures)
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Soft Clouds', 'Smooth Stones', 'Gentle Waves', 'Warm Sand'].map((texture, index) => (
            <button
              key={texture}
              className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-sm font-handwritten text-gray-700">{texture}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Breathing Guide */}
      <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl">
        <div className="flex items-center space-x-3 mb-3">
          <MimiBlob size="sm" emotion="calm" animated={true} />
          <h5 className="font-semibold text-gray-800 font-handwritten">
            Breathe with Mimi
          </h5>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 bg-teal-200 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-teal-400 rounded-full animate-ping"></div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 mt-2 font-handwritten">
          Breathe in... and out... with the gentle rhythm
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-handwritten">Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <MimiBlob size="sm" emotion="happy" animated={false} />
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent font-handwritten">
                Creative Studio
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveCreation}
                className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300"
              >
                <Pin className="w-4 h-4" />
                <span className="font-handwritten">Pin to Museum</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveMode('drawing')}
            className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              activeMode === 'drawing'
                ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Palette className="w-5 h-5" />
            <span className="font-handwritten font-semibold">Drawing Pad</span>
          </button>
          
          <button
            onClick={() => setActiveMode('story')}
            className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              activeMode === 'story'
                ? 'bg-gradient-to-r from-purple-400 to-violet-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-handwritten font-semibold">Story Builder</span>
          </button>
          
          <button
            onClick={() => setActiveMode('sensory')}
            className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              activeMode === 'sensory'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Headphones className="w-5 h-5" />
            <span className="font-handwritten font-semibold">Sensory Space</span>
          </button>
        </div>

        {/* Active Module */}
        <div className="max-w-5xl mx-auto">
          {activeMode === 'drawing' && renderDrawingPad()}
          {activeMode === 'story' && renderStoryBuilder()}
          {activeMode === 'sensory' && renderSensoryCollage()}
        </div>
      </div>

      {/* Pin Prompt Modal */}
      {renderPinPrompt()}
    </div>
  );
};

export default CreativeStudio;