import { Link } from "react-router-dom";
import AdminNavbar from "../../../components/navbarAdmin/adminNavbar";
import AdminSidebar from "../../../components/navbarAdmin/adminSidebar";
import VillageHealthWorker from "../../../components/villageHealthWorker";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React, { useState, useEffect } from "react";
import axios from "axios";
import lifesaversHand from "../../../assets/lifesaversHand.png";
interface Data {
  id: number;
  firstname: string;
  lastname: string;
  rolename: string;
}

interface ProfileData {
  id: number;
  statusmaster: string;
  username: string;
  firstname: string;
  lastname: string;
  rolename: string;
  phone: string;
}

interface StatusMaster {
  id: number;
  firstname: string;
  lastname: string;
  rolename: string;
  statusmaster: string;
}

interface ApiResponse {
  countallMaster: number;

}

const Profile: React.FC = () => {
  const [data, setData] = useState<Data[]>([]);
  const [profileData, setProfileData] = useState<ProfileData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<any | null>(null);
  const [status, setStatus] = useState<StatusMaster[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<ProfileData[] | null>(null);
  const [master, setMaster] = useState<boolean>(false);
  const [searchQuerys, setSearchQuerys] = useState<string>("");
  const [finalResult, setFinalResult] = useState<Data[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [countallMaster, setCountallMaster] = useState<number | null>(null);
  useEffect(() => {
    if (searchQuerys === "") {
      setFinalResult(data);
    } else {
      const filteredQuery = data.filter((datas) => {
        return Object.values(datas).some((value) =>
          value.toString().toLowerCase().includes(searchQuerys.toLowerCase())
        );
      });
      setFinalResult(filteredQuery);
    }
  }, [searchQuerys, data]);

  const handleClick = (id: number) => {
    setUserId(id);
    setSelectedId(id);
  };

  const handleSummit = () => {
    setMaster(!master);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const hadnleEdit = () => {
    setIsEdit(!isEdit);
  };

  const handleConfirm = () => {
    setIsPopupOpen(false);
  };

  const handleClicks = () => {
    window.location.reload();
  };

  const allMaster = async () => {
    await axios
      .get(`http://localhost:9999/api/users/allMaster`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setData(response.data.allMaster);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
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
  const handleSubmits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editValue && editValue[0]) {
      try {
        const response = await axios.put(
          `http://localhost:9999/api/users/updateStatusMaster/${userId}`,
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
  
        setStatus(response.data);
        setIsPopupOpen(false);
        localStorage.setItem("isReady", "true");
  
        setProfileData(prevData => {
          if (prevData && prevData.length > 0) {
            const updatedData = { ...prevData[0], ...response.data };
            return [updatedData];
          } else {
 
            return [];
          }
        });
  
      } catch (err) {
        setError("Failed to load statusMaster");
      }
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
    axios
      .get<ApiResponse>(`http://localhost:9999/api/users/allMaster`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setCountallMaster(response.data.countallMaster);
      })
      .catch((error) => {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      });
  }, []);

  useEffect(() => {
    allMaster();
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    setEditValue(profileData);
  }, [profileData]);

  return (
    <div className="h-screen">
      <AdminNavbar />
      <div className="grid grid-cols-[1fr_4fr] gap-4">
        <div className="flex">
          <AdminSidebar />
        </div>
        <div className="p-6">
          <div className="bg-white flex">
            <div className="bg-neutral-100 ">
              <div className="bg-white w-64  m-4 p-4">
                <div className="grid grid-cols-2 ">
                  <div>
                    จัดการผู้ใช้งาน
                    <div className="text-start flex text-blue-500">
                      <div className="mr-2">
                      {countallMaster}
                      </div>
                      <div>คน</div>
                      </div>
                  </div>
                  <Link to="/admin/Proflile/addUser">
                    <button className="bg-blue-600 p-2 rounded-md w-full text-white">
                      +เพิ่มผู้ใช้งาน

                    </button>
                  </Link>
                </div>
                <div className="flex flex-col items-start w-full pt-2 pb-2">
                  <label htmlFor="searchInput">ค้นหาผู้ใช้งาน</label>
                  <input
                    className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full"
                    id="searchInput"
                    name="searchInput"
                    placeholder="Search"
                    value={searchQuerys}
                    onChange={(e) => setSearchQuerys(e.target.value)}
                  />
                </div>
                <div>
                  <div>
                    <style>
                      {`
          .custom-scroll {
            scrollbar-width: none; /* สำหรับ Firefox */
            -ms-overflow-style: none; /* สำหรับ Internet Explorer และ Edge */
          }

          .custom-scroll::-webkit-scrollbar {
            display: none; /* สำหรับ Chrome, Safari, และ Opera */
          }
        `}
                    </style>
                    <div className="flex justify-center items-center">
                      <div className="w-64 h-96 overflow-y-auto custom-scroll flex flex-col">
                        {finalResult.map((item, index) => (
                          <TableRow
                            key={item.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <button
                              onClick={() => handleClick(item.id)}
                              className={`mb-1 bg-gray-200 w-full text-start flex flex-col transition duration-200  ${selectedId === item.id ? 'border-2 border-blue-500' : 'border border-transparent'
                                }`}
                            >
                              <div className="p-2">
                                {item.firstname} {item.lastname}
                              </div>
                              <div className="pb-2 pl-2">{item.rolename}</div>
                            </button>
                          </TableRow>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-neutral-100 w-full">
              <div className="m-4 bg-white">
                <div className="bg-white ">
                  <div className="p-5">
                    <div className="text-center rounded-md">
                      {isEdit ? (
                        <>
                          <div className="flex flex-col w-full mx-2 justify-start">
                            <div className="">
                              <div className="flex justify-end gap-x-2">
                                <button
                                  className="bg-white text-blue-500 border border-blue-500 py-2 px-4 rounded-xl"
                                  onClick={handleClicks}
                                >
                                  ยกเลิก
                                </button>
                                <button
                                  onClick={handleSubmit}
                                  className="bg-blue-600 text-white py-2 px-4 rounded-xl"
                                >
                                  บันทึก
                                </button>
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

                                      const updatedProfile = [...prevState]; // Clone the previous state array
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
                                    value={editValue?.[0]?.firstname || ""} // Optional chaining to avoid errors
                                    onChange={(e) => {
                                      // Ensure you're updating the correct object in the array
                                      setEditValue((prevState) => {
                                        if (!prevState) return prevState; // Handle null case

                                        const updatedProfile = [...prevState]; // Clone the previous state array
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
                                <div className="pl-2 text-start">last name</div>
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

                                        const updatedProfile = [...prevState]; // Clone the previous state array
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

                                      const updatedProfile = [...prevState]; // Clone the previous state array
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
                              <div className="p-2 text-start">rolename</div>
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

                                      const updatedProfile = [...prevState]; // Clone the previous state array
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
                          <div className="grid justify-items-end ">
                            <button
                              className="bg-blue-600 p-2 rounded-md text-white"
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
                                      {status && status.length > 0 ? (
                                        <div className="flex">
                                          <TableCell className="flex-1">
                                            <div>สถานะ</div>
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex flex-col text-end">
                                              <div>
                                                {status[0].statusmaster}
                                              </div>
                                            </div>
                                          </TableCell>
                                        </div>
                                      ) : (
                                        <div></div>
                                      )}
                                      {profileData && profileData.length > 0 ? (
                                        <div className="flex">
                                          <TableCell className="flex-1">
                                            <div>สถานะ</div>
                                            <div>ชื่อผู้ใช้งาน</div>
                                            <div>ชื่อ</div>
                                            <div>นามสกุล</div>
                                            <div>บทบาท</div>
                                            <div>เบอร์โทรศัพท์</div>
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex flex-col text-end">
                                              <div
                                                className={`${profileData?.[0]
                                                  ?.statusmaster === "READY"
                                                  ? "text-green-500"
                                                  : "text-red-500"
                                                  }`}
                                              >
                                                {profileData?.[0]
                                                  ?.statusmaster === "READY"
                                                  ? "พร้อมใช้งาน"
                                                  : "ไม่พร้อมใช้งาน"}
                                              </div>
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
                                              <div>{profileData[0].phone}</div>
                                            </div>
                                          </TableCell>
                                        </div>
                                      ) : (
                                        <div>
                                          <p>ยังไม่มีข้อมูล</p>
                                          <p>{userId}</p>
                                        </div>
                                      )}

                                      <div className="">
                                        <div className="bg-white rounded-lg shadow-lg p-6 relative">
                                          <div className="flex flex-col items-end justify-end">
                                            <button
                                              onClick={openPopup}
                                              className="bg-white text-blue-500 border border-blue-500 py-2 px-4 rounded-xl"
                                            >
                                              อัพเดทสถานะการใช้งาน
                                            </button>
                                            {isPopupOpen && (
                                              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                                                <div className="bg-white rounded-lg shadow-lg p-6  relative">
                                                  <div className="flex items-center justify-center h-full">
                                                    <img
                                                      src={lifesaversHand}
                                                      alt="lifesaversHand"
                                                      className="max-w-full max-h-full"
                                                    />
                                                  </div>
                                                  <h2 className="text-xl font-bold p-4">
                                                    ต้องการอัพเดตสถานะของผู้ใช้หรือไม่
                                                  </h2>
                                                  <div className="flex justify-between">
                                                    <button
                                                      onClick={closePopup}
                                                      className="p-2 bg-gray-200 rounded-lg"
                                                    >
                                                      ยกเลิก
                                                    </button>
                                                    <button
                                                      onClick={handleSubmits}
                                                      className="p-2 bg-blue-500 text-white rounded-lg"
                                                    >
                                                      ยืนยัน
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
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

export default Profile;
