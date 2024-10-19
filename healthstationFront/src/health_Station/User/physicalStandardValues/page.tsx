import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { List, useMediaQuery, useTheme } from "@mui/material";
import { Link, useNavigate,useLocation } from "react-router-dom";
import icon from "../../../assets/icon.png";
import * as Yup from "yup";
import axios from "axios";
import userPlus from "../../../assets/userPlus.png";
import Contacts from "../../../assets/Contacts.png";
import Logout from "../../../assets/Logout.png";
import userPlusBlue from "../../../assets/userPlusBlue.png";
import ContactBlue from "../../../assets/ContactBlue.png";

interface FormData {
  ssd: string;
  blood_pressure: string;
  weight: string;
  height: string;
  waistline: string;
}

interface Errors {
  ssd?: string;
  blood_pressure?: string;
  weight?: string;
  height?: string;
  waistline?: string;
}

const validationSchema = Yup.object().shape({
  ssd: Yup.string()
    .matches(/^\d{13}$/, "เลขประจำตัวประชาชนต้องมี 13 หลัก")
    .required("กรุณากรอก เลขประจำตัวประชาชน ของผู้ดูแล"),

  blood_pressure: Yup.string()
    .required("กรุณากรอกความดันโลหิต")
    .test("range-check", "ค่าความดันโลหิตต้องอยู่ในช่วง 50-200", (value) =>
      value ? parseInt(value) >= 50 && parseInt(value) <= 200 : true
    ),
  weight: Yup.string()
    .required("กรุณากรอกน้ำหนัก")
    .test(
      "weight-check",
      "น้ำหนักต้องมากกว่า 0 และน้อยกว่า 300 กิโลกรัม",
      (value) => (value ? parseInt(value) > 0 && parseInt(value) < 300 : true)
    ),
  height: Yup.string()
    .required("กรุณากรอกส่วนสูง")
    .test("height-check", "ส่วนสูงต้องอยู่ในช่วง 30-250 เซนติเมตร", (value) =>
      value ? parseInt(value) >= 30 && parseInt(value) <= 250 : true
    ),
  waistline: Yup.string()
    .required("กรุณากรอกรอบเอว")
    .test("waistline-check", "รอบเอวต้องอยู่ในช่วง 10-150 นิ้ว", (value) =>
      value ? parseInt(value) >= 10 && parseInt(value) <= 150 : true
    ),
});

const PhysicalStandardValues: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    ssd: "",
    blood_pressure: "",
    weight: "",
    height: "",
    waistline: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isActive = (path: string) => location.pathname === path;
  const location = useLocation(); 
  const [isSsnError, setIsSsnError] = useState<boolean>(false);
  const [ssnError, setSsnError] = useState<string | null>(null);
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

    // console.log(formData)

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setSsnError(null);
      setIsSsnError(false);
      const response = await axios.post(
        "http://localhost:9999/api/form/healthDataRecords",
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
        window.location.href = "/health_Station";
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

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex">
        <div className="flex-1">
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
                  <button className="mr-2">
                    <img
                      src={icon}
                      alt="icon"
                      className="object-cover h-3 mt-3 mr-1 md:place-items-start"
                    />
                  </button>
                </Link>
                <div className="text-2xl">ข้อมูลการตรวจสุขภาพ</div>
              </div>
            </div>
            <div className="items-start w-full mt-3 mb-4">
              <label
                htmlFor="nationalIdentificationNumber"
                className="relative"
              >
                เลขประจำตัวประชาชน
                <span className="text-red-500 absolute">*</span>
              </label>
              <input
                className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                id="idssd"
                name="ssd"
                placeholder="เลขประจำตัวประชาชน"
                onChange={handleChange}
                value={formData.ssd}
              />
              {isSsnError && (
                  <div className="text-red-500 text-sm mt-1">{ssnError}</div>
                )}
              {errors.ssd && (
                <div className="text-red-500 text-sm mt-1">{errors.ssd}</div>
              )}
            </div>
            <Accordion className="bg-blue-500 m-2">
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Typography>ข้อมูลสุขภาพพื้นฐาน</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div className="p-4">
                    <div className="items-start w-full mt-3">
                      <label htmlFor="blood_pressure" className="relative">
                        ความดันโลหิต (มม.ปรอท)
                        <span className="text-red-500 absolute">*</span>
                      </label>
                      <input
                        className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                        id="idBlood_pressure"
                        name="blood_pressure"
                        placeholder="ความดันโลหิต (มม.ปรอท)"
                        onChange={handleChange}
                        value={formData.blood_pressure}
                      />
                      {errors.blood_pressure && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.blood_pressure}
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="w-full">
                          <label htmlFor="weight" className="relative">
                            น้ำหนัก
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idWeight"
                            name="weight"
                            placeholder="กิโลกรัม"
                            onChange={handleChange}
                            value={formData.weight}
                          />
                          {errors.weight && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.weight}
                            </div>
                          )}
                        </div>
                        <div className="items-start w-full">
                          <label htmlFor="height" className="relative">
                            ส่วนสูง
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idHeight"
                            name="height"
                            placeholder="เซนติเมตร"
                            onChange={handleChange}
                            value={formData.height}
                          />
                          {errors.height && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.height}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full mt-3">
                      <label htmlFor="waistline" className="relative">
                        รอบเอว (นิ้ว)
                        <span className="text-red-500 absolute">*</span>
                      </label>
                      <input
                        className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                        id="idWaistline"
                        name="waistline"
                        placeholder="รอบเอว"
                        onChange={handleChange}
                        value={formData.waistline}
                      />
                      {errors.waistline && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.waistline}
                        </div>
                      )}
                    </div>
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

export default PhysicalStandardValues;
