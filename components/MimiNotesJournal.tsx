import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Heart, 
  Palette, 
  BookOpen, 
  Mic, 
  Play, 
  Pause, 
  Filter, 
  Search, 
  Star, 
  Sparkles,
  ArrowLeft,
  Download,
  Share2,
  Volume2,
  Image as ImageIcon,
  FileText,
  Headphones,
  Smile,
  Sun,
  Cloud,
  Zap,
  Moon,
  Rainbow
} from 'lucide-react';
import { MimiBlob } from './MimiBlob';

interface JournalEntry {
  id: string;
  date: Date;
  mood: {
    id: string;
    emoji: string;
    label: string;
    color: string;
  };
  medium: 'drawing' | 'story' | 'sensory';
  thumbnail: string;
  title: string;
  childReflection?: {
    type: 'text' | 'voice';
    content: string;
  };
  mimiMessage: string;
  tags: string[];
  isFavorite: boolean;
}

interface MimiNotesJournalProps {
  onBack: () => void;
}

export const MimiNotesJournal: React.FC<MimiNotesJournalProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'emotion' | 'medium'>('all');
  const [emotionFilter, setEmotionFilter] = useState<string>('all');
  const [mediumFilter, setMediumFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isPlayingReflection, setIsPlayingReflection] = useState(false);

  // Sample data - in real app, this would come from storage
  useEffect(() => {
    const sampleEntries: JournalEntry[] = [
      {
        id: '1',
        date: new Date('2024-01-15'),
        mood: { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-200' },
        medium: 'drawing',
        thumbnail: '/api/placeholder/200/150',
        title: 'My Rainbow Dragon',
        childReflection: {
          type: 'text',
          content: 'I drew a dragon that breathes rainbows instead of fire because I think that would make everyone happy!'
        },
        mimiMessage: "Your rainbow dragon is absolutely magical! I love how you turned something scary into something beautiful. That shows such a kind heart! 🌈✨",
        tags: ['dragons', 'rainbows', 'kindness'],
        isFavorite: true
      },
      {
        id: '2',
        date: new Date('2024-01-14'),
        mood: { id: 'calm', emoji: '😌', label: 'Calm', color: 'bg-blue-200' },
        medium: 'story',
        thumbnail: '/api/placeholder/200/150',
        title: 'The Quiet Superhero',
        childReflection: {
          type: 'voice',
          content: 'voice-recording-url'
        },
        mimiMessage: "What a wonderful story about finding strength in quietness! Your superhero shows that being gentle can be the most powerful thing of all. 💙",
        tags: ['superheroes', 'quiet', 'strength'],
        isFavorite: false
      },
      {
        id: '3',
        date: new Date('2024-01-13'),
        mood: { id: 'curious', emoji: '🤔', label: 'Curious', color: 'bg-purple-200' },
        medium: 'sensory',
        thumbnail: '/api/placeholder/200/150',
        title: 'Ocean Sounds Session',
        childReflection: {
          type: 'text',
          content: 'The waves made me think about how my thoughts come and go like water. Sometimes they are big waves, sometimes little ones.'
        },
        mimiMessage: "What a beautiful way to think about your thoughts! You're like a wise ocean explorer, understanding how feelings flow. 🌊💜",
        tags: ['ocean', 'thoughts', 'mindfulness'],
        isFavorite: true
      },
      {
        id: '4',
        date: new Date('2024-01-12'),
        mood: { id: 'creative', emoji: '🎨', label: 'Creative', color: 'bg-pink-200' },
        medium: 'drawing',
        thumbnail: '/api/placeholder/200/150',
        title: 'My Feelings Garden',
        childReflection: {
          type: 'text',
          content: 'Each flower is a different feeling. The big sunflower is when I feel proud, and the little violets are when I feel shy.'
        },
        mimiMessage: "Your feelings garden is so thoughtful! I love how you gave each emotion its own special flower. You understand your heart so well! 🌻💜",
        tags: ['feelings', 'garden', 'flowers', 'emotions'],
        isFavorite: false
      },
      {
        id: '5',
        date: new Date('2024-01-11'),
        mood: { id: 'excited', emoji: '🤩', label: 'Excited', color: 'bg-orange-200' },
        medium: 'story',
        thumbnail: '/api/placeholder/200/150',
        title: 'Adventure in the Cloud Castle',
        childReflection: {
          type: 'voice',
          content: 'voice-recording-url'
        },
        mimiMessage: "What an amazing adventure! Your imagination took us on such a wonderful journey through the clouds. I felt like I was flying right beside you! ☁️✨",
        tags: ['adventure', 'clouds', 'flying', 'imagination'],
        isFavorite: true
      }
    ];
    setEntries(sampleEntries);
  }, []);

  const moodOptions = [
    { id: 'all', emoji: '🌈', label: 'All Moods', color: 'bg-gradient-to-r from-pink-200 to-purple-200' },
    { id: 'happy', emoji: '😊', label: 'Happy Days', color: 'bg-yellow-200' },
    { id: 'excited', emoji: '🤩', label: 'Excited Days', color: 'bg-orange-200' },
    { id: 'calm', emoji: '😌', label: 'Calm Days', color: 'bg-blue-200' },
    { id: 'curious', emoji: '🤔', label: 'Curious Days', color: 'bg-purple-200' },
    { id: 'creative', emoji: '🎨', label: 'Creative Days', color: 'bg-pink-200' },
    { id: 'quiet', emoji: '🤫', label: 'Quiet Days', color: 'bg-green-200' }
  ];

  const mediumOptions = [
    { id: 'all', icon: Sparkles, label: 'All Creations', color: 'bg-gradient-to-r from-teal-200 to-cyan-200' },
    { id: 'drawing', icon: Palette, label: 'My Drawings', color: 'bg-pink-200' },
    { id: 'story', icon: BookOpen, label: 'My Stories', color: 'bg-purple-200' },
    { id: 'sensory', icon: Headphones, label: 'Sensory Sessions', color: 'bg-blue-200' }
  ];

  const filteredEntries = entries.filter(entry => {
    const matchesEmotion = emotionFilter === 'all' || entry.mood.id === emotionFilter;
    const matchesMedium = mediumFilter === 'all' || entry.medium === mediumFilter;
    const matchesSearch = searchTerm === '' || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesEmotion && matchesMedium && matchesSearch;
  });

  const toggleFavorite = (entryId: string) => {
    setEntries(entries.map(entry => 
      entry.id === entryId ? { ...entry, isFavorite: !entry.isFavorite } : entry
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderEntryCard = (entry: JournalEntry) => (
    <div 
      key={entry.id}
      className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 cursor-pointer relative overflow-hidden"
      onClick={() => setSelectedEntry(entry)}
    >
      {/* Favorite Star */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(entry.id);
        }}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
          entry.isFavorite 
            ? 'bg-yellow-100 text-yellow-500 scale-110' 
            : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-500'
        }`}
      >
        <Star className={`w-4 h-4 ${entry.isFavorite ? 'fill-current' : ''}`} />
      </button>

      {/* Date */}
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600 font-handwritten">
          {formatDate(entry.date)}
        </span>
      </div>

      {/* Mood Badge */}
      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${entry.mood.color} mb-4`}>
        <span className="text-lg">{entry.mood.emoji}</span>
        <span className="text-sm font-medium text-gray-700 font-handwritten">
          {entry.mood.label}
        </span>
      </div>

      {/* Thumbnail */}
      <div className="relative mb-4">
        <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
          {entry.medium === 'drawing' && <Palette className="w-8 h-8 text-gray-400" />}
          {entry.medium === 'story' && <BookOpen className="w-8 h-8 text-gray-400" />}
          {entry.medium === 'sensory' && <Headphones className="w-8 h-8 text-gray-400" />}
        </div>
        
        {/* Medium Badge */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
          {entry.medium === 'drawing' && <Palette className="w-4 h-4 text-pink-500" />}
          {entry.medium === 'story' && <BookOpen className="w-4 h-4 text-purple-500" />}
          {entry.medium === 'sensory' && <Headphones className="w-4 h-4 text-blue-500" />}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-3 font-handwritten">
        {entry.title}
      </h3>

      {/* Child's Reflection Preview */}
      {entry.childReflection && (
        <div className="mb-4 p-3 bg-gray-50 rounded-2xl">
          <div className="flex items-center space-x-2 mb-2">
            {entry.childReflection.type === 'voice' ? (
              <Mic className="w-4 h-4 text-teal-500" />
            ) : (
              <FileText className="w-4 h-4 text-teal-500" />
            )}
            <span className="text-sm font-medium text-gray-700 font-handwritten">
              My thoughts:
            </span>
          </div>
          <p className="text-sm text-gray-600 font-handwritten leading-relaxed line-clamp-2">
            {entry.childReflection.type === 'text' 
              ? entry.childReflection.content 
              : "Voice reflection recorded"
            }
          </p>
        </div>
      )}

      {/* Mimi's Message Preview */}
      <div className="p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl">
        <div className="flex items-start space-x-2">
          <MimiBlob size="sm" emotion="happy" animated={false} />
          <div>
            <span className="text-sm font-medium text-gray-700 font-handwritten block mb-1">
              Mimi says:
            </span>
            <p className="text-sm text-gray-600 font-handwritten leading-relaxed line-clamp-2">
              {entry.mimiMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {entry.tags.slice(0, 3).map((tag) => (
          <span 
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-handwritten"
          >
            #{tag}
          </span>
        ))}
        {entry.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-handwritten">
            +{entry.tags.length - 3} more
          </span>
        )}
      </div>
    </div>
  );

  const renderDetailView = () => {
    if (!selectedEntry) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedEntry(null)}
                className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-handwritten">Back to Journal</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleFavorite(selectedEntry.id)}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    selectedEntry.isFavorite 
                      ? 'bg-yellow-100 text-yellow-500' 
                      : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-500'
                  }`}
                >
                  <Star className={`w-5 h-5 ${selectedEntry.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Date and Mood */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600 font-handwritten">
                  {formatDate(selectedEntry.date)}
                </span>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${selectedEntry.mood.color}`}>
                <span className="text-xl">{selectedEntry.mood.emoji}</span>
                <span className="font-medium text-gray-700 font-handwritten">
                  {selectedEntry.mood.label}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6 font-handwritten">
              {selectedEntry.title}
            </h1>

            {/* Creation Preview */}
            <div className="mb-8">
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                {selectedEntry.medium === 'drawing' && <Palette className="w-16 h-16 text-gray-400" />}
                {selectedEntry.medium === 'story' && <BookOpen className="w-16 h-16 text-gray-400" />}
                {selectedEntry.medium === 'sensory' && <Headphones className="w-16 h-16 text-gray-400" />}
              </div>
            </div>

            {/* Child's Reflection */}
            {selectedEntry.childReflection && (
              <div className="mb-8 p-6 bg-gray-50 rounded-3xl">
                <div className="flex items-center space-x-3 mb-4">
                  {selectedEntry.childReflection.type === 'voice' ? (
                    <Mic className="w-6 h-6 text-teal-500" />
                  ) : (
                    <FileText className="w-6 h-6 text-teal-500" />
                  )}
                  <h3 className="text-xl font-bold text-gray-800 font-handwritten">
                    My Thoughts
                  </h3>
                </div>
                
                {selectedEntry.childReflection.type === 'voice' ? (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsPlayingReflection(!isPlayingReflection)}
                      className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-xl hover:bg-teal-600 transition-colors"
                    >
                      {isPlayingReflection ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span className="font-handwritten">
                        {isPlayingReflection ? 'Pause' : 'Play'} My Voice
                      </span>
                    </button>
                    <Volume2 className="w-5 h-5 text-gray-500" />
                  </div>
                ) : (
                  <p className="text-gray-700 font-handwritten text-lg leading-relaxed">
                    "{selectedEntry.childReflection.content}"
                  </p>
                )}
              </div>
            )}

            {/* Mimi's Message */}
            <div className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-3xl">
              <div className="flex items-start space-x-4">
                <MimiBlob size="md" emotion="happy" animated={true} showSparkles={true} />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 font-handwritten">
                    Mimi's Message for You
                  </h3>
                  <p className="text-gray-700 font-handwritten text-lg leading-relaxed">
                    {selectedEntry.mimiMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 font-handwritten">
                Memory Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedEntry.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-full font-handwritten hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
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
                Mimi Notes Journal
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-handwritten">
                {filteredEntries.length} memories
              </span>
              <Heart className="w-4 h-4 text-pink-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <MimiBlob size="lg" emotion="happy" animated={true} showSparkles={true} />
              <div>
                <h1 className="text-4xl font-bold text-gray-800 font-handwritten">
                  Your Memory Collection
                </h1>
                <p className="text-xl text-gray-600 font-handwritten mt-2">
                  Every creation tells your unique story
                </p>
              </div>
            </div>
            <p className="text-gray-600 font-handwritten leading-relaxed">
              Welcome to your special place where all your creative moments live! 
              Each memory here shows how amazing and creative you are. 
              Mimi has been saving every wonderful thing you've made! ✨
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-2 border-gray-200 focus:border-teal-400 focus:outline-none font-handwritten"
              />
            </div>
          </div>

          {/* Emotion Filter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center font-handwritten">
              Filter by Feeling
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setEmotionFilter(mood.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    emotionFilter === mood.id 
                      ? `${mood.color} ring-4 ring-teal-300 scale-105` 
                      : `${mood.color} hover:shadow-md`
                  }`}
                >
                  <span className="text-lg">{mood.emoji}</span>
                  <span className="text-sm font-medium text-gray-700 font-handwritten">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Medium Filter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center font-handwritten">
              Filter by Creation Type
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {mediumOptions.map((medium) => {
                const IconComponent = medium.icon;
                return (
                  <button
                    key={medium.id}
                    onClick={() => setMediumFilter(medium.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      mediumFilter === medium.id 
                        ? `${medium.color} ring-4 ring-teal-300 scale-105` 
                        : `${medium.color} hover:shadow-md`
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 font-handwritten">
                      {medium.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Entries Grid */}
        {filteredEntries.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEntries.map(renderEntryCard)}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg max-w-md mx-auto">
              <MimiBlob size="lg" emotion="curious" animated={true} />
              <h3 className="text-2xl font-bold text-gray-800 mt-4 mb-2 font-handwritten">
                No memories found
              </h3>
              <p className="text-gray-600 font-handwritten">
                Try changing your filters or create something new to add to your collection!
              </p>
            </div>
          </div>
        )}

        {/* Mimi's Encouragement */}
        {filteredEntries.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-3xl p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <MimiBlob size="md" emotion="excited" animated={true} showSparkles={true} />
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 font-handwritten">
                    Look how much you've created!
                  </h3>
                </div>
              </div>
              <p className="text-gray-700 font-handwritten text-lg leading-relaxed">
                Every single memory here shows your unique creativity and beautiful heart. 
                I'm so proud of all the wonderful things you've made! 
                Keep creating - your imagination makes the world more colorful! 🌈✨
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Detail View Modal */}
      {renderDetailView()}
    </div>
  );
};

export default MimiNotesJournal;