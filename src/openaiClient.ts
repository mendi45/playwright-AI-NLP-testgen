import { config } from "dotenv";
import OpenAI from "openai";
config();

const openai = new OpenAI();

export async function generateFromPrompt(prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });
  return completion.choices[0].message.content || '';
}
