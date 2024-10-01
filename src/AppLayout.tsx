import { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactTour from "@/components/app/react-tour/react-tour";
import BootAnimation from "@/components/app/boot-animation/boot-animation";
import Header from "@/components/app/header/header";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex">
      <ReactTour>
        <BootAnimation>
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
