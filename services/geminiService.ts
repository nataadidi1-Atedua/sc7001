import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Language } from '../types';

/* Obtain API key exclusively from process.env.API_KEY per guidelines */
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getAITutorResponse = async (prompt: string, language: Language = 'pt') => {
  const ai = getAIClient();
  
  const languageNames: Record<Language, string> = {
    pt: 'Português do Brasil',
    en: 'English',
    es: 'Español',
    fr: 'Français',
    zh: 'Chinese (Simplified)',
    ja: 'Japanese',
    it: 'Italiano'
  };

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are EduBot, a helpful academic tutor. Help students with subject questions, explain complex concepts simply, and motivate them. You MUST respond in ${languageNames[language]}.`,
    },
  });

  const response = await chat.sendMessage({ message: prompt });
  return response.text;
};

export const summarizeNotes = async (text: string, language: Language = 'pt') => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summarize the following academic content in clear, objective bullet points. Language: ${language}.\n\n${text}`,
  });
  return response.text;
};