import React from "react";
import useConversation from "../../stateManage/useConversation.js";
import {useSocketContext} from "../../context/SocketContext.jsx";

const Chatuser = () => {
    const {selectedConversation} = useConversation();
    console.log(selectedConversation);
    const { onlineUsers } = useSocketContext();
    const getOnlineUserStatus = (userId)=>{
      return onlineUsers.includes(userId)? "Online" : "Offline"
    }
  return (
    <>
      <div className="pl-5 pt-5 pb-3 h-[12vh] flex space-x-4 bg-gray-900 hover:bg-gray-600 duration-300">
        <div>
          {/* <div className={`avatar ${isOnline ? "avatar-online":"avatar-offline"}`}> */}
          <div>
            <div className="w-14 rounded-full">
              <img src="https://avatars.githubusercontent.com/u/99532574?v=4?s=400 " />
            </div>
          </div>
        </div>
        
        <div>
          <h1 className="text-xl">{selectedConversation?.fullname}</h1>
          <span className="text-sm">{getOnlineUserStatus(selectedConversation._id)}</span>
        </div>
      </div>
    </>
  );
};

export default Chatuser;
