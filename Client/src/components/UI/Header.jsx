import { Link, NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../../store/slices/userInfoSlice";
import { useDispatch, useSelector } from "react-redux";

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
      <header className="header ">
        {/* <img src={SomeLogo} alt="Logo" /> */}
        {/* <h1>
          <Link to="/">Cruise</Link>
        </h1> */}
        <nav className="align-center">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/path">Path</NavLink>
            {isLoggedIn && <NavLink to="/createpath">Create Path</NavLink>}
            {isLoggedIn && <NavLink to="/review">Reviews</NavLink>}
            {isLoggedIn && <NavLink to="/profile">Profile</NavLink>}
            
                
            {isLoggedIn && (
                <a onClick={logout} role="button">
                Logout
                </a>
            )}

            {!isLoggedIn && <NavLink to="/login">Login</NavLink>}
            {/* {!isLoggedIn && <NavLink to="/login">Register</NavLink>} */}
        </nav>
      </header>
    </>
  );
}

export default Header;
