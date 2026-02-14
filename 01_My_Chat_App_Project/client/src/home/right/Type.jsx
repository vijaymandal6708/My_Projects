import React from "react";
import { IoSend } from "react-icons/io5";

const Type = () => {
  return (
    <>
      <div className="flex space-x-3 h-[8vh] text-center bg-gray-800 p-0.5">
        <div className="w-[70%] mx-4">
          <input
            type="text"
            placeholder="Type here"
            className="border-[1px] border-gray-700 rounded-lg flex items-center py-3 px-3 rounde-xl w-full grow outline-none bg-slate-900"
          />
        </div>
        <button className="btn btn-primary mt-1">
          <IoSend className="text-3xl" />
        </button>
      </div>
    </>
  );
};

export default Type;
