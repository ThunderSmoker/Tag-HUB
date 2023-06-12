'use client'
import { React, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AiFillGooglePlusCircle } from 'react-icons/ai';
import { signIn, getProviders } from 'next-auth/react';
import style from './signin.module.css';

const MySignUp = () => {
  const usernameRegex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errmsg, setErrmsg] = useState('');
  const [providers, setProviders] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setErrmsg('*Please fill all the fields');
      return;
    }
    if (!username.match(usernameRegex)) {
      setErrmsg(
        'Username invalid, it should contain 8-20 alphanumeric letters and be unique!'
      );
      return;
    }
    if (!password.match(passwordRegex)) {
      setErrmsg(
        'Password invalid, it should contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number!'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrmsg('*Passwords do not match');
      return;
    }

    // Continue with form submission
    const userData = {
      username,
      email,
      password,
    };

    console.log(userData);

    // Reset error message
    setErrmsg('');
    try {
      const response = await fetch('/api/usersignup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Handle successful response
        console.log('User created successfully');
      } else {
        // Handle error response
        console.error('Failed to create user');
      }
    } catch (error) {
      // Handle fetch error
      console.error('Error occurred while signing up:', error);
    }
  };

  const handleGoogleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await signIn('google', {
        callbackUrl: `${window.location.origin}/`,
        redirect: false,
      });
      console.log(response);
      if (response.ok) {
        // Handle successful response
        console.log('User logged in successfully');
      } else {
        // Handle error response
        console.error('Failed to log in');
      }
    } catch (error) {
      // Handle fetch error
      console.error('Error occurred while logging in:', error);
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

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const strength = calculatePasswordStrength(newPassword);
    setPasswordStrength(strength);
  };

  return (
    <section style={{
      animation: `${style.gradient} 10s ease infinite`,
    }} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-pink-600 to-blue-500">
        <div className={style.box}>
        <div className={style.square} style={{ "--i": 0 }}></div>
        <div className={style.square} style={{ "--i": 1 }}></div>
        <div className={style.square} style={{ "--i": 2 }}></div>
        <div className={style.square} style={{ "--i": 3 }}></div>
        <div className={style.square} style={{ "--i": 4 }}></div>
        <div className={style.square} style={{ "--i": 5 }}></div>
      <div className="container relative bg-white rounded-lg shadow-md p-8 max-w-lg w-full">
        <div className={`${style.form} flex flex-col items-center justify-center `}>
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="text-gray-500">TagHUB</p>
        </div>
        <h2 className="text-2xl font-bold mb-4">SIGN UP for TagHUB</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <input
              type="text"
              required
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              required
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              required
              value={password}
              placeholder="Password"
              onChange={(e) => handlePasswordChange(e)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <div className="password-strength-bar">
              <div
                className={`bar-level-${passwordStrength}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="password"
              required
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="text-red-600 mb-4">{errmsg}</div>
          <div className="flex items-center justify-between mb-4">
            <input
              type="submit"
              value="Sign Up"
              onClick={handleFormSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
            />
            <p className="ml-4">OR</p>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  className="bg-black text-white rounded-full hover:bg-slate-800 py-2 px-3 transition-colors duration-300 flex items-center"
                  onClick={handleGoogleLogin}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {isHovered ? (
                    <AiFillGooglePlusCircle className="mr-2" size={20} />
                  ) : (
                    <></>
                  )}
                  {isHovered ? 'Sign in with Google' : 'Continue with Google'}
                </button>
              ))}
          </div>
        </form>
        <p>
          Already have an account? <Link href="/signin">Sign in</Link>
        </p>
      </div>
      </div>
    </section>
  );
};

export default MySignUp;
