import React from 'react'

const TransactionCard = () => {
  return (
    <div className='flex justify-between items-center mt-2 bg-white w-full py-4 px-6 shadow rounded-lg'>
      <div className='flex items-center gap-2'>
        <div>↗️</div>
        <div className='flex flex-col lg:items-center lg:flex-row lg:gap-2'>
          <p className='text-sm text-gray-600'>paid to</p>
          <p>Aman Verma</p>
        </div>
      </div>
      <div className='flex items-center'>₹<span className='font-bold text-xl px-1'>200</span></div>
    </div>
  )
}

export default TransactionCard