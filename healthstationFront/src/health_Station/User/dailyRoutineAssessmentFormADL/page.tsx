import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  List,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, useNavigate,useLocation } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import axios from "axios";
import icon from "../../../assets/icon.png";
import * as Yup from "yup";
import userPlus from "../../../assets/userPlus.png";
import Contacts from "../../../assets/Contacts.png";
import Logout from "../../../assets/Logout.png";
import userPlusBlue from "../../../assets/userPlusBlue.png";
import ContactBlue from "../../../assets/ContactBlue.png";

interface FormData {
  ssd: string;
  one: string;
  two: string;
  three: string;
  four: string;
  five: string;
  six: string;
  seven: string;
  eight: string;
  nine: string;
  ten: string;
}

interface Errors {
  ssd?: string;
  one?: string;
  two?: string;
  three?: string;
  four?: string;
  five?: string;
  six?: string;
  seven?: string;
  eight?: string;
  nine?: string;
  ten?: string;
}

const validationSchema = Yup.object().shape({
  ssd: Yup.string()
    .matches(/^\d{13}$/, "เลขประจำตัวประชาชนต้องมี 13 หลัก")
    .required("กรุณากรอก เลขประจำตัวประชาชน"),

  one: Yup.string().required("กรุณาเลือกประเภท"),
  two: Yup.string().required("กรุณาเลือกประเภท"),
  three: Yup.string().required("กรุณาเลือกประเภท"),
  four: Yup.string().required("กรุณาเลือกประเภท"),
  five: Yup.string().required("กรุณาเลือกประเภท"),
  six: Yup.string().required("กรุณาเลือกประเภท"),
  seven: Yup.string().required("กรุณาเลือกประเภท"),
  eight: Yup.string().required("กรุณาเลือกประเภท"),
  nine: Yup.string().required("กรุณาเลือกประเภท"),
  ten: Yup.string().required("กรุณาเลือกประเภท"),
});



