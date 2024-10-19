import React, { useState } from "react";
import FormDataComponent from "../../../components/from/fromData"; // Correct import path
import { Link } from "react-router-dom";
import icon from "../../../assets/icon.png";
interface FormData {
  ssd: number;
  firstname: string;
  lastname: string;
  sex: string;
  age: number;
  birthday_date: Date;
  num_of_house: number;
  group_of_house: number;
  alley_of_house: string;
  street_of_house: string;
  tambon: string;
  amphoe: string;
  province: string;
  postcode: number;
  phone: number;
  line_id: string;
  education_level: string;
  email: string;
  career: string;
  caregiver: string;
  operating_area: string;
}

const data = [
  {
    id: "1",
    name: "เลขประจำตัวประชาชน",
    placeholder: "เลขประจำตัวประชาชน",
    type: "number",
  },
  { id: "2", name: "ชื่อ", placeholder: "ชื่อ", type: "text" },
  { id: "3", name: "นามสกุล", placeholder: "นามสกุล", type: "text" },
  { id: "4", name: "อายุ", placeholder: "อายุ", type: "number" },
  {
    id: "5",
    name: "วัน/เดือน/ปีเกิด",
    placeholder: "วัน/เดือน/ปีเกิด",
    type: "date",
  },
  {
    id: "6",
    name: "ที่อยู่บ้านเลขที่",
    placeholder: "ที่อยู่บ้านเลขที่",
    type: "text",
  },
  { id: "7", name: "ตรอก/ซอย", placeholder: "ตรอก/ซอย", type: "text" },
  { id: "8", name: "ถนน", placeholder: "ถนน", type: "text" },
  { id: "9", name: "ตำบล", placeholder: "ตำบล", type: "text" },
  { id: "10", name: "อำเภอ", placeholder: "อำเภอ", type: "text" },
  { id: "11", name: "จังหวัด", placeholder: "จังหวัด", type: "text" },
  {
    id: "12",
    name: "รหัสไปรษณีย์",
    placeholder: "รหัสไปรษณีย์",
    type: "number",
  },
  { id: "13", name: "โทรศัพท์", placeholder: "โทรศัพท์", type: "number" },
  { id: "14", name: "Line ID", placeholder: "Line ID", type: "text" },
  { id: "15", name: "E-mail", placeholder: "E-mail", type: "email" },
  { id: "16", name: "อาชีพ", placeholder: "อาชีพ", type: "text" },
];

