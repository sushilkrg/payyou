import React from 'react'
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className='p-4 shadow-lg sticky'>
      <div className="container mx-auto px-4 md:px-16 flex justify-between items-center ">
        <div>
          {/* <Link to="/" className='hover:text-blue-400'>Payyou</Link> */}
          <Link to="/" className='text-3xl font-bold text-blue-800 hover:text-blue-400'>Payyou</Link>

        </div>

        <div className='flex justify-between gap-4 md:gap-8 md:pr-8'>
          <Link to="/login">
          <button className='mr-3 border border-blue rounded-3xl px-4 py-2 font-bold'>Login</button>
          </Link>
          <Link to="/signup">
          <button className= 'border border-blue-950 bg-blue-950 text-white rounded-3xl px-4 py-2 font-bold '>Sign up</button>
          </Link>
          {/* <img src='https://png.pngtree.com/element_our/png/20181206/users-vector-icon-png_260862.jpg' className= 'border border-blue-950 rounded-full w-8 h-8'/> */}
        </div>
      </div>

    </nav>
  )
}

export default Navbar