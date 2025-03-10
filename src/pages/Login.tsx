import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import login from "../assets/login.jpeg";
import register from "../assets/register.jpeg";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-row w-full h-screen">
      <div className="hidden md:block md:w-[60%] relative py-10 px-20">
        <img
          src={isLogin ? login : register}
          alt="Auth Visual"
          className="w-full h-full object-cover rounded-4xl"
        />
        <div className="absolute bottom-40 left-24 text-white text-6xl font-bold">
          Lorem Ipsum is simply
        </div>
        <div className="absolute bottom-24 left-24 text-white text-4xl font-medium">
          Lorem Ipsum is simply
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-8 sm:px-10 md:px-12 lg:px-28 h-screen w-full md:w-[40%]">
        <h1 className="text-2xl text-black font-semibold mb-6">
          Welcome to lorem...!
        </h1>
        <div className="bg-[rgba(73,187,189,0.5)] flex flex-row gap-4 px-2 py-2 rounded-full text-white text-lg mb-14">
          <button
            className={`${
              isLogin ? "bg-[#49BBBD]" : ""
            } rounded-full px-8 py-1 cursor-pointer`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`${
              !isLogin ? "bg-[#49BBBD]" : ""
            } rounded-full px-8 py-1 cursor-pointer`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        <h1 className="mb-14 text-xl text-justify">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </h1>

        <div className="flex flex-col w-full gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-2 text-lg">
              <label className="text-black font-semibold">Email Address</label>
              <input
                type="email"
                placeholder="Enter your Email Address"
                className="w-full px-4 py-2 border rounded-full border-[#49BBBD] focus:outline-none placeholder:text-gray-300"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 text-lg">
            <label className="text-black font-semibold">User name</label>
            <input
              type="text"
              placeholder="Enter your User name"
              className="w-full px-4 py-2 border rounded-full border-[#49BBBD] focus:outline-none placeholder:text-gray-300"
            />
          </div>
          <div className="flex flex-col gap-2 relative text-lg">
            <label className="text-black font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                className="w-full px-4 py-2 border rounded-full border-[#49BBBD] focus:outline-none placeholder:text-gray-300"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>
          {isLogin && (
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <h1 className="text-black cursor-pointer">Forgot Password?</h1>
            </div>
          )}
          <div className="w-full flex flex-row items-center justify-end mt-10">
            {isLogin ? (
              <button
                type="submit"
                className="w-1/2 bg-[#49BBBD] text-white py-2 rounded-full hover:bg-[rgba(73,187,189,0.5)]"
              >
                Login
              </button>
            ) : (
              <button
                type="submit"
                className="w-1/2 bg-[#49BBBD] text-white py-2 rounded-full hover:bg-[rgba(73,187,189,0.5)]"
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
