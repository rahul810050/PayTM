import React, { useRef, useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import axios from "axios";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface ISignUp {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  password: string;
}

function Signup() {
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  const usernameRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function hitDataBase(userData: ISignUp) {
    try {
      const response = await axios.post(`${BASE_URL}/signup`, {
        ...userData,
        mobile: Number(userData.mobile),
      });

      if (response.status === 200) {
        navigate("/signin");
      } else {
        setAlert(response.data.msg || "Something went wrong!");
      }
    } catch (error) {
      setAlert((error as Error).message || "Network error. Try again!");
    }
  }

  const handleSignup = () => {
    const userData: ISignUp = {
      username: usernameRef.current?.value || "",
      firstname: firstNameRef.current?.value || "",
      lastname: lastNameRef.current?.value || "",
      email: emailRef.current?.value || "",
      mobile: mobileRef.current?.value || "",
      password: passwordRef.current?.value || "",
    };

    hitDataBase(userData);

    // Reset input fields
    [usernameRef, firstNameRef, lastNameRef, emailRef, mobileRef, passwordRef].forEach((ref) => {
      if (ref.current) ref.current.value = "";
    });
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Sign Up</h1>
          <p className="text-gray-600">Create an account to get started</p>
        </div>

        {/* Alert Message */}
        {alert && (
          <div className="mt-3 text-red-600 text-center bg-red-100 p-2 rounded-md">
            ** {alert}
          </div>
        )}

        {/* Input Fields */}
        <div className="mt-5 space-y-4">
          <Input ref={usernameRef} label="Username" placeholder="@cocane" type="text" classname="border border-gray-300 focus:ring-2 focus:ring-blue-400" />
          <Input ref={firstNameRef} label="First Name" placeholder="Cocane" type="text" classname="border border-gray-300 focus:ring-2 focus:ring-blue-400" />
          <Input ref={lastNameRef} label="Last Name" placeholder="Lee" type="text" classname="border border-gray-300 focus:ring-2 focus:ring-blue-400" />
          <Input ref={emailRef} label="Email" placeholder="cocane@gmail.com" type="email" classname="border border-gray-300 focus:ring-2 focus:ring-blue-400" />
          <Input ref={mobileRef} label="Mobile No." placeholder="1234567890" type="tel" classname="border border-gray-300 focus:ring-2 focus:ring-blue-400" />
          <Input ref={passwordRef} label="Password" placeholder="********" type="password" classname="border border-gray-300 focus:ring-2 focus:ring-blue-400" />
        </div>

        {/* Sign-up Button */}
        <div className="mt-5">
          <Button text="Sign Up" onClick={handleSignup} classname="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200" />
        </div>

        {/* Sign-in Link */}
        <div className="mt-3 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600 hover:underline">
              Sign in here.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
