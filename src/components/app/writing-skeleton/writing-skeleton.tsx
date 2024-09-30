import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export const WritingSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full mt-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.5 }}
      >
        <Skeleton className="h-3 w-full rounded-[8px] bg-primary/60" />
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "75%" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Skeleton className="h-3 w-full rounded-[8px] bg-primary/60" />
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "50%" }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Skeleton className="h-3 w-full rounded-[8px] bg-primary/60" />
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "83.333%" }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Skeleton className="h-3 w-full rounded-[8px] bg-primary/60" />
      </motion.div>
    </div>
  );
};
