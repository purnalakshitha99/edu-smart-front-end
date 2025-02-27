import React from "react";

const HeroSection = () => {
  return (
    <div className="bg-white py-12">
      {" "}
      <div className="container mx-auto flex ">
        <div className="w-1/2 px-8 items-start ">
          <p className="text-sm text-blue-500 mb-2 pt-6">
            By Themadbrains in inspiration
          </p>
          <h1 className="text-4xl font-semibold mb-4 pb-6">
            Why Swift UI Should Be on the <br /> Radar of Every
            <br /> Mobile Developer
          </h1>
          <p className="text-gray-600 mb-6 pb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipiscing
            elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor.
          </p>
          <button className="bg-[#49BBBD] hover:bg-[#62999A] text-white font-semibold py-2 px-6  rounded">
            Start learning now
          </button>
        </div>
        <div className="w-1/2 pr-8 rounded-lg overflow-hidden">
          <img
            src="src/assets/mainpage/mainPgaeHeroSetionc.png"
            alt="Laptop with video call"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
