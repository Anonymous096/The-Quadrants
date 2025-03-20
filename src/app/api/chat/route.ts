import { Configuration, OpenAIApi } from "openai-edge";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getContext } from "@/lib/context";

export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, chatId } = body;

    // ✅ Validate request data
    if (!chatId || !messages || messages.length === 0) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // ✅ Fetch chat from DB
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];

    // ✅ Handle empty messages safely
    if (!lastMessage || !lastMessage.content) {
      return NextResponse.json({ error: "No valid message content" }, { status: 400 });
    }

    // ✅ Get context from stored file
    const context = await getContext(lastMessage.content, fileKey);

    // ✅ System prompt for OpenAI
    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain and can accurately answer nearly any question.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK provided in a conversation.
      If the context does not provide the answer, AI will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses but will indicate when new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.`,
    };

    // ✅ Call OpenAI API
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [prompt, ...messages.filter((message: Message) => message.role === "user")],
      stream: true,
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    // ✅ Handle streaming response
    const stream = OpenAIStream(response, {
      onStart: async () => {
        try {
          await db.insert(_messages).values({
            chatId,
            content: lastMessage.content,
            role: "user",
          });
        } catch (error) {
          console.error("Database error (saving user message):", error);
        }
      },
      onCompletion: async (completion) => {
        try {
          await db.insert(_messages).values({
            chatId,
            content: completion,
            role: "system",
          });
        } catch (error) {
          console.error("Database error (saving AI message):", error);
        }
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
