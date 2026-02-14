import React from 'react'
import Search from './Search'
import Users from './Users'

const Left = () => {
  return (
    <div className='w-[30%] bg-black text-white flex flex-col h-full'>
      <h1 className='font-bold text-3xl p-2 items-center ml-8'>Chats</h1>
      <Search></Search>
      <hr />
      <Users></Users>
    </div>
  )
}

export default Left
