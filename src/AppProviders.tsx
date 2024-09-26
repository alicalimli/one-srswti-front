import { ReactNode } from "react";
import { store } from "./lib/redux/store";
import { Provider } from "react-redux";
import { Toaster } from "./components/ui/sonner";
import AppLayout from "./AppLayout";

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <Provider store={store}>
      {children}

      <Toaster />
    </Provider>
  );
};

export default AppProviders;
