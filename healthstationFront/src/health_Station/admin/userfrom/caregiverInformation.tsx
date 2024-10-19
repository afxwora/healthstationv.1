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
  time_stamp: string; // ใช้เป็น string สำหรับการแปลงวันที่
  weight: number;
  height: number;
  blood_pressure: number;
  waistline: number;
}

const Caregivers: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData[] | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState<string | null>(null);
  const { cvid } = useParams<{ cvid: string }>();

  // ฟังก์ชันแปลงวันที่
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = (date.getUTCFullYear() + 543).toString(); // แปลงปี ค.ศ. เป็น พ.ศ.
    return `${day}/${month}/${year}`;
  };

  // ดึงข้อมูลจาก API
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9999/api/users/historyDataRecordsFromID/${cvid}`,
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
  }, [cvid]);

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
                <div className="flex p-4">
                  <Link to="/admin">
                    <button className="mr-2">
                      <img
                        src={icon}
                        alt="icon"
                        className="object-cover h-3 mt-3 mr-1 md:place-items-start"
                      />
                    </button>
                  </Link>
                  <div className="text-2xl">ตารางประวัติข้อมูลสุขภาพ</div>
                </div>
                <div className="m-2 mt-4">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell className="text-center"><div className="text-center">วันที่</div></TableCell>
                          <TableCell className="text-center"><div className="text-center">น้ำหนัก (กก.)</div></TableCell>
                          <TableCell className="text-center"><div className="text-center">ส่วนสูง (ซม.)</div></TableCell>
                          <TableCell className="text-center"><div className="text-center">ความดันโลหิต (มม.ปรอท)</div></TableCell>
                          <TableCell className="text-center"><div className="text-center">รอบเอว (นิ้ว)</div></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {profileData && profileData.length > 0 ? (
                          profileData.map((data) => (
                            <TableRow key={data.id}>
                              <TableCell className="text-center">
                              <div className="text-center">{formatDate(data.time_stamp)}</div>
                              </TableCell>
                              <TableCell ><div className="text-center">{data.weight}</div></TableCell>
                              <TableCell ><div className="text-center">{data.height}</div></TableCell>
                              <TableCell ><div className="text-center">{data.blood_pressure}</div></TableCell>
                              <TableCell ><div className="text-center">{data.waistline}</div></TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">
                              ไม่มีข้อมูลของตารางประวัติข้อมูลสุขภาพ
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
  );
};

export default Caregivers;
