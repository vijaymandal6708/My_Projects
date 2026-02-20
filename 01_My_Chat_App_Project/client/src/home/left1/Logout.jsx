import React, { useState } from 'react';
import { TbLogout } from "react-icons/tb";
import axios from 'axios';
import Cookies from 'js-cookie';

const Logout = () => {
    const [loading, setLoading] = useState(false);
    const handleLogout = async ()=>{
      setLoading(true);
      try {
        const res = await axios.post("/api/user/logout");
        localStorage.removeItem("ChatApp");
        Cookies.remove("jwt");
        setLoading(false);
        alert("Logout Successfully");
      } catch (error) {
        console.log(error);
      }
    }
  return (
    <div className='w-[4%] bg-slate-950 text-white flex flex-col justify-end'>
      <div className="p-2 align-bottom">
        <button>
            <TbLogout className='text-5xl p-2 hover:bg-gray-600 rounded-lg duration-300' onClick={handleLogout} /> 
        </button>
      </div>
    </div>
  )
}

export default Logout
