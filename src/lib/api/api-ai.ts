import axios from "axios";
import { cryptoDecryptData, cryptoEncryptData } from "./encoder-decoder";

export const srswtiInference = async ({
  history = [],
  maxOutputTokens = 4096,
  shouldFail,
}: {
  history: { content: string; role: "assistant" | "user" }[];
  maxOutputTokens?: number;
  shouldFail?: boolean;
}) => {
  const raw = {
    ramanujanModel: "ramanujan-l2",
    rest: {
      max_tokens: maxOutputTokens,
      messages: history,
    },
  };

  const urls = [
    "https://router.srswti.com/rene/ren",
    "https://router.srswti.com/ram/rinf",
  ];
  const makeRequest = async (encrypt) => {
    if (shouldFail) {
      throw new Error("error");
    }

    const url = encrypt ? urls[0] : urls[1];
    const data = encrypt
      ? { encryptedData: cryptoEncryptData(JSON.stringify(raw)) }
      : raw;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
      url,
    };

    const response = await axios(requestOptions);

    if (response.status !== 200) throw new Error("Request failed");

    const res = response.data;
    const resultData = encrypt
      ? JSON.parse(cryptoDecryptData(res.encryptedData))
      : res;

    console.log(resultData);

    return resultData?.content[0]?.text;
  };

  try {
    return await makeRequest(true);
  } catch (error) {
    console.error("Encrypted request failed:", error);
    try {
      return await makeRequest(false);
    } catch (secondError) {
      console.error("Unencrypted request failed:", secondError);
      throw new Error(secondError);
    }
  }
};
