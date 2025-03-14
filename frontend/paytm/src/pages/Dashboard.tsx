import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Button from "../components/button";
import axios from "axios";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [userBalance, setUserBalance] = useState("0");
  const [allUsers, setAllUsers] = useState([]);
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const balanceRes = await axios.get(BASE_URL + "/account/balance", {
          headers: { authorization: token },
        });
        setUserBalance(balanceRes.data.balance?.toString() || "0");

        const usersRes = await axios.get(BASE_URL + "/users/bulk", {
          headers: { authorization: token },
        });
        setAllUsers(usersRes.data.user || []);

        const userRes = await axios.get(BASE_URL + "/users/metadata", {
          headers: { authorization: token },
        });
        setUsername(userRes.data.user.username);
      } catch (err) {
        console.error("Error while fetching the data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Navbar */}
      <Nav username={username} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Balance Section */}
        <div className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700">
            Your Balance: <span className="text-green-600 font-semibold">₹{userBalance}</span>
          </h1>
        </div>

        {/* Users Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800">Users</h2>

          {/* Search Bar */}
          <input
            type="text"
            className="w-full mt-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search users..."
          />
        </div>

        {/* User List */}
        <div className="mt-6 space-y-4">
          {allUsers.length > 0 ? (
            allUsers.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                    {user.firstname ? user.firstname[0].toUpperCase() : "U"}
                  </div>
                  <p className="text-lg text-gray-700 font-semibold">
                    {user.firstname} {user.lastname}
                  </p>
                </div>

                {/* Send Money Button */}
                <Button onClick={()=> {
                  navigate(`/send`, {state: {userId: user._id}});

                }} text="Send Money" classname="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200" />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-4">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