const dataselect = [
  {
    id: "1",
    name: "เพศ",
    options: [
      { value: "1", label: "เพศ" },
      { value: "2", label: "ชาย" },
      { value: "3", label: "หญิง" },
    ],
  },
  {
    id: "2",
    name: "หมู่ที่",
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
    name: "ระดับการศึกษา",
    options: [
      { value: "1", label: "การอบรม Cg (Caregiver)" },
      { value: "ต่ำกว่าประถมศึกษา", label: "ต่ำกว่าประถมศึกษา" },
      { value: "ประถมศึกษา", label: "ประถมศึกษา" },
      { value: "มัธยมศึกษา", label: "มัธยมศึกษา" },
      {
        value: "ประกาศนียบัตรวิชาชีพ ปวช/ปวส/ปวท",
        label: "ประกาศนียบัตรวิชาชีพ ปวช/ปวส/ปวท",
      },
      { value: "อนุปริญญา", label: "อนุปริญญา" },
      { value: "ปริญญาตรีหรือเทียบเท่า", label: "ปริญญาตรีหรือเทียบเท่า" },
      { value: "ปริญญาโท", label: "ปริญญาโท" },
      { value: "ปริญญาเอก", label: "ปริญญาเอก" },
    ],
  },
  {
    id: "4",
    name: "การอบรม Cg (Caregiver)",
    options: [
      { value: "1", label: "การอบรม Cg (Caregiver)" },
      { value: "2", label: "ผ่านการอบรม" },
      { value: "3", label: "ไม่ผ่านการอบรม" },
    ],
  },
  {
    id: "5",
    name: "พื้นที่ปฏิบัติงาน",
    options: [
      { value: "พื้นที่ปฏิบัติงาน", label: "พื้นที่ปฏิบัติงาน" },
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

const FormAdmin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    ssd: 0,
    firstname: "",
    lastname: "",
    sex: "",
    age: 0,
    birthday_date: new Date(),
    num_of_house: 0,
    group_of_house: 0,
    alley_of_house: "",
    street_of_house: "",
    tambon: "",
    amphoe: "",
    province: "",
    postcode: 0,
    phone: 0,
    line_id: "",
    education_level: "",
    email: "",
    career: "",
    caregiver: "",
    operating_area: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getFieldValue = (fieldName: keyof FormData): string => {
    const value = formData[fieldName];
    return value !== undefined && value !== null ? value.toString() : "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="m-10">
          <div className="flex">
            <Link to="/admin">
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
          {data
            .filter((field) => parseInt(field.id) <= 3)
            .map((field) => (
              <FormDataComponent
                key={field.id}
                id={field.id}
                name={field.name}
                placeholder={field.placeholder}
                type={field.type}
                value={getFieldValue(field.name as keyof FormData)}
                onChange={handleChange}
              />
            ))}
          <div>
            {dataselect
              .filter((fieldSelect) => parseInt(fieldSelect.id) === 1)
              .map((fieldSelect) => (
                <div key={fieldSelect.id} className="mb-4">
                  <label htmlFor={fieldSelect.id} className="block mb-2">
                    {fieldSelect.name}
                  </label>
                  <select
                    id={fieldSelect.id}
                    name={fieldSelect.name}
                    className="form-select block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-base"
                    value={getFieldValue(fieldSelect.name as keyof FormData)}
                    onChange={handleChange}
                  >
                    {fieldSelect.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            {data
              .filter((field) => parseInt(field.id) === 4)
              .map((field) => (
                <FormDataComponent
                  key={field.id}
                  id={field.id}
                  name={field.name}
                  placeholder={field.placeholder}
                  type={field.type}
                  value={getFieldValue(field.name as keyof FormData)}
                  onChange={handleChange}
                />
              ))}
          </div>
          <div>
            {data
              .filter((field) => parseInt(field.id) === 5)
              .map((field) => (
                <FormDataComponent
                  key={field.id}
                  id={field.id}
                  name={field.name}
                  placeholder={field.placeholder}
                  type={field.type}
                  value={getFieldValue(field.name as keyof FormData)}
                  onChange={handleChange}
                />
              ))}
          </div>
          <div>
            {data
              .filter((field) => parseInt(field.id) === 6)
              .map((field) => (
                <FormDataComponent
                  key={field.id}
                  id={field.id}
                  name={field.name}
                  placeholder={field.placeholder}
                  type={field.type}
                  value={getFieldValue(field.name as keyof FormData)}
                  onChange={handleChange}
                />
              ))}
            <div>
              {dataselect
                .filter((fieldSelect) => parseInt(fieldSelect.id) === 2)
                .map((fieldSelect) => (
                  <div key={fieldSelect.id} className="mb-4">
                    <label htmlFor={fieldSelect.id} className="block mb-2">
                      {fieldSelect.name}
                    </label>
                    <select
                      id={fieldSelect.id}
                      name={fieldSelect.name}
                      className="form-select block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-base"
                      value={getFieldValue(fieldSelect.name as keyof FormData)}
                      onChange={handleChange}
                    >
                      {fieldSelect.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              {data
                .filter(
                  (field) => parseInt(field.id) >= 7 && parseInt(field.id) <= 14
                )
                .map((field) => (
                  <FormDataComponent
                    key={field.id}
                    id={field.id}
                    name={field.name}
                    placeholder={field.placeholder}
                    type={field.type}
                    value={getFieldValue(field.name as keyof FormData)}
                    onChange={handleChange}
                  />
                ))}
              {dataselect
                .filter((fieldSelect) => parseInt(fieldSelect.id) === 3)
                .map((fieldSelect) => (
                  <div key={fieldSelect.id} className="mb-4">
                    <label htmlFor={fieldSelect.id} className="block mb-2">
                      {fieldSelect.name}
                    </label>
                    <select
                      id={fieldSelect.id}
                      name={fieldSelect.name}
                      className="form-select block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-base"
                      value={getFieldValue(fieldSelect.name as keyof FormData)}
                      onChange={handleChange}
                    >
                      {fieldSelect.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              {data
                .filter(
                  (field) =>
                    parseInt(field.id) >= 15 && parseInt(field.id) <= 16
                )
                .map((field) => (
                  <FormDataComponent
                    key={field.id}
                    id={field.id}
                    name={field.name}
                    placeholder={field.placeholder}
                    type={field.type}
                    value={getFieldValue(field.name as keyof FormData)}
                    onChange={handleChange}
                  />
                ))}
              {dataselect
                .filter(
                  (fieldSelect) =>
                    parseInt(fieldSelect.id) >= 4 &&
                    parseInt(fieldSelect.id) <= 5
                )
                .map((fieldSelect) => (
                  <div key={fieldSelect.id} className="mb-4">
                    <label htmlFor={fieldSelect.id} className="block mb-2">
                      {fieldSelect.name}
                    </label>
                    <select
                      id={fieldSelect.id}
                      name={fieldSelect.name}
                      className="form-select block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-base"
                      value={getFieldValue(fieldSelect.name as keyof FormData)}
                      onChange={handleChange}
                    >
                      {fieldSelect.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormAdmin;
