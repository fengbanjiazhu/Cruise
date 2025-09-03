import { Link, NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../../store/slices/userInfoSlice";
import { useDispatch, useSelector } from "react-redux";
import logo from "@/assets/cruise_logo.png";

function Header() {
  const { isLoggedIn } = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch(removeUser());
    navigate("/");
  };

  return (
    <>
      <header className="header px-4 flex justify-between">
        <Link to="/">
          <img className="h-[2.5rem] mx-2" src={logo} alt="Logo" />
        </Link>

        <nav className="align-center">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/path">Path</NavLink>

          {isLoggedIn && <NavLink to="/createpath">Create Path</NavLink>}
          {isLoggedIn && <NavLink to="/review">Reviews</NavLink>}
          {isLoggedIn && <NavLink to="/profile">Profile</NavLink>}
          {isLoggedIn && <NavLink to="/admin">Admin</NavLink>}

          {isLoggedIn && (
            <a onClick={logout} role="button">
              Logout
            </a>
          )}

          {!isLoggedIn && <NavLink to="/login">Login</NavLink>}
          {!isLoggedIn && <NavLink to="/register">Register</NavLink>}
        </nav>
      </header>
    </>
  );
}

export default Header;
