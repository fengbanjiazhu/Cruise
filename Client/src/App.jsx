import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import "./index.css";
import "./App.css";

import Layout from "./components/UI/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Path from "./pages/Path";
import CreatePath from "./pages/CreatePath";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

import { fetchUserInfoUntilSuccess } from "./store/slices/userInfoSlice";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, token } = useSelector((state) => state.userInfo);

  useEffect(() => {
    if (token && !isLoggedIn) {
      dispatch(fetchUserInfoUntilSuccess());
    }
  }, [token, dispatch, isLoggedIn]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/path" element={<Path />} />
            <Route path="/createpath" element={<CreatePath />} />

            {isLoggedIn && <Route path="/profile" element={<Profile />} />}
            {!isLoggedIn && <Route path="/login" element={<Login />} />}

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster position="top-center" gutter={12} containerStyle={{ margin: "1rem" }} />
    </>
  );
}

export default App;
