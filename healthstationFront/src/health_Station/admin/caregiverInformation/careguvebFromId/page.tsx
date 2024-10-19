import React, { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import AdminNavbar from "../../../../components/navbarAdmin/adminNavbar";
import AdminSidebar from "../../../../components/navbarAdmin/adminSidebar";
import { Link } from "react-router-dom";
import icon from "../../../../assets/icon.png";
// Other imports

const CareguvebFromId: React.FC = () => {
  const [state, setState] = useState();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className="h-screen">
      <AdminNavbar />
      <div className="flex">
        <div className="grid-rows-1">
          <AdminSidebar />
        </div>
        <div className=" bg-neutral-100 w-full">
          <div className="flex-initial md:bg-white"></div>
          <div className="flex-1 md:bg-neutral-100 ">
            <div className=" md:bg-white md:m-4 p-2 bg-white rounded-lg">
              <div className="text-center rounded-md">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 ">
                <div className="flex p-4 ">
                <Link to="/admin/caregiverInformation">
                  <button className="mr-2 ">
                    <img
                      src={icon}
                      alt="icon"
                      className="object-cover h-3 mt-3 mr-1 md:place-items-start"
                    />
                  </button>
                </Link>
                <div className="text-2xl">ข้อมูลผู้ดูแล</div>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareguvebFromId;
