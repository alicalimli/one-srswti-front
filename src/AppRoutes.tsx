import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageAuth from "./pages/page-auth/page-auth";
import PageSearch from "./pages/page-search/page-search";
import AppLayout from "./AppLayout";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<>HELLO</>} />
        <Route
          path="/search"
          element={
            <AppLayout>
              <PageSearch />
            </AppLayout>
          }
        />
        <Route path="/signin" element={<PageAuth />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
