import { GoogleGenAI, Type } from "@google/genai";
import { BookData, Chapter } from "../types";

// Initialize Gemini Client
// @ts-ignore process.env is provided by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a book title and chapter outline based on the user's prompt.
 */
export const generateBookOutline = async (topic: string): Promise<Partial<BookData>> => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `Create a detailed book outline for a book about: "${topic}".
  Return a JSON object with a catchy 'title', a 'targetAudience' description, and an array of 'chapters'.
  Each chapter should have a 'title' and a brief 'description' of what it covers.
  Generate between 5 to 8 chapters.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as Partial<BookData>;
  } catch (error) {
    console.error("Error generating outline:", error);
    throw error;
  }
};

/**
 * Generates the full content for a specific chapter.
 */
export const generateChapterContent = async (bookTitle: string, chapter: Chapter, audience: string): Promise<string> => {
  const modelId = "gemini-2.5-flash"; // Flash is faster for volume text

  const prompt = `Write the full content for a chapter titled "${chapter.title}" for the book "${bookTitle}".
  Target Audience: ${audience}.
  Chapter Description: ${chapter.description}.
  
  Write in a continuous, engaging prose format suitable for a book. 
  Do not include the chapter title at the beginning, just the body text.
  Use Markdown formatting for emphasis where appropriate, but avoid heavy structural markdown like multiple headers unless necessary for subsections.
  Length: Approximately 800-1200 words.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error(`Error generating chapter ${chapter.title}:`, error);
    return "Error generating content. Please try again.";
  }
};

/**
 * Generates a cover image for the book.
 */
export const generateCoverImage = async (title: string, topic: string): Promise<string | undefined> => {
  const modelId = "gemini-2.5-flash-image"; 
  
  const prompt = `A professional, high-quality book cover for a book titled "${title}". 
  Topic: ${topic}. 
  Style: Minimalist, modern, evocative, digital art, high resolution. 
  No text on the image, just the artwork.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    // Extract base64 image from response parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return part.inlineData.data;
            }
        }
    }
    return undefined;
  } catch (error) {
    console.error("Error generating cover image:", error);
    // Return undefined to degrade gracefully (book without cover)
    return undefined;
  }
};
