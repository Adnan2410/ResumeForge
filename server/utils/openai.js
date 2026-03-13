import OpenAI from "openai";
import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
dotenv.config();

// Fixes the error by explicitly setting the baseURL to OpenRouter
export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const getAIReview = async (resumeText) => {
  // We keep your full, high-quality "Principal Recruiter" prompt here
  const prompt = `
You are an AI Resume Strategist, embodying the persona of a **Principal Recruiter at a top-tier global company (e.g., Google, Meta, Netflix)**. 
Your goal is to provide realistic, honest, and strategic recommendations designed to elevate the provided resume to the **top 5% of applicants**.

---
### **Evaluation Protocol**
1. **Infer Target Role:** Analyze the resume to infer the target role.
2. **Apply 2026 Hiring Standards:** Conduct a critical review based on Quantifiable Impact, ATS Alignment, and Clarity.
3. **Score with a Strict Rubric:** Use a 1-10 scale. 

---
🔍 First, infer whether the resume is for a **tech** or **non-tech** role.
🎯 Be strict — do not inflate scores.
💬 Provide realistic improvement tips with **specific examples**.

---
📦 Return only this JSON format:
{
  "resumeType": "Tech" or "Non-Tech",
  "score": {
    "skills": number,
    "projects": number,
    "experience": number,
    "communication": number,
    "formatting": number,
    "overall": number
  },
  "summary": "string",
  "pros": ["string"],
  "cons": ["string"],
  "suggestions": ["string"],
  "formattingTips": ["string"],
  "keywordsToAdd": ["string"],
  "wordsToRemove": ["string"]
}

Resume Text:
"""
${resumeText}
"""
`;

  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001", // This matches the ID in your screen recording
      messages: [
        { role: "system", content: "You are a professional resume reviewer. Return ONLY valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 1500,
    });

    const result = response.choices[0].message.content.trim();

    // Clean markdown code blocks from the AI response
    const cleaned = result
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/```$/, "")
      .trim();

    console.log("🧠 Raw AI Response received from Gemini");

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON parsing failed. Raw output was:", result);
      throw new Error("AI returned invalid JSON format.");
    }
  } catch (error) {
    console.error("AI Review error:", error);
    return {
      score: { overall: 0 },
      summary: "❌ AI review failed. Please check your OpenRouter API key and internet connection.",
      pros: [],
      cons: [],
      suggestions: ["Check backend console for error details"],
    };
  }
};
// This function is needed by customizeResumeController.js
export const getOpenAIResponse = async (prompt) => {
  try {
    // 2. Inside getOpenAIResponse
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001", // Updated Model ID
      messages: [
        { role: "system", content: "You are a helpful assistant. Always reply clearly and concisely." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error in getOpenAIResponse:", error);
    throw new Error("❌ Failed to get AI response for customization.");
  }
};