import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { truncateStringWithEllipsis } from "@/lib/utils";
import { motion } from "framer-motion";
import { PlayCircleIcon } from "lucide-react";
import React, { memo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SearchResultVideos } from "@/lib/types";

interface YoutubeResultsProps {
  results: SearchResultVideos[];
}

const YoutubeResults: React.FC<YoutubeResultsProps> = ({ results }) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const activeVideo = results?.find((r) => r.embed_url === selectedVideo);

  return (
    <Accordion
      type="single"
      collapsible
      className="bg-primary/10 border border-white/20 rounded-2xl overflow-hidden"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-sm border-b border-white/20 px-6 hover:opacity-80 active:scale-[0.98]">
          Video Results
        </AccordionTrigger>
        <AccordionContent className="p-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 ">
            {results?.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative cursor-pointer overflow-hidden rounded-[12px] group border border-white/20 shadow-lg aspect-video"
              >
                <div onClick={() => setSelectedVideo(result.embed_url)}>
                  <img
                    src={result.images?.medium}
                    alt={result.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black group-hover:bg-opacity-20 duration-200 bg-opacity-60 p-4 flex flex-col justify-end">
                    <h3 className="text-white text-md font-semibold mb-2">
                      {truncateStringWithEllipsis(result.title, 64)}
                    </h3>
                    <PlayCircleIcon className="absolute size-5 z-10 opacity-30 top-4 right-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Dialog
            open={!!selectedVideo}
            onOpenChange={() => setSelectedVideo(null)}
          >
            <DialogContent className="max-w-5xl flex flex-col p-6 border-white/10 h-[98svh] max-h-[40rem] bg-primary/20 backdrop-blur-lg">
              <DialogTitle>{activeVideo?.title}</DialogTitle>
              {selectedVideo && (
                <iframe
                  width="100%"
                  height="315"
                  src={activeVideo?.embed_url}
                  title="YouTube video player"
                  className="rounded-[16px] h-full w-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </DialogContent>
          </Dialog>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default memo(YoutubeResults);
