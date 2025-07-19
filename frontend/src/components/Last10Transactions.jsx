import React, { useEffect, useState } from 'react'
import TransactionCard from './TransactionCard'
import { Link } from "react-router-dom"
import { getMyTransactions } from '../services/transactionService'

const Last10Transactions = () => {

  const [transactionData, setTransactionData] = useState("");

  const transactionsList = async () => {
    try {
      const res = await getMyTransactions();
      setTransactionData(res.data.transactions);
    } catch (error) {
      console.log("error in transaction list - ", error);
    }
  }

  useEffect(() => {
    transactionsList()
  }, [])

  if (transactionData?.length == 0) {
    return (
      <div className='bg-white mt-4 w-full py-8 md:px-8 px-6 shadow rounded-lg'>
        <h1 className='font-bold'>Your last 10 transactions</h1>
        <div className='text-center mt-16'>
          <h3>No data available.</h3>
        </div>
      </div>

    )
  }

  return (
    <div className='bg-white mt-4 w-full py-8 md:px-8 px-6 shadow rounded-lg'>
      <h1 className='font-bold'>Your last 10 transactions</h1>
      {/* {!transactionData && <p>Loading...</p>} */}
      {transactionData?.slice(0, 10).map((transaction) => (
        <TransactionCard key={transaction._id} transaction={transaction} />
      ))}
      <Link to="/app/transactions" className='text-center'>
        <div className='w-28 px-4 py-2 border rounded-lg bg-gray-800 hover:bg-gray-600 text-white mt-2 cursor-pointer'>See more</div>
      </Link>
    </div>
  )
}

export default Last10Transactions