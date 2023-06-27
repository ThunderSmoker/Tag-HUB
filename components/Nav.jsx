"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
  const {data: session,status } = useSession();
  
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);
  
  return (
    <nav className="flex-between w-full mb-16 pt-3">
      {console.log(status)}
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text rounded-lg" style={{display:"flex",backgroundColor:"#09080d",color:"white",padding:"0.3rem"}}>Tag<p className="ml-1 rounded-md " style={{backgroundColor:'#ff9801',paddingLeft:"0.1rem",paddingRight:"0.1rem"}}>hub</p></p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-post" className="black_btn">
              Create Post
            </Link>

            <button type="button" onClick={signOut} className="outline_btn">
              Sign Out
            </button>

            <Link href="/profile">
              <Image
                src={session?.user.image}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <>
             {providers &&
              Object.values(providers).map((provider) => {
                if (provider.id === "google") {
                  return (
                    <Link href="/sign-in" key={provider.name}>
                      <button type="button" className="black_btn">
                        Sign in
                      </button>
                    </Link>
                  );
                } else {
                  return null; 
                }
              })}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image}
              width={37}
              height={37}
              className="rounded-full"
              alt="profile"
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />

            {toggleDropdown && (
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/create-post"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Prompt
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className="mt-5 w-full black_btn"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => {
                if (provider.id === "google") {
                  return (
                    <Link href="/sign-in" key={provider.name}>
                      <button type="button" className="black_btn">
                        Sign in
                      </button>
                    </Link>
                  );
                } else {
                  return null; 
                }
              })}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
