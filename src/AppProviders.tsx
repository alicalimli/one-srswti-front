import { ReactNode } from "react";
import { store } from "./lib/redux/store";
import { Provider } from "react-redux";

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default AppProviders;
