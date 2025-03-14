import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../config";

export const SendMoney = () => {
  const location = useLocation();
  const userId = location.state?.userId;
	console.log(userId)
  const amountRef = useRef("");
  const token = localStorage.getItem("token");
  const [recieverData, setRecieverData] = useState({});
  const firstLetter = recieverData.firstname ? recieverData.firstname[0].toUpperCase() : "U";

  useEffect(() => {
    if (!token || !userId) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/userdata`, {
					params:{userId: userId}
				});

        setRecieverData(response.data.user);
      } catch (error) {
        console.error("Error fetching receiver data:", error);
      }
    };

    fetchData();
  }, [userId, token]); 

  async function transferMoney() {
    try {
      const transferRes = await axios.post(
        `${BASE_URL}/account/transfer`,{ 
					to: userId,
					amount: Number(amountRef.current?.value) 
				},
        { 
					headers: {
						authorization: token 
					} 
				} 
      );

      if (transferRes.status === 200) {
        alert(`Rs. ${amountRef.current?.value} successfully transferred to ${recieverData.firstname} ${recieverData.lastname}`);
        amountRef.current.value = "";
      }
    } catch (error) {
      console.error("Error transferring money:", error);
      alert("Transaction failed. Please try again.");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-6">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Send Money</h2>

        {/* User Info */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
            {firstLetter}
          </div>
          <h3 className="text-xl font-semibold text-gray-700">
            {recieverData.firstname} {recieverData.lastname}
          </h3>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label htmlFor="amount" className="text-sm font-medium text-gray-600 block mb-1">
            Amount (in Rs)
          </label>
          <input
            type="number"
            id="amount"
            placeholder="Enter amount"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            ref={amountRef}
          />
        </div>

        {/* Transfer Button */}
        <button className="w-full h-12 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          onClick={transferMoney}
        >
          Initiate Transfer
        </button>
      </div>
    </div>
  );
};
