"use client";
import { React, useState, useEffect } from "react";
import style from "./signin.module.css";
import Image from "next/image";
import Link from "next/link";
import { AiFillGooglePlusCircle } from "react-icons/ai";
import { signIn, getProviders } from "next-auth/react";
const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [providers, setProviders] = useState(null);
  const [errmsg, setErrmsg] = useState("");
  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Create an object with the user data
    const userData = {
      username,
      password,
    };
    console.log(userData);
    if (!username || !password) {
      setErrmsg("*Please fill all the fields");
      return;
    }
    console.log(errmsg);
    try {
      const response = await signIn("credentials", {
        username: userData.username,
        password: userData.password,
        redirect:false
      });

      // const response = await fetch("/api/userlogin", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(userData),
      // });

      if (response.ok) {
        // Handle successful response
        console.log("User logged in successfully");
        window.location.href = "/";
      }
      // else if(response.status === 404){
      //   setErrmsg("User not found. Please check your username and password.");
      // }
      // else if(response.status === 401){
      //   setErrmsg("Incorrect password!");
      // }
      //  else {
      //   // Handle error response
      //   console.error("Failed to log in");
      // }
    } catch (error) {
      // Handle fetch error
      console.error("Error occurred while logging in:", error);
    }
  };
  const handleGoogleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await signIn("google", {
        callbackUrl: `${window.location.origin}/`,
        redirect: false,
      });
      console.log(response);
      if (response.ok) {
        // Handle successful response
        console.log("User logged in successfully");
        window.location.href = "/";
      } else {
        // Handle error response
        console.error("Failed to log in");
      }
    } catch (error) {
      // Handle fetch error
      console.error("Error occurred while logging in:", error);
    }
  };
  const show_hide_password = (target) => {
    var input = document.getElementById("password-input");
    if (input.getAttribute("type") === "password") {
      target.classList.add("view");
      input.setAttribute("type", "text");
    } else {
      target.classList.remove("view");
      input.setAttribute("type", "password");
    }
    return false;
  };

  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
        animation: `${style.gradient} 10s ease infinite`,
      }}
      className="w-full h-screen"
    >
      <div className={style.box}>
        <div className={style.square} style={{ "--i": 0 }}></div>
        <div className={style.square} style={{ "--i": 1 }}></div>
        <div className={style.square} style={{ "--i": 2 }}></div>
        <div className={style.square} style={{ "--i": 3 }}></div>
        <div className={style.square} style={{ "--i": 4 }}></div>
        <div className={style.square} style={{ "--i": 5 }}></div>
        <div className={`${style.container} max-w-lg`}>
          <div className={style.form}>
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/assets/images/logo.svg"
                alt="logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <p className="text-gray-500">TagHUB</p>
            </div>
            <h2
              style={{
                fontWeight: "bolder",
                fontFamily: "Lato, sans-serif",
              }}
            >
              LOGIN to TagHUB
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className={style.inputBx}>
                <input
                  type="text"
                  required="required"
                  value={username}
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
                {/* <span>Login</span>
                <i className={`${style.fas} fa-user-circle`}></i> */}
              </div>
              <div className={`${style.inputBx} ${style.password}`}>
                <input
                  id="password-input"
                  type="password"
                  name="password"
                  value={password}
                  placeholder="Password"
                  required="required"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* <span>Password</span> */}
                <a
                  href="#"
                  className="password-control"
                  onClick={() => show_hide_password(this)}
                ></a>
                {/* <i className={`${style.fas} fa-key`}></i> */}
              </div>
              <div className="flex ml-2 my-3 text-red-600">{errmsg} </div>
              {/* <label className={style.remember}>
                <input type="checkbox" />I agree to Terms & Services of
                TagHUB.
              </label> */}
              <div
                className={`${style.inputBx} flex items-center justify-between mb-4 `}
              >
                <input
                  type="submit"
                  value="Log in"
                  onClick={handleFormSubmit}
                />
                <p className="m-4">OR</p>
                {providers &&
                  Object.values(providers).map((provider) => {
                    if (provider.id === "google") {
                      return (
                        <button
                          type="button"
                          key={provider.name}
                          className="bg-black text-white rounded-full hover:bg-slate-800 py-2 px-3 transition-colors duration-300 flex items-center"
                          onClick={handleGoogleLogin}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                        >
                          {isHovered ? (
                            <AiFillGooglePlusCircle
                              className="mr-2"
                              size={20}
                            />
                          ) : (
                            <></>
                          )}
                          {isHovered
                            ? "Sign in with Google"
                            : "Continue with Google"}
                        </button>
                      );
                    } else {
                      return null;
                    }
                  })}
              </div>
            </form>
            <p>
              Don't have an account <Link href="/sign-up">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
