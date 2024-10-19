import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logout from "../../assets/Logout.png";
import Chart from "../../assets/Chart.png";
import Chartblue from "../../assets/Chartblue.png";
import Location from "../../assets/Location.png";
import locationBlue from "../../assets/locationBlue.png";
import Folder from "../../assets/Folder.png";
import folderBlue from "../../assets/folderBlue.png";
import user from "../../assets/user.png";
import userBlue from "../../assets/userBlue.png";
import userPlus from "../../assets/userPlus.png";
import userPlusBlue from "../../assets/userPlusBlue.png";

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div>
      <div className="w-64">
        <Accordion className="bg-blue-500 m-2">
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>การรายงานและวิเคราะห์ผล</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div>
                <Link to="/admin/dashboard">
                  <button
                    className={`rounded-full p-2 text-left w-full flex items-center  ${
                      isActive("/admin/dashboard") ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    <img
                      src={isActive("/admin/dashboard") ? Chartblue : Chart}
                      alt="Chart"
                      className="object-cover snap-center"
                    />
                    <span className="ml-2">สถานการณ์สุขภาพ</span>
                  </button>
                </Link>
                <Link to="/admin/map">
                  <button
                    className={`rounded-full p-2 text-left w-full flex items-center ${
                      isActive("/admin/map") ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    <img
                      src={isActive("/admin/map") ? locationBlue : Location}
                      alt="Location"
                      className="object-cover md:place-items-start "
                    />
                    <span className="ml-2">แผนที่แสดงจุด</span>
                  </button>
                </Link>
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion className="bg-blue-500 m-2">
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography>การติดตามข้อมูลสุขภาพ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div>
                <Link to="/admin">
                  <button
                    className={`rounded-full p-2 text-left w-full flex items-center ${
                      isActive("/admin") ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    <img
                      src={isActive("/admin") ? folderBlue : Folder}
                      alt="Folder"
                      className="object-cover md:place-items-start"
                    />
                    <span className="ml-2">ข้อมูลสุขภาพที่บันทึกแล้ว</span>
                  </button>
                </Link>
                <Link to="/admin/caregiverInformation">
                  <button
                    className={`rounded-full p-2 text-left w-full flex items-center ${
                      isActive("/admin/caregiverInformation")
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                  >
                    <img
                      src={
                        isActive("/admin/caregiverInformation")
                          ? folderBlue
                          : Folder
                      }
                      alt="Folder"
                      className="object-cover md:place-items-start"
                    />
                    <span className="ml-2">ข้อมูลผู้ดูแล</span>
                  </button>
                </Link>
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion className="bg-blue-500 m-2">
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography>การจัดการข้อมูลผู้ใช้งาน</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div>
                <Link to="/admin/adminProflile">
                  <button
                    className={`rounded-full p-2 text-left w-full flex items-center ${
                      isActive("/admin/adminProflile") ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    <img
                      src={isActive("/admin/adminProflile") ? userBlue : user}
                      alt="user"
                      className="object-cover md:place-items-start  h-4 w-4 "
                    />
                    <span className="ml-2">ข้อมูลผู้ใช้งาน</span>
                  </button>
                </Link>
                <Link to="/admin/Profile">
                  <button
                    className={`rounded-full p-2 text-left w-full flex items-center ${
                      isActive("/admin/Profile") ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    <img
                      src={isActive("/admin/Profile") ? userPlusBlue : userPlus}
                      alt="userPlus"
                      className="object-cover md:place-items-start "
                    />
                    <span className="ml-2">ผู้ใช้งานในระบบ</span>
                  </button>
                </Link>
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="m-2">
        <Accordion>
          <button
            onClick={handleLogout}
            className="rounded-full p-2 text-left w-full grid grid-cols-2 text-red-500 items-center"
          >
            ออกจากระบบ
            <img
              src={Logout}
              alt="Logout"
              className="object-cover md:place-items-start  justify-self-end "
            />
          </button>
        </Accordion>
      </div>
    </div>
  );
};

export default AdminSidebar;
