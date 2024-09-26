import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageAuth from "./pages/page-auth/page-auth";
import AppLayout from "./AppLayout";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<>HELLO</>} />
        <Route path="/search" element={<AppLayout>HELLO</AppLayout>} />
        <Route path="/signin" element={<PageAuth />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
