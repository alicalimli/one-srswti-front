import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import PageAuth from "./pages/page-auth/page-auth";
import PageSearch from "./pages/page-search/page-search";
import AppLayout from "./AppLayout";
import PageThread from "./pages/page-thread/page-thread";
import PageShared from "./pages/page-shared/page-shared";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          element={
            <AppLayout>
              <Outlet />
            </AppLayout>
          }
        >
          <Route path="/thread" element={<PageThread />} />
          <Route path="/thread/:threadID" element={<PageThread />} />
          <Route path="/share/:shareID" element={<PageShared />} />
          <Route path="/search" element={<PageSearch />} />
          <Route path="/" element={<PageSearch />} />
        </Route>
        <Route path="/signin" element={<PageAuth />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
