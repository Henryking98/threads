"use client";

import Link from "next/link";
import Image from "next/image";

import {useUser, useRedirectFunctions, useLogoutFunction} from "@propelauth/nextjs/client";


function Topbar() {
    const {loading, user} = useUser();
	const {redirectToSignupPage, redirectToLoginPage, redirectToAccountPage} = useRedirectFunctions();
	const logoutFn = useLogoutFunction();

    //if (loading) return <div>Loading....</div>;

    return (
      <nav className="topbar">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
          <p className="text-heading3-bold text-light-1 max-xs:hidden">
            Threads
          </p>
        </Link>

        <div className="flex items-center gap-1">
          <div className="block">
            {user ? (
              <div className="flex items-center gap-1">
				<div className="block md:hidden cursor-pointer">
					<Image 
						src="/assets/logout.svg"
						alt="logout"
						width={24}
						height={24}
						onClick={logoutFn}
					/>
				</div>
				<div className="py-2 px-4">
					<button onClick={() => redirectToAccountPage()}>Personal workspace</button>
				</div>
                {/* <p>{user.email}</p> */}
              </div>
            ) : (
              <div className="text-white">
                <div className="text-white">
                  <button onClick={() => redirectToLoginPage()}>Login </button>
                  <button onClick={() => redirectToSignupPage()}> Signup</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
}

export default Topbar;
