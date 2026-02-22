import React, { useEffect } from 'react'
import { useSocketContext } from './SocketContext'
import useConversation from '../stateManage/useConversation.js';
import sound from "";

const useGetSocketMessage = () => {
    const {socket} = useSocketContext();
    const {messages,setMessages} = useConversation();

    useEffect(()=>{
        socket.on("newMessage", (newMessage)=>{
            const notification = hnew Audio(sound);

            setMessages(...messages,newMessage);
        });
        return ()=> socket.off("newMessage");
    },[socket,messages,setMessages]);
}

export default useGetSocketMessage
