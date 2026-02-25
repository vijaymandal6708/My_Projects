import React from 'react'
import Messages from './Messages';

const Message = ({message}) => {
    const authUser = JSON.parse(localStorage.getItem("ChatApp"));
    const itsme = message.senderId === authUser.user._id;
    const chatName = itsme ? "chat-end" : "chat-start";
    const chatColor = itsme? "bg-blue-400": "bg-gray-800";
    const createdAt = new Date(message.createdAt);
    const formattedTime = createdAt.toLocaleTimeString([],{
      hour: "2-digit",
      minute: "2-digit"
    })
  return (
    <>
      <div className="p-4">
        <div className={`chat ${chatName}`}>
          <div className={`chat-bubble text-white ${chatColor}`}>{message.message}</div>
          <div>{formattedTime}</div>
        </div>
      </div>
    </>
  )
}

export default Message
