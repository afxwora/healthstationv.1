import React, { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import AdminNavbar from "../../../components/navbarAdmin/adminNavbar";
import AdminSidebar from "../../../components/navbarAdmin/adminSidebar";
import { Link } from "react-router-dom";
import icon from "../../../assets/icon.png";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useParams } from "react-router-dom";

// ประกาศ Interface ของข้อมูล Profile
interface ProfileData {
  id: number;
  ssd: string;
  firstname: string;
  lastname: string;
  sex: string;
  age: number;
  birthday_date: string; // วันที่เกิดเป็น string
  num_of_house: string;
  group_of_house: string;
  alley_of_house: string;
  tambon: string;
  amphoe: string;
  province: string;
  postcode: number;
  phone: number;
  line_id: string;
  email: string;
  education_level: string;
  career: string;
  caregiver: string;
  operating_area: string;
}

// ฟังก์ชันแปลงวันเกิดให้เป็น dd/MM/yyyy
const formatDate = (dateString: string): string => {
  const date = new Date(dateString); // แปลง string เป็น Date object
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = (date.getFullYear() + 543).toString(); // แปลงปี ค.ศ. เป็น พ.ศ.
  return `${day}/${month}/${year}`; // คืนค่าตามรูปแบบที่ต้องการ
};

const CitizenInformation: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData[] | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState<string | null>(null);
  const { czid } = useParams<{ czid: string }>();

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9999/api/users/getCaregivenFromuser/${czid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfileData(response.data);
    } catch (err) {
      setError("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [czid]);

  return (
    <div className="h-screen">
      <AdminNavbar />
      <div className="flex">
        <div className="grid-rows-1">
          <AdminSidebar />
        </div>
        <div className="bg-neutral-100 w-full">
          <div className="flex-initial md:bg-white"></div>
          <div className="flex-1 md:bg-neutral-100">
            <div className="md:bg-white md:m-4 p-2 bg-white rounded-lg">
              <div className="text-center rounded-md">
                <div>
                  <div className="flex p-4 ">
                    <Link to="/admin">
                      <button className="mr-2 ">
                        <img
                          src={icon}
                          alt="icon"
                          className="object-cover h-3 mt-3 mr-1 md:place-items-start"
                        />
                      </button>
                    </Link>
                    <div className="text-2xl">ข้อมูลผู้ดูแล</div>
                  </div>
                  <div className="m-2 mt-4">
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell className="text-center">
                              รายละเอียด
                            </TableCell>
                            <TableCell>
                              <div className="text-end"></div>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {profileData && profileData.length > 0 ? (
                            <div className="grid grid-cols-2 gap-x-4">
                              <TableCell className="">
                                <div className="grid grid-cols-2">
                                  <div>เลขบัตรประชาชน</div>
                                  <div>{profileData[0].ssd}</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div>ชื่อ</div>
                                  <div>{profileData[0].firstname}</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div>นามสกุล</div>
                                  <div>{profileData[0].lastname}</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div>เพศ</div>
                                  <div>{profileData[0].sex}</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div>อายุ</div>
                                  <div>{profileData[0].age}</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div>วันเดือนปีเกิด</div>
                                  <div>
                                    {formatDate(profileData[0].birthday_date)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 text-start">
                                      <div>ที่อยู่</div>
                                      <div>
                                        <div>
                                          {profileData[0].num_of_house}
                                          {profileData[0].group_of_house}
                                        </div>
                                        <div>
                                          <div className="flex">
                                            ตำบล
                                            {profileData[0].tambon}
                                            <div className="ml-1">
                                              อำเภอ
                                              {profileData[0].amphoe}
                                            </div>
                                            <div className="ml-1">
                                              จังหวัด
                                              {profileData[0].province}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                              </TableCell>
                              <TableCell className="">
                                <div className="grid grid-cols-2">
                                  <div>เบอร์โทรศัพท์</div>
                                  <div>{profileData[0].phone}</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div>Line ID</div>
                                  <div>{profileData[0].line_id}</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div>E-mail</div>
                                  <div>{profileData[0].email}</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div>ระดับการศึกษา</div>
                                  <div>{profileData[0].education_level}</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div>อาชีพ</div>
                                  <div>{profileData[0].career}</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div>การอบรม Cg</div>
                                  <div>{profileData[0].caregiver}</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div>พื้นที่ปฏิบัติงาน</div>
                                  <div>{profileData[0].operating_area}</div>
                                </div>
                              </TableCell>
                            </div>
                          ) : (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center">
                                ไม่มีผู้ดูแล
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenInformation;
