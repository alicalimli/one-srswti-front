import { useAppDispatch } from "@/lib/hooks/use-redux";
import { setAppStateReducer } from "@/lib/redux/slices/slice-app-state";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

interface FloatingDockItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  href: string;
  disabled?: boolean;
}

interface FloatingDockProps {
  items: FloatingDockItem[];
  active: string;
  className?: string;
  handleClick: (item: FloatingDockItem) => void;
}

export const FloatingDock = ({
  items,
  active,
  className,
  handleClick,
}: FloatingDockProps) => {
  let mouseX = useMotionValue(Infinity);
  const dispatch = useAppDispatch();

  const handleMouseIn = (item: FloatingDockItem) => {
    dispatch(setAppStateReducer({ hoveredMode: item.id }));
  };

  const handleMouseOut = () => {
    dispatch(setAppStateReducer({ hoveredMode: active }));
  };

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex w-full p-4 md:p-0 md:px-4 md:pb-3  md:h-16 gap-4 items-end rounded-2xl bg-primary/20 backdrop-blur-sm border border-white/20 ",
        className
      )}
    >
      <div className="md:hidden grid grid-cols-4 gap-4 w-screen max-w-[10rem]">
        {items.map((item) => (
          <button
            onClick={() => handleClick(item)}
            className={cn(
              "flex bg-primary/20 p-1.5 rounded-full hover:opacity-70",
              active === item.id ? "bg-primary" : "bg-pink-200/10"
            )}
          >
            {item.icon}
          </button>
        ))}
      </div>

      <div className="hidden gap-2 w-fit md:flex items-end">
        {items.map((item) => (
          <IconContainer
            handleMouseIn={handleMouseIn}
            handleMouseOut={handleMouseOut}
            key={item.id}
            handleClick={handleClick}
            item={item}
            active={active}
            mouseX={mouseX}
          />
        ))}
      </div>
    </motion.div>
  );
};

interface IconContainerProps {
  item: FloatingDockItem;
  active: string;
  mouseX: MotionValue<number>;
  handleMouseIn: (item: FloatingDockItem) => void;
  handleMouseOut: () => void;
  handleClick: (item: FloatingDockItem) => void;
}

function IconContainer({
  handleMouseIn,
  handleMouseOut,
  item,
  active,
  mouseX,
  handleClick,
}: IconContainerProps) {
  const { id, title, icon } = item;
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const widthTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20]
  );
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20]
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <button disabled={item?.disabled} onClick={() => handleClick(item)}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => {
          setHovered(true);
          handleMouseIn(item);
        }}
        onMouseLeave={() => {
          handleMouseOut();
          setHovered(false);
        }}
        className={cn(
          "aspect-square rounded-full gap-4 mx-1 flex items-center justify-center relative",
          active === id ? "bg-primary" : "bg-pink-200/10",
          item?.disabled ? "opacity-40" : "hover:bg-pink-200/30"
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </button>
  );
}
