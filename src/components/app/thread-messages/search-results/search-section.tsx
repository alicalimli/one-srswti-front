import type { SearchResults } from "@/lib/types";
import KnowledgeGraph from "./knowledge-graph";
import { memo } from "react";
import YoutubeResults from "./search-youtube-results";
import SearchImages from "./search-images";

export type SearchSectionProps = {
  searchResults: SearchResults;
  query: string;
  pending?: boolean;
};

function SearchSection({ query, searchResults }: SearchSectionProps) {
  const maxResults = searchResults.text_results?.length;
  const pending = false;

  return (
    <>
      <KnowledgeGraph
        pending={pending}
        query={query}
        maxResults={maxResults}
        searchResult={searchResults?.text_results}
      />

      {!pending && (
        <>
          <YoutubeResults results={searchResults?.video_results} />

          {searchResults?.image_results && (
            <SearchImages images={searchResults?.image_results} query={query} />
          )}
        </>
      )}
    </>
  );
}

export default memo(SearchSection);
