import React, { useState } from "react";
import heath from "../assets/health.png";
import Sidebar from "./Sibebar";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className=" text-white ">
      <div className="container flex justify-between items-center md:h-20">
        <div className="items-center flex">
          <div className="text-blue-600 text-right text-3xl font-bold md:block hidden flex-1 ml-20 w-96">
            Health Station
          </div>
          <div className="flex-1  ">
            <img
              src={heath}
              alt="Health"
              className="object-cover rounded-full w-20 h-20 mt-5 ml-2 md:ml-0 md:mt-0 md:lg:w-12 md:lg:h-12 md:place-items-start"
            />
          </div>
        </div>
        <div className="hidden md:flex space-x-4"></div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <Sidebar /> : <Sidebar />}
        </button>
      </div>
      <div
        className={`md:hidden ${isOpen ? "block" : "hidden"} bg-blue-700`}
      ></div>
    </nav>
  );
};

export default Navbar;
