import React from "react";
import { SearchResults } from "../types";
import { getStructuredResultContext } from "../utils/get-structured-result-context";
import { srswtiInference } from "../api/api-ai";

const getWritingPrompt = (context) => {
  return `
  You are a professional writer tasked with generating concise, informative answers. Follow these guidelines:

    1. Answer Format:
      - Maximum length: 400 words
      - Use Markdown format
      - Link format: [link text](url)
      - Image format: ![alt text](url)
      - LaTeX Formulas: Strictly use LaTeX syntax that can be parsed into a human readable format whenever there is LaTeX in the response.

    2. Information Sources:
      - Use ONLY the provided search results (URL and content)
      - Do not include external information

    3. Writing Style:
      - Maintain an unbiased, journalistic tone
      - Be comprehensive yet concise
      - Avoid repetition

    4. Content Organization:
      - Directly address the user's question
      - Synthesize information from multiple search results
      - Create a coherent, well-structured answer
      - Ensure proper structure and context for all content, including bullet points
      - Use appropriate headings, subheadings, and paragraphs to organize information
      - Maintain logical flow and connections between different parts of the response

    5. Citations and References:
      - Always cite the source URL when quoting or referencing specific information
      - Format: "According to [Source Name](source_url), ..."

    6. Visual Elements:
      - Include relevant images if available in the search results

    7. Language Matching:
      - Adapt your response to match the user's language

    8. User Profile Consideration:

    9. Quality Control:
      - Ensure accuracy of information
      - Double-check all links and image references
      - Verify that all content is properly contextualized and structured


    Remember: Your goal is to provide a clear, accurate, and tailored response using only the given search results while adhering to these guidelines. Ensure that all parts of your response, including any lists or bullet points, are properly structured and in context with the overall answer.

    Here's the information about the websites:
    "${context}"
    `;
};

interface getSearchAnswerProps {
  searchResults: SearchResults;
}

const getSearchAnswer = async ({ searchResults }: getSearchAnswerProps) => {
  const resultContext = getStructuredResultContext(searchResults);
  const prompt = getWritingPrompt(resultContext);

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
    return "Coudn't generate a response.";
  }
};

export default getSearchAnswer;
