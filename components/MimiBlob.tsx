import React from 'react';
import { Sparkles, Heart, Star } from 'lucide-react';

interface MimiBlobProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  emotion?: 'happy' | 'excited' | 'calm' | 'curious' | 'creative';
  animated?: boolean;
  showSparkles?: boolean;
  className?: string;
}

export const MimiBlob: React.FC<MimiBlobProps> = ({ 
  size = 'md', 
  emotion = 'happy', 
  animated = true,
  showSparkles = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const getEyeExpression = () => {
    switch (emotion) {
      case 'excited':
        return { left: '35%', right: '65%', size: '6px', shape: 'rounded-full' };
      case 'calm':
        return { left: '35%', right: '65%', size: '4px', shape: 'rounded-full' };
      case 'curious':
        return { left: '32%', right: '68%', size: '5px', shape: 'rounded-full' };
      case 'creative':
        return { left: '33%', right: '67%', size: '5px', shape: 'rounded-full' };
      default:
        return { left: '35%', right: '65%', size: '5px', shape: 'rounded-full' };
    }
  };

  const getMouthExpression = () => {
    switch (emotion) {
      case 'excited':
        return { width: '16px', height: '12px', borderRadius: '0 0 16px 16px' };
      case 'calm':
        return { width: '12px', height: '6px', borderRadius: '0 0 12px 12px' };
      case 'curious':
        return { width: '8px', height: '8px', borderRadius: '50%' };
      case 'creative':
        return { width: '14px', height: '10px', borderRadius: '0 0 14px 14px' };
      default:
        return { width: '14px', height: '8px', borderRadius: '0 0 14px 14px' };
    }
  };

  const eyes = getEyeExpression();
  const mouth = getMouthExpression();

  return (
    <div className={`relative ${className}`}>
      {/* Mimi's blob body */}
      <div 
        className={`
          ${sizeClasses[size]} 
          bg-gradient-to-br from-teal-400 to-cyan-500 
          rounded-full 
          relative 
          ${animated ? 'animate-bounce' : ''}
          shadow-lg
          transform transition-all duration-300 hover:scale-110
        `}
        style={{
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          animation: animated ? 'blob 4s ease-in-out infinite' : 'none'
        }}
      >
        {/* Eyes */}
        <div 
          className="absolute bg-white rounded-full"
          style={{
            left: eyes.left,
            top: '35%',
            width: eyes.size,
            height: eyes.size,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div 
          className="absolute bg-white rounded-full"
          style={{
            left: eyes.right,
            top: '35%',
            width: eyes.size,
            height: eyes.size,
            transform: 'translate(-50%, -50%)'
          }}
        />
        
        {/* Pupils */}
        <div 
          className="absolute bg-gray-800 rounded-full"
          style={{
            left: eyes.left,
            top: '35%',
            width: `${parseInt(eyes.size) - 2}px`,
            height: `${parseInt(eyes.size) - 2}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div 
          className="absolute bg-gray-800 rounded-full"
          style={{
            left: eyes.right,
            top: '35%',
            width: `${parseInt(eyes.size) - 2}px`,
            height: `${parseInt(eyes.size) - 2}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* Mouth */}
        <div 
          className="absolute bg-white"
          style={{
            left: '50%',
            top: '55%',
            width: mouth.width,
            height: mouth.height,
            borderRadius: mouth.borderRadius,
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* Cheek blush */}
        {emotion === 'excited' && (
          <>
            <div className="absolute w-3 h-2 bg-pink-300 rounded-full opacity-60" style={{ left: '20%', top: '45%' }} />
            <div className="absolute w-3 h-2 bg-pink-300 rounded-full opacity-60" style={{ right: '20%', top: '45%' }} />
          </>
        )}
      </div>

      {/* Sparkles around Mimi */}
      {showSparkles && (
        <>
          <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-amber-400 animate-pulse" />
          <Star className="absolute -bottom-1 -left-2 w-3 h-3 text-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Heart className="absolute top-0 -left-3 w-3 h-3 text-rose-400 animate-pulse" style={{ animationDelay: '1s' }} />
        </>
      )}
    </div>
  );
};

export default MimiBlob;