import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
  model: 'mistral-small-latest',
  apiKey: process.env.MISTRAL_API_KEY
});

export async function generateResponse(message) {
  const response = await geminiModel.invoke([
    new HumanMessage(message)
  ])

  return response.text;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for chat conversations. User will provide you with the first message of a chat conversation, and you will generate a title that summarizes the main topic of the conversation. The title should be no more than 5 words long and should capture the essence of the conversation in a clear and engaging way. Here is the first
      `),
    new HumanMessage(`Generate a title for a chat conversation with the following first message: ${message}`)
  ])

  return response.text;
}
