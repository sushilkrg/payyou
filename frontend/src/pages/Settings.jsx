import React, { useState } from 'react'

const Settings = () => {
  const [theme, setTheme] = useState('light');
  
  return (
    <div className='bg-white w-full py-8 md:px-8 px-6 shadow rounded-lg'>
      <h3 className='text-xl font-bold'>Account & Profile</h3>
      <p className='font-semibold'>update profile</p>

      <h3 className='mt-4 font-bold'>Security & Privacy</h3>
      <p>change password</p>

      <p>Change Transaction limit</p>

      <div className='flex items-center mt-4 gap-2'>
        {/* <p className=' font-semibold'>Theme</p> */}
        {/* <p className=' border rounded-2xl bg-gray-800 text-white border-gray-800 px-4 py-1 cursor-pointer'>dark</p> */}
        <div className="flex justify-between items-center gap-2">
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1">
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-200  py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900  sm:text-sm"
            onChange={(e) => setTheme(e.target.value)}
            value={theme}
          >
            <option value="light" >🌞 Light</option>
            <option value="dark">🌚 Dark</option>
          </select>
        </div>
      </div>

      <h3 className='mt-4'>Terms of Service</h3>
    </div>
  )
}

export default Settings