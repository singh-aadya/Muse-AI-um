import React, { useState, useEffect } from 'react';
import { 
  Pin, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  ArrowLeft,
  Grid3X3,
  Move,
  RotateCcw,
  Save,
  Download,
  Share2,
  Star,
  Heart,
  Sparkles,
  Palette,
  BookOpen,
  Headphones,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  Settings,
  Shuffle,
  Filter,
  Search,
  Plus,
  Trash2,
  Edit3,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { MimiBlob } from './MimiBlob';

interface ExhibitItem {
  id: string;
  title: string;
  type: 'drawing' | 'story' | 'sensory';
  date: Date;
  thumbnail: string;
  mood: string;
  tags: string[];
  voiceLabel?: {
    text: string;
    audioUrl: string;
    duration: number;
  };
  isPinned: boolean;
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
  room: string;
  isFavorite: boolean;
  createdAt: Date;
}

interface MuseumRoom {
  id: string;
  name: string;
  theme: string;
  color: string;
  icon: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isCustomizable: boolean;
}

interface MuseumWallProps {
  onBack: () => void;
  newItem?: {
    title: string;
    type: 'drawing' | 'story' | 'sensory';
    thumbnail: string;
    mood: string;
    tags: string[];
  };
}

export const MuseumWall: React.FC<MuseumWallProps> = ({ onBack, newItem }) => {
  const [exhibits, setExhibits] = useState<ExhibitItem[]>([]);
  const [rooms, setRooms] = useState<MuseumRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>('main');
  const [isRecordingLabel, setIsRecordingLabel] = useState<string | null>(null);
  const [isPlayingLabel, setIsPlayingLabel] = useState<string | null>(null);
  const [selectedExhibit, setSelectedExhibit] = useState<string | null>(null);
  const [isArrangeMode, setIsArrangeMode] = useState(false);
  const [isRoomDesignMode, setIsRoomDesignMode] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | 'grid' | 'timeline'>('gallery');
  const [filterBy, setFilterBy] = useState<'all' | 'pinned' | 'favorites' | 'recent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [googleDriveEnabled, setGoogleDriveEnabled] = useState(false);
  const [lastBackup, setLastBackup] = useState<Date | null>(null);

  // Initialize default rooms
  useEffect(() => {
    const defaultRooms: MuseumRoom[] = [
      {
        id: 'main',
        name: 'Main Gallery',
        theme: 'rainbow',
        color: 'bg-gradient-to-br from-pink-100 to-purple-100',
        icon: '🎨',
        position: { x: 0, y: 0 },
        size: { width: 4, height: 3 },
        isCustomizable: true
      },
      {
        id: 'favorites',
        name: 'My Favorites',
        theme: 'stars',
        color: 'bg-gradient-to-br from-yellow-100 to-orange-100',
        icon: '⭐',
        position: { x: 4, y: 0 },
        size: { width: 3, height: 2 },
        isCustomizable: true
      },
      {
        id: 'stories',
        name: 'Story Corner',
        theme: 'books',
        color: 'bg-gradient-to-br from-blue-100 to-cyan-100',
        icon: '📚',
        position: { x: 0, y: 3 },
        size: { width: 3, height: 2 },
        isCustomizable: true
      },
      {
        id: 'calm',
        name: 'Quiet Space',
        theme: 'zen',
        color: 'bg-gradient-to-br from-green-100 to-teal-100',
        icon: '🧘',
        position: { x: 3, y: 3 },
        size: { width: 2, height: 2 },
        isCustomizable: true
      }
    ];
    setRooms(defaultRooms);

    // Sample exhibits
    const sampleExhibits: ExhibitItem[] = [
      {
        id: '1',
        title: 'My Rainbow Dragon',
        type: 'drawing',
        date: new Date('2024-01-15'),
        thumbnail: '/api/placeholder/200/150',
        mood: 'happy',
        tags: ['dragons', 'rainbows', 'kindness'],
        voiceLabel: {
          text: "This is my rainbow dragon! I made him breathe rainbows instead of fire because I think that would make everyone happy and not scared.",
          audioUrl: 'voice-1.mp3',
          duration: 8
        },
        isPinned: true,
        position: { x: 1, y: 1 },
        size: 'large',
        room: 'main',
        isFavorite: true,
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        title: 'The Quiet Superhero',
        type: 'story',
        date: new Date('2024-01-14'),
        thumbnail: '/api/placeholder/200/150',
        mood: 'calm',
        tags: ['superheroes', 'quiet', 'strength'],
        voiceLabel: {
          text: "My superhero is quiet but really strong. He helps people by listening to them and making them feel better.",
          audioUrl: 'voice-2.mp3',
          duration: 6
        },
        isPinned: true,
        position: { x: 0, y: 0 },
        size: 'medium',
        room: 'stories',
        isFavorite: false,
        createdAt: new Date('2024-01-14')
      },
      {
        id: '3',
        title: 'Ocean Waves Session',
        type: 'sensory',
        date: new Date('2024-01-13'),
        thumbnail: '/api/placeholder/200/150',
        mood: 'calm',
        tags: ['ocean', 'peaceful', 'waves'],
        voiceLabel: {
          text: "The ocean sounds help me feel calm. It's like the waves are washing away my worries.",
          audioUrl: 'voice-3.mp3',
          duration: 5
        },
        isPinned: false,
        position: { x: 0, y: 0 },
        size: 'small',
        room: 'calm',
        isFavorite: true,
        createdAt: new Date('2024-01-13')
      }
    ];
    setExhibits(sampleExhibits);
  }, []);

  // Handle new item from creative session
  useEffect(() => {
    if (newItem) {
      setShowPinPrompt(true);
    }
  }, [newItem]);

  const handlePinToMuseum = (voiceLabel?: string) => {
    if (!newItem) return;

    const newExhibit: ExhibitItem = {
      id: Date.now().toString(),
      title: newItem.title,
      type: newItem.type,
      date: new Date(),
      thumbnail: newItem.thumbnail,
      mood: newItem.mood,
      tags: newItem.tags,
      voiceLabel: voiceLabel ? {
        text: voiceLabel,
        audioUrl: `voice-${Date.now()}.mp3`,
        duration: Math.ceil(voiceLabel.length / 10) // Rough estimate
      } : undefined,
      isPinned: true,
      position: { x: Math.floor(Math.random() * 3), y: Math.floor(Math.random() * 2) },
      size: 'medium',
      room: currentRoom,
      isFavorite: false,
      createdAt: new Date()
    };

    setExhibits(prev => [newExhibit, ...prev]);
    setShowPinPrompt(false);
    
    // Auto-backup if enabled
    if (googleDriveEnabled) {
      handleAutoBackup();
    }
  };

  const handleAutoBackup = async () => {
    // Simulate Google Drive backup
    try {
      console.log('Backing up to Google Drive...');
      // In real implementation, this would use Google Drive API
      setTimeout(() => {
        setLastBackup(new Date());
        console.log('Backup completed successfully!');
      }, 2000);
    } catch (error) {
      console.error('Backup failed:', error);
    }
  };

  const startRecordingLabel = (exhibitId: string) => {
    setIsRecordingLabel(exhibitId);
    // In real implementation, start speech recognition
    setTimeout(() => {
      const sampleLabel = "This creation means a lot to me because it shows how I was feeling that day.";
      setExhibits(prev => prev.map(exhibit => 
        exhibit.id === exhibitId 
          ? { 
              ...exhibit, 
              voiceLabel: {
                text: sampleLabel,
                audioUrl: `voice-${exhibitId}.mp3`,
                duration: 5
              }
            }
          : exhibit
      ));
      setIsRecordingLabel(null);
    }, 3000);
  };

  const playVoiceLabel = (exhibitId: string) => {
    setIsPlayingLabel(exhibitId);
    // In real implementation, play audio
    setTimeout(() => {
      setIsPlayingLabel(null);
    }, 3000);
  };

  const togglePin = (exhibitId: string) => {
    setExhibits(prev => prev.map(exhibit => 
      exhibit.id === exhibitId 
        ? { ...exhibit, isPinned: !exhibit.isPinned }
        : exhibit
    ));
  };

  const toggleFavorite = (exhibitId: string) => {
    setExhibits(prev => prev.map(exhibit => 
      exhibit.id === exhibitId 
        ? { ...exhibit, isFavorite: !exhibit.isFavorite }
        : exhibit
    ));
  };

  const moveExhibit = (exhibitId: string, newPosition: { x: number; y: number }) => {
    setExhibits(prev => prev.map(exhibit => 
      exhibit.id === exhibitId 
        ? { ...exhibit, position: newPosition }
        : exhibit
    ));
  };

  const changeExhibitSize = (exhibitId: string, newSize: 'small' | 'medium' | 'large') => {
    setExhibits(prev => prev.map(exhibit => 
      exhibit.id === exhibitId 
        ? { ...exhibit, size: newSize }
        : exhibit
    ));
  };

  const moveRoom = (roomId: string, newPosition: { x: number; y: number }) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, position: newPosition }
        : room
    ));
  };

  const resizeRoom = (roomId: string, newSize: { width: number; height: number }) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, size: newSize }
        : room
    ));
  };

  const filteredExhibits = exhibits.filter(exhibit => {
    const matchesRoom = exhibit.room === currentRoom;
    const matchesFilter = 
      filterBy === 'all' || 
      (filterBy === 'pinned' && exhibit.isPinned) ||
      (filterBy === 'favorites' && exhibit.isFavorite) ||
      (filterBy === 'recent' && new Date().getTime() - exhibit.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000);
    const matchesSearch = searchTerm === '' || 
      exhibit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibit.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesRoom && matchesFilter && matchesSearch;
  });

  const renderExhibitCard = (exhibit: ExhibitItem) => {
    const sizeClasses = {
      small: 'w-32 h-24',
      medium: 'w-48 h-36',
      large: 'w-64 h-48'
    };

    return (
      <div 
        key={exhibit.id}
        className={`${sizeClasses[exhibit.size]} bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative group cursor-pointer`}
        style={{
          gridColumn: `span ${exhibit.size === 'large' ? 2 : 1}`,
          gridRow: `span ${exhibit.size === 'large' ? 2 : 1}`
        }}
        onClick={() => setSelectedExhibit(exhibit.id)}
      >
        {/* Pin Badge */}
        {exhibit.isPinned && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center z-10">
            <Pin className="w-3 h-3" />
          </div>
        )}

        {/* Favorite Badge */}
        {exhibit.isFavorite && (
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center z-10">
            <Star className="w-3 h-3 fill-current" />
          </div>
        )}

        {/* Thumbnail */}
        <div className="w-full h-2/3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl flex items-center justify-center relative overflow-hidden">
          {exhibit.type === 'drawing' && <Palette className="w-8 h-8 text-gray-400" />}
          {exhibit.type === 'story' && <BookOpen className="w-8 h-8 text-gray-400" />}
          {exhibit.type === 'sensory' && <Headphones className="w-8 h-8 text-gray-400" />}
          
          {/* Mood Indicator */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-white/80 rounded-full text-xs">
            {exhibit.mood === 'happy' && '😊'}
            {exhibit.mood === 'calm' && '😌'}
            {exhibit.mood === 'excited' && '🤩'}
            {exhibit.mood === 'creative' && '🎨'}
            {exhibit.mood === 'curious' && '🤔'}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-bold text-gray-800 text-sm font-handwritten truncate">
            {exhibit.title}
          </h3>
          <p className="text-xs text-gray-500 font-handwritten">
            {exhibit.date.toLocaleDateString()}
          </p>
        </div>

        {/* Voice Label Indicator */}
        {exhibit.voiceLabel && (
          <div className="absolute bottom-2 right-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playVoiceLabel(exhibit.id);
              }}
              className={`p-1 rounded-full transition-colors ${
                isPlayingLabel === exhibit.id 
                  ? 'bg-purple-500 text-white animate-pulse' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              {isPlayingLabel === exhibit.id ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </button>
          </div>
        )}

        {/* Arrange Mode Controls */}
        {isArrangeMode && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  changeExhibitSize(exhibit.id, exhibit.size === 'small' ? 'medium' : exhibit.size === 'medium' ? 'large' : 'small');
                }}
                className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(exhibit.id);
                }}
                className={`p-2 rounded-lg ${exhibit.isPinned ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                <Pin className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(exhibit.id);
                }}
                className={`p-2 rounded-lg ${exhibit.isFavorite ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                <Star className={`w-4 h-4 ${exhibit.isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRoomSelector = () => (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => setCurrentRoom(room.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl whitespace-nowrap transition-all duration-300 ${
            currentRoom === room.id 
              ? `${room.color} ring-4 ring-teal-300 scale-105` 
              : `${room.color} hover:shadow-md`
          }`}
        >
          <span className="text-lg">{room.icon}</span>
          <span className="font-medium text-gray-700 font-handwritten">
            {room.name}
          </span>
          <span className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full">
            {exhibits.filter(e => e.room === room.id).length}
          </span>
        </button>
      ))}
    </div>
  );

  const renderPinPrompt = () => {
    if (!showPinPrompt || !newItem) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <MimiBlob size="md" emotion="excited" animated={true} showSparkles={true} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800 font-handwritten">
                  Pin to Your Museum!
                </h2>
                <p className="text-gray-600 font-handwritten">
                  Add "{newItem.title}" to your personal gallery
                </p>
              </div>
            </div>
          </div>

          {/* Voice Label Recording */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
            <h3 className="font-semibold text-gray-800 mb-3 font-handwritten">
              Tell Mimi what this means to you
            </h3>
            <p className="text-sm text-gray-600 mb-4 font-handwritten">
              Record a voice note that will become your exhibit label!
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => startRecordingLabel('new')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isRecordingLabel === 'new'
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                {isRecordingLabel === 'new' ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span className="font-handwritten">Recording...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span className="font-handwritten">Record Label</span>
                  </>
                )}
              </button>
              
              <span className="text-sm text-gray-500 font-handwritten">
                or skip for now
              </span>
            </div>
          </div>

          {/* Room Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 font-handwritten">
              Choose a room:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setCurrentRoom(room.id)}
                  className={`p-3 rounded-2xl transition-all duration-300 ${
                    currentRoom === room.id 
                      ? `${room.color} ring-2 ring-teal-400` 
                      : `${room.color} hover:shadow-md`
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{room.icon}</div>
                    <div className="text-sm font-medium text-gray-700 font-handwritten">
                      {room.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => handlePinToMuseum()}
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
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-40">
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
                My Museum Wall
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Google Drive Status */}
              {googleDriveEnabled && (
                <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-handwritten">Auto-backup ON</span>
                </div>
              )}
              
              <button
                onClick={() => setIsArrangeMode(!isArrangeMode)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 font-handwritten ${
                  isArrangeMode 
                    ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <Move className="w-4 h-4" />
                <span>{isArrangeMode ? 'Done Arranging' : 'Arrange'}</span>
              </button>
              
              <button
                onClick={() => setIsRoomDesignMode(!isRoomDesignMode)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 font-handwritten ${
                  isRoomDesignMode 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span>{isRoomDesignMode ? 'Done Designing' : 'Design Rooms'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <MimiBlob size="lg" emotion="excited" animated={true} showSparkles={true} />
              <div>
                <h1 className="text-3xl font-bold text-gray-800 font-handwritten">
                  Welcome to Your Museum!
                </h1>
                <p className="text-gray-600 font-handwritten">
                  Your personal gallery of creative masterpieces
                </p>
              </div>
            </div>
            <p className="text-gray-600 font-handwritten leading-relaxed">
              Every creation you pin here becomes part of your special museum. 
              Add voice labels to tell the story behind each piece! 🎨✨
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          {/* Room Selector */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 font-handwritten">
              Museum Rooms
            </h3>
            {renderRoomSelector()}
          </div>

          {/* Filters and Search */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center space-x-4">
              <select 
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:border-teal-400 focus:outline-none font-handwritten"
              >
                <option value="all">All Exhibits</option>
                <option value="pinned">Pinned Only</option>
                <option value="favorites">My Favorites</option>
                <option value="recent">Recent (7 days)</option>
              </select>

              <div className="flex space-x-2">
                {['gallery', 'grid', 'timeline'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as any)}
                    className={`px-3 py-2 rounded-lg transition-colors font-handwritten ${
                      viewMode === mode 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exhibits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-teal-400 focus:outline-none font-handwritten"
                />
              </div>

              <button
                onClick={() => setGoogleDriveEnabled(!googleDriveEnabled)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-colors font-handwritten ${
                  googleDriveEnabled 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Auto-backup</span>
              </button>
            </div>
          </div>
        </div>

        {/* Current Room Display */}
        <div className="mb-6">
          <div className={`${rooms.find(r => r.id === currentRoom)?.color} rounded-3xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">
                  {rooms.find(r => r.id === currentRoom)?.icon}
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 font-handwritten">
                    {rooms.find(r => r.id === currentRoom)?.name}
                  </h2>
                  <p className="text-gray-600 font-handwritten">
                    {filteredExhibits.length} exhibits displayed
                  </p>
                </div>
              </div>
              
              {isRoomDesignMode && (
                <div className="flex space-x-2">
                  <button className="p-2 bg-white/80 text-gray-700 rounded-lg hover:bg-white transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/80 text-gray-700 rounded-lg hover:bg-white transition-colors">
                    <Palette className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Exhibits Grid */}
            {filteredExhibits.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'gallery' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' :
                'grid-cols-1'
              }`}>
                {filteredExhibits.map(renderExhibitCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
                  <MimiBlob size="lg" emotion="curious" animated={true} />
                  <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2 font-handwritten">
                    This room is waiting for you!
                  </h3>
                  <p className="text-gray-600 font-handwritten">
                    Create something amazing and pin it here to start your collection.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Museum Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-teal-600 mb-2">
              {exhibits.length}
            </div>
            <div className="text-gray-600 font-handwritten">Total Exhibits</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {exhibits.filter(e => e.isPinned).length}
            </div>
            <div className="text-gray-600 font-handwritten">Pinned Items</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">
              {exhibits.filter(e => e.voiceLabel).length}
            </div>
            <div className="text-gray-600 font-handwritten">Voice Labels</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {rooms.length}
            </div>
            <div className="text-gray-600 font-handwritten">Museum Rooms</div>
          </div>
        </div>
      </div>

      {/* Pin Prompt Modal */}
      {renderPinPrompt()}
    </div>
  );
};

export default MuseumWall;