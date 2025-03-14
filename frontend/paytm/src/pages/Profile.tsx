import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import Nav from "../components/Nav";

interface IUser {
    username?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    mobile?: string;
    password?: string;
}

function Profile() {
    const token = localStorage.getItem("token");
    const [userData, setUserData] = useState<IUser | null>(null);
		const [userBalance, setUserBalance] = useState("")

    useEffect(() => {
        if (!token) return;
        const fetchData = async () => {
            try {
                const user = await axios.get(BASE_URL + "/users/metadata", {
                    headers: { authorization: token },
                });
                setUserData(user.data.user);
								const balance = await axios.get(BASE_URL+"/account/balance", {
									headers: {
										authorization: token
									}
								})
								setUserBalance(balance.data.balance);
            } catch (e) {
                console.error("Error while fetching the data", e);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="w-full h-screen ">
            <Nav username={userData?.firstname}/>
            <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
            
            {/* Profile Title */}
            <h1 className="font-bold text-3xl mb-6 text-gray-800">Profile</h1>

            {/* Profile Card */}
            <div className="bg-white shadow-lg rounded-lg p-12 flex flex-col md:flex-row w-full max-w-3xl">
                {/* Left Section - User Info */}
                <div className="w-full md:w-2/3 pr-6 border-b md:border-b-0 md:border-r border-gray-300 pb-4 md:pb-0">
                    <h2 className="text-2xl font-bold text-green-700">{userData?.username || "Unknown"}</h2>
                    
                    <div className="space-y-2 text-gray-700 mt-2">
                        <p><strong>💸 Balance:</strong> {userBalance || "N/A"} </p>
                        <p><strong>👤 FirstName:</strong> {userData?.firstname || "N/A"} </p>
                        <p><strong>👤 LastName:</strong>  {userData?.lastname || ""}</p>
                        <p><strong>📧 Email:</strong> {userData?.email || "N/A"}</p>
                        <p><strong>📞 Mobile:</strong> {userData?.mobile || "N/A"}</p>
                        <p><strong>🔒 Password:</strong> ********</p>
                    </div>
                </div>

                {/* Right Section - Avatar */}
                <div className="w-full md:w-1/3 flex flex-col items-center justify-center mt-4 md:mt-0">
                    <div className="w-24 h-24  rounded-full flex items-center justify-center text-4xl font-bold text-white bg-blue-500">
                        {userData?.firstname ? userData.firstname[0].toUpperCase() : "?"}
                    </div>
                    <a href="#" className="mt-2 text-blue-600 hover:underline">Change photo</a>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Profile;
