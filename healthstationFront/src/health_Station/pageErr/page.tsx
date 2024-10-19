import React from "react";
import err from "../../assets/err.png"; 

const Err: React.FC = () => {
  return (
    <div className="h-screen">
      <div className="flex flex-col items-center justify-center h-full">
        <img src={err} alt="error" className="w-80" />
        <h1 className="text-2xl text-center">404 ไม่มีข้อมูล</h1>
        <p>Try Again Later</p>
      </div>
    </div>
  );
};

export default Err;
