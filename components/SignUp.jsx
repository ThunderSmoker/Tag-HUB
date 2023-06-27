"use client";
import { React, useState, useEffect } from "react";
import style from "./signin.module.css";
import Image from "next/image";
import Link from "next/link";
import { AiFillGooglePlusCircle } from "react-icons/ai";
import { signIn, getProviders } from "next-auth/react";
import swal from "sweetalert";
import { set } from "mongoose";
import { format } from "date-fns";
import  {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { firebaseStorage } from "@utils/firebase";
import { convertToPNG,resizeImage } from "@utils/Image";
const SignUp = () => {
  const usernameRegex =
    /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  const passwordRegex =
    /^(?=.{8,20}$)(?![.])(?!.*[.]{2})[a-zA-Z0-9!@#$%^&*().]+(?<![.])$/;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errmsg, setErrmsg] = useState("");
  const [providers, setProviders] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setErrmsg("*Please fill all the fields");
      return;
    }
    if (!username.match(usernameRegex)) {
      setErrmsg(
        "*Username invalid, it should contain 8-20 alphanumeric letters and be unique!"
      );
      return;
    }
    if (!password.match(passwordRegex)) {
      setErrmsg(
        "*Password invalid, it should contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number!"
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrmsg("*Passwords do not match");
      return;
    }
    let imageUrl ="";
    if(imageFile){
      imageUrl=await handleImageUpload(imageFile);
    }
    // Continue with form submission
    const userData = {
      username,
      email,
      password,
      imageUrl,
    };

    // console.log(userData);

    // Reset error message
    setErrmsg("");
    try {
      const response = await signIn("credentials", {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        imageUrl: userData.imageUrl,
        redirect: false,
      });
      if (response.error == null) {
        // Handle successful response
        console.log("User created successfully");
        window.location.href = "/";
      } else {
        swal("Error", response.error, "error");
        console.log(response.error);
      }
      // const response = await fetch("/api/usersignup", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(userData),
      // });

      // if (response.ok) {
      //   // Handle successful response
      //   console.log("User created successfully");
      //   window.location.href = "/";
      // } else if (response.status === 409) {
      //   // Handle duplicate username error
      //   setErrmsg(
      //     "Username already exists. Please choose a different username."
      //   );
      // }else if (response.status === 410) {
      //   // Handle duplicate username error
      //   setErrmsg(
      //     "The email address is already in use by another account."
      //   );
      // }  else {
      //   // Handle error response
      //   console.error("Failed to create user");
      // }
    } catch (error) {
      // Handle fetch error
      console.error("Error occurred while signing up:", error);
    }
  };

  const handleImageUpload = async (imageFile) => {
    try{
      console.log("Uploading image file...");
      if(imageFile.type !== "image/png"){
        const convertedImage = await convertToPNG(imageFile);
        imageFile = convertedImage;
      }
      const resizedImage = await resizeImage(imageFile, 512, 512);
      const currentDate = format(new Date(), "yyyyMMdd_HHmmss");
      const fileName = `${currentDate}_${imageFile.name}`;
      const storageRef = ref(firebaseStorage, `images/${fileName}`);
    
      // Upload the image file to the storage bucket
      const snapshot = await uploadBytes(storageRef, resizedImage);
      
      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Set the image URL in your component's state or any other data structure
      return downloadURL;
    } catch (error) {
      console.log("Error handling image: ", error);
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
      } else {
        // Handle error response
        console.error("Failed to log in");
      }
    } catch (error) {
      // Handle fetch error
      console.error("Error occurred while logging in:", error);
    }
  };
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    // Add your password strength criteria here
    if (password.length >= 8) {
      strength += 1;
    }
    if (/[A-Z]/.test(password)) {
      strength += 1;
    }
    if (/[a-z]/.test(password)) {
      strength += 1;
    }
    if (/\d/.test(password)) {
      strength += 1;
    }
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)) {
      strength += 1;
    }
    return strength;
  };

  const handleImagePreview = async (file) => {
    setPreviewImage(URL.createObjectURL(file));
  };
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const strength = calculatePasswordStrength(newPassword);
    setPasswordStrength(strength);
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
      className="w-full min-h-screen"
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
              className="mt-3"
            >
              SIGN UP for TagHUB
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className={style.inputBx}>
                <input
                  type="text"
                  required
                  value={username}
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className={style.inputBx}>
                <input
                  type="email"
                  required
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={style.inputBx}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>{ handleImagePreview(e.target.files[0]);setImageFile(e.target.files[0])}}
                />
              </div>
              {previewImage && (
                <div>
                  <h3>Preview Image:</h3>
                  <div className="h-20 w-20">
                    <img
                      style={{ objectFit: "contain" }}
                      src={previewImage}
                      alt="Preview"
                    />
                  </div>
                </div>
              )}

              <div className={style.inputBx}>
                <input
                  type="password"
                  required
                  value={password}
                  placeholder="Password"
                  onChange={(e) => handlePasswordChange(e)}
                />
                <a
                  href="#"
                  className="password-control"
                  onClick={() => show_hide_password(this)}
                ></a>
              </div>
              <div className="password-strength-bar">
                <div
                  className={`bar-level-${passwordStrength}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              <div className={style.inputBx}>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <a
                  href="#"
                  className="password-control"
                  onClick={() => show_hide_password(this)}
                ></a>
              </div>
              <div className="flex ml-2 my-3 text-red-600">{errmsg}</div>
              <div
                className={`${style.inputBx} flex items-center justify-between mb-4`}
              >
                <input
                  type="submit"
                  value="Sign Up"
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
              Already have an account? <Link href="/sign-in">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
