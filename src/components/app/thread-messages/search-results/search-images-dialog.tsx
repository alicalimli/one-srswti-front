import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchResultImage } from "@/lib/types";
import { useEffect, useState } from "react";

interface SearchImagesDialogProps {
  selectedIndex: number;
  query?: string;
  images: SearchResultImage[];
}

const SearchImagesDialog: React.FC<SearchImagesDialogProps> = ({
  selectedIndex,
  query,
  images,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (api) {
      api.scrollTo(selectedIndex, true);
    }
  }, [api, selectedIndex]);

  return (
    <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>Search Images</DialogTitle>
        <DialogDescription className="text-sm">{query}</DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <Carousel setApi={setApi} className="w-full bg-muted max-h-[60vh]">
          <CarouselContent>
            {images.map((img, idx) => (
              <CarouselItem key={idx}>
                <div className="p-1 flex items-center justify-center h-full">
                  <img
                    src={img.thumbnail}
                    alt={`Image ${idx + 1}`}
                    className="h-auto w-full object-contain max-h-[60vh]"
                    onError={(e) =>
                      (e.currentTarget.src = "/images/placeholder-image.png")
                    }
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute inset-8 flex items-center justify-between p-4">
            <CarouselPrevious className="w-10 h-10 rounded-full shadow focus:outline-none">
              <span className="sr-only">Previous</span>
            </CarouselPrevious>
            <CarouselNext className="w-10 h-10 rounded-full shadow focus:outline-none">
              <span className="sr-only">Next</span>
            </CarouselNext>
          </div>
        </Carousel>
        <div className="py-2 text-center text-sm text-muted-foreground">
          {current} of {count}
        </div>
      </div>
    </DialogContent>
  );
};

export default SearchImagesDialog;
