import React from 'react';

export const LimitsTab: React.FC = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto text-gray-300">
      <h2 className="text-2xl font-bold text-white mb-6">Vocal Sculptor V2: System Limits</h2>
      
      <div className="space-y-6">
        <section className="bg-studio-800 p-6 rounded border border-studio-600">
          <h3 className="text-lg font-bold text-studio-highlight mb-2">1. Audio Preview Fidelity</h3>
          <p className="text-sm mb-2">
            <strong>The Limit:</strong> The "Preview" button uses your browser's built-in Text-to-Speech (Web Speech API). It is <em>not</em> a generative AI singer.
          </p>
          <p className="text-sm">
            <strong>Why it exists:</strong> To provide immediate, free feedback on rhythm and phonetic flow without incurring massive API costs or latency. It sounds robotic, but if the robot pronounces the vowel correctly, Suno likely will too.
          </p>
        </section>

        <section className="bg-studio-800 p-6 rounded border border-studio-600">
          <h3 className="text-lg font-bold text-studio-highlight mb-2">2. Syllabification & Word Breaking</h3>
          <p className="text-sm mb-2">
            <strong>The Limit:</strong> The input parser splits primarily by whitespace. It does not automatically split complex multi-syllable words into sub-blocks (e.g., "Un-be-liev-a-ble") automatically on the frontend.
          </p>
          <p className="text-sm">
            <strong>Workaround:</strong> The Gemini AI layer <em>can</em> insert hyphens into the phonetic field. You can also manually add hyphens in the "Phonetic" field of a word card to force the split.
          </p>
        </section>

        <section className="bg-studio-800 p-6 rounded border border-studio-600">
          <h3 className="text-lg font-bold text-studio-highlight mb-2">3. Token Limits</h3>
          <p className="text-sm mb-2">
            <strong>The Limit:</strong> Processing extremely long songs (500+ words) in one batch may hit Gemini's token limits or timeout.
          </p>
          <p className="text-sm">
            <strong>Advice:</strong> Process Verse and Chorus sections separately for the best precision.
          </p>
        </section>
        
        <section className="bg-studio-800 p-6 rounded border border-studio-600">
          <h3 className="text-lg font-bold text-studio-highlight mb-2">4. "Eye Dialect" Accuracy</h3>
          <p className="text-sm mb-2">
            <strong>The Limit:</strong> The "Scottish" or "Patois" generation is a statistical approximation by the LLM. It is not a linguistically perfect IPA transcription.
          </p>
          <p className="text-sm">
            <strong>The Goal:</strong> It is optimized for <em>Transformers</em> (Suno/Udio), which often respond better to "crude" respellings (e.g., "Wah-tuh") than scientific IPA symbols.
          </p>
        </section>
      </div>
    </div>
  );
};
