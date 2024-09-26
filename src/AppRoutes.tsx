import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageAuth from "./pages/page-auth/page-auth";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<>HELLO</>} />
        <Route path="/search" element={<>SEARCH</>} />
        <Route path="/signin" element={<PageAuth />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
