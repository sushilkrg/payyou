import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
    const user = useSelector(store => store.auth.user)
  return (
    <div className='bg-white flex items-center justify-center flex-col w-full py-8 md:px-8 px-6 shadow rounded-lg'>
      <img className='w-32 h-32 rounded-full object-cover' src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSgFBs-0-0qcp9qxyLfUNJeED7fb0rJC_ZhGXlR79BS0KFlwz2Uc9RFyMFUoW0Cr6uZqZYnMorPZRudxAC16Zf1tg" alt="profile pic" />

      <div className='mt-4'>
        <p className='text-xl font-bold'>{user?.name}</p>
        <p>{user?.email}</p>
        <p>{user?.walletId}@payyou</p>
      </div>

    </div>
  )
}

export default Profile