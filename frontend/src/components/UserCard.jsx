import React from 'react'
import { useSelector } from 'react-redux'

const UserCard = () => {

  const user = useSelector(store => store.auth.user)

  return (
    <div className='bg-gradient-to-r from-teal-400 to-blue-500 text-white hover:from-pink-500 hover:to-orange-500 hover:text-white w-full md:w-96 py-8 md:px-8 px-6 shadow rounded-lg'>
      <p className='pb-2 text-xl font-bold'>{user?.name}</p>
      <p className='pb-2 font-semibold'>{user?.walletId}@payyou</p>
      <p className='font-semibold'>Balance - ₹ <span className=' font-bold'>{user?.balance}</span></p>
    </div>
  )
}

export default UserCard