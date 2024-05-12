"use server";

import { Song } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

const RESPONSE_JSON_FORMAT = {
  setlist: [
    {
      title: "string",
      key: "string",
    },
  ],
};

export async function generate(params: { repertoire: Song[]; prompt: string }) {
  const repertoire = params.repertoire.map((song) => {
    return {
      title: song.title,
      key: song.key,
      description: song.description,
    };
  });

  const systemPrompt = `
  Your purpose is to generate a setlist for a band.
  The user will provide you with a prompt, and your job is to use that prompt to generate a setlist given a song repertoine in JSON. 
  You should pick around 10 songs for the setlist, but adjust as needed if the user asks for more or less. 
  
  Your response should in the following JSON format: 
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
    model: "gpt-3.5-turbo",
    response_format: {
      type: "json_object",
    },
    n: 1,
  });

  const [choice] = chatCompletion.choices;
  if (typeof choice.message.content !== "string") {
    throw new Error("Choice is not a string");
  }

  const result: {
    setlist: { title: string; key: string }[];
  } = JSON.parse(choice.message.content);

  return result;
}
