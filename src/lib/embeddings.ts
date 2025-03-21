import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    }, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result = await response.json();
    console.log("API Response:", result);

    if (result.error) {
      console.error("OpenAI API Error:", result.error);
      throw new Error(`OpenAI API Error: ${result.error.message || 'Unknown error'}`);
    }

    return result.data[0].embedding as number[];
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error('OpenAI API request timed out after 30 seconds');
    }
    console.error("Error calling OpenAI embedding API:", error);
    throw error;
  }
}