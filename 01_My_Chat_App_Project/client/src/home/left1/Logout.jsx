import React from 'react'
import { TbLogout } from "react-icons/tb";

const Logout = () => {
  return (
    <div className='w-[4%] bg-slate-950 text-white flex flex-col justify-end'>
      <div className="p-2 align-bottom">
        <button>
            <TbLogout className='text-5xl p-2 hover:bg-gray-600 rounded-lg duration-300' /> 
        </button>
      </div>
    </div>
  )
}

export default Logout
