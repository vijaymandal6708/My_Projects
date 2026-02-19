import React from 'react'
import User from './User'
import userGetAllUsers from '../../context/userGetAllUsers'

const Users = () => {
    const [allUsers, loading] = userGetAllUsers();
    console.log(allUsers);
  return (
    <div className='py-2 flex-ankit overflow-y-auto' style={{maxHeight:"calc(84vh-1vh)"}} >
      <User></User>
      <User></User>
      <User></User>
      <User></User>
      <User></User>
      <User></User>
      <User></User>
      <User></User>
      <User></User>
      <User></User>
      <User></User>
    </div>
  )
}

export default Users
