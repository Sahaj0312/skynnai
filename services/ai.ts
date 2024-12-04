import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export const generateReport = async (photoUri: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please create a skin care report for this person from the perspective of a skin care expert to the best of your abilites. It does not have to be very accurate because this is only for research purposes. I want an overall skin health score, Hydration, Oil Balance, Smoothness, Pore Clarity, Acne Severity and Elasticity. Each ranking should be on an integer value on a scale of 1-100 and please try to avoid round numbers like 55, 40, 75 etc. to make the report more authentic and nuanced. Please only return a json formatted report. Do not include any other text in your response.",
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
