import React, { useState } from 'react';
import { WordUnit } from '../types';
import { speakPreview, stopSpeech } from '../services/tts';

interface ExportPanelProps {
  words: WordUnit[];
  selectedAccent: string;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ words, selectedAccent }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Output Formatting State
  const [spacingStyle, setSpacingStyle] = useState<'hyphen' | 'underscore' | 'dot' | 'comma'>('hyphen');
  const [structureTag, setStructureTag] = useState<string>('');

  const STRUCTURE_TAGS = [
    { label: 'None', value: '' },
    { label: '[Verse]', value: '[Verse]' },
    { label: '[Chorus]', value: '[Chorus]' },
    { label: '[Pre-Chorus]', value: '[Pre-Chorus]' },
    { label: '[Bridge]', value: '[Bridge]' },
    { label: '[Hook]', value: '[Hook]' },
    { label: '[Intro]', value: '[Intro]' },
    { label: '[Outro]', value: '[Outro]' },
    { label: '[Instrumental]', value: '[Instrumental Break]' },
    { label: '[Ad-lib]', value: '[Ad-lib]' },
  ];

  const SPACING_OPTIONS = [
    { label: 'Suno Hyphens ( - )', value: 'hyphen' },
    { label: 'Udio Pauses ( ... )', value: 'dot' },
    { label: 'Underscores ( _ )', value: 'underscore' },
    { label: 'Commas ( , )', value: 'comma' },
  ];

  const getSpacingString = (count: number) => {
    if (count === 0) return '';
    
    switch (spacingStyle) {
        case 'hyphen': return ' ' + '-'.repeat(count);
        case 'underscore': return ' ' + '_'.repeat(count);
        case 'dot': return ' ' + '.'.repeat(count * 2); // .. .... ......
        case 'comma': return ','.repeat(count);
        default: return '';
    }
  };

  const generateFinalString = () => {
    const lyricText = words.map(w => {
      // Always prioritize the phonetic field. Fallback to original only if empty.
      let text = w.phonetic && w.phonetic.trim().length > 0 ? w.phonetic : w.original; 
      
      // Apply Stress (Capitalization)
      if (w.stress) {
        text = text.toUpperCase();
      }

      // Apply Spacing / Rhythm
      const spacingSuffix = getSpacingString(w.spacing);
      
      return text + spacingSuffix;
    }).join(' ').replace(/\s+/g, ' ').trim();

    return structureTag ? `${structureTag}\n${lyricText}` : lyricText;
  };

  const finalOutput = generateFinalString();

  const handleCopy = () => {
    navigator.clipboard.writeText(finalOutput);
  };

  const handlePlay = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakPreview(finalOutput, selectedAccent);
      setTimeout(() => setIsPlaying(false), Math.min(finalOutput.length * 100, 15000)); 
    }
  };

  return (
    <div className="h-full flex flex-col bg-studio-800 border-t border-studio-700">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-y-2 justify-between items-center px-4 py-3 bg-studio-900/50 border-b border-studio-700 shrink-0">
        
        {/* Left: Formatting Controls */}
        <div className="flex items-center gap-3 overflow-x-auto">
            <div className="flex flex-col">
                <label className="text-[9px] text-studio-500 font-bold uppercase tracking-wider mb-0.5">Structure</label>
                <select 
                    value={structureTag}
                    onChange={(e) => setStructureTag(e.target.value)}
                    className="bg-studio-800 text-xs text-white border border-studio-600 rounded px-2 py-1 focus:border-studio-accent outline-none"
                >
                    {STRUCTURE_TAGS.map(tag => (
                        <option key={tag.label} value={tag.value}>{tag.label}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label className="text-[9px] text-studio-500 font-bold uppercase tracking-wider mb-0.5">Rhythm / Spacing</label>
                <select 
                    value={spacingStyle}
                    onChange={(e) => setSpacingStyle(e.target.value as any)}
                    className="bg-studio-800 text-xs text-white border border-studio-600 rounded px-2 py-1 focus:border-studio-accent outline-none"
                >
                    {SPACING_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* Right: Actions */}
        <div className="flex space-x-2">
          <button 
            onClick={handlePlay}
            className={`flex items-center space-x-1 px-4 py-1 rounded text-xs font-bold transition-colors border border-transparent ${
                isPlaying ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-studio-700 hover:bg-studio-600 text-gray-200 border-studio-600'
            }`}
          >
            {isPlaying ? (
                 <span>STOP</span>
            ) : (
                 <span>🎧 PREVIEW</span>
            )}
          </button>
          <button 
            onClick={handleCopy}
            className="bg-studio-accent hover:bg-blue-600 text-white px-4 py-1 rounded text-xs font-bold transition-colors shadow-lg shadow-blue-900/20"
          >
            COPY OUTPUT
          </button>
        </div>
      </div>
      
      {/* Text Area */}
      <div className="relative flex-1">
        <div className="absolute top-2 right-4 text-[10px] text-studio-600 font-mono pointer-events-none">
            MASTER OUTPUT (PHONETIC)
        </div>
        <textarea 
            readOnly
            value={finalOutput}
            className="w-full h-full bg-studio-900 p-4 text-sm font-mono text-green-400 resize-none focus:outline-none leading-relaxed"
            spellCheck={false}
        />
      </div>
    </div>
  );
};
