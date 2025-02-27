import { Dispatch } from "@reduxjs/toolkit";
import { DUCKDUCKGO_API_URL } from "../config";
import {
  NewsResult,
  SearchResults,
  SearchResultWebsite,
  ThreadMessageGroupType,
} from "../types";
import { updateThreadMessage } from "../redux/slices/slice-thread";

export async function duckDuckGoSearch({
  query,
  maxResults,
  searchType,
  quickSearch,
  messageObject,
  dispatch,
}: {
  dispatch: Dispatch;
  messageObject: ThreadMessageGroupType;
  searchType?: "general" | "news";
  query: string;
  quickSearch?: boolean;
  maxResults: number;
}): Promise<SearchResults> {
  const apiUrl = DUCKDUCKGO_API_URL;

  if (!apiUrl) {
    throw new Error(
      "DUCKDUCKGO_API_URL is not set in the environment variables"
    );
  }

  try {
    let endpoint = "/ddgs_search";
    let requestBody: any = {
      query,
      max_results: maxResults,
      region: "wt-wt",
      safesearch: "moderate",
    };

    if (searchType === "news") {
      endpoint = "/ddgs_news";
      requestBody.timelimit = "w";
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const resultData: SearchResults = await response.json();

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DuckDuckGo API error (${response.status}):`, errorText);
      throw new Error(
        `DuckDuckGo API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    console.log(resultData);
    const newsDataToWebsitesData = (
      newsResults: NewsResult[]
    ): SearchResultWebsite[] => {
      return newsResults.map((n) => ({
        title: n.title,
        body: n.body,
        href: n.url,
        keywords: [],
        summary: n.body,
      }));
    };

    const data: SearchResults = {
      image_results: resultData.image_results ?? [],
      text_results:
        searchType === "news" && resultData?.news_results
          ? newsDataToWebsitesData(resultData.news_results)
          : resultData.text_results,
      video_results: resultData.video_results ?? [],
    };

    console.log(data);

    const resultsSimulation: SearchResultWebsite[] = [];

    let content = {
      image_results: [],
      text_results: [],
      video_results: [],
    };

    const batchSize = 5;

    for (let i = 0; i < maxResults; i += batchSize) {
      const batch = data.text_results.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (result, index) => {
          const payload = JSON.stringify({
            url: result.href,
            summary_type: "balanced",
            keyword_count: 5,
          });

          let websiteWithSummary = null;

          // Replace contentSummarizer with the new API crawler
          try {
            const crawlerResponse = await fetch(`${apiUrl}/crawl`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: payload,
            });

            websiteWithSummary = await crawlerResponse.json();
            console.log("summarizing");
          } catch (e) {
            console.log("CRAWLER ERROR", e);
          }

          // Adapt the crawler response to match the expected format
          const adaptedResult: SearchResultWebsite = {
            ...result,
            title: websiteWithSummary?.title || result.title,
            summary: websiteWithSummary?.summary || result.body,
            body: result.body,
            keywords: websiteWithSummary?.keywords || [],
          };

          content.text_results.push(adaptedResult);
          console.log("updating", content);
          const newMessageObject = {
            ...messageObject,
            content,
          };
          console.log("obj", newMessageObject);

          dispatch(updateThreadMessage(newMessageObject));
          resultsSimulation.push(adaptedResult);
        })
      );
    }

    const finalResult = {
      ...data,
      text_results: resultsSimulation,
    };

    return finalResult;
  } catch (error) {
    console.error("DuckDuckGo API or Crawler error:", error);
    throw error;
  }
}