const PhysicalStandardValues: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    ssd: "",
    one: "",
    two: "",
    three: "",
    four: "",
    five: "",
    six: "",
    seven: "",
    eight: "",
    nine: "",
    ten: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [ssnError, setSsnError] = useState<string | null>(null)
  const [isSsnError, setIsSsnError] = useState<boolean>(false)
  const isActive = (path: string) => location.pathname === path;
  const location = useLocation(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setFormData({
      ...formData,
      [name]: event.target.value,
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
        "http://localhost:9999/api/form/adl_Form",
        formData,
        {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      if (response.status === 200){
        console.log("Form Submitted", formData);
        setErrors({});
        window.location.href = "/health_Station";
      }
    } catch (error) {
      setSsnError("ไม่มีข้อมูลผู้ใช้")
      setIsSsnError(true)
      const newErrors: Errors = {};
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          if (err.path) newErrors[err.path as keyof Errors] = err.message;
        });
      }else if (axios.isAxiosError(error)) {
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
      }else {
        console.error("Unexpected error:", error);
      }
      setErrors(newErrors);
    }
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
                            บันทึกข้อมูลผู้ดูแลผู้สูงอายุ
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
                <div className="text-2xl">แบบบันทึกข้อมูลสุขภาพ</div>
              </div>
              <div className="items-start w-full mt-3 mb-4">
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
                  <div className="text-red-500 text-sm mt-1">{errors.ssd}</div>
                )}
                {isSsnError && (
                  <div className="text-red-500 text-sm mt-1">{ssnError}</div>
                )}
              </div>
              <Accordion className="bg-blue-500">
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography>ข้อมูลการประเมินกิจวัตรประจำวัน</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <div className="items-start w-full mt-3 p-2">
                      <Box>
                        <FormControl component="fieldset">
                          <label htmlFor="one" className="relative">
                            การรับประทานอาหารเมื่อเตรียมสำรับไว้ให้เรียบร้อยต่อหน้า
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <RadioGroup
                            aria-label="one"
                            name="one"
                            value={
                              formData.one !== null
                                ? formData.one.toString()
                                : ""
                            }
                            onChange={(e) => handleChangeRadio(e, "one")}
                          >
                            <div className="grid grid-cols-1 gap-4">
                              <FormControlLabel
                                value="0"
                                control={<Radio />}
                                label="0 ไม่สามารถตักอาหารเข้าปากได้"
                              />
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="1 ตักอาหารเองได้แต่ต้องมีคนช่วย เช่น ช่วยใช้ช้อนตักเตรียมไว้ให้หรือตัดเป็นเล็กๆไว้ล่วงหน้า"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="2 ตักอาหารและช่วยตัวเองได้เป็นปกติ"
                              />
                            </div>
                            {errors.one && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.one}
                              </div>
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Box>

                      <Box>
                        <FormControl component="fieldset">
                          <label htmlFor="two" className="relative mt-6 mb-6">
                            ล้างหน้า หวีผม แปรงฟัน โกนหนวด ในระยะเวลา 24 - 28
                            ชั่วโมงที่ผ่านมา
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <RadioGroup
                            aria-label="two"
                            name="two"
                            value={
                              formData.two !== null
                                ? formData.two.toString()
                                : ""
                            }
                            onChange={(e) => handleChangeRadio(e, "two")}
                          >
                            <div className="grid grid-cols-1 gap-4">
                              <FormControlLabel
                                value="0"
                                control={<Radio />}
                                label="0 ต้องการความช่วยเหลือ"
                              />
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="1 ทําเองได้ (รวมทั้งที่ทําได้เองถ้าเตรียมอุปกรณ์ไว้ให้)"
                              />
                            </div>
                            {errors.two && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.two}
                              </div>
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Box>

                      <Box>
                        <FormControl component="fieldset">
                          <label htmlFor="three" className="relative mt-6 mb-6">
                            ลุกนั่งจากที่นอน หรือจากเตียง ไปยังเก้าอี้
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <RadioGroup
                            aria-label="three"
                            name="three"
                            value={
                              formData.three !== null
                                ? formData.three.toString()
                                : ""
                            }
                            onChange={(e) => handleChangeRadio(e, "three")}
                          >
                            <div className="grid grid-cols-1 gap-4">
                              <FormControlLabel
                                value="0"
                                control={<Radio />}
                                label="0 ไม่สามารถนั่งได้ (นั่งแล้วจะล้มเสมอ) หรือต้องใช้คนสองคนช่วยกันยกขึ้น"
                              />
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="1 ต้องการความช่วยเหลืออย่างมากจึงจะนั่งได้ เช่น ต้องใช้คนที่แข็งแรงหรือมีทักษะ 1 คน หรือใช้คนทั่วไป 2 คนพยุงหรือดันขึ้นมาจึงจะนั่งอยู่ได้"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="2 ต้องการความช่วยเหลือบ้าง เช่น บอกให้ทําตาม หรือช่วยพยุงเล็กน้อย หรือต้องมีคนดูแลเพื่อความปลอดภัย"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio />}
                                label="3 ทําได้เอง"
                              />
                            </div>
                            {errors.three && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.three}
                              </div>
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Box>

                      <Box>
                        <FormControl component="fieldset">
                          <label htmlFor="four" className="relative mt-6 mb-6">
                            ใช้ห้องนํ้า
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <RadioGroup
                            aria-label="four"
                            name="four"
                            value={
                              formData.four !== null
                                ? formData.four.toString()
                                : ""
                            }
                            onChange={(e) => handleChangeRadio(e, "four")}
                          >
                            <div className="grid grid-cols-1 gap-4">
                              <FormControlLabel
                                value="0"
                                control={<Radio />}
                                label="0 ต้องการความช่วยเหลือ"
                              />
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="1 ทําเองได้พอสมควร เช่น ยังต้องใช้ไม้เท้าช่วยบ้าง หรือมีปัญหาลุกขึ้นนั่งหรือยืนบ้าง แต่ถ้าอุปกรณ์ช่วยเดินไปห้องนํ้าเองได้"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="2 ช่วยตัวเองได้ตามปกติ"
                              />
                            </div>
                            {errors.four && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.four}
                              </div>
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Box>

                      <Box>
                        <FormControl component="fieldset">
                          <label htmlFor="five" className="relative mt-6 mb-6">
                            การเคลื่อนที่ภายในห้องหรือบ้าน
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <RadioGroup
                            aria-label="five"
                            name="five"
                            value={
                              formData.five !== null
                                ? formData.five.toString()
                                : ""
                            }
                            onChange={(e) => handleChangeRadio(e, "five")}
                          >
                            <div className="grid grid-cols-1 gap-4">
                              <FormControlLabel
                                value="0"
                                control={<Radio />}
                                label="0 เคลื่อนที่ไปไหนไม่ได้"
                              />
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="1 ต้องใช้รถเข็นช่วยตัวเองให้เคลื่อนที่ได้เอง (ไม่ต้องมีคนเข็นให้) และจะต้องเข้าออกมุมห้องหรือประตูได้"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="2 เดินหรือเคลื่อนที่โดยมีคน ช่วย เช่น พยุง หรือบอกให้ทําตามหรือต้องให้ความสนใจดูแลเพื่อความปลอดภัย"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio />}
                                label="3 เดินหรือเคลื่อนที่ได้เอง"
                              />
                            </div>
                            {errors.five && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.five}
                              </div>
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Box>

                      <Box>
                        <FormControl component="fieldset">
                          <label htmlFor="six" className="relative mt-6 mb-6">
                            การสวมใส่เสื้อผ้า
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <RadioGroup
                            aria-label="six"
                            name="six"
                            value={
                              formData.six !== null
                                ? formData.six.toString()
                                : ""
                            }
                            onChange={(e) => handleChangeRadio(e, "six")}
                          >
                            <div className="grid grid-cols-1 gap-4">
                              <FormControlLabel
                                value="0"
                                control={<Radio />}
                                label="0 ต้องมีคนสวมใส่ให้ ช่วยตัวเองแทบไม่ได้หรือได้น้อย"
                              />
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="1 ช่วยตัวเองได้ประมาณร้อยละ 50 ที่เหลือต้องมีคนช่วยห้"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="2 ช่วยตัวเองได้ดี (รวมทั้งการติดกระดุม รูดซิบ หรือใช้เสื้อผ้าที่ดัดแปลงให้เหมาะสมก็ได้)"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio />}
                                label="3 เดินหรือเคลื่อนที่ได้เอง"
                              />
                            </div>
                            {errors.six && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.six}
                              </div>
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Box>

                      <Box>
                        <FormControl component="fieldset">
                          <label htmlFor="seven" className="relative mt-6 mb-6">
                            การขึ้นลงบันได 1 ชั้น
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <RadioGroup
                            aria-label="seven"
                            name="seven"
                            value={
                              formData.seven !== null
                                ? formData.seven.toString()
                                : ""
                            }
                            onChange={(e) => handleChangeRadio(e, "seven")}
                          >
                            <div className="grid grid-cols-1 gap-4">
                              <FormControlLabel
                                value="0"
                                control={<Radio />}
                                label="0 ไม่สามารถทําได้"
                              />
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="1 ต้องการคนช่วย"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="2 ขึ้นลงได้เอง (ถ้าต้องใช้เครื่องช่วยเดิน เช่น walker จะต้องเอาขึ้นลงได้ด้วย)"
                              />
                            </div>
                            {errors.seven && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.seven}
                              </div>
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Box>

                      <Box>
                        <FormControl component="fieldset">
                          <label htmlFor="eight" className="relative mt-6 mb-6">
                            การอาบนํ้า
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <RadioGroup
                            aria-label="eight"
                            name="eight"
                            value={
                              formData.eight !== null
                                ? formData.eight.toString()
                                : ""
                            }
                            onChange={(e) => handleChangeRadio(e, "eight")}
                          >
                            <div className="grid grid-cols-1 gap-4">
                              <FormControlLabel
                                value="0"
                                control={<Radio />}
                                label="0 ต้องการคนช่วยหรือบอกให้ทํา"
                              />
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="1 อาบนํ้าเองได้"
                              />
                            </div>
                            {errors.eight && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.eight}
                              </div>
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Box>

                      <Box>
                        <FormControl component="fieldset">
                          <label htmlFor="nine" className="relative mt-6 mb-6">
                            การกลั้นการถ่ายอุจจาระในระยะ 1 สัปดาห์
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <RadioGroup
                            aria-label="nine"
                            name="nine"
                            value={
                              formData.nine !== null
                                ? formData.nine.toString()
                                : ""
                            }
                            onChange={(e) => handleChangeRadio(e, "nine")}
                          >
                            <div className="grid grid-cols-1 gap-4">
                              <FormControlLabel
                                value="0"
                                control={<Radio />}
                                label="0 กลั้นไม่ได้ หรือต้องการการสวนอุจจาระอยู่เสมอ"
                              />
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="1 กลั้นไม่ได้บางครั้ง (เป็นน้อยกว่า 1 ครั้งต่อสัปดาห์)"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="2 กลั้นได้เป็นปกติ"
                              />
                            </div>
                            {errors.nine && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.nine}
                              </div>
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Box>

                      <Box>
                        <FormControl component="fieldset">
                          <label htmlFor="ten" className="relative mt-6 mb-6">
                            การกลั้นปัสสาวะในระยะ 1 สัปดาห์ที่ผ่านมา
                            <span className="text-red-500 absolute">*</span>
                          </label>
                          <RadioGroup
                            aria-label="ten"
                            name="ten"
                            value={
                              formData.ten !== null
                                ? formData.ten.toString()
                                : ""
                            }
                            onChange={(e) => handleChangeRadio(e, "ten")}
                          >
                            <div className="grid grid-cols-1 gap-4">
                              <FormControlLabel
                                value="0"
                                control={<Radio />}
                                label="0 กลั้นไม่ได้ หรือใส่สายสวนปัสสาวะแต่ไม่สามารถดูแลเองได้"
                              />
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="1 กลั้นไม่ได้บางครั้ง (เป็นน้อยกว่าวันละ 1 ครั้ง)"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="2 กลั้นได้เป็นปกติ"
                              />
                            </div>
                            {errors.ten && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.ten}
                              </div>
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    </div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="border-2 flex-none rounded-lg bg-blue-500 text-white p-2 md:w-36 mt-6 h-12 w-32"
                  onClick={handleSubmit}
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default PhysicalStandardValues;
