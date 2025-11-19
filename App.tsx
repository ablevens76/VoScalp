import React, { useState, useEffect } from 'react';
import { MixingBoard } from './components/MixingBoard';
import { ExportPanel } from './components/ExportPanel';
import { ApiKeyModal } from './components/ApiKeyModal';
import { LimitsTab } from './components/LimitsTab';
import { processLyricsWithGemini } from './services/geminiService';
import { AppTab, WordUnit, AccentType, AiProcessingStatus } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [apiKey, setApiKey] = useState<string>(process.env.API_KEY || '');
  const [isKeyModalOpen, setKeyModalOpen] = useState(!process.env.API_KEY);
  
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.EDITOR);
  const [inputText, setInputText] = useState('');
  const [words, setWords] = useState<WordUnit[]>([]);
  const [selectedAccent, setSelectedAccent] = useState<AccentType>(AccentType.GENERAL_AMERICAN);
  
  const [aiStatus, setAiStatus] = useState<AiProcessingStatus>({ isProcessing: false, message: '' });

  const handleApiKeySave = (key: string) => {
    setApiKey(key);
    setKeyModalOpen(false);
  };

  // Helper to generate word units from text
  const generateWordsFromText = (text: string): WordUnit[] => {
    if (!text.trim()) return [];
    const rawWords = text.trim().split(/\s+/);
    return rawWords.map(w => ({
      id: uuidv4(),
      original: w,
      phonetic: w, 
      stress: false,
      spacing: 0,
      isLocked: false
    }));
  };

  const handleImport = () => {
    if (!inputText.trim()) return;
    const newUnits = generateWordsFromText(inputText);
    setWords(newUnits);
  };

  const handleApplyAccent = async () => {
    let currentWords = words;

    // Auto-Import if words are empty but user has typed text
    if (currentWords.length === 0 && inputText.trim()) {
        currentWords = generateWordsFromText(inputText);
        setWords(currentWords);
    }

    if (currentWords.length === 0) return;
    
    setAiStatus({ isProcessing: true, message: `Gemini is sculpting: ${selectedAccent}...` });
    
    try {
      const updatedWords = await processLyricsWithGemini(apiKey, currentWords, selectedAccent);
      setWords(updatedWords);
      setAiStatus({ isProcessing: false, message: 'Processing Complete' });
    } catch (e: any) {
      setAiStatus({ isProcessing: false, message: '', error: e.message });
      if (e.message.includes('API Key')) {
        setKeyModalOpen(true);
      }
    }
  };

  const handleReset = () => {
    if(confirm("Reset all phonetic edits?")) {
        setWords(words.map(w => ({ ...w, phonetic: w.original, stress: false, spacing: 0, isLocked: false })));
    }
  };

  const canApply = !aiStatus.isProcessing && (words.length > 0 || inputText.trim().length > 0);

  return (
    <div className="flex flex-col h-screen bg-studio-900 text-gray-100 font-sans">
      <ApiKeyModal isOpen={isKeyModalOpen} onSave={handleApiKeySave} />
      
      {/* Header */}
      <header className="h-14 bg-studio-900 border-b border-studio-700 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎚️</span>
          <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            VOCAL SCULPTOR <span className="text-xs text-studio-accent font-mono border border-studio-accent px-1 rounded">V2.0</span>
          </h1>
        </div>
        <div className="flex space-x-4 text-sm font-medium">
          <button 
            onClick={() => setActiveTab(AppTab.EDITOR)}
            className={`${activeTab === AppTab.EDITOR ? 'text-studio-accent border-b-2 border-studio-accent' : 'text-gray-400 hover:text-white'}`}
          >
            MIXING BOARD
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.LIMITS)}
             className={`${activeTab === AppTab.LIMITS ? 'text-studio-accent border-b-2 border-studio-accent' : 'text-gray-400 hover:text-white'}`}
          >
            SYSTEM LIMITS
          </button>
        </div>
        <div className="flex items-center gap-2">
             {apiKey ? (
                 <span className="text-[10px] text-green-500 font-mono px-2 py-1 bg-green-900/20 rounded border border-green-800">API KEY ACTIVE</span>
             ) : (
                 <button onClick={() => setKeyModalOpen(true)} className="text-[10px] text-red-400 border border-red-500 px-2 py-1 rounded hover:bg-red-900/20">NO KEY</button>
             )}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === AppTab.EDITOR ? (
          <>
            {/* Left Panel: Input & Global Controls */}
            <aside className="w-80 bg-studio-800 border-r border-studio-700 flex flex-col z-10 shadow-xl">
              <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                
                {/* Input Section */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-studio-400 uppercase tracking-wider">1. Input Lyrics</label>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste lyrics here..."
                        className="w-full h-32 bg-studio-900 border border-studio-600 rounded p-2 text-sm text-white focus:border-studio-accent focus:outline-none resize-none placeholder-studio-600"
                    />
                    {words.length === 0 && inputText.trim().length > 0 && (
                        <div className="text-[10px] text-studio-accent animate-pulse font-bold text-center">
                            Ready to Load...
                        </div>
                    )}
                    <button 
                        onClick={handleImport}
                        disabled={!inputText.trim()}
                        className="w-full bg-studio-700 hover:bg-studio-600 disabled:opacity-50 text-white text-xs font-bold py-2 rounded border border-studio-600 transition-all"
                    >
                        LOAD TO MIXER &rarr;
                    </button>
                </div>

                <hr className="border-studio-700" />

                {/* Controls Section */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-studio-400 uppercase tracking-wider">2. Phonetic Engine</label>
                    
                    <div className="relative group">
                        <span className="text-[10px] text-gray-500 mb-1 block">TARGET ACCENT</span>
                        <div className="relative">
                          <select 
                              value={selectedAccent}
                              onChange={(e) => setSelectedAccent(e.target.value as AccentType)}
                              className="w-full appearance-none bg-studio-900 text-white border border-studio-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-studio-accent cursor-pointer hover:border-studio-500 transition-colors pr-8"
                              style={{ colorScheme: 'dark' }}
                          >
                              {Object.values(AccentType).map(acc => (
                                  <option key={acc} value={acc} className="bg-studio-900 text-white">{acc}</option>
                              ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-studio-400">
                            {/* Custom Chevron */}
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleApplyAccent}
                        disabled={!canApply}
                        className={`
                            w-full py-3 rounded font-bold text-sm shadow-lg transition-all relative overflow-hidden flex items-center justify-center
                            ${aiStatus.isProcessing ? 'bg-studio-600 cursor-wait' : ''}
                            ${!canApply ? 'bg-studio-800 text-studio-600 cursor-not-allowed border border-studio-700' : 'bg-studio-accent hover:bg-blue-600 text-white'}
                        `}
                    >
                        {aiStatus.isProcessing ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                SCULPTING...
                            </span>
                        ) : (
                             words.length === 0 && inputText.trim().length > 0 ? "LOAD & APPLY ACCENT" : "APPLY ACCENT"
                        )}
                    </button>

                    {aiStatus.error && (
                        <div className="p-2 bg-red-900/30 border border-red-800 rounded text-[10px] text-red-300 animate-pulse">
                            Error: {aiStatus.error}
                        </div>
                    )}

                     <button 
                        onClick={handleReset}
                        disabled={words.length === 0}
                        className="w-full bg-transparent hover:bg-studio-700 text-studio-400 text-xs py-2 rounded border border-dashed border-studio-600 transition-all disabled:opacity-30"
                    >
                        RESET EDITS
                    </button>
                </div>
              </div>

              {/* Bottom Status */}
              <div className="p-3 bg-studio-900 border-t border-studio-700 text-[10px] text-studio-400 font-mono text-center">
                {words.length} WORDS LOADED
              </div>
            </aside>

            {/* Center: Mixing Board */}
            <section className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 overflow-hidden relative">
                    <MixingBoard words={words} setWords={setWords} />
                </div>
                {/* Bottom: Export */}
                <div className="h-48 shrink-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                    <ExportPanel words={words} selectedAccent={selectedAccent} />
                </div>
            </section>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto bg-studio-900">
            <LimitsTab />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;