import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='min-h-screen bg-gray-800 flex flex-col justify-center items-center py-12 px-2 lg:px-8'>
      <div className='bg-white w-full md:w-auto py-8 md:px-8 px-6 shadow rounded-lg'>
        <h2 className='text-3xl font-bold text-gray-900 text-center mb-2'>
          Welcome back to Paypay
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Login to your account for secure payment
        </p>
        <form className='space-y-6'>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="text" name='email' placeholder='Enter your email' required
              className="w-full mt-1 text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="text" name='password' placeholder='Enter your password' required
              className="w-full mt-1 text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <button type='submit' className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 '>Login</button>
          </div>
        </form>
         <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
      </div>
    </div>
  )
}

export default Login