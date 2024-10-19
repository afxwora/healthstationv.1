import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import menu from "../assets/menu.png";
import exit from "../assets/exit.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import userPlus from "../assets/userPlus.png";
import Contacts from "../assets/Contacts.png";
import userPlusBlue from "../assets/userPlusBlue.png";
import ContactBlue from "../assets/ContactBlue.png";

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const isActive = (path: string) => location.pathname === path;
  const location = useLocation();
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  const DrawerList = () => (
    <div className="flex m-4">
      <Box sx={{ width: "260px" }} role="presentation" className="m-4 ">
        <div>
          <Accordion className="bg-blue-500 m-4 ">
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>การบันทึกข้อมูล</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <div className="">
                  <Link to="/health_Station">
                    <button
                      className={`rounded-full p-2 text-left w-full flex items-center  ${
                        isActive("/health_Station")
                          ? "bg-blue-50 text-blue-600"
                          : ""
                      }`}
                    >
                      <img
                        src={
                          isActive("/health_Station") ? userPlusBlue : userPlus
                        }
                        alt="Chart"
                        className="object-cover snap-center"
                      />
                      <span className="ml-2 ">บันทึกข้อมูลใหม่</span>
                    </button>
                  </Link>
                  <Link to="/health_Station/elderly">
                    <button
                      className={`rounded-full p-2 text-left w-full flex items-center  ${
                        isActive("/health_Station/elderly")
                          ? "bg-blue-50 text-blue-600"
                          : ""
                      }`}
                    >
                      <img
                        src={
                          isActive("/health_Station/elderly")
                            ? ContactBlue
                            : Contacts
                        }
                        alt="Chart"
                        className="object-cover snap-center"
                      />
                      <span className="ml-2">
                        บันทึกข้อมูลผู้ดูแล
                      </span>
                    </button>
                  </Link>
                </div>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </Box>
      <div className="">
        <Button
          onClick={toggleDrawer(false)}
          className="flex items-center justify-center"
        >
          <div className="bg-blue-500 rounded-lg p-2 mt-7">
            <img src={exit} alt="exit" className="w-6 h-6" />
          </div>
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <img
          src={menu}
          alt="menu"
          className="w-6 h-6 object-cover rounded-full"
        />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList()}
      </Drawer>
    </div>
  );
}
