import React from 'react'
import Last10Transactions from '../components/Last10Transactions'

const Transactions = () => {
  return (
    <div>



    {/* Change it later as i want to implement infinite scroll for getting more transactions in multiple of 10 */}

      <Last10Transactions/>
    </div>
  )
}

export default Transactions