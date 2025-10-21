// Jeffrey
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ props }) => {
  return (
    <>
      <Header {...props} />
      <div className="container">
        <div className="block md:flex min-h-[90vh] w-full md:w-[100vw] relative">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
