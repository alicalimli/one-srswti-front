import { SearchResults, SearchResultWebsite } from "../types";

export const getStructuredResultContext = (results: SearchResults) => {
  let formattedString = "Websites:\n";

  results.text_results.forEach((result: SearchResultWebsite, index: number) => {
    formattedString += `Website ${index + 1} Title: ${result.title}\n`;
    formattedString += `URL: ${result.href}\n`;
    formattedString += `Content: ${result.summary}\n`;
    formattedString += `Keywords: ${result.keywords?.join(", ")}\n\n`;
  });

  formattedString += "Videos:\n";
  results.video_results.forEach((video, index) => {
    formattedString += `Video ${index + 1} Title: ${video.content}\n`;
    formattedString += `Content: ${video.content}\n\n`;
  });

  formattedString += "Images:\n";
  results.image_results.forEach((image, index) => {
    formattedString += `Image ${index + 1}: ${image.image}\n`;
  });

  return formattedString;
};
