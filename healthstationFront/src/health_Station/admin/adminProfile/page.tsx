import React, { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import AdminNavbar from "../../../components/navbarAdmin/adminNavbar";
import AdminSidebar from "../../../components/navbarAdmin/adminSidebar";
import { Link } from "react-router-dom";
import icon from "../../../assets/icon.png";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

interface ProfileData {
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
  rolename: string;
}

const AdminProfile: React.FC = () => {
  const [state, setState] = useState();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [totalCount, setTotalCount] = useState<number>(0);
  const [profileData, setProfileData] = useState<ProfileData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<any | null>(
    localStorage.getItem("userId")
  );
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<ProfileData[] | null>(null);
  const requestStatus = "active";
  const status = "active"; 

  const handleClick = (id: any) => {
    setUserId(id);
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9999/api/users/getProfile/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfileData(response.data.Master);
    } catch (err) {
      setError("Failed to load profile");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editValue && editValue[0]) {
      try {
        const response = await axios.put(
          `http://localhost:9999/api/users/editProfile/${userId}`,
          {
            ...editValue[0],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          console.log("Form Submitted", editValue);
          window.location.href = "http://localhost:3000/admin/Proflile";
        }
      } catch (err) {
        setError("Failed to save statusMaster");
      }
    } else {
      setError("editvalue not updated");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const hadnleEdit = () => {
    setIsEdit(!isEdit);
  };

  useEffect(() => {
    setEditValue(profileData);
  }, [profileData]);

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
            <div className=" md:bg-white md:m-4 bg-white rounded-lg">
              <div className="text-center rounded-md">
                <div className="grid justify-items-end">
                  {/* <div className="">
                    <Link to="/admin/Profile/editprofile">
                      <button className="bg-blue-500 p-1 m-2 rounded-lg text-white ">
                        แก้ไข
                      </button>
                    </Link>
                  </div> */}
                </div>
                <div className="m-2">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <div className="text-center rounded-md">
                            {isEdit ? (
                              <>
                                <div className="flex flex-col w-full p-2 mx-2 justify-start">
                                  <div className="p-4">
                                    <div className="flex justify-end gap-x-2">
                                      <Link to={"/admin"}>
                                        <button className="bg-white text-blue-500 border border-blue-500 py-2 px-4 rounded-xl">
                                          ยกเลิก
                                        </button>
                                      </Link>
                                      <button
                                        onClick={handleSubmit}
                                        className="bg-blue-500 text-white py-2 px-4 rounded-xl"
                                      >
                                        บันทึก
                                      </button>
                                    </div>

                                  </div>
                                  <div className="p-2 text-start">
                                      ชื่อผู้ใช้งาน
                                    </div>
                                    <div className="p-2">
                                      <input
                                        type="text"
                                        name="username"
                                        id=""
                                        className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                                        value={editValue?.[0]?.username || ""} // Optional chaining to avoid errors
                                        onChange={(e) => {
                                          // Ensure you're updating the correct object in the array
                                          setEditValue((prevState) => {
                                            if (!prevState) return prevState; // Handle null case

                                            const updatedProfile = [
                                              ...prevState,
                                            ]; // Clone the previous state array
                                            updatedProfile[0] = {
                                              // Assume you're updating the first profile object
                                              ...updatedProfile[0],
                                              username: e.target.value, // Update the username field
                                            };

                                            return updatedProfile; // Return the updated array
                                          });
                                        }}
                                      />
                                    </div>
                                  <div className="grid grid-cols-2">
                                    <div className="">
                                      <div className="pl-2 text-start">
                                        first name
                                      </div>
                                      <div className="p-2">
                                        <input
                                          type="text"
                                          name="firstname"
                                          id=""
                                          className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                                          value={
                                            editValue?.[0]?.firstname || ""
                                          } // Optional chaining to avoid errors
                                          onChange={(e) => {
                                            // Ensure you're updating the correct object in the array
                                            setEditValue((prevState) => {
                                              if (!prevState) return prevState; // Handle null case

                                              const updatedProfile = [
                                                ...prevState,
                                              ]; // Clone the previous state array
                                              updatedProfile[0] = {
                                                // Assume you're updating the first profile object
                                                ...updatedProfile[0],
                                                firstname: e.target.value, // Update the username field
                                              };

                                              return updatedProfile; // Return the updated array
                                            });
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex flex-col">
                                      <div className="pl-2 text-start">
                                        last name
                                      </div>
                                      <div className="p-2">
                                        <input
                                          type="text"
                                          name="lastname"
                                          id=""
                                          className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                                          value={editValue?.[0]?.lastname || ""} // Optional chaining to avoid errors
                                          onChange={(e) => {
                                            // Ensure you're updating the correct object in the array
                                            setEditValue((prevState) => {
                                              if (!prevState) return prevState; // Handle null case

                                              const updatedProfile = [
                                                ...prevState,
                                              ]; // Clone the previous state array
                                              updatedProfile[0] = {
                                                // Assume you're updating the first profile object
                                                ...updatedProfile[0],
                                                lastname: e.target.value, // Update the username field
                                              };

                                              return updatedProfile; // Return the updated array
                                            });
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="p-2 text-start">phone</div>
                                    <div className="p-2">
                                      <input
                                        type="text"
                                        name="username"
                                        id=""
                                        className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                                        value={editValue?.[0]?.phone || ""} // Optional chaining to avoid errors
                                        onChange={(e) => {
                                          // Ensure you're updating the correct object in the array
                                          setEditValue((prevState) => {
                                            if (!prevState) return prevState; // Handle null case

                                            const updatedProfile = [
                                              ...prevState,
                                            ]; // Clone the previous state array
                                            updatedProfile[0] = {
                                              // Assume you're updating the first profile object
                                              ...updatedProfile[0],
                                              phone: e.target.value, // Update the username field
                                            };

                                            return updatedProfile; // Return the updated array
                                          });
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="p-2 text-start">
                                      rolename
                                    </div>
                                    <div className="p-2">
                                      <input
                                        type="text"
                                        name="rolename"
                                        id=""
                                        className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                                        value={editValue?.[0]?.rolename || ""} // Optional chaining to avoid errors
                                        onChange={(e) => {
                                          // Ensure you're updating the correct object in the array
                                          setEditValue((prevState) => {
                                            if (!prevState) return prevState; // Handle null case

                                            const updatedProfile = [
                                              ...prevState,
                                            ]; // Clone the previous state array
                                            updatedProfile[0] = {
                                              // Assume you're updating the first profile object
                                              ...updatedProfile[0],
                                              rolename: e.target.value, // Update the username field
                                            };

                                            return updatedProfile; // Return the updated array
                                          });
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="">
                                <div className="grid justify-items-end p-2">
                                  <button
                                    className="bg-blue-500 p-2 rounded-md text-white"
                                    onClick={() => hadnleEdit()}
                                  >
                                    แก้ไข
                                  </button>
                                </div>
                                <div className="m-2 mt-4">
                                  <TableContainer component={Paper}>
                                    <Table
                                      sx={{ minWidth: 650 }}
                                      aria-label="simple table"
                                    >
                                      <TableHead>
                                        <TableRow>
                                          <div>
                                            {profileData &&
                                            profileData.length > 0 ? (
                                              <div className="flex">
                                                <TableCell className="flex-1">
                                                
                                                  <div>ชื่อผู้ใช้งาน</div>
                                                  <div>ชื่อ</div>
                                                  <div>นามสกุล</div>
                                                  <div>บทบาท</div>
                                                  <div>เบอร์โทรศัพท์</div>
                                                </TableCell>
                                                <TableCell>
                                                  <div className="flex flex-col text-end">
                                  
                                                    <div>
                                                      {profileData[0].username}
                                                    </div>
                                                    <div>
                                                      {profileData[0].firstname}
                                                    </div>
                                                    <div>
                                                      {profileData[0].lastname}
                                                    </div>
                                                    <div>
                                                      {profileData[0].rolename}
                                                    </div>
                                                    <div>
                                                      {profileData[0].phone}
                                                    </div>
                                                  </div>
                                                </TableCell>
                                              </div>
                                            ) : (
                                              <div>
                                                <p>ยังไม่มีข้อมูล</p>
                                                <p>{userId}</p>
                                              </div>
                                            )}
                                          </div>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody></TableBody>
                                    </Table>
                                  </TableContainer>
                                </div>
                              </div>
                            )}
                          </div>
                        </TableRow>
                      </TableHead>
                      <TableBody></TableBody>
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

export default AdminProfile;
