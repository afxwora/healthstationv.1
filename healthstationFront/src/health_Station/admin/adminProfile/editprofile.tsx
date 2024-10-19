import React, { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import AdminNavbar from "../../../components/navbarAdmin/adminNavbar";
import AdminSidebar from "../../../components/navbarAdmin/adminSidebar";
import { Link } from "react-router-dom";
import FormDataComponent from "../../../components/from/fromData"; 
import icon from "../../../assets/icon.png";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


interface FormData {
    ssd: number;
    firstname: string;
    lastname: string;
    sex: string;
    age: number;

  }

const data = [
    {
      id: "1",
      name: "เลขประจำตัวประชาชน",
      placeholder: "เลขประจำตัวประชาชน",
      type: "text",
    },
    { id: "2", name: "ชื่อ", placeholder: "ชื่อ", type: "text" },
    { id: "3", name: "นามสกุล", placeholder: "นามสกุล", type: "text" },
    { id: "4", name: "อายุ", placeholder: "อายุ", type: "number" },
    {
      id: "5",
      name: "วัน/เดือน/ปีเกิด",
      placeholder: "วัน/เดือน/ปีเกิด",
      type: "date",
    }
]
// Other imports
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const EditProfile: React.FC = () => {
  const [state, setState] = useState();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState<FormData>({
    ssd: 0,
    firstname: "",
    lastname: "",
    sex: "",
    age: 0,

  });

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

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
                <div className="grid justify-items-end">
                  <div className="">
                    <Link to="">
                    <button className="bg-blue-500 p-1 m-2 rounded-lg text-white ">แก้ไข</button>
                    </Link>
                  </div>
                </div>
                <div className="m-2">
                {data
            .filter((field) => parseInt(field.id) <= 1)
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
                  <div className="grid grid-cols-2 justify-items-end">
                  {data
                .filter(
                  (field) => parseInt(field.id) >= 2 && parseInt(field.id) <= 3
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
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
