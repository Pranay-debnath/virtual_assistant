import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function getResponse(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1000,
      },
    });

    let text = "";

    // Compatible with latest SDK
    if (typeof response.text === "function") {
      text = response.text();
    } else {
      text = response.text;
    }

    if (!text || text.trim() === "") {
      return "Sorry, I couldn't generate a response.";
    }

    return text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);

    return "Sorry, I am having trouble connecting to Gemini right now.";
  }
}