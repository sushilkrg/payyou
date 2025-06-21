import { useState } from 'react'
import { Link } from 'react-router-dom'

const AddMoney = () => {

  const [amount, setAmount] = useState("");

  const amountSuggestions = ['100', '200', '500']

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  return (
    <div className='bg-white w-full md:w-96 py-8 md:px-8 px-6 shadow rounded-lg'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Enter Amount</label>
          <input type="text" name='amount' placeholder='Enter amount' value={amount} onChange={(e) => setAmount(e.target.value)} required
            className="w-full mt-1 text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          {amountSuggestions.map(amountSuggestion => (
            <button onClick={() => setAmount(amountSuggestion)} className='border rounded-3xl text-md font-semibold text-gray-500 px-4 py-0.5 mx-2 cursor-pointer'>{amountSuggestion}</button>
          ))}
        </div>
        <div className='flex justify-center items-center'>
          <button type='submit' className='w-auto flex justify-center items-center cursor-pointer outline-none py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700'>Add Money</button>
        </div>
      </form>
    </div>
  )
}

export default AddMoney