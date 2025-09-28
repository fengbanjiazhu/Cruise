import bg from "@/assets/bg.jpg";
import car from "@/assets/car.png";
import rider from "@/assets/rider.png";
import cloud1 from "@/assets/cloud_1.png";
import cloud2 from "@/assets/cloud_2.png";
import map from "@/assets/map.jpg";
import earth from "@/assets/earth.png";

import React, { useRef } from "react";
import Card from "../components/ui/OldCard";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const { isLoggedIn } = useSelector((state) => state.userInfo);
  const parallax = useRef();

  return (
    <div className="w-full h-screen">
      <div
        className="w-full h-screen bg-cover fixed top-0 left-0"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>
      <div className="w-full h-full" style={{ background: "#253237" }}>
        <Parallax ref={parallax} pages={3}>
          <ParallaxLayer
            offset={1}
            speed={1}
            style={{ backgroundColor: "rgba(224, 150, 58, 0.2)" }}
          />
          <ParallaxLayer offset={2} speed={1} style={{ backgroundColor: "rgba(0, 18, 22, 0.8)" }} />

          <ParallaxLayer offset={0.5} speed={0} factor={3} className="cover filter grayscale">
            <img
              src={cloud1}
              className="w-30 ml-[65%] opacity-50 "
              style={{ display: "block", width: "30%" }}
            />
          </ParallaxLayer>

          <ParallaxLayer offset={0.5} speed={0.8}>
            <div className="w-80 h-40 ml-40">
              <p className="text-6xl text-slate-50 opacity-40 font-bold">
                {"Scroll down to unlock your journey".toUpperCase()}
              </p>
            </div>
          </ParallaxLayer>

          <ParallaxLayer offset={1.75} speed={0.5} style={{ opacity: 0.1 }}>
            <img src={cloud2} style={{ display: "block", width: "40%", marginLeft: "40%" }} />
          </ParallaxLayer>

          <ParallaxLayer offset={1} speed={0.2} style={{ opacity: 0.4 }}>
            <img src={cloud2} style={{ display: "block", width: "60%", marginLeft: "10%" }} />
            <img src={cloud1} className="block w-[30%] ml-[75%]" />
          </ParallaxLayer>

          <ParallaxLayer offset={1.6} speed={-0.1} style={{ opacity: 0.5 }}>
            <img src={cloud1} style={{ display: "block", width: "25%", marginLeft: "30%" }} />
          </ParallaxLayer>

          <ParallaxLayer offset={2.5} speed={-0.4} className="flex items-center justify-center">
            <img src={earth} className="w-[70%] opacity-35" />
          </ParallaxLayer>

          <ParallaxLayer
            offset={0}
            speed={0.1}
            onClick={() => parallax.current.scrollTo(1)}
            className="flex items-center justify-center"
          >
            <div className="w-18 h-20 rounded-10 flex items-center justify-center">
              <img src={car} className="w-16 filter brightness-80" />
            </div>
          </ParallaxLayer>

          <ParallaxLayer
            offset={1}
            speed={0.1}
            onClick={() => parallax.current.scrollTo(1)}
            className="flex items-center justify-center"
          >
            <div className="w-18 h-20 rounded-10 flex items-center justify-center">
              <img src={rider} className="w-16 filter brightness-50" />
            </div>
          </ParallaxLayer>

          <ParallaxLayer
            offset={1.25}
            speed={1}
            onClick={() => parallax.current.scrollTo(2)}
            className="ml-[70%]"
          >
            <Card>
              <img src={map} className="p-2 border rounded mb-6"></img>
              <p className="text-xl">Discover, Submit, and share scenic routes.</p>
            </Card>
          </ParallaxLayer>

          <ParallaxLayer
            offset={2}
            speed={-0}
            className="flex items-center justify-center"
            onClick={() => {}}
          >
            <Card>
              <p className="text-xl">
                {isLoggedIn ? "Create a new path now" : "Login to start your journey"}
              </p>
              <Link to={isLoggedIn ? "/createpath" : "/login"}>
                <button className="btn text-slate-900 mt-4 w-full hover:bg-transparent hover:text-white">
                  {isLoggedIn ? "Create" : "Login"}
                </button>
              </Link>
            </Card>
          </ParallaxLayer>
        </Parallax>
      </div>
    </div>
  );
}

export default Home;
