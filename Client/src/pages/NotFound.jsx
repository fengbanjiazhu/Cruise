// Jeffrey
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    let timer = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex text-center text-slate-70 w-full justify-center items-center">
      <div>
        <h1 className="mb-2">{"You probably took a wrong turn".toUpperCase()}</h1>
        <p className="font-bold">Try another route instead</p>
      </div>
    </div>
  );
}

export default NotFound;
