import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function mapLocalDialect(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Translate this local Indian dialect or informal query into standard English keywords for a government scheme search. 
      Query: "${query}"
      Return ONLY the keywords, comma separated.`,
    });
    return response.text?.trim() || query;
  } catch (error) {
    console.error("Gemini Error:", error);
    return query;
  }
}

export async function getSchemeRecommendations(userProfile: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Based on this user profile, recommend 3 types of government schemes they might be eligible for in India.
      Profile: ${JSON.stringify(userProfile)}
      Return as a JSON array of objects with 'title' and 'reason'.`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
}
