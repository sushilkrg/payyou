import { Link } from 'react-router-dom'

const SendMoney = () => {
  return (
    // <div className=' bg-gray-800 flex flex-col justify-center items-center py-12 px-2 lg:px-8'>
      <div className='bg-white w-full md:w-96 py-8 md:px-8 px-6 shadow rounded-lg'>
        
        <form className='space-y-6'>
          <div>
            <label htmlFor="walletId" className="block text-sm font-medium text-gray-700">Enter walletId</label>
            <input type="text" name='walletId' placeholder='Enter walletId' required
              className="w-full mt-1 text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Enter amount</label>
            <input type="text" name='amount' placeholder='Enter amount' required
              className="w-full mt-1 text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className='flex justify-center items-center'>
            <button type='submit' className='w-auto flex justify-center items-center cursor-pointer outline-none py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700  '>Send Money</button>
          </div>
        </form>
        
      {/* </div> */}
    </div>
  )
}

export default SendMoney