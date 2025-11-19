import React, { useState } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave }) => {
  const [key, setKey] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-studio-800 border border-studio-600 rounded-lg p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-2">Gemini API Key Required</h2>
        <p className="text-studio-400 text-sm mb-4">
          To use the Phonetic Engine, you need a free Google Gemini API key. 
          The key is stored locally in your browser session only.
        </p>
        <div className="mb-4">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-studio-accent hover:underline text-sm">
                Get a key here &rarr;
            </a>
        </div>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Paste AI Studio Key (AIza...)"
          className="w-full bg-studio-900 border border-studio-600 rounded px-3 py-2 text-white mb-4 focus:border-studio-accent focus:outline-none"
        />
        <button
          onClick={() => onSave(key)}
          disabled={!key}
          className="w-full bg-studio-accent hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2 rounded transition-colors"
        >
          Initialize Engine
        </button>
      </div>
    </div>
  );
};
