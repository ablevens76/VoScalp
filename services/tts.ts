/**
 * A wrapper around the Web Speech API to provide immediate audio feedback.
 * While not as high-fidelity as Suno/Udio, it helps check rhythm and phonetic flow.
 */

export const speakPreview = (text: string, accent: string) => {
  if (!('speechSynthesis' in window)) {
    console.warn('TTS not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9; // Slightly slower to hear phonetics clearly
  utterance.pitch = 1.0;

  // Try to find a matching voice based on the requested accent
  const voices = window.speechSynthesis.getVoices();
  let selectedVoice = null;

  const lowerAccent = accent.toLowerCase();

  if (lowerAccent.includes('british') || lowerAccent.includes('rp') || lowerAccent.includes('scottish')) {
    selectedVoice = voices.find(v => v.lang.includes('en-GB'));
  } else if (lowerAccent.includes('southern') || lowerAccent.includes('american')) {
    selectedVoice = voices.find(v => v.lang.includes('en-US'));
  } else if (lowerAccent.includes('french')) {
    // Sometimes using a French voice to read English approximates the accent
    selectedVoice = voices.find(v => v.lang.includes('fr-FR'));
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
