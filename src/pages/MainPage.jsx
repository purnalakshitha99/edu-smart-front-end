import React from "react";
import { Button } from "@material-tailwind/react";

const MainPage = () => {
  return (
    <div>
      <h1 className="text-red-700 text-6xl font-bold">Hello World</h1>
      {/* Add the button here */}
      <Button
        className="middle none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        ripple="light"
      >
        Button
      </Button>
    </div>
  );
};

export default MainPage;
