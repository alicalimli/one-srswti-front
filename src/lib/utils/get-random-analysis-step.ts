export const getRandomAnalysisSteps = (
  count: number = 5
): { id: number; message: string }[] => {
  const stepCategories = [
    [
      "Initiated web crawling for relevant sources",
      "Started data collection from target websites",
      "Began scanning online resources for information",
      "Launched automated data retrieval process",
      "Commenced digital exploration for pertinent data",
    ],
    [
      "Extracted key information from target websites",
      "Parsed crucial data points from web content",
      "Gathered essential details from online sources",
      "Filtered and collected relevant information",
      "Compiled significant data from various web platforms",
    ],
    [
      "Analyzed semantic relationships between concepts",
      "Processed linguistic connections in the data",
      "Examined contextual links within the information",
      "Evaluated conceptual associations in gathered content",
      "Investigated semantic networks within the dataset",
    ],
    [
      "Performed natural language processing on gathered text",
      "Applied text analysis algorithms to collected data",
      "Conducted linguistic examination of acquired content",
      "Implemented NLP techniques for textual insights",
      "Executed advanced language parsing on compiled information",
    ],
    [
      "Identified primary themes and topics in the content",
      "Recognized main subjects within the information",
      "Determined key focus areas in the gathered data",
      "Discerned central concepts from analyzed material",
      "Extracted core themes from processed content",
    ],
  ];

  return stepCategories.slice(0, count).map((category, index) => ({
    id: index + 1,
    message: category[Math.floor(Math.random() * category.length)],
  }));
};
