import React, { useRef, useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import axios from "axios";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface ISignIn {
  mobile: string;
  email: string;
  password: string;
}

function Signin() {
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function hitDataBase(userData: ISignIn) {
    try {
      const response = await axios.post(`${BASE_URL}/signin`, {
        mobile: Number(userData.mobile),
        email: userData.email,
        password: userData.password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setAlert(response.data.msg || "Something went wrong!");
      }
    } catch (error) {
      setAlert((error as Error).message || "Network error. Try again!");
    }
  }

  const handleSignin = () => {
    const userData: ISignIn = {
      mobile: mobileRef.current?.value || "",
      email: emailRef.current?.value || "",
      password: passwordRef.current?.value || "",
    };

    hitDataBase(userData);

    // Reset input fields
    [emailRef, mobileRef, passwordRef].forEach((ref) => {
      if (ref.current) ref.current.value = "";
    });
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Sign in</h1>
          <p className="text-gray-600">Enter your credentials to access your account</p>
        </div>

        {/* Alert Message */}
        {alert && (
          <div className="mt-3 text-red-600 text-center bg-red-100 p-2 rounded-md">
            ** {alert}
          </div>
        )}

        {/* Input Fields */}
        <div className="mt-5 space-y-4">
          <Input ref={emailRef} label="Email" placeholder="cocane@gmail.com" type="email" classname="border border-gray-300 focus:ring-2 focus:ring-blue-400" />
          <Input ref={mobileRef} label="Mobile No." placeholder="1234567890" type="tel" classname="border border-gray-300 focus:ring-2 focus:ring-blue-400" />
          <Input ref={passwordRef} label="Password" placeholder="********" type="password" classname="border border-gray-300 focus:ring-2 focus:ring-blue-400" />
        </div>

        {/* Sign-in Button */}
        <div className="mt-5">
          <Button text="Sign In" onClick={handleSignin} classname="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200" />
        </div>

        {/* Sign-up Link */}
        <div className="mt-3 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up here.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
