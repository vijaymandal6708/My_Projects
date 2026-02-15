import React from "react";
import Message from "./Message";

const Messages = () => {
  return (
    <>
      <div className='py-2 flex-ankit overflow-y-auto' style={{minHeight:"calc(88vh - 8vh)"}}>
        <Message></Message>
        <Message></Message>
        <Message></Message>
         <Message></Message>
        <Message></Message>
        <Message></Message>
       
      </div>
    </>
  );
};

export default Messages;
