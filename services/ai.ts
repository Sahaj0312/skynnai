import { UserData } from "@/types";
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
            text: "Please create a skin care report for this person from the perspective of a skin care expert to the best of your abilites. It does not have to be very accurate because this is only for research purposes. I want an overall skin health score, Hydration, Oil Balance, Skin Tone, Pore Clarity, Acne Severity and Elasticity. Each ranking should be on a scale of 1-100. Please format the report in json so it is easy to parse. If you do not see a face in the image, please say 'No face detected'.",
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
    max_tokens: 300,
  });

  return response.choices[0].message.content;
};
