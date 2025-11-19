import { GoogleGenAI, Type } from "@google/genai";
import { WordUnit, AccentType } from "../types";

const SYSTEM_INSTRUCTION = `
You are a world-class "Lyric Luthier" and expert in "Eye Dialect" for AI music transformers (Suno, Udio).
Your goal is to rewrite lyrics phonetically to force specific accents and rhythms.

CRITICAL INSTRUCTION: OUTPUT ONLY PHONETIC RESPELLINGS.
Do not output standard English unless it is the only way to represent the sound.

Rules:
1. AGGRESSIVELY phonetically respell standard English into "Eye Dialect" based on the target accent. 
   - "The" -> "Thuh", "Da", "Dee" (depending on accent).
   - "Love" -> "Luv", "Lahv".
   - "Running" -> "Run-nin".
2. Use ALL CAPS for stressed syllables if emphasized (e.g., "e-MO-shun").
3. Use hyphens to separate syllables for clarity (e.g., "sep-a-rate").
4. Map ambiguous vowels to: 'ay' (stay), 'ee' (tree), 'eye' (buy), 'oh' (go), 'oo' (food).
5. Respect the number of words provided. Map 1 input word to 1 output phonetic string.
`;

export const processLyricsWithGemini = async (
  apiKey: string,
  words: WordUnit[],
  targetAccent: AccentType
): Promise<WordUnit[]> => {
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  // Filter only unlocked words for processing
  const unlockedWords = words.filter(w => !w.isLocked);
  
  if (unlockedWords.length === 0) return words;

  const inputList = unlockedWords.map(w => w.original);

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        original: { type: Type.STRING },
        phonetic: { type: Type.STRING, description: "The phonetic respelling in Eye Dialect" },
      },
      required: ["original", "phonetic"],
    },
  };

  const prompt = `
    Target Accent: ${targetAccent}
    
    Convert the following list of words into phonetic eye-dialect.
    Input Words: ${JSON.stringify(inputList)}
    
    Return a JSON array where each object matches the input word order.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4,
      },
    });

    const rawText = response.text || "[]";
    const cleanText = rawText.replace(/```json|```/g, '').trim();
    let jsonResponse;
    
    try {
        jsonResponse = JSON.parse(cleanText);
    } catch (e) {
        console.warn("Failed to parse JSON directly, trying to fix", cleanText);
        jsonResponse = []; // Fallback
    }

    const newPhonetics = jsonResponse as { original: string; phonetic: string }[];

    let processIndex = 0;
    return words.map((word) => {
      if (word.isLocked) return word;

      const update = newPhonetics[processIndex];
      processIndex++;

      if (update && update.phonetic) {
        return {
          ...word,
          phonetic: update.phonetic,
        };
      }
      return word;
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to process lyrics with AI");
  }
};
