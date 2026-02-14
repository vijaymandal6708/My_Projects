import React from 'react'
import Chatuser from './Chatuser'
import Messages from './Messages'
import Type from './Type'

const Right = () => {
  return (
    <div className='w-[70%] bg-slate-950 text-white flex flex-col h-full'>
      <Chatuser></Chatuser>
      <div className='py-2 flex-ankit overflow-y-auto' style={{minHeight: "calc(88vh - 12vh)"}}>
        <Messages></Messages>
      </div>
      <Type></Type>
    </div>
  )
}

export default Right
