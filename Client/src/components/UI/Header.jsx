import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <>
      <header className="header">
        {/* <img src={SomeLogo} alt="Logo" /> */}
        <h1>
          <Link to="/">Cruise</Link>
        </h1>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/path">Path</NavLink>
          <NavLink to="/createpath">Create Path</NavLink>
        </nav>
      </header>
    </>
  );
}

export default Header;
