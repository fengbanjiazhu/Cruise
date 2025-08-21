import { Route, Routes, BrowserRouter } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import "./index.css";
import "./App.css";

import Layout from "./components/UI/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Path from "./pages/Path";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/path" element={<Path />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster position="top-center" gutter={12} containerStyle={{ margin: "1rem" }} />
    </>
  );
}

export default App;
