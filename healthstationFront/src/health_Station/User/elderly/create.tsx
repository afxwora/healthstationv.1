import React, { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "../../../components/Navbar";
import icon from "../../../assets/icon.png";
import axios from "axios";
import * as Yup from "yup";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { List, useMediaQuery, useTheme } from "@mui/material";
import { Link, useNavigate,useLocation } from "react-router-dom";
import userPlus from "../../../assets/userPlus.png";
import Contacts from "../../../assets/Contacts.png";
import Logout from "../../../assets/Logout.png";
import userPlusBlue from "../../../assets/userPlusBlue.png";
import ContactBlue from "../../../assets/ContactBlue.png";

interface FormData {
  ssd: string;
  firstname: string;
  lastname: string;
  sex: string;
  age: string;
  birthday_date: string;
  num_of_house: string;
  group_of_house: string;
  alley_of_house: string;
  street_of_house: string;
  tambon: string;
  amphoe: string;
  province: string;
  postcode: string;
  phone: string;
  line_id: string;
  education_level: string;
  email: string;
  career: string;
  caregiver: string;
  operating_area: string;
}

interface Errors {
  [key: string]: string;
}

const validationSchema = Yup.object().shape({
  ssd: Yup.string()
    .required("กรุณากรอกเลขประจำตัวประชาชน")
    .length(13, "เลขประจำตัวประชาชนต้องมี 13 หลัก"),
  firstname: Yup.string().required("กรุณากรอกชื่อ"),
  lastname: Yup.string().required("กรุณากรอกนามสกุล"),
  sex: Yup.string().required("กรุณาเลือกเพศ"),
  age: Yup.string()
    .required("กรุณากรอกอายุ")
    .min(1, "อายุต้องมากกว่า 0")
    .max(150, "อายุต้องไม่เกิน 150 ปี"),
  birthday_date: Yup.date().required("กรุณากรอกวัน/เดือน/ปีเกิด").nullable(),
  num_of_house: Yup.string().required("กรุณากรอกที่อยู่บ้านเลขที่"),
  group_of_house: Yup.string().required("กรุณากรอกหมู่ที่"),
  alley_of_house: Yup.string().required("กรุณากรอกตรอก/ซอย"),
  street_of_house: Yup.string().required("กรุณากรอกถนน"),
  tambon: Yup.string().required("กรุณากรอกตำบล"),
  amphoe: Yup.string().required("กรุณากรอกอำเภอ"),
  province: Yup.string().required("กรุณากรอกจังหวัด"),
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
  email: Yup.string().required("กรุณากรอกอีเมล").email("อีเมลไม่ถูกต้อง"),
  line_id: Yup.string().required("กรุณากรอก Line ID"),
  education_level: Yup.string().required("กรุณาเลือกระดับการศึกษา"),
  career: Yup.string().required("กรุณากรอกอาชีพ"),
  caregiver: Yup.string().required("กรุณากรอกข้อมูลการอบรม CG (Caregiver)"),
  operating_area: Yup.string().required("กรุณากรอกพื้นที่ปฏิบัติงาน"),
});

const data = [
  {
    id: "1",
    names: "เลขประจำตัวประชาชน",
    name: "ssd",
    placeholder: "เลขประจำตัวประชาชน",
    type: "text",
  },
  {
    id: "2",
    names: "ชื่อ",
    name: "firstname",
    placeholder: "ชื่อ",
    type: "text",
  },
  {
    id: "3",
    names: "นามสกุล",
    name: "lastname",
    placeholder: "นามสกุล",
    type: "text",
  },
  {
    id: "4",
    names: "วัน/เดือน/ปีเกิด",
    name: "birthday_date",
    placeholder: "วัน/เดือน/ปีเกิด",
    type: "date",
  },
  { id: "5", names: "อายุ", name: "age", placeholder: "อายุ", type: "text" },
  {
    id: "6",
    names: "ที่อยู่บ้านเลขที่",
    name: "num_of_house",
    placeholder: "ที่อยู่บ้านเลขที่",
    type: "text",
  },
  {
    id: "7",
    names: "ตรอก/ซอย",
    name: "alley_of_house",
    placeholder: "ตรอก/ซอย",
    type: "text",
  },
  {
    id: "8",
    names: "ถนน",
    name: "street_of_house",
    placeholder: "ถนน",
    type: "text",
  },
  { id: "9", names: "ตำบล", name: "tambon", placeholder: "ตำบล", type: "text" },
  {
    id: "10",
    names: "อำเภอ",
    name: "amphoe",
    placeholder: "อำเภอ",
    type: "text",
  },
  {
    id: "11",
    names: "จังหวัด",
    name: "province",
    placeholder: "จังหวัด",
    type: "text",
  },
  {
    id: "12",
    names: "รหัสไปรษณีย์",
    name: "postcode",
    placeholder: "รหัสไปรษณีย์",
    type: "text",
  },
  {
    id: "13",
    names: "โทรศัพท์",
    name: "phone",
    placeholder: "โทรศัพท์",
    type: "text",
  },
  {
    id: "14",
    names: "Line ID",
    name: "line_id",
    placeholder: "Line ID",
    type: "text",
  },
  {
    id: "15",
    names: "E-mail",
    name: "email",
    placeholder: "E-mail",
    type: "email",
  },
  {
    id: "16",
    names: "อาชีพ",
    name: "career",
    placeholder: "อาชีพ",
    type: "text",
  },
];

const dataselect = [
  {
    id: "1.1",
    names: "เพศ",
    name: "sex",
    options: [
      { value: "", label: "เพศ" },
      { value: "ชาย", label: "ชาย" },
      { value: "หญิง", label: "หญิง" },
    ],
  },
  {
    id: "2.1",
    names: "หมู่ที่",
    name: "group_of_house",
    options: [
      { value: "หมู่ที่", label: "หมู่ที่" },
      { value: "หมู่ที่ 1 บ้านหลวง", label: "หมู่ที่ 1 บ้านหลวง" },
      { value: "หมู่ที่ 2 บ้านแพทย์", label: "หมู่ที่ 2 บ้านแพทย์" },
      { value: "หมู่ที่ 2 บ้านปงสนุก", label: "หมู่ที่ 2 บ้านปงสนุก" },
      { value: "หมู่ที่ 3 บ้านปิน", label: "หมู่ที่ 3 บ้านปิน" },
      { value: "หมู่ที่ 4 บ้านไชยสถาน", label: "หมู่ที่ 4 บ้านไชยสถาน" },
      { value: "หมู่ที่ 5 บ้านท่าม่าน", label: "หมู่ที่ 5 บ้านท่าม่าน" },
      { value: "หมู่ที่ 6 บ้านหล่ายทุ่ง", label: "หมู่ที่ 6 บ้านหล่ายทุ่ง" },
      { value: "หมู่ที่ 7 บ้านสบทราย", label: "หมู่ที่ 7 บ้านสบทราย" },
      { value: "หมู่ที่ 8 บ้านใหม่", label: "หมู่ที่ 8 บ้านใหม่" },
      { value: "หมู่ที่ 9 บ้านกลาง", label: "หมู่ที่ 9 บ้านกลาง" },
      { value: "หมู่ที่ 10 บ้านป่าซางคำ", label: "หมู่ที่ 10 บ้านป่าซางคำ" },
    ],
  },
  {
    id: "3",
    names: "ระดับการศึกษา",
    name: "education_level",
    options: [
      { value: "", label: "ระดับการศึกษา" },
      { value: "ต่ำกว่าประถมศึกษา", label: "ต่ำกว่าประถมศึกษา" },
      { value: "ประถมศึกษา", label: "ประถมศึกษา" },
      { value: "มัธยมศึกษา", label: "มัธยมศึกษา" },
      {
        value: "ประกาศนียบัตรวิชาชีพ ปวช/ปวส/ปวท",
        label: "ประกาศนียบัตรวิชาชีพ ปวช/ปวส/ปวท",
      },
      { value: "ปริญญาตรี", label: "ปริญญาตรี" },
      { value: "ปริญญาโท", label: "ปริญญาโท" },
      { value: "ปริญญาเอก", label: "ปริญญาเอก" },
      { value: "อื่นๆ", label: "อื่นๆ" },
    ],
  },
  {
    id: "4",
    names: "ข้อมูลการอบรม CG (Caregiver)",
    name: "caregiver",
    options: [
      { value: "", label: "ข้อมูลการอบรม CG (Caregiver)" },
      { value: "มีใบรับรอง", label: "มีใบรับรอง" },
      { value: "ไม่มีใบรับรอง", label: "ไม่มีใบรับรอง" },
    ],
  },
  {
    id: "5.1",
    names: "พื้นที่ปฏิบัติงาน",
    name: "operating_area",
    options: [
      { value: "", label: "พื้นที่ปฏิบัติงาน" },
      { value: "หมู่ที่ 1 บ้านหลวง", label: "หมู่ที่ 1 บ้านหลวง" },
      { value: "หมู่ที่ 2 บ้านแพทย์", label: "หมู่ที่ 2 บ้านแพทย์" },
      { value: "หมู่ที่ 2 บ้านปงสนุก", label: "หมู่ที่ 2 บ้านปงสนุก" },
      { value: "หมู่ที่ 3 บ้านปิน", label: "หมู่ที่ 3 บ้านปิน" },
      { value: "หมู่ที่ 4 บ้านไชยสถาน", label: "หมู่ที่ 4 บ้านไชยสถาน" },
      { value: "หมู่ที่ 5 บ้านท่าม่าน", label: "หมู่ที่ 5 บ้านท่าม่าน" },
      { value: "หมู่ที่ 6 บ้านหล่ายทุ่ง", label: "หมู่ที่ 6 บ้านหล่ายทุ่ง" },
      { value: "หมู่ที่ 7 บ้านสบทราย", label: "หมู่ที่ 7 บ้านสบทราย" },
      { value: "หมู่ที่ 8 บ้านใหม่", label: "หมู่ที่ 8 บ้านใหม่" },
      { value: "หมู่ที่ 9 บ้านกลาง", label: "หมู่ที่ 9 บ้านกลาง" },
      { value: "หมู่ที่ 10 บ้านป่าซางคำ", label: "หมู่ที่ 10 บ้านป่าซางคำ" },
    ],
  },
];

const Create: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    ssd: "",
    firstname: "",
    lastname: "",
    sex: "",
    age: "",
    birthday_date: "",
    num_of_house: "",
    group_of_house: "",
    alley_of_house: "",
    street_of_house: "",
    tambon: "",
    amphoe: "",
    province: "",
    postcode: "",
    phone: "",
    line_id: "",
    education_level: "",
    email: "",
    career: "",
    caregiver: "",
    operating_area: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  const location = useLocation(); 
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log(formData);
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      const response = await axios.post(
        "http://localhost:9999/api/form/careGiven_form",
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
        window.location.href = "/health_Station/elderly";
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
    localStorage.removeItem('token');
    
    navigate('/');
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
                <Link to="/health_Station/elderly">
                  <button className="mr-2 ">
                    <img
                      src={icon}
                      alt="icon"
                      className="object-cover h-3 mt-3 mr-1 md:place-items-start"
                    />
                  </button>
                </Link>
                <div className="text-2xl">แบบบันทึกข้อมูลผู้ดูแลผู้สูงอายุ</div>
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
                  <form onSubmit={handleSubmit} className="p-2">
                    {data
                      .filter((field) => parseInt(field.id) === 1)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <input
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          />
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                    <div className="flex flex-col md:flex-row md:space-x-4">
                      <div className="w-full md:w-1/2">
                        {data
                          .filter((field) => parseInt(field.id) === 2)
                          .map((item) => (
                            <div className="p-2" key={item.id}>
                              <label>{item.names}</label>
                              <span className="text-red-500 absolute">*</span>
                              <input
                                type={item.type}
                                name={item.name}
                                placeholder={item.placeholder}
                                value={formData[item.name as keyof FormData]}
                                onChange={handleChange}
                                className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                              />
                              {errors[item.name] && (
                                <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>
                              )}
                            </div>
                          ))}
                      </div>
                      <div className="w-full md:w-1/2">
                        {data
                          .filter((field) => parseInt(field.id) === 3)
                          .map((item) => (
                            <div className="p-2" key={item.id}>
                              <label>{item.names}</label>
                              <span className="text-red-500 absolute">*</span>
                              <input
                                type={item.type}
                                name={item.name}
                                placeholder={item.placeholder}
                                value={formData[item.name as keyof FormData]}
                                onChange={handleChange}
                                className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                              />
                              {errors[item.name] && (
                                <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>

                    {dataselect
                      .filter((fieldSelect) => parseInt(fieldSelect.id) === 1)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <select
                            name={item.name}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          >
                            {item.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                    {data
                      .filter((fieldSelect) => parseInt(fieldSelect.id) === 1.1)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <input
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          />
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                    <div className="flex flex-col md:flex-row md:space-x-4">
                      <div className="w-full md:w-1/2">
                        {data
                          .filter((field) => parseInt(field.id) === 4)
                          .map((item) => (
                            <div className="p-2" key={item.id}>
                              <label>{item.names}</label>
                              <span className="text-red-500 absolute">*</span>
                              <input
                                type={item.type}
                                name={item.name}
                                placeholder={item.placeholder}
                                value={formData[item.name as keyof FormData]}
                                onChange={handleChangeL}
                                className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                              />
                              {errors[item.name] && (
                                <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>
                              )}
                            </div>
                          ))}
                      </div>
                      <div className="w-full md:w-1/2">
                        {data
                          .filter((field) => parseInt(field.id) === 5)
                          .map((item) => (
                            <div className="p-2" key={item.id}>
                              <label>{item.names}</label>
                              <span className="text-red-500 absolute">*</span>
                              <input
                                type={item.type}
                                name={item.name}
                                placeholder={item.placeholder}
                                value={formData[item.name as keyof FormData]}
                                
                                className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                              />
                              {errors[item.name] && (
                                <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-4">
                      <div className="w-full md:w-1/2">
                        {data
                          .filter((field) => parseInt(field.id) === 6)
                          .map((item) => (
                            <div className="p-2" key={item.id}>
                              <label>{item.names}</label>
                              <span className="text-red-500 absolute">*</span>
                              <input
                                type={item.type}
                                name={item.name}
                                placeholder={item.placeholder}
                                value={formData[item.name as keyof FormData]}
                                onChange={handleChange}
                                className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                              />
                              {errors[item.name] && (
                                <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>
                              )}
                            </div>
                          ))}
                      </div>
                      <div className="w-full md:w-1/2">
                        {dataselect
                          .filter(
                            (fieldSelect) => parseInt(fieldSelect.id) === 2
                          )
                          .map((item) => (
                            <div className="p-2" key={item.id}>
                              <label>{item.names}</label>
                              <span className="text-red-500 absolute">*</span>
                              <select
                                name={item.name}
                                value={formData[item.name as keyof FormData]}
                                onChange={handleChange}
                                className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                              >
                                {item.options.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              {errors[item.name] && (
                                <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                    {data
                       .filter((field) => parseInt(field.id) === 7)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <input
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          />
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                      </div>
                      <div className="w-full md:w-1/2">
                      {data
                       .filter((field) => parseInt(field.id) === 8)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <input
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          />
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                      </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:space-x-4">
                      <div className="w-full md:w-1/2">
                      {data
                       .filter((field) => parseInt(field.id) === 9)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <input
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          />
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                      </div>
                      <div className="w-full md:w-1/2">
                      {data
                       .filter((field) => parseInt(field.id) === 10)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <input
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          />
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                      </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:space-x-4">
                      <div className="w-full md:w-1/2">
                      {data
                       .filter((field) => parseInt(field.id) === 11)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <input
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          />
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                      </div>
                      <div className="w-full md:w-1/2">
                      {data
                       .filter((field) => parseInt(field.id) === 12)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <input
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          />
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                      </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:space-x-4">
                      <div className="w-full md:w-1/2">
                      {data
                       .filter((field) => parseInt(field.id) === 13)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <input
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          />
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                      </div>
                      <div className="w-full md:w-1/2">
                      {data
                       .filter((field) => parseInt(field.id) === 14)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <input
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          />
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                      </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:space-x-4">
                      <div className="w-full md:w-1/2">
                    {dataselect
                      .filter((fieldSelect) => parseInt(fieldSelect.id) === 3)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <select
                            name={item.name}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          >
                            {item.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                      </div>
                      <div className="w-full md:w-1/2">
                    {data
                      .filter((field) => parseInt(field.id) === 15)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <input
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          />
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                      </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:space-x-4">
                      <div className="w-full md:w-1/2">
                      {data
                      .filter((field) => parseInt(field.id) === 16)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <input
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          />
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                      </div>
                      <div className="w-full md:w-1/2">
                    {dataselect
                      .filter((fieldSelect) => parseInt(fieldSelect.id) === 4)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <select
                            name={item.name}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          >
                            {item.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                      </div>
                      </div>
                    {dataselect
                      .filter((fieldSelect) => parseInt(fieldSelect.id) === 5)
                      .map((item) => (
                        <div className="p-2" key={item.id}>
                          <label>{item.names}</label>
                          <span className="text-red-500 absolute">*</span>
                          <select
                            name={item.name}
                            value={formData[item.name as keyof FormData]}
                            onChange={handleChange}
                            className="w-full p-2 border-gray-200 bg-gray-100 border-2 border-b-4"
                          >
                            {item.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors[item.name] && <div className="text-red-500 text-sm mt-1">{errors[item.name]}</div>}
                        </div>
                      ))}
                  </form>
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

export default Create;