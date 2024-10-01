import { DUCKDUCKGO_API_URL } from "../config";
import { SearchResults, SearchResultWebsite } from "../types";

export async function duckDuckGoSearch({
  query,
  maxResults,
  searchType,
  withCrawling,
}: {
  searchType?: string;
  query: string;
  withCrawling?: boolean;
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

    const data: SearchResults = await response.json();

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DuckDuckGo API error (${response.status}):`, errorText);
      throw new Error(
        `DuckDuckGo API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const resultsSimulation: SearchResultWebsite[] = [];

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
