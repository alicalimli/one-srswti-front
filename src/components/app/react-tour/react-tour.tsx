import { setAppStateReducer } from "@/lib/redux/slices/slice-app-state";
import { TourProvider, useTour } from "@reactour/tour";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ReactTour = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const { setIsOpen } = useTour();

  useEffect(() => {
    const hasTourBeenOpened = localStorage.getItem("tourOpened");
    if (!hasTourBeenOpened) {
      setIsOpen(true);
      localStorage.setItem("tourOpened", "true");
    }
  }, []);

  const isOnMobile = window.innerWidth <= 648;

  const steps = useMemo(() => {
    const allSteps = [
      {
        selector: ".step",
        content: (
          <p>
            Welcome to SRSWTI One! We&apos;re excited to have you join us.
            Let&apos;s take a quick tour to help you get started with our
            AI-powered search engine.
          </p>
        ),
      },
      {
        selector: ".profile-btn-step",
        content: (
          <p>
            This is your personal hub. Customize your experience and manage
            settings here to get the most out of our AI assistant.
          </p>
        ),
      },
      {
        selector: ".step-search-input",
        content: (
          <p>
            Start your journey here! Type in any question or topic, and our AI
            will find the most relevant information for you.
          </p>
        ),
      },
      {
        selector: ".step-suggestions",
        content: (
          <p>
            Need inspiration? Check out these personalized suggestions to spark
            your curiosity and explore new topics.
          </p>
        ),
      },
      {
        selector: ".step-focus-mode",
        content: (
          <p>
            When you need to dive deep, activate Focus Mode. It helps our AI
            understand your specific needs and provide more targeted results.
          </p>
        ),
      },
      {
        selector: ".step-mode-picker",
        content: (
          <p>
            Tailor your search experience by selecting a mode that fits your
            current task, whether it&apos;s math, writing, or business.
          </p>
        ),
      },
      {
        selector: ".step-search-btn",
        content: (
          <p>
            When you&apos;re ready, just hit the search button to start
            exploring the web with SRSWTI ONE!
          </p>
        ),
      },
    ];

    return allSteps;
  }, [isOnMobile]);

  const onTourOpen = async () => {
    navigate("/search");
    dispatch(setAppStateReducer({ focusMode: false }));
  };

  return (
    <TourProvider
      steps={steps}
      afterOpen={onTourOpen}
      beforeClose={() => {
        setCurrentStep(0);
        dispatch(setAppStateReducer({ focusMode: false }));
        setIsOpen(false);
      }}
      onClickMask={() => {}}
      disableInteraction={true}
      currentStep={currentStep}
      setCurrentStep={(val) => {
        if (val === 4) {
          dispatch(setAppStateReducer({ focusMode: true }));
          setTimeout(() => setCurrentStep(val), 300);
        } else {
          setCurrentStep(val);
        }
      }}
      styles={{
        popover: (base) => ({
          ...base,
          backgroundColor: "#9124D950",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          maxWidth: "400px",
          color: "white",
          "--reactour-accent": "#9124D9",
        }),
        maskArea: (base) => ({ ...base, rx: 24 }),
      }}
    >
      {children}
    </TourProvider>
  );
};

export default ReactTour;
