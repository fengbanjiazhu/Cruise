import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileBtn from "../Profiles/ProfileBtn";
import logo from "@/assets/cruise_logo.png";
import ToggleMap from "../Paths/ToggleMap";

function Header() {
  const { isLoggedIn, user } = useSelector((state) => state.userInfo);
  const isAdmin = user?.role === "admin";

  return (
    <>
      <header className="header px-4 flex justify-between">
        <Link to="/">
          <img className="h-[2.5rem] mx-2" src={logo} alt="Logo" />
        </Link>

        <nav className="align-center flex gap-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/allpaths">Path</NavLink>

          {isLoggedIn && <NavLink to="/createpath">Create Path</NavLink>}
          {isLoggedIn && isAdmin && <NavLink to="/admin">Admin</NavLink>}

          {!isLoggedIn && <NavLink to="/login">Login</NavLink>}
          {!isLoggedIn && <NavLink to="/register">Register</NavLink>}

          <ToggleMap />
          {isLoggedIn && <ProfileBtn />}
        </nav>
      </header>
    </>
  );
}

export default Header;
