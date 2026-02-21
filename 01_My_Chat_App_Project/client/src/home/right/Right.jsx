import React, { useEffect } from "react";
import Chatuser from "./Chatuser";
import Messages from "./Messages";
import Type from "./Type";
import useConversation from "../../stateManage/useConversation.js";
import Loading from "../../components/Loading.jsx";
import { useAuth } from "../../context/AuthProvider.jsx";

const Right = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  useEffect(() => {
    return setSelectedConversation(null);
  }, [setSelectedConversation]);
  return (
    <>
      <div className="w-full bg-slate-800 text-white flex flex-col h-full">
        <div>
          {!selectedConversation ? (
        <Nochat />
      ) : (
        <>
          
            <Chatuser></Chatuser>
            <div
              className="py-2 flex-ankit overflow-y-auto"
              style={{ maxHeight: "calc(88vh - 8vh)" }}
            >
              <Messages></Messages>
            </div>
            <Type></Type>
          
        </>
      )}
        </div>
      </div>
    </>
  );
};

export default Right;

const Nochat = () => {
  const [authUser] = useAuth();

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-center font-semibold text-xl">
          Welcome <span>{authUser.user.fullname}</span>
          <br />
          Select a chat to start messanging.
        </h1>
        {authUser.name && <Nochat />}
      </div>
    </>
  );
};
