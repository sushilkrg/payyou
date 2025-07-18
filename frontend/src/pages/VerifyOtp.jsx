import React, { useState } from 'react'
import { verifyOTP } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {

  const [otp, setOtp] = useState("");
  const storedEmail = localStorage.getItem("email");
  const navigate = useNavigate()
  let email;

  if (storedEmail) {
    email = JSON.parse(storedEmail)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = { email, otp }
      const res = await verifyOTP(data)

      if (res.data) {
        console.log("otp verified-", res.data);
        localStorage.removeItem("email");
        navigate("/login")
      }
    } catch (error) {
      console.log("error in otp-", error);

    }
  }

  return (
    <div className='min-h-screen bg-gray-800 flex flex-col justify-center items-center py-12 px-2 lg:px-8'>
      <div className='bg-white w-full md:w-auto py-8 md:px-8 px-6 shadow rounded-lg'>
        <h2 className='text-2xl font-bold text-gray-900 text-center mb-2'>
          Verify OTP
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Check OTP sent to your registered email
        </p>
        <form onSubmit={handleSubmit} className='space-y-6'>

          <div>
            <input type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder='Enter your OTP here' required
              className="w-full mt-1 text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          <div>
            <button type='submit' className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 '>Verify</button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default VerifyOtp