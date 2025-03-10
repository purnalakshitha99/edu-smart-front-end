import React from "react";
import { Button } from "@material-tailwind/react";
import NavBar from "../components/layouts/NavBar";
import HeroSection from "../components/pages/mainpage/HeroSection";
import Section from "../components/pages/mainpage/section";

const MainPage = () => {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <Section />
    </div>
  );
};

export default MainPage;
