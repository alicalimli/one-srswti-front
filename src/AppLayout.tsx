import { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactTour from "@/components/app/react-tour/react-tour";
import BootAnimation from "@/components/app/boot-animation/boot-animation";
import Header from "@/components/app/header/header";
import { useAppSelector } from "./lib/hooks/use-redux";
import { cn } from "./lib/utils";

const BackgroundOverlay = () => {
  const focusMode = useAppSelector((state) => state.appState.focusMode);

  return (
    <div
      className={cn(
        "pointer-events-none fixed duration-1000 inset-0 bg-black/80",
        focusMode ? "opacity-100" : "opacity-0"
      )}
    ></div>
  );
};
interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex">
      <ReactTour>
        <BootAnimation>
          <BackgroundOverlay />

          <main className="flex flex-col h-[100svh] w-screen">
            <Header />
            <ScrollArea className="flex-grow">{children}</ScrollArea>
          </main>
        </BootAnimation>
      </ReactTour>
    </div>
  );
};

export default AppLayout;
