import React from 'react'

const UserCard = () => {
  return (
    <div className='bg-gradient-to-r from-teal-400 to-blue-500 text-white hover:from-pink-500 hover:to-orange-500 hover:text-white w-full md:w-96 py-8 md:px-8 px-6 shadow rounded-lg'>
      <p className='pb-2 text-xl font-bold'>Sushil Kumar</p>
      <p className='pb-2 font-semibold'>29293949574@payyou</p>
      <p className='font-semibold'>Balance - ₹ <span className=' font-bold'>500</span></p>
    </div>
  )
}

export default UserCard