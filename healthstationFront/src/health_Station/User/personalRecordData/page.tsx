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
  type: string;
  ssd: string;
  firstname: string;
  lastname: string;
  sex: string;
  education_level: string;
  career: string;
  age: string;
  birthday_date: string;
  blood_group: string;
  num_of_house: string;
  group_of_house: string;
  alley_of_house: string;
  street_of_house: string;
  tambon: string;
  amphoe: string;
  province: string;
  postcode: string;
  phone: string;
}

interface Errors {
  type?: string;
  ssd?: string;
  firstname?: string;
  lastname?: string;
  sex?: string;
  education_level?: string;
  career?: string;
  age?: string;
  birthday_date?: string;
  blood_group?: string;
  num_of_house?: string;
  group_of_house?: string;
  alley_of_house?: string;
  street_of_house?: string;
  tambon?: string;
  amphoe?: string;
  province?: string;
  postcode?: string;
  phone?: string;
}

const validationSchema = Yup.object().shape({
  type: Yup.string().required("กรุณาเลือกประเภท"),

  // เลขประจำตัวประชาชนควรมีความยาว 13 หลัก
  ssd: Yup.string()
    .required("กรุณากรอก เลขประจำตัวประชาชน")
    .matches(
      /^\d{13}$/,
      "กรุณากรอกเป็นตัวเลขเท่านั้น,เลขประจำตัวประชาชนต้องมี 13 หลัก",
      
    ),

  // เลขประจำตัวประชาชนของผู้ดูแลก็เช่นกัน

  firstname: Yup.string().required("กรุณากรอกชื่อ"),
  lastname: Yup.string().required("กรุณากรอกนามสกุล"),

  // เพศอาจมีเพียง "ชาย", "หญิง" หรือ "อื่นๆ"
  sex: Yup.string()
    .oneOf(["ชาย", "หญิง", "อื่นๆ"], "กรุณาเลือกเพศที่ถูกต้อง")
    .required("กรุณาเลือกเพศ"),

  // ระดับการศึกษาที่อาจเป็นได้ เช่น ปริญญาตรี, มัธยมปลาย, อื่นๆ
  education_level: Yup.string().required("กรุณาเลือกระดับการศึกษา"),

  career: Yup.string().required("กรุณากรอกอาชีพ"),

  // อายุควรเป็นตัวเลขและมีค่ามากกว่า 0
  age: Yup.string().required("กรุณากรอกอายุ"),

  // รูปแบบวันที่ เช่น yyyy-mm-dd
  birthday_date: Yup.string()
    .typeError("กรุณากรอกวันเกิดในรูปแบบที่ถูกต้อง")
    .required("กรุณากรอกวันเกิด"),

  // หมู่เลือดควรมีค่าที่เป็นไปได้ เช่น A, B, AB, O
  blood_group: Yup.string().required("กรุณากรอกหมู่เลือด"),

  num_of_house: Yup.string().required("กรุณากรอกที่อยู่บ้านเลขที่"),
  group_of_house: Yup.string().required("กรุณากรอกหมู่ที่"),
  alley_of_house: Yup.string(),
  street_of_house: Yup.string(),

  // ตรวจสอบตำบล อำเภอ จังหวัด
  tambon: Yup.string().required("กรุณากรอกตำบล"),
  amphoe: Yup.string().required("กรุณากรอกอำเภอ"),
  province: Yup.string().required("กรุณากรอกจังหวัด"),

  // รหัสไปรษณีย์ต้องมี 5 หลัก
  postcode: Yup.string()
    .required("กรุณากรอกรหัสไปรษณีย์")
    .length(5, "รหัสไปรษณีย์ต้องมี 5 หลัก")
    .matches(
      /^\d{5}$/,
      "กรุณากรอกเป็นตัวเลขเท่านั้น,รหัสไปรษณีย์ต้องมี  5 หลัก"
    ),

  phone: Yup.string()
    .required("กรุณากรอก เบอร์โทร")
    .length(10, "รหัสไปรษณีย์ต้องมี 10 หลัก")
    .matches(/^\d{10}$/, "กรุณากรอกเป็นตัวเลขเท่านั้น,เบอร์โทรต้องมี 10 หลัก"),
});

