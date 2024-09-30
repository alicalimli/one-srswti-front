import { Dialog } from "@/components/ui/dialog";
import { SearchResultImage } from "@/lib/types";
import { ImageIcon, PlusCircle } from "lucide-react";
import { useState, Suspense, memo } from "react";
import { motion } from "framer-motion";
import React, { lazy } from "react";

const SearchImagesDialog = lazy(() => import("./search-images-dialog"));

interface SearchImagesProps {
  images: SearchResultImage[];
  query?: string;
}

const SearchImages: React.FC<SearchImagesProps> = ({
  images: resultImages,
  query,
}) => {
  const images = resultImages.slice(0, 4);
  console.log(images);
  const [open, setOpen] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // If enabled the include_images_description is true, the images will be an array of { url: string, description: string }
  // Otherwise, the images will be an array of strings

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-4 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {images.map((image, index) => (
        <motion.div key={index} variants={itemVariants}>
          <button
            className="aspect-video w-full cursor-pointer relative block hover:opacity-60 duration-200 btn-effect"
            onClick={() => {
              setSelectedIndex(index);
              setOpen(true);
            }}
          >
            <ImageIcon className="absolute size-4 z-10 opacity-30 top-4 right-4" />
            {image ? (
              <img
                src={image.thumbnail}
                alt={`Search Result Photo ${index + 1}`}
                className="h-full w-full object-contain bg-[#111] rounded-xl border-2 border-white/30"
                onError={(e) =>
                  (e.currentTarget.src = "/images/placeholder-image.png")
                }
              />
            ) : (
              <div className="w-full h-full bg-muted animate-pulse" />
            )}

            {index === 3 && images.length > 4 && (
              <div className="shadow-lg absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center text-white/80 text-sm">
                <PlusCircle size={24} />
              </div>
            )}
          </button>
        </motion.div>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <Suspense fallback={<div>Loading...</div>}>
          <SearchImagesDialog
            selectedIndex={selectedIndex}
            query={query}
            images={images}
          />
        </Suspense>
      </Dialog>
    </motion.div>
  );
};

export default memo(SearchImages);
