import { useAppSelector } from "@/lib/hooks/use-redux";
import { getThreadState } from "@/lib/redux/slices/slice-thread";
import { useLocation, useNavigate } from "react-router-dom";

interface PageThreadProps {}

const PageThread = ({}: PageThreadProps) => {
  const { status } = useAppSelector(getThreadState);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <div>PageThread</div>;
};

export default PageThread;