// คอมโพเนนต์หลัก
const PersonalRecordData: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    type: "",
    ssd: "",
    firstname: "",
    lastname: "",
    sex: "",
    education_level: "",
    career: "",
    age: "",
    birthday_date: "",
    blood_group: "",
    num_of_house: "",
    group_of_house: "",
    alley_of_house: "",
    street_of_house: "",
    tambon: "",
    amphoe: "",
    province: "",
    postcode: "",
    phone: "",
  });
  const [ssnError, setSsnError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
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

  const handleChangeL = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // อัปเดตข้อมูลฟอร์ม
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "birthday_date") {
      const birthday = new Date(value);
      const today = new Date();

      // คำนวณอายุด้วยปีค.ศ.
      let age = today.getFullYear() - birthday.getFullYear();

      // ตรวจสอบอายุที่คำนวณได้
      if (
        today.getMonth() < birthday.getMonth() ||
        (today.getMonth() === birthday.getMonth() &&
          today.getDate() < birthday.getDate())
      ) {
        age--;
      }

      // อัปเดตอายุที่คำนวณได้
      setFormData((prevData) => ({
        ...prevData,
        age: isNaN(age) || age < 1 ? "" : age.toString(), // ใส่ค่าอายุที่คำนวณได้
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      const response = await axios.post(
        "http://localhost:9999/api/form/userPersonal",
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
      const newErrors: Errors = {};
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          if (err.path) newErrors[err.path as keyof Errors] = err.message;
        });
      } else if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("API error:", error.response.data);
          const apiErrors = error.response.data.errors;

          if (error.response.status === 409) {
            newErrors.ssd = "เลขบัตรประชาชนนี้มีอยู่ในระบบแล้ว";
          }
          
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
                <div className="text-2xl">แบบบันทึกข้อมูลส่วนตัว</div>
              </div>
            </div>
            <Accordion className="bg-blue-500">
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Typography>ข้อมูลส่วนตัวบุคคล</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div className="p-4">
                    <form className="" onSubmit={handleSubmit}>
                      <div className="items-start w-full">
                        <label htmlFor="type" className="relative">
                          ประเภทความบกพร่องทางร่างกาย
                          <span className="text-red-500 absolute">*</span>
                        </label>
                        <select
                          name="type"
                          id="idType"
                          onChange={handleChange}
                          value={formData.type}
                          className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                        >
                          <option value="">ประเภทความบกพร่องทางร่างกาย</option>
                          <option value="มีความพิการ">มีความพิการ</option>
                          <option value="สุขภาวะปกติ">สุขภาวะปกติ</option>
                        </select>
                        {errors.type && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.type}
                          </div>
                        )}
                      </div>
                      <div className="items-start w-full mt-3">
                        <label htmlFor="ssd" className="relative">
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
                        {errors.ssd && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.ssd}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row md:space-x-4 mt-3">
                        <div className="w-full mb-4 md:mb-0">
                          <label htmlFor="firstname" className="relative">
                            ชื่อ
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idfirstname"
                            name="firstname"
                            placeholder="ชื่อ"
                            onChange={handleChange}
                            value={formData.firstname}
                          />
                          {errors.firstname && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.firstname}
                            </div>
                          )}
                        </div>
                        <div className="w-full">
                          <label htmlFor="lastname" className="relative">
                            นามสกุล
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idlastname"
                            name="lastname"
                            placeholder="นามสกุล"
                            onChange={handleChange}
                            value={formData.lastname}
                          />
                          {errors.lastname && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.lastname}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="items-start w-full mt-3">
                          <label htmlFor="sex" className="relative">
                            เพศ
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <select
                            name="sex"
                            id="idsex"
                            onChange={handleChange}
                            value={formData.sex}
                            className="border-2 border-b-4 flex-1 text-left pb-3 pt-2  bg-gray-100 w-full"
                          >
                            <option value="">เพศ</option>
                            <option value="ชาย">ชาย</option>
                            <option value="หญิง">หญิง</option>
                          </select>
                          {errors.sex && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.sex}
                            </div>
                          )}
                        </div>
                        <div className="items-start w-full mt-3">
                          <label htmlFor="blood_group" className="relative">
                            หมู่เลือด
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idblood_group"
                            name="blood_group"
                            placeholder="หมู่เลือด"
                            value={formData.blood_group}
                            onChange={handleChange}
                          />
                          {errors.blood_group && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.blood_group}
                            </div>
                          )}
                        </div>
                        <div className="items-start w-full">
                          <label htmlFor="education_level" className="relative">
                            ระดับการศึกษา
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <select
                            name="education_level"
                            id="ideducation_level"
                            onChange={handleChange}
                            value={formData.education_level}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          >
                            <option value="">ระดับการศึกษา</option>
                            <option value="ต่ำกว่าประถมศึกษา">
                              ต่ำกว่าประถมศึกษา
                            </option>
                            <option value="ประถมศึกษา">ประถมศึกษา</option>
                            <option value="มัธยมศึกษา">มัธยมศึกษา</option>
                            <option value="ประกาศนียบัตรวิชาชีพ ปวช/ปวส/ปวท">
                              ประกาศนียบัตรวิชาชีพ ปวช/ปวส/ปวท
                            </option>
                            <option value="อนุปริญญา">อนุปริญญา</option>
                            <option value="ปริญญาตรีหรือเทียบเท่า">
                              ปริญญาตรีหรือเทียบเท่า
                            </option>
                            <option value="ปริญญาโท">ปริญญาโท</option>
                            <option value="ปริญญาเอก">ปริญญาเอก</option>
                          </select>
                          {errors.education_level && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.education_level}
                            </div>
                          )}
                        </div>
                        <div className="items-start w-full">
                          <label htmlFor="idcareer" className="relative">
                            อาชีพ
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idcareer"
                            name="career"
                            placeholder="อาชีพ"
                            value={formData.career}
                            onChange={handleChange}
                          />
                          {errors.career && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.career}
                            </div>
                          )}
                        </div>
                        <div className="items-start w-full">
                          <label htmlFor="birthday_date" className="relative">
                            วัน/เดือน/ปีเกิด
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            type="date"
                            id="idbirthday_date"
                            name="birthday_date"
                            placeholder="กรอกวันเกิดของคุณ"
                            value={formData.birthday_date}
                            onChange={handleChangeL}
                          />
                          {errors.birthday_date && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.birthday_date}
                            </div>
                          )}
                        </div>

                        <div className="items-start w-full">
                          <label htmlFor="age" className="relative">
                            อายุ
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idage"
                            name="age"
                            placeholder="อายุ"
                            value={formData.age}
                          />
                        </div>
                        <div className="items-start w-full">
                          <label htmlFor="num_of_house" className="relative">
                            ที่อยู่บ้านเลขที่
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idnum_of_house"
                            name="num_of_house"
                            placeholder="ที่อยู่บ้านเลขที่"
                            value={formData.num_of_house}
                            onChange={handleChange}
                          />
                          {errors.num_of_house && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.num_of_house}
                            </div>
                          )}
                        </div>
                        <div className="items-start w-full">
                          <label htmlFor="group_of_house" className="relative">
                            หมู่ที่
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <select
                            name="group_of_house"
                            id="idgroup_of_house"
                            onChange={handleChange}
                            value={formData.group_of_house}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          >
                            <option value="">หมู่ที่</option>
                            <option value="หมู่ที่ 1 บ้านหลวง">
                              หมู่ที่ 1 บ้านหลวง
                            </option>
                            <option value="หมู่ที่ 2 บ้านแพทย์">
                              หมู่ที่ 2 บ้านแพทย์
                            </option>
                            <option value="หมู่ที่ 2 บ้านปงสนุก">
                              หมู่ที่ 2 บ้านปงสนุก
                            </option>
                            <option value="หมู่ที่ 3 บ้านปิน">
                              หมู่ที่ 3 บ้านปิน
                            </option>
                            <option value="หมู่ที่ 4 บ้านไชยสถาน">
                              หมู่ที่ 4 บ้านไชยสถาน
                            </option>
                            <option value="หมู่ที่ 5 บ้านท่าม่าน">
                              หมู่ที่ 5 บ้านท่าม่าน
                            </option>
                            <option value="หมู่ที่ 6 บ้านหล่ายทุ่ง">
                              หมู่ที่ 6 บ้านหล่ายทุ่ง
                            </option>
                            <option value="หมู่ที่ 7 บ้านสบทราย">
                              หมู่ที่ 7 บ้านสบทราย
                            </option>
                            <option value="หมู่ที่ 8 บ้านใหม่">
                              หมู่ที่ 8 บ้านใหม่
                            </option>
                            <option value="หมู่ที่ 9 บ้านกลาง">
                              หมู่ที่ 9 บ้านกลาง
                            </option>
                            <option value="หมู่ที่ 10 บ้านป่าซางคำ">
                              หมู่ที่ 10 บ้านป่าซางคำ
                            </option>
                          </select>
                          {errors.group_of_house && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.group_of_house}
                            </div>
                          )}
                        </div>
                        <div className="items-start w-full">
                          <label htmlFor="alley_of_house">ตรอก/ซอย</label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idalley_of_house"
                            name="alley_of_house"
                            placeholder="ตรอก/ซอย"
                            value={formData.alley_of_house}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="items-start w-full">
                          <label htmlFor="street_of_house">ถนน</label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idstreet_of_house"
                            name="street_of_house"
                            placeholder="ถนน"
                            value={formData.street_of_house}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="items-start w-full">
                          <label htmlFor="tambon" className="relative">
                            ตำบล
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idtambon"
                            name="tambon"
                            placeholder="ตำบล"
                            value={formData.tambon}
                            onChange={handleChange}
                          />
                          {errors.tambon && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.tambon}
                            </div>
                          )}
                        </div>
                        <div className="items-start w-full">
                          <label htmlFor="amphoe" className="relative">
                            อำเภอ
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idamphoe"
                            name="amphoe"
                            placeholder="อำเภอ"
                            value={formData.amphoe}
                            onChange={handleChange}
                          />
                          {errors.amphoe && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.amphoe}
                            </div>
                          )}
                        </div>
                        <div className="items-start w-full">
                          <label htmlFor="province" className="relative">
                            จังหวัด
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idprovince"
                            name="province"
                            placeholder="จังหวัด"
                            value={formData.province}
                            onChange={handleChange}
                          />
                          {errors.province && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.province}
                            </div>
                          )}
                        </div>
                        <div className="items-start w-full">
                          <label htmlFor="postcode" className="relative">
                            รหัสไปรษณีย์
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idpostcode"
                            name="postcode"
                            placeholder="รหัสไปรษณีย์"
                            value={formData.postcode}
                            onChange={handleChange}
                          />
                          {errors.postcode && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.postcode}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-rows-1 grid-flow-col gap-4">
                        <div className="items-start w-full pt-4">
                          <label htmlFor="phone" className="relative">
                            โทรศัพท์
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <input
                            className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                            id="idphone"
                            name="phone"
                            placeholder="โทรศัพท์"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                          {errors.phone && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.phone}
                            </div>
                          )}
                        </div>
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

export default PersonalRecordData;
