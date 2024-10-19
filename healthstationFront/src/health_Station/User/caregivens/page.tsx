import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { List, useMediaQuery, useTheme } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import icon from "../../../assets/icon.png";
import * as Yup from "yup";
import axios from "axios";
import userPlus from "../../../assets/userPlus.png";
import Contacts from "../../../assets/Contacts.png";
import Logout from "../../../assets/Logout.png";
import userPlusBlue from "../../../assets/userPlusBlue.png";
import ContactBlue from "../../../assets/ContactBlue.png";

interface FormData {
  user_ssd: string;
  caregiven_ssd: string;
}

interface Errors {
  user_ssd?: string;
  caregiven_ssd?: string;
}

const validationSchema = Yup.object().shape({
  user_ssd: Yup.string()
    .required("กรุณากรอก เลขประจำตัวประชาชน")
    .matches(
      /^\d{13}$/,
      "กรุณากรอกเป็นตัวเลขเท่านั้น,เลขประจำตัวประชาชนต้องมี 13 หลัก"
    ),
  caregiven_ssd: Yup.string()
    .matches(/^\d{13}$/, "เลขประจำตัวประชาชนต้องมี 13 หลัก")
    .required("กรุณากรอก เลขประจำตัวประชาชน ของผู้ดูแล"),
});

const Caregivens: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    user_ssd: "",
    caregiven_ssd: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [ssnError, setSsnError] = useState<string | null>(null);
  const [isSsnError, setIsSsnError] = useState<boolean>(false);
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const location = useLocation();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setSsnError(null);
      setIsSsnError(false);
      const response = await axios.post(
        "http://localhost:9999/api/form/linkCaregiven",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Form Submitted", formData);
        setErrors({});
        window.location.href = "/health_Station"; // <-- Navigate to the desired route after form submission
      }
      
    } catch (error) {
      setSsnError("ไม่มีข้อมูลผู้ใช้");
      setIsSsnError(true);
      const newErrors: Errors = {};
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          if (err.path) newErrors[err.path as keyof Errors] = err.message;
        });
      } else if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("API error:", error.response.data);
          const apiErrors = error.response.data.errors;
          if (apiErrors) {
            Object.keys(apiErrors).forEach((key) => {
              newErrors[key as keyof Errors] = apiErrors[key];
            });
          }
        } else if (error.request) {
          console.error("API error: No response received");
        } else {
          console.error("API error:", error.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }

      setErrors(newErrors);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex">
        <div className="flex-1 ">
          {!isSmallScreen && (
            <List className="md:w-56">
              <Accordion className="bg-blue-500 m-2">
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography>การบันทึกข้อมูล</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <div>
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
                              isActive("/health_Station")
                                ? userPlusBlue
                                : userPlus
                            }
                            alt="Chart"
                            className="object-cover snap-center"
                          />
                          <span className="ml-2">บันทึกข้อมูลใหม่</span>
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
              <div className="m-2">
                <Accordion>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg p-2 text-left w-full grid grid-cols-2 text-red-500"
                  >
                    ออกจากระบบ
                    <img
                      src={Logout}
                      alt="Logout"
                      className="object-cover md:place-items-start mt-1 mr-1 justify-self-end"
                    />
                  </button>
                </Accordion>
              </div>
            </List>
          )}
        </div>
        <div className="md:bg-neutral-100 w-full p-4">
          <div className="bg-white p-2">
            <div className="flex-initial md:bg-white">
              <div className="flex p-4 ">
                <Link to="/Health_Station">
                  <button className="mr-2 ">
                    <img
                      src={icon}
                      alt="icon"
                      className="object-cover h-3 mt-3 mr-1 md:place-items-start"
                    />
                  </button>
                </Link>
                <div className="text-2xl">บันทึกเพิ่มผู้ดูแล</div>
              </div>
            </div>
            <Accordion className="bg-blue-500">
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Typography>ข้อมูลเพิ่มผู้ดูแล</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div className="p-4">
                    <form className="" onSubmit={handleSubmit}>
                      <div className="items-start w-full mt-3">
                        <label htmlFor="user_ssd" className="relative">
                          เลขประจำตัวประชาชน
                          <span className="text-red-500 absolute">*</span>
                        </label>
                        <input
                          className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                          id="iduser_ssd"
                          name="user_ssd"
                          placeholder="เลขประจำตัวประชาชน"
                          onChange={handleChange}
                          value={formData.user_ssd}
                        />
                        {isSsnError && (
                          <div className="text-red-500 text-sm mt-1">
                            {ssnError}
                          </div>
                        )}
                        {errors.user_ssd && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.user_ssd}
                          </div>
                        )}
                      </div>
                      <div className="items-start w-full mt-3">
                        <label htmlFor="caregiven_ssd" className="relative">
                          เลขประจำตัวประชาชนของผู้ดูแลผู้สูงอายุ
                          <span className="text-red-500 absolute">*</span>
                        </label>
                        <input
                          className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                          id="idcaregiven_ssd"
                          name="caregiven_ssd"
                          placeholder="เลขประจำตัวประชาชนของผู้ดูแลผู้สูงอายุ"
                          onChange={handleChange}
                          value={formData.caregiven_ssd}
                        />
                        {isSsnError && (
                          <div className="text-red-500 text-sm mt-1">
                            {ssnError}
                          </div>
                        )}
                        {errors.caregiven_ssd && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.caregiven_ssd}
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <div className="flex items-start justify-end w-full">
              <button
                className="border-2 flex-none rounded-lg bg-blue-500 text-white p-2 md:w-36 mt-6"
                type="submit"
                onClick={handleSubmit}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Caregivens;
