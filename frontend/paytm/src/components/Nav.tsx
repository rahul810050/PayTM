import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

interface INavBar {
  username?: string;
}

function Nav(props: INavBar) {
  const navigate = useNavigate();
  const firstLetter = props.username ? props.username[0].toUpperCase() : "?";
  const token = localStorage.getItem("token"); // Check if user is logged in
	const [auth, setAuth] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token"); // Remove token
    navigate("/"); // Redirect to home page
  }

	useEffect(()=> {
		if(!token) return
		const fetchData = async ()=> {
			const res = await axios.get(BASE_URL+"/users/metadata", {
				headers: {
					authorization: token
				}
			})
			if(res.status === 200){
				setAuth(true);
			}
		}
		fetchData()
	}, [token])

  return (
    <div className="flex justify-between bg-slate-300 py-5 px-8 shadow-xl">
      <div>
        <h1 className="text-2xl font-bold font-serif">PaymentApp</h1>
      </div>

      <div className="flex items-center gap-4">
        {auth ? ( // If logged in, show username and logout button
          <>
            <p className="text-xl">
              Hello, <span>{props.username}</span>
            </p>
            <div
              className="rounded-4xl bg-blue-600 text-white w-[33px] h-[32px] cursor-pointer text-center flex justify-center items-center"
              onClick={() => navigate("/profile")}
            >
              {firstLetter}
            </div>
            <button
              onClick={()=> {
								handleLogout()
								setAuth(false)
								navigate("/signin")
							}}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          // If not logged in, show Sign In button
          <button
            onClick={() => navigate("/signin")}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

export default Nav;
