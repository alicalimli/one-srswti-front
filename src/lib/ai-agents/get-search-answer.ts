import { srswtiInference } from "../api/api-ai";
import { getLLMode, LLMModeId } from "../data/dataModes";

interface getSearchAnswerProps {
  context: string;
  llmMode?: LLMModeId | null;
}

const getSearchAnswer = async ({ context, llmMode }: getSearchAnswerProps) => {
  const llmModeData = llmMode ? getLLMode(llmMode) : null;

  const currentDate = new Date().toLocaleString();

  const prompt = `
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


      ${
        llmModeData
          ? `

        10. Focus Mode Handling:
          a. ALWAYS adjust your search query, tool selection, and response style based on the active focus mode:
          - ${llmModeData.title}: ${llmModeData.researcher}

          The user is currently using ${llmModeData.title} mode.

        `
          : ""
      }
    
    Remember: Your goal is to provide a clear, accurate, and tailored response using only the given search results while adhering to these guidelines. Ensure that all parts of your response, including any lists or bullet points, are properly structured and in context with the overall answer.
    
    Current date and time: '${currentDate}
    
    "${context}"
    `;

  try {
    const res = await srswtiInference({
      history: [{ role: "user", content: prompt }],
    });

    if (!res) {
      throw new Error("Invalid response from srswtiInference");
    }

    return res.trim();
  } catch (error) {
    console.error("Error in transformUserQuery:", error);
    return "Coudn't generate a response.";
  }
};

export default getSearchAnswer;
