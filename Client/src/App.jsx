import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import "./index.css";
import "./App.css";

import Layout from "./components/ui/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CreatePath from "./pages/CreatePath";
import AllPaths from "./pages/AllPaths";
import Profile from "./pages/Profile";
import Admin from "./pages/AdminPage/page";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import PathDetail from "./pages/PathDetail";
import Review from "./pages/Review";




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
            <Route path="/allpaths" element={<AllPaths />} />
            <Route path="/path/:pathID" element={<PathDetail />} />

            {/* Only logged in users can access these */}
            {isLoggedIn && <Route path="/createpath" element={<CreatePath />} />}

            {isLoggedIn && <Route path="/review" element={<Review />} />}
            {isLoggedIn && <Route path="/profile" element={<Profile />} />}
            {/* {isLoggedIn && <Route path="/profile2" element={<Profile2 />} />} */}
            {isLoggedIn && <Route path="/admin" element={<Admin />} />}

            {!isLoggedIn && <Route path="/login" element={<Login />} />}
            {!isLoggedIn && <Route path="/register" element={<Register />} />}

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster position="top-center" gutter={12} containerStyle={{ margin: "1rem" }} />
    </>
  );
}

export default App;
