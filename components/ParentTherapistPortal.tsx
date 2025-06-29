import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Download, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Heart, 
  Palette, 
  Mic, 
  Headphones,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Lock,
  Key,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  MessageSquare,
  FileText,
  Settings,
  ArrowLeft,
  Filter,
  Search,
  Star,
  Bookmark,
  Share2,
  Mail,
  Phone,
  Globe,
  User,
  UserCheck
} from 'lucide-react';
import { MimiBlob } from './MimiBlob';

interface SessionData {
  id: string;
  date: Date;
  duration: number; // minutes
  mood: {
    start: string;
    end: string;
  };
  activities: {
    drawing: number;
    story: number;
    sensory: number;
  };
  engagementLevel: 'low' | 'medium' | 'high';
  mimiInteractions: number;
  creationsCount: number;
  reflectionProvided: boolean;
}

interface CreationSummary {
  id: string;
  title: string;
  date: Date;
  type: 'drawing' | 'story' | 'sensory';
  mood: string;
  tags: string[];
  therapeuticNotes: string[];
  isBookmarked: boolean;
  childConsent: boolean;
}

interface ParentTherapistPortalProps {
  onBack: () => void;
  userRole: 'parent' | 'therapist' | 'educator';
}

export const ParentTherapistPortal: React.FC<ParentTherapistPortalProps> = ({ onBack, userRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'creations' | 'insights' | 'resources'>('overview');
  const [sessionData, setSessionData] = useState<SessionData[]>([]);
  const [creations, setCreations] = useState<CreationSummary[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [consentFilter, setConsentFilter] = useState<'all' | 'consented' | 'pending'>('consented');

  // Authentication component
  const renderAuthentication = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Secure Access Portal
          </h1>
          <p className="text-gray-600">
            For Parents, Therapists & Educators
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Code
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Enter secure access code"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Role
            </label>
            <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none">
              <option value="parent">Parent/Guardian</option>
              <option value="therapist">Licensed Therapist</option>
              <option value="educator">Special Education Professional</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Access Portal
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-2xl">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Privacy First</h4>
              <p className="text-sm text-blue-700">
                All data is encrypted and access is logged. Only information with explicit child consent is available.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Muse-AI-um
          </button>
        </div>
      </div>
    </div>
  );

  // Sample data
  useEffect(() => {
    if (isAuthenticated) {
      // Sample session data
      const sampleSessions: SessionData[] = [
        {
          id: '1',
          date: new Date('2024-01-15'),
          duration: 45,
          mood: { start: 'curious', end: 'happy' },
          activities: { drawing: 30, story: 10, sensory: 5 },
          engagementLevel: 'high',
          mimiInteractions: 12,
          creationsCount: 2,
          reflectionProvided: true
        },
        {
          id: '2',
          date: new Date('2024-01-14'),
          duration: 35,
          mood: { start: 'calm', end: 'creative' },
          activities: { drawing: 15, story: 20, sensory: 0 },
          engagementLevel: 'medium',
          mimiInteractions: 8,
          creationsCount: 1,
          reflectionProvided: true
        },
        {
          id: '3',
          date: new Date('2024-01-13'),
          duration: 25,
          mood: { start: 'quiet', end: 'calm' },
          activities: { drawing: 0, story: 0, sensory: 25 },
          engagementLevel: 'medium',
          mimiInteractions: 5,
          creationsCount: 0,
          reflectionProvided: false
        }
      ];

      const sampleCreations: CreationSummary[] = [
        {
          id: '1',
          title: 'My Rainbow Dragon',
          date: new Date('2024-01-15'),
          type: 'drawing',
          mood: 'happy',
          tags: ['dragons', 'rainbows', 'kindness'],
          therapeuticNotes: [
            'Shows positive emotional regulation through creative transformation',
            'Demonstrates empathy by reimagining traditionally scary imagery',
            'Strong use of color suggests emotional expression'
          ],
          isBookmarked: true,
          childConsent: true
        },
        {
          id: '2',
          title: 'The Quiet Superhero',
          date: new Date('2024-01-14'),
          type: 'story',
          mood: 'calm',
          tags: ['superheroes', 'quiet', 'strength'],
          therapeuticNotes: [
            'Explores themes of introversion as strength',
            'Self-advocacy through character development',
            'Positive self-representation in narrative'
          ],
          isBookmarked: false,
          childConsent: true
        }
      ];

      setSessionData(sampleSessions);
      setCreations(sampleCreations);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return renderAuthentication();
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Total Time</h3>
              <p className="text-2xl font-bold text-blue-600">
                {sessionData.reduce((acc, session) => acc + session.duration, 0)} min
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">This {selectedTimeframe}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Sessions</h3>
              <p className="text-2xl font-bold text-green-600">{sessionData.length}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Active engagement</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Creations</h3>
              <p className="text-2xl font-bold text-purple-600">
                {sessionData.reduce((acc, session) => acc + session.creationsCount, 0)}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Shared with consent</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Mood Trend</h3>
              <p className="text-2xl font-bold text-pink-600">Positive</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Overall trajectory</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {sessionData.slice(0, 3).map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {session.date.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {session.duration} minutes • {session.creationsCount} creations
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {session.mood.start} → {session.mood.end}
                </span>
                <div className={`w-3 h-3 rounded-full ${
                  session.engagementLevel === 'high' ? 'bg-green-400' :
                  session.engagementLevel === 'medium' ? 'bg-yellow-400' : 'bg-gray-400'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Therapeutic Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Key Insights</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Consistent positive mood progression during creative activities</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Strong engagement with drawing activities (70% of time)</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Regular self-reflection indicates developing emotional awareness</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreations = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <select 
              value={consentFilter}
              onChange={(e) => setConsentFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
            >
              <option value="all">All Creations</option>
              <option value="consented">With Consent Only</option>
              <option value="pending">Consent Pending</option>
            </select>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Privacy Protected</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Creations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {creations
          .filter(creation => 
            consentFilter === 'all' || 
            (consentFilter === 'consented' && creation.childConsent) ||
            (consentFilter === 'pending' && !creation.childConsent)
          )
          .map((creation) => (
          <div key={creation.id} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{creation.title}</h3>
                <p className="text-sm text-gray-600">
                  {creation.date.toLocaleDateString()} • {creation.type}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {creation.childConsent ? (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Consented</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>Pending</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    const updated = creations.map(c => 
                      c.id === creation.id ? { ...c, isBookmarked: !c.isBookmarked } : c
                    );
                    setCreations(updated);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    creation.isBookmarked 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${creation.isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Creation Preview */}
            <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4">
              {creation.type === 'drawing' && <Palette className="w-8 h-8 text-gray-400" />}
              {creation.type === 'story' && <BookOpen className="w-8 h-8 text-gray-400" />}
              {creation.type === 'sensory' && <Headphones className="w-8 h-8 text-gray-400" />}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {creation.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Therapeutic Notes */}
            {creation.childConsent && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Therapeutic Observations</h4>
                <ul className="space-y-1">
                  {creation.therapeuticNotes.map((note, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-8">
      {/* Therapeutic Guidance */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Using Creative Outputs in Therapy</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl">
              <h4 className="font-semibold text-green-800 mb-2">Drawing Analysis</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Color choices often reflect emotional states</li>
                <li>• Recurring themes indicate processing patterns</li>
                <li>• Spatial organization shows cognitive development</li>
                <li>• Detail level indicates attention and engagement</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <h4 className="font-semibold text-purple-800 mb-2">Story Themes</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Character choices reflect self-perception</li>
                <li>• Conflict resolution shows coping strategies</li>
                <li>• Setting preferences indicate comfort zones</li>
                <li>• Narrative structure shows cognitive organization</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-800 mb-2">Sensory Preferences</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Activity duration indicates regulation needs</li>
                <li>• Sound preferences show sensory processing</li>
                <li>• Engagement patterns reveal comfort strategies</li>
                <li>• Mood changes indicate effectiveness</li>
              </ul>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl">
              <h4 className="font-semibold text-orange-800 mb-2">Discussion Starters</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• "Tell me about this character you created"</li>
                <li>• "What was your favorite part to make?"</li>
                <li>• "How did you feel while creating this?"</li>
                <li>• "What would happen next in this story?"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Resources */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Professional Resources</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Research Library</h4>
            <p className="text-sm text-gray-600 mb-4">
              Access peer-reviewed studies on art therapy and neurodivergent children
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Browse Studies →
            </button>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Professional Network</h4>
            <p className="text-sm text-gray-600 mb-4">
              Connect with other professionals using creative therapy approaches
            </p>
            <button className="text-green-600 hover:text-green-700 font-medium">
              Join Community →
            </button>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Case Consultation</h4>
            <p className="text-sm text-gray-600 mb-4">
              Schedule consultations with our clinical advisory team
            </p>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Book Session →
            </button>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Support & Contact</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Clinical Support</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">clinical@muse-ai-um.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">1-800-MUSE-AID</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">professionals.muse-ai-um.com</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Training & Certification</h4>
            <p className="text-sm text-gray-600 mb-3">
              Learn how to maximize therapeutic outcomes using Muse-AI-um in your practice.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
              View Training Programs
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Muse-AI-um</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Professional Portal
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UserCheck className="w-4 h-4" />
                <span className="capitalize">{userRole}</span>
              </div>
              <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-2xl p-2 shadow-lg mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'sessions', label: 'Sessions', icon: Activity },
            { id: 'creations', label: 'Creations', icon: Palette },
            { id: 'insights', label: 'Insights', icon: TrendingUp },
            { id: 'resources', label: 'Resources', icon: BookOpen }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'creations' && renderCreations()}
        {activeTab === 'resources' && renderResources()}
        
        {/* Placeholder for other tabs */}
        {(activeTab === 'sessions' || activeTab === 'insights') && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {activeTab === 'sessions' ? 'Session Analytics' : 'Advanced Insights'}
            </h3>
            <p className="text-gray-600">
              Detailed {activeTab} coming soon with enhanced privacy controls and therapeutic frameworks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentTherapistPortal;