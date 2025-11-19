import React, { useRef } from 'react';
import { WordUnit } from '../types';

interface WordCardProps {
  word: WordUnit;
  onChange: (updated: WordUnit) => void;
  isActive: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({ word, onChange, isActive }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePhoneticChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...word, phonetic: e.target.value });
  };

  const toggleStress = () => {
    onChange({ ...word, stress: !word.stress });
  };

  const toggleLock = () => {
    onChange({ ...word, isLocked: !word.isLocked });
  };

  const handleSpacingChange = (val: number) => {
    onChange({ ...word, spacing: val });
  };

  const renderSpacingDots = () => {
    return (
      <div className="flex space-x-1 items-center group/spacing">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            onClick={() => handleSpacingChange(word.spacing === i ? 0 : i)}
            className={`w-2 h-2 rounded-sm cursor-pointer transition-all duration-200 ${
              i <= word.spacing ? 'bg-studio-highlight shadow-[0_0_5px_rgba(244,63,94,0.5)]' : 'bg-studio-700 hover:bg-studio-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={`
        relative flex flex-col p-3 rounded-lg border transition-all duration-200 min-h-[110px]
        ${isActive ? 'border-studio-accent bg-studio-800 ring-1 ring-studio-accent shadow-2xl z-10' : 'border-studio-600 bg-studio-800/40 hover:border-studio-500 hover:bg-studio-800/80'}
        ${word.isLocked ? 'bg-studio-800/20 border-dashed' : ''}
      `}
    >
      {/* Header: Original Word */}
      <div className="flex justify-between items-start mb-1">
        <div className="flex flex-col">
            <span className="text-[10px] text-studio-500 uppercase font-bold tracking-wider">Input</span>
            <span className="text-xs text-studio-300 font-mono opacity-60 truncate max-w-[80px]">{word.original}</span>
        </div>
        <button onClick={toggleLock} className={`transition-colors ${word.isLocked ? 'text-studio-highlight' : 'text-studio-600 hover:text-studio-400'}`} title={word.isLocked ? "Unlock" : "Lock"}>
          {word.isLocked ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
          )}
        </button>
      </div>

      {/* Main Input: Phonetic */}
      <div className="mt-1 mb-3 relative">
        <label className="absolute -top-3 left-0 text-[9px] text-studio-500 font-bold tracking-wider pointer-events-none">OUTPUT</label>
        <input
            ref={inputRef}
            type="text"
            value={word.phonetic}
            onChange={handlePhoneticChange}
            spellCheck={false}
            className={`
            w-full bg-transparent text-lg font-bold text-center focus:outline-none font-sans border-b border-transparent focus:border-studio-accent transition-colors pb-1
            ${word.stress ? 'text-yellow-400 uppercase tracking-widest drop-shadow-md' : 'text-white'}
            `}
        />
      </div>

      {/* Footer Controls */}
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-studio-700/50">
        <button
          onClick={toggleStress}
          className={`px-1.5 py-0.5 text-[9px] rounded border transition-all font-bold uppercase tracking-wide ${
            word.stress
              ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500'
              : 'border-studio-700 text-studio-500 hover:border-studio-400 hover:text-studio-300'
          }`}
        >
          STRESS
        </button>
        
        <div className="flex flex-col items-end">
           <span className="text-[8px] text-studio-600 font-mono mb-0.5">TIMING</span>
           {renderSpacingDots()}
        </div>
      </div>
    </div>
  );
};
