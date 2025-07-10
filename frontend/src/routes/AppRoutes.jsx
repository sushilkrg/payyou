import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ProtectedRoutes from './ProtectedRoute'
import Layout from '../pages/Layout'
import Dashboard from '../pages/Dashboard'
import SendMoney from '../pages/SendMoney'
import Profile from '../pages/Profile'
import AddMoney from '../pages/AddMoney'
import Transactions from '../pages/Transactions'
import Settings from '../pages/Settings'
import Support from '../pages/Support'
import VerifyOtp from '../pages/VerifyOtp'
import GenerateWalletId from '../pages/GenerateWalletId'

const AppRoutes = () => {

    const user = "";

    return (
        <Routes>
            <Route path='/' element={user ? <Navigate to="/app" /> : <Home />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/verify' element={<VerifyOtp />} />

            <Route element={<ProtectedRoutes />}>
                <Route path="/app" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path='generate' element={<GenerateWalletId />} />
                    <Route path="send-money" element={<SendMoney />} />
                    <Route path="add-money" element={<AddMoney />} />
                    {/* <Route path="/wallet" element={<Wallet/>}/> */}
                    <Route path="profile" element={<Profile />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="support" element={<Support />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes