import bg from "@/assets/bg.jpg";
import Card from "../components/UI/Card";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

const inputClass = `w-full rounded p-2 text-black focus:border-red-500 focus-ring-2`;

function Login() {
  const [email, setEmail] = useState("jeff@test.com");
  const [password, setPassword] = useState("");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  function onLogin() {
    if (!emailRegex.test(email) || email.trim() === "") {
      emailRef.current.focus();
      return toast.error("Email is not valid");
    }
    if (password.trim() === "") {
      passwordRef.current.focus();
      return toast.error("Password is not valid");
    }

    toast.success(`Email: ${email}, Password: ${password}`);
  }

  return (
    <div className="flex text-center text-slate-70 w-full justify-center items-center">
      <div
        className="w-full h-screen bg-cover fixed top-0 left-0"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>
      <Card className="w-80 gap-4 p-30 text-white font-semibold bg-[rgba(50,50,50,0.7)]">
        <h3 class="text-center mb-3 text-4xl font-bold">Login Here</h3>
        <p>Email</p>
        <input
          className={inputClass}
          type="text"
          placeholder="Email"
          ref={emailRef}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p>Password</p>
        <input
          className={inputClass}
          ref={passwordRef}
          type="password"
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
