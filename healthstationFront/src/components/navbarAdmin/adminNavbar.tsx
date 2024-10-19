import React, { useState } from "react";
import health from "../../assets/health.png"; // ปรับเส้นทางให้ถูกต้องตามตำแหน่งจริงของไฟล์

const AdminNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="text-white ">
      <div className="container flex justify-between items-center h-20">
        <div className="flex items-center">
          <div className="text-blue-600 text-3xl font-bold hidden md:block ml-20">
            Health Station
          </div>
          <div className="ml-4">
            <img
              src={health}
              alt="Health"
              className="object-cover rounded-full w-20 h-20 md:w-12 md:h-12"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
