import React from 'react'
import TransactionCard from './TransactionCard'
import { Link } from "react-router-dom"

const Last10Transactions = () => {
  return (
    <div className='bg-white mt-4 w-full py-8 md:px-8 px-6 shadow rounded-lg'>
      <h1 className='font-bold'>Your last 10 transactions</h1>
      <TransactionCard />
      <TransactionCard />
      <TransactionCard />
      <TransactionCard />
      <TransactionCard />
      <TransactionCard />
      <TransactionCard />
      <TransactionCard />
      <TransactionCard />
      <TransactionCard />
      <Link to="/app/transactions" className='text-center'>
        <div className='w-28 px-4 py-2 border rounded-lg bg-gray-800 hover:bg-gray-600 text-white mt-2 cursor-pointer'>See more</div>
      </Link>
    </div>
  )
}

export default Last10Transactions