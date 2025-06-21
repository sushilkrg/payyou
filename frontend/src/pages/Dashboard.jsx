import React from 'react'
import UserCard from '../components/UserCard';
import WeeklyTransactionGraph from '../components/WeeklyTransactionGraph';
import Last10Transactions from '../components/Last10Transactions';

const Dashboard = () => {

  return (
   <div className='bg-white w-full py-8 md:px-8 px-6 shadow rounded-lg'>
    <UserCard/>
    <WeeklyTransactionGraph/>
    <Last10Transactions/>
   </div>
  );
}

export default Dashboard