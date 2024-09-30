import { SearchResultWebsite } from "@/lib/types";
import { LinkIcon } from "lucide-react";

const KnowledgeGraphModal = ({
  activeSummary,
}: {
  activeSummary: SearchResultWebsite | null;
}) => {
  return (
    <main className="">
      <h3 className="text-xl mb-4 flex items-start gap-2">
        {activeSummary?.title}{" "}
        <a
          href={activeSummary?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-50 duration-150 mt-1"
        >
          <LinkIcon className="size-4" />
        </a>
      </h3>
      <p className="opacity-70 leading-[1.8]">{activeSummary?.summary}</p>

      <ul className="flex flex-wrap gap-2 mt-4">
        {activeSummary?.keywords?.map((tag: string) => (
          <li key={tag} className="p-2 text-xs bg-primary/30 rounded">
            {tag}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default KnowledgeGraphModal;
