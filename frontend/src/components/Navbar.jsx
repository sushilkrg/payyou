import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from "react-router-dom"
import { logout } from '../features/auth/authSlice';
import { logoutUser } from '../services/authService';

const Navbar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(store => store?.auth?.user);

  const handleLogout = async () => {

    try {
      const res = await logoutUser();
      if (res.data) {
        dispatch(logout());
        navigate("/login")
      }
    } catch (error) {
      console.log("error in logout");

    }

  }

  return (
    <nav className='p-4 shadow-lg sticky'>
      <div className="container mx-auto px-4 md:px-16 flex justify-between items-center ">
        <div>
          <Link to="/" className='text-3xl font-bold text-teal-900 hover:text-teal-800'>Payyou</Link>
        </div>

        <div className='flex justify-between gap-4 md:gap-8 md:pr-8'>
          {user ?
            <button onClick={handleLogout} className='mr-3 border border-blue rounded-3xl px-4 py-2 font-bold cursor-pointer'>Logout</button>
            : <>
              <Link to="/login">
                <button className='mr-3 border border-blue rounded-3xl px-4 py-2 font-bold cursor-pointer'>Login</button>
              </Link>
              <Link to="/signup">
                <button className='border border-teal-950 bg-teal-900 text-white rounded-3xl px-4 py-2 font-bold cursor-pointer'>Sign up</button>
              </Link>
            </>
          }
        </div>
      </div>

    </nav>
  )
}

export default Navbar