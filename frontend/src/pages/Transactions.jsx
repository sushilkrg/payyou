import React, { useEffect, useState } from 'react'
import TransactionCard from '../components/TransactionCard'
import { getMyTransactions } from '../services/transactionService';

const Transactions = () => {

  const [allTransactionData, setAllTransactionData] = useState("");
  const [filteredTransactionData, setFilteredTransactionData] = useState("");
  const [transactionType, setTransactionType] = useState("all");

  const handleChange = (e) => {
    setTransactionType(e.target.value);
    let transactionType = e.target.value;
    let filteredTransactions;

    if (transactionType === "all") {
      setFilteredTransactionData(allTransactionData)
    }

    if (transactionType === "add") {
      filteredTransactions = allTransactionData.filter((transaction) => transaction?.type == "add")
      setFilteredTransactionData(filteredTransactions)
    }
    if (transactionType === "send") {
      filteredTransactions = allTransactionData.filter((transaction) => transaction?.type == "send")
      setFilteredTransactionData(filteredTransactions)
    }
    if (transactionType === "receive") {
      filteredTransactions = allTransactionData.filter((transaction) => transaction?.type == "receive")
      setFilteredTransactionData(filteredTransactions)
    }
  }

  const transactionsList = async () => {
    try {
      const res = await getMyTransactions();
      // console.log(res.data.transactions);

      setAllTransactionData(res.data.transactions);
      setFilteredTransactionData(res.data.transactions);

    } catch (error) {
      console.log("error in transaction list - ", error);

    }
  }

  useEffect(() => {
    transactionsList()
  }, [])

  if (filteredTransactionData?.length == 0) {
    return (
      <div>
        <div className="flex justify-end xl:pr-24">
          <div className="w-38 bg-white-800 text-gray rounded-lg ">
            <select
              name="transactionType"
              id="transactionType"
              value={transactionType}
              onChange={handleChange}
              className="block w-full font-bold px-4 py-2 border rounded-md text-gray-700 focus:outline-none"
            >
              <option className='font-bold' value="all">All</option>
              <option value="add">Added</option>
              <option value="send">Sent</option>
              <option value="receive">Received</option>
            </select>
          </div>
        </div>
        <div className='bg-white mt-4 w-full py-8 md:px-8 px-6 shadow rounded-lg'>
          <h1 className='font-bold'>Your transactions</h1>
          <div className='text-center mt-16'>
            <h3>No data available.</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* filters  */}

      <div className="flex justify-end xl:pr-24">
        <div className="w-38 bg-white-800 text-gray rounded-lg ">
          <select
            name="transactionType"
            id="transactionType"
            value={transactionType}
            onChange={handleChange}
            className="block w-full font-bold px-4 py-2 border rounded-md text-gray-700 focus:outline-none"
          >
            <option className='font-bold' value="all">All</option>
            <option value="add">Added</option>
            <option value="send">Sent</option>
            <option value="receive">Received</option>
          </select>
        </div>
      </div>

      {/* Change it later as i want to implement infinite scroll for getting more transactions in multiple of 10 */}

      <div className='bg-white mt-4 w-full py-8 md:px-8 px-6 shadow rounded-lg'>
        <h1 className='font-bold'>Your transactions</h1>
        {!filteredTransactionData && <p>Loading...</p>}
        {filteredTransactionData?.map((transaction) => (
          <TransactionCard key={transaction._id} transaction={transaction} />
        ))}
      </div>
    </div>
  )
}

export default Transactions