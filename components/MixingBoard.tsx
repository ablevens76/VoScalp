import React from 'react';
import { WordUnit } from '../types';
import { WordCard } from './WordCard';

interface MixingBoardProps {
  words: WordUnit[];
  setWords: React.Dispatch<React.SetStateAction<WordUnit[]>>;
}

export const MixingBoard: React.FC<MixingBoardProps> = ({ words, setWords }) => {
  
  const handleWordChange = (id: string, updatedWord: WordUnit) => {
    setWords((prev) => prev.map((w) => (w.id === id ? updatedWord : w)));
  };

  if (words.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-studio-600">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
        </svg>
        <p className="text-xl font-semibold opacity-50">The Stage is Empty</p>
        <p className="text-sm mt-2 opacity-40">Import text from the left to begin sculpting.</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto bg-studio-900/50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {words.map((word, idx) => (
                <WordCard 
                    key={word.id} 
                    word={word} 
                    onChange={(updated) => handleWordChange(word.id, updated)}
                    isActive={false}
                />
            ))}
        </div>
        
        {/* End of list padding */}
        <div className="h-20"></div>
    </div>
  );
};
