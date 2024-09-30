import { srswtiInference } from "../api/api-ai";

async function transformUserQuery(query: string): Promise<string> {
  const prompt = `
    Optimize this user query for internet search:
    - Identify main topics and key concepts
    - Use specific keywords and relevant synonyms
    - Add quotation marks or search operators if needed
    - Keep it concise and search-engine friendly
    - Return only the optimized query

    Query: "${query}"
    
    Your response would only be the new query without double quotes.
    `;

  try {
    const res = await srswtiInference({
      question: prompt,
      withBs64: false,
      extraPayload: {
        user_id: "ebee54f3-7691-4e3c-a895-a7d7a508af7a",
      },
    });

    if (!res || !res.response) {
      throw new Error("Invalid response from srswtiInference");
    }

    return res.response.trim();
  } catch (error) {
    console.error("Error in transformUserQuery:", error);
    return query.trim();
  }
}

export { transformUserQuery };
