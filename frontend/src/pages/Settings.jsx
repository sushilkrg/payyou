import React from 'react'

const Settings = () => {
  return (
    <div className='bg-white w-full py-8 md:px-8 px-6 shadow rounded-lg'>
      <h3 className='text-xl font-bold'>Account & Profile</h3>
      <p className='font-semibold'>update profile</p>

      <h3 className='mt-4 font-bold'>Security & Privacy</h3>
      <p>change password</p>

      <p>Change Transaction limit</p>

      <h3 className='mt-4 font-bold'>Privacy Setting</h3>
      <div className='flex items-center mt-4 gap-2'>
        <p className=' font-semibold'>Theme</p>
        <p className=' border rounded-2xl bg-gray-800 text-white border-gray-800 px-4 py-1 cursor-pointer'>dark</p>
      </div>

      <h3 className='mt-4'>Terms of Service</h3>
    </div>
  )
}

export default Settings