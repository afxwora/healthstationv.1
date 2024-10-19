import React, { useState } from "react";
import FormData2 from "../../../components/from/fromData2";
import SelectData from "../../../components/from/selectData";
import FormDataComponent from "../../../components/from/fromData";
import { Link } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";

interface FormData {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  rolename: string;
  phone: string;
}

interface Errors {
  username?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  rolename?: string;
  phone?: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required("กรุณากรอกชื่อผู้ใช้งาน*"),
  password: Yup.string()
    .required("กรุณากรอกรหัสผ่าน")
    .min(5, "รหัสผ่านต้องมีความยาวอย่างน้อย 5 ตัวอักษร")
    .matches(/[a-z]/, "รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อยหนึ่งตัว (a-z)")
    .matches(/[A-Z]/, "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อยหนึ่งตัว (A-Z)")
    .matches(/[0-9]/, "รหัสผ่านต้องมีตัวเลขอย่างน้อยหนึ่งตัว (0-9)"),
  firstname: Yup.string().required("กรุณากรอกชื่อ"),
  lastname: Yup.string().required("กรุณากรอกนามสกุล"),
  rolename: Yup.string().required("กรุณากรอกบทบาท"),
  phone: Yup.string()
    .required("กรุณากรอกเบอร์โทรศัพท์")
    .min(10, "เบอร์โทรต้องมี 10 ตัว"),
});

const datas = [
  {  name: "phone", placeholder: "เบอร์โทรศัพท์", type: "text" },
];

const formFields = [
  {
    
    name: "username",
    placeholder: "ผู้ใช้งานระบบ",
    type: "text",
  },
  {
    name: "password",
    placeholder: "รหัสผ่าน",
    type: "password",
  },
  {  name: "firstname", placeholder: "ชื่อ", type: "text" },
  {  name: "lastname", placeholder: "นามสกุล", type: "text" },
];

const AddUser: React.FC = () => {
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    rolename: "",
    phone: "",
  });

  const handleChange = (name: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChanges = (
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
      const response = await axios.post('http://localhost:9999/api/users/createMaster', formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200){
        console.log("Form Submitted", formData);
      setErrors({});
      window.location.href = "/admin/Proflile";
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

  return (
    <div className="h-screen p-4">
      <div className="text-xl font-semibold mb-4">+เพิ่มผู้ใช้งาน</div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFields.map((field) => (
            <div key={field.name} className="relative">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
              </label>
              <FormData2
                name={field.name}
                placeholder={field.placeholder}
                type={field.type}
                value={formData[field.name as keyof FormData]}
                onChange={(e) =>
                  handleChange(field.name as keyof FormData, e.target.value)
                }
              />
              {errors[field.name as keyof Errors] && (
                <div className="text-red-500 text-sm mt-1">
                  {errors[field.name as keyof Errors]}
                </div>
              )}
            </div>
          ))}
        </div>
        <div>
          <label htmlFor="idrolename" className="relative">
            บทบาท
            <span className="text-red-500 absolute">*</span>
          </label>
          <select
            name="rolename"
            id="idrolename" 
            onChange={handleChanges}
            value={formData.rolename}
            className="border-2 border-b-4 flex-1 text-left pb-3 pt-2 bg-gray-100 w-full"
          >
            <option value="">ตำแหน่งงาน</option>
            <option value="เจ้าหน้าที่">เจ้าหน้าที่</option>
            <option value="อสม.">อสม.</option>
          </select>
          {errors.rolename && (
            <div className="text-red-500 text-sm mt-1">{errors.rolename}</div>
          )}
        </div>
        <div className="mt-4">
          {datas.map((field) => (
            <div key={field.name} className="relative">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
              </label>
              <span className="text-red-500 absolute ml-24">*</span>
              <FormDataComponent
                name={field.name}
                placeholder={field.placeholder}
                type={field.type}
                value={formData[field.name as keyof FormData]}
                onChange={(e) =>
                  handleChange(field.name as keyof FormData, e.target.value)
                }
              />
              
              {errors[field.name as keyof Errors] && (
                <div className="text-red-500 text-sm mt-1">
                  {errors[field.name as keyof Errors]}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Link to="/admin/Profile">
            <button
              type="button"
              className="bg-white text-blue-500 px-4 py-2 rounded-md border-2 border-blue-500"
            >
              ยกเลิก
            </button>
          </Link>
          <button
           onClick={handleSubmit}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            สร้าง
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
