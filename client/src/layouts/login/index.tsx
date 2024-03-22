import React from "react";
import { StreamifyLogo } from "../../assets/streamify-logo.svg";

export function LoginLayout() {
  return (
    <main id="container" className="h-screen w-screen flex bg-gradient-purple">
      <div className="w-1/2">
        <div className="">
          <StreamifyLogo/>
        </div>
      </div>
      <div className="w-screen h-screen flex justify-center items-center ">
        <div className="flex flex-col justify-between bg-white rounded-md mt-32 size-96 shadow-2xl shadow-black">
          <h1 className="text-2xl font-bold text-center mt-8  mb-4 text-stf-purple-700">Sign in</h1>
          <div className="user mt-6 ml-8 mr-8">
            <h2 className="text-sm text-stf-purple-700">Username</h2>
            <input type="text" placeholder="Example" className="border border-stf-purple-650 rounded-md w-full text-sm size-12 pl-3" />
          </div>
            <div className="password mt-6 ml-8 mr-8">
              <h2 className="text-sm text-stf-purple-700">Password</h2>
              <input type="password" placeholder="Password ..." className="border border-stf-purple-650 rounded-md w-full text-sm size-12 pl-3"/>
            </div>
            <div className="mt-auto">
              <button className="w-full text-base font-semibold bg-gradient-to-r from-[#5A189A] to-[#8300FF] py-1 rounded-b-md size-16">Submit</button>
            </div>
        </div>
      </div>
    </main>
  );
}
