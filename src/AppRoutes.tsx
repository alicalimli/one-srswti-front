import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<>HELLO</>} />
        <Route path="/search" element={<>SEARCH</>} />
        <Route path="/signin" element={<>SIGNIN</>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
