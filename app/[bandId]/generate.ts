"use server";

import { Song } from "@/lib/db";
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const setlistSchema = z.object({
  setlist: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      key: z.string(),
    })
  ),
  assistantMessage: z.string(),
});

export type SetlistResponse = z.infer<typeof setlistSchema>;

const RESPONSE_JSON_FORMAT = setlistSchema.parse({
  setlist: [
    {
      id: "string",
      title: "string",
      key: "string",
    },
  ],
  assistantMessage: "string",
});

export async function generate(params: { repertoire: Song[]; prompt: string }) {
  const repertoire = params.repertoire.map((song) => {
    return {
      id: song.id,
      title: song.title,
      key: song.key,
      description: song.description,
    };
  });

  const systemPrompt = `
  Your purpose is to generate a setlist for a band.
  The user will provide you with a prompt, and your job is to use that prompt to generate a setlist given a song repertoine in JSON. 
  You should pick around 10 songs for the setlist, but adjust as needed if the user asks for more or less. 
  
  Your response should include the songs and a message about the setlist in the following JSON format: 
  ${JSON.stringify(RESPONSE_JSON_FORMAT)} 

  Here is the song repertoire in JSON format:
  ${JSON.stringify(repertoire)}
  `;

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      { role: "user", content: params.prompt },
    ],
    model: "gpt-4o",
    response_format: {
      type: "json_object",
    },
    n: 1,
  });

  const [choice] = chatCompletion.choices;
  if (typeof choice.message.content !== "string") {
    throw new Error("Choice is not a string");
  }

  const result = setlistSchema.parse(JSON.parse(choice.message.content));

  return result;
}
