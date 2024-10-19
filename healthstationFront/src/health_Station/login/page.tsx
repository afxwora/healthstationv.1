import React, { useState, ChangeEvent } from "react";
import imageToAddUser from "../../assets/user.png";
import imageToAddLock from "../../assets/lock.png";
import imageToAddEye from "../../assets/eye.png";
import imageToAddEye_closed from "../../assets/eyeclosed.png";
import group from "../../assets/group.png";
import axios from "axios";

interface UserInput {
  username: string;
  password: string;
}

const initialState: UserInput = {
  username: "",
  password: "",
};

const Login: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>(initialState);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const setUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput({ ...userInput, username: e.target.value });
  };

  const setPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput({ ...userInput, password: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9999/api/auth/login",
        { ...userInput }
      );
      console.log(response);
      window.localStorage.setItem("token", response.data.token);
      window.localStorage.setItem("username", userInput.username);
      window.localStorage.setItem("userId",response.data.id)
      if(response.data.role === "ADMIN"){
        window.location.href = "/admin";
      }else {
        window.location.href = "/health_Station";
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "การเข้าสู่ระบบล้มเหลว โปรดลองอีกครั้ง");
      } else {
        setErrorMessage("เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองอีกครั้ง");
      }
    }
  };

  return (
    <div className="h-screen">
      <div className="md:flex md:flex-row p-2">
        <div className="md:flex-1 md:flex md:justify-center md:items-center">
          <div className="place-content-center p-4">
            <div className="text-4xl  mt-14 mb-5 md:mt-5">เข้าสู่ระบบ</div>
            <div className="mt-16">
              <label htmlFor="username">
                ชื่อผู้ใช้งาน
                <div className="flex flex-row items-center border-b-2">
                  <img
                    src={imageToAddUser}
                    alt="User"
                    className="w-6 h-6 object-cover rounded-full "
                  />
                  <input
                    id="username"
                    className="focus:outline-none m-2"
                    placeholder="กรอกชื่อผู้ใช้งานของคุณ"
                    onChange={setUsername}
                    value={userInput.username}
                  />
                </div>
              </label>
            </div>
            <div className="mt-10">
              <label htmlFor="password">
                รหัสผ่าน
                <div className="grid grid-cols-2 border-b-2">
                  <div className="flex">
                  <img
                    src={imageToAddLock}
                    alt="Lock"
                    className="w-6 h-6 object-cover rounded-full mt-2"
                  />
                  <input
                    id="password"
                    className="focus:outline-none m-2"
                    placeholder="กรอกรหัสผ่านของคุณ"
                    type={showPassword ? "text" : "password"}
                    onChange={setPassword}
                    value={userInput.password}
                  />
                  </div>
                  <button
                    className="grid justify-items-end"
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <img
                        src={imageToAddEye}
                        alt="Eye Open"
                        className="w-6 h-6 object-cover rounded-full mt-2"
                      />
                    ) : (
                      <img
                        src={imageToAddEye_closed}
                        alt="Eye Closed"
                        className="w-6 h-6 object-cover rounded-full mt-2"
                      />
                    )}
                  </button>
                </div>
              </label>
            </div>
            {/* <div className="mt-2">
              <label className="flex items-center">
                <span className="ml-2 mt-5 mb-5 text-sm text-gray-600">
                  Remember me
                </span>
              </label>
            </div> */}

              <button onClick={handleLogin} className="text-white text-xl md:w-full text-center bg-blue-500 rounded-full py-3 mt-28 grid justify-items-center">
                Login
              </button>

            {errorMessage && (
              <div className="text-red-500 text-center mt-4">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
        <div className="hidden md:flex-1 rounded-lg justify-center items-center md:block ">
          <div className="text-white">
            <img
              src={group}
              alt="group"
              className="object-cover md:place-items-start bg-auto hover:bg-contain w-[900px] h-[730px] rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;