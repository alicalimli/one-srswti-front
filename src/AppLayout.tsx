import React, { ReactNode } from "react";
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
      <BootAnimation>
        <ReactTour>
          <main className="flex flex-col h-[100svh] w-screen">
            <ScrollArea className="flex-grow">
              <Header />
              {children}
            </ScrollArea>
          </main>
        </ReactTour>
      </BootAnimation>
    </div>
  );
};

export default AppLayout;
