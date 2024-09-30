import { srswtiInference } from "../api/api-ai";

async function transformUserQuery({
  query,
  historyContext,
}: {
  query: string;
  historyContext: string;
}): Promise<string> {
  const prompt = `
    As an expert search query optimizer, your task is to craft the perfect search query based on the user's current query and the conversation history. This optimized query will be used to research the internet and provide the user with precise, relevant information.

    Guidelines:
    1. Analyze the user's current query and the conversation history for context.
    2. Identify the core information need and any implicit requirements.
    3. Include essential keywords and concepts from both the current query and relevant historical context.
    4. Remove any unnecessary words or phrases that might dilute the search results.
    5. Use advanced search operators if appropriate (e.g., quotation marks for exact phrases).
    6. Ensure the query is concise yet comprehensive, typically 4-8 words long.
    7. Format the query to maximize relevance in search engine results.

    Your response should be ONLY the optimized search query, without any explanation or double quotes.

    Current Query: "${query}"

    Conversation History:
    ${historyContext}
    `;

  try {
    const res = await srswtiInference({
      history: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: "I will summarize the query in 4-5 words.",
        },
      ],
    });

    if (!res) {
      throw new Error("Invalid response from srswtiInference");
    }

    return res.trim();
  } catch (error) {
    console.error("Error in transformUserQuery:", error);
    return query.trim();
  }
}

export { transformUserQuery };
