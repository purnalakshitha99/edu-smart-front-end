import { Input, Typography } from "@material-tailwind/react";
import React from "react";

function Footer() {
  return (
    <footer className="bg-footerMain text-white h-[293px] flex flex-col justify-between">
      <div className="w-[500px] m-auto py-5 text-center">
        <p className="text-3xl font-bold">Subscribe to get our Newsletter</p>
        <div className="flex justify-center items-center gap-4 mt-10">
          <Input className="rounded-full" placeholder="someone@gmail.com" />
          <button className="bg-[#49BBBD] hover:bg-[#62999A] w-[180px] text-white font-semibold p-2 rounded-full">
            Subscribe
          </button>
        </div>
      </div>

      <div className="pb-5">
        <ul className="flex justify-center gap-8">
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500"
            >
              About Us
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500"
            >
              License
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500"
            >
              Contribute
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500"
            >
              Contact Us
            </Typography>
          </li>
        </ul>
        <Typography
          color="blue-gray"
          className="font-normal flex justify-center mt-5"
        >
          &copy; 2023 Material Tailwind
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
