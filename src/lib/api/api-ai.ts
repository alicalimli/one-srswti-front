import { LLM_INFERENCE } from "@/lib/config";
import { decodeApiData, encodeAPIData } from "./encoder-decoder";

export const srswtiInference = async ({
  question = "",
  history = [],
  endpoint = LLM_INFERENCE,
  withBs64 = false,
  extraPayload = {},
}) => {
  const sendRequest = async (assistantType: "srswti-fast" | "flash") => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const messageObject = {
      message: question,
      assistant_type: assistantType,
      user_id: "ebee54f3-7691-4e3c-a895-a7d7a508af7a",
      llm_chathistory: [...history],
      ...extraPayload,
    };

    const base64Data = encodeAPIData(messageObject);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: {},
      redirect: "follow",
    };

    let response;

    if (withBs64) {
      const APIRes = await fetch(
        `${endpoint}?ed=${base64Data}`,
        requestOptions
      );

      const responseJSON = await APIRes.json();

      response = decodeApiData(responseJSON.response);
    } else {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageObject),
      };
      const APIRes = await fetch(`${endpoint}`, requestOptions);
      const responseJSON = await APIRes.json();
      response = responseJSON.response;
    }

    return response;
  };

  try {
    const model = endpoint === LLM_INFERENCE ? "flash" : "srswti-fast";

    const response = await sendRequest(model);

    return {
      response,
    };
  } catch (error) {
    console.log(error);

    const model = endpoint === LLM_INFERENCE ? "srswti-fast" : "flash";

    const response = await sendRequest(model);
    return {
      response,
    };
  }
};
