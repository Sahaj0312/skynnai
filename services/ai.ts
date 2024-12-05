import AsyncStorage from "@react-native-async-storage/async-storage";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export const generateReport = async (photoUri: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a skin care expert tasked with creating detailed skin care reports. Assess skin health metrics including overall health score, hydration, oil balance, smoothness, pore clarity, acne severity, and elasticity. Identify three very concise 2-3 word critical skin issues. All metrics should be integers on a scale of 1-100, avoiding round numbers for authenticity. Return the results strictly as a JSON object without additional text.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please create a skin care report for this person. This is for research purposes, so it does not have to be perfectly accurate.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${photoUri}`,
            },
          },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "skin_analysis",
        schema: {
          type: "object",
          properties: {
            face_detected: {
              type: "boolean",
              description: "Indicates whether a face has been detected.",
            },
            overall_skin_health_score: {
              type: "number",
              description: "Overall score representing the skin's health.",
            },
            hydration: {
              type: "number",
              description: "Score representing the skin's hydration level.",
            },
            oil_balance: {
              type: "number",
              description: "Score indicating the balance of oil on the skin.",
            },
            smoothness: {
              type: "number",
              description: "Score indicating the smoothness of the skin.",
            },
            pore_clarity: {
              type: "number",
              description: "Score reflecting the clarity of pores.",
            },
            acne_severity: {
              type: "number",
              description: "Score representing the severity of acne.",
            },
            elasticity: {
              type: "number",
              description: "Score indicating the elasticity of the skin.",
            },
            issues: {
              type: "array",
              description:
                "Array of strings describing 3 critical issues with the skin.",
              items: {
                type: "string",
              },
            },
          },
          required: [
            "face_detected",
            "overall_skin_health_score",
            "hydration",
            "oil_balance",
            "smoothness",
            "pore_clarity",
            "acne_severity",
            "elasticity",
            "issues",
          ],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    max_tokens: 300,
  });

  return response.choices[0].message.content;
};

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatWithAI(messages: ChatMessage[]) {
  const existingReports = await AsyncStorage.getItem("userReports");
  const reports = existingReports ? JSON.parse(existingReports) : [];
  let prompt = "";
  if (reports.length > 0) {
    const latestReport = reports[0];
    prompt = `You are a dermatologist. You only answer questions related to dermatology, skin care, and skin health. If a question is unrelated to dermatology, politely redirect the user. Here is the latest report so you may reference it in your responses: ${JSON.stringify(
      latestReport.reportData
    )}`;
  } else {
    prompt =
      "You are a dermatologist. You only answer questions related to dermatology, skin care, and skin health. If a question is unrelated to dermatology, politely redirect the user.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        ...messages,
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in chatWithAI:", error);
    throw new Error("Failed to get AI response");
  }
}
