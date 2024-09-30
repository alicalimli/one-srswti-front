import { useLocation } from "react-router-dom";

interface PageThreadProps {}

const PageThread = ({}: PageThreadProps) => {
  const location = useLocation();
  const data = location.state;

  console.log(data);

  return <div>PageThread</div>;
};

export default PageThread;
