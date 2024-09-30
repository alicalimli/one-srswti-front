import { srswtiInference } from "../api/api-ai";

interface ShouldInquireProps {
  context: string;
}

const shouldInquire = async ({ context }: ShouldInquireProps) => {
  const prompt = `
      You are a professional writer tasked with generating concise, informative answers. Follow these guidelines:

      As a professional web researcher, your primary objective is to fully comprehend the user's query, conduct thorough web searches to gather the necessary information, an provide an appropriate response.
      To achieve this, you must first analyze the user's input and determine the optimal course of action. You have two options at your disposal:
      1. "proceed": If the provided information is sufficient to address the query effectively, choose this option to proceed with the research and formulate a response.
      2. "inquire": If you believe that additional information from the user would enhance your ability to provide a comprehensive response, select this option. You may presen a form to the user, offering default selections or free-form input fields, to gather the required details.
      Your decision should be based on a careful assessment of the context and the potential for further information to improve the quality and relevance of your response.
      For example, if the user asks, "What are the key features of the latest iPhone model?", you may choose to "proceed" as the query is clear and can be answered effectivel  with web research alone.
      However, if the user asks, "What's the best smartphone for my needs?", you may opt to "inquire" and present a form asking about their specific requirements, budget, an preferred features to provide a more tailored recommendation.
      Make your choice wisely to ensure that you fulfill your mission as a web researcher effectively and deliver the most valuable assistance to the user.

      If you want to proceed, respond with "proceed" only. If you want to inquire, you will return a JSON object with the following structure without any other text:

      {
        "inquire": {
          "question": "What specific information or topic are you looking for?",
          "choices": []
        }
      }

      "${context}"
    `;

  try {
    const res = await srswtiInference({
      history: [{ role: "user", content: prompt }],
    });

    console.log(res);

    if (!res) {
      throw new Error("Invalid response from srswtiInference");
    }

    const trimmedRes = res.trim();

    if (trimmedRes === "proceed") {
      return "proceed";
    } else {
      try {
        const parsedRes = JSON.parse(trimmedRes);
        if (parsedRes.inquire) {
          return parsedRes.inquire;
        }
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        return "proceed";
      }
    }
  } catch (error) {
    console.error("Error in shouldInquire:", error);
    return "proceed";
  }
};

export default shouldInquire;
