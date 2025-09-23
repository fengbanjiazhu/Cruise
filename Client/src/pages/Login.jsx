import bg from "@/assets/bg.jpg";
import Card from "../components/UI/OldCard";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { fetchPost, optionMaker } from "../utils/api";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userInfoSlice";
import { useNavigate } from "react-router-dom";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

const inputClass = `w-full rounded p-2 text-black focus:border-red-500 focus-ring-2`;

function Login() {
  const [email, setEmail] = useState("jeff@test.com");
  const [password, setPassword] = useState("");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function onLogin() {
    if (!emailRegex.test(email) || email.trim() === "") {
      emailRef.current.focus();
      return toast.error("Email is not valid");
    }
    if (password.trim() === "") {
      passwordRef.current.focus();
      return toast.error("Password is not valid");
    }
    try {
      const data = await fetchPost("user/login", optionMaker({ email, password }));
      dispatch(setUser(data));
      localStorage.setItem("jwt", data.token);
      toast.success("Successfully logged in");
      navigate("/profile");
    } catch (error) {
      toast.error(error.message);
    }

    // toast.success(`Email: ${email}, Password: ${password}`);
  }

  return (
    <div className="flex text-center text-slate-70 w-full justify-center items-center">
      <div
        className="w-full h-screen bg-cover fixed top-0 left-0"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>
      <Card className="w-80 gap-4 p-30 text-white font-semibold bg-[rgba(50,50,50,0.7)]">
        <h3 className="text-center mb-3 text-4xl font-bold">Login Here</h3>
        <p>Email</p>
        <input
          className={inputClass}
          type="text"
          placeholder="Email"
          ref={emailRef}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p>Password</p>
        <input
          className={inputClass}
          ref={passwordRef}
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={onLogin}
          className="btn text-slate-900 mt-4 w-full hover:bg-transparent hover:text-white hover:border-white"
        >
          Login
        </button>
      </Card>
    </div>
  );
}

export default Login;
