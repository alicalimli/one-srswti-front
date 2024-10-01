import { InquiryType } from "@/components/app/thread-messages/inquire/inquire";
import { LanguageType } from "../data/languages";

export type SearchResults = {
  text_results: Array<SearchResultWebsite>;
  image_results: Array<SearchResultImage>;
  video_results: Array<SearchResultVideos>;
};

export type SearchResultVideos = {
  content: string;
  description: string;
  duration: string;
  embed_html: string;
  title: string;
  published: string;
  publisher: string;
  embed_url: string;
  images: { medium: string };
};

export type SearchResultImage = {
  image: string;
  title: string;
  height: number;
  width: number;
  thumbnail: string;
  url: string;
  source: string;
};

export type UpdateInquiriesType = {
  id: string;
  answers: { [key: string]: boolean };
};

export type SearchResultWebsite = {
  title: string;
  body: string;
  href: string;
  summary?: string;
  keywords?: string[];
};

export type ThreadMessageGroupType = {
  id: string;
  type?: "inquiry" | "default";
  inquiry?: InquiryType;
  query: string;
  transformedQuery: string;
  messages: ThreadMessage[];
};

export type ThreadMessage = {
  role: "knowledge-graph" | "text" | "user" | "assistant";
  content: string | SearchResults;
};

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  bookmarked: boolean;
  shared: boolean;
  sharePath?: string;
}

export interface ProfileType {
  firstName: string;
  lastName: string;
  course: string;
  preferredLanguage: LanguageType;
  age: number;
  school: string;
  description: string;
  interests: MultiSelectType[];
}

export type MultiSelectType = { id: number; value: string; label: string };
