import type { NextRequest } from "next/server"

import { OpenAIStream, OpenAIStreamPayload } from "@/utils/OpenAIStream"

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing Environment Variable OPENAI_API_KEY")
}

export const config = {
  runtime: "edge"
}

const basePromptPrefix = 'I want you to act as a travel guide. I will write you my location and you will suggest places to visit near my location. In some cases, I will give you the type of places I will visit. My first suggestion request is: I am in '

const handler = async (req: NextRequest): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { prompt } = (await req.json()) as {
    prompt?: string
  }

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "text-davinci-003",
    prompt: `${basePromptPrefix} ${prompt}\n`,
    temperature: 0.7,
    stream: true,
    max_tokens: 1024
  }

  const stream = await OpenAIStream(payload)

  return new Response(stream)
}

export default handler
