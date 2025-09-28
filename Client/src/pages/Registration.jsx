import bg from "@/assets/bg.jpg";
import Card from "../components/ui/OldCard";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { fetchPost, optionMaker, checkEmail } from "../utils/api";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userInfoSlice";
import { useNavigate } from "react-router-dom";

const inputClass = `w-full rounded p-2 text-black focus:border-red-500 focus-ring-2`;

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleRegister = async () => {
    if (!name.trim()) {
      nameRef.current.focus();
      return toast.error("Name is required");
    }
    if (!emailRegex.test(email)) {
      emailRef.current.focus();
      return toast.error("Email is not valid");
    }
    if (password.trim().length < 6) {
      passwordRef.current.focus();
      return toast.error("Password is not valid, at least 6 characters");
    }
    if (!passwordConfirm.trim()) {
      passwordConfirmRef.current.focus();
      return toast.error("Please confirm your password");
    }
    if (password !== passwordConfirm) {
      passwordConfirmRef.current.focus();
      return toast.error("Passwords do not match");
    }

    const result = await checkEmail(email);
    if (!result || result.exist) return toast.error("Email already exist");

    const data = { name, email, password, passwordConfirm };

    try {
      await fetchPost("user/register", optionMaker(data));
      toast.success("Successfully registered!");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex text-center w-full justify-center items-center h-screen">
      <div
        className="w-full h-screen bg-cover fixed top-0 left-0"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>

      <Card className="w-80 gap-4 p-30 text-white font-semibold bg-[rgba(50,50,50,0.7)]">
        <h3 className="text-center mb-3 text-4xl font-bold">Register</h3>

        <p>Full Name</p>
        <input
          className={inputClass}
          type="text"
          placeholder="Full Name"
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          type="password"
          placeholder="Password"
          ref={passwordRef}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p>Confirm Password</p>
        <input
          className={inputClass}
          type="password"
          placeholder="Confirm Password"
          ref={passwordConfirmRef}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="btn text-white mt-4 w-full hover:bg-transparent hover:text-white hover:border-white"
        >
          Register
        </button>
      </Card>
    </div>
  );
}

export default Register;
