import { useSelector } from "react-redux";
import DashboardLayout from "../components/DashboardLayout";
import type { RootState } from "../store/store";
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import axios from "axios";
import { Link } from "react-router-dom";
import RecentTransactions from "../components/RecentTransactions";

interface WalletData {
  balance: number;
  dailyLimit: number;
  todaySpent: number;
  remainingLimit: number;
  status: string;
}

const Dashboard = () => {
  const user = useSelector((s: RootState) => s.user);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { data } = await api.get("/wallet");
        setWallet(data.wallet);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load wallet");
        } else {
          setError("Failed to load wallet");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  return (
    <DashboardLayout title="Dashboard">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.fullName?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your wallet overview</p>
        </div>

        {/* Wallet Card */}
        {isLoading ? (
          <div className="bg-brand-600 rounded-2xl p-6 h-40 animate-pulse" />
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
            {error}
          </div>
        ) : (
          wallet && (
            <div className="bg-linear-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
              <p className="text-brand-100 text-sm font-medium mb-1">
                Total Balance
              </p>
              <p className="text-4xl font-bold mb-4">
                {formatCurrency(wallet.balance)}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-brand-200">Today Spent</p>
                  <p className="font-semibold">
                    {formatCurrency(wallet.todaySpent)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-brand-200">Remaining Limit</p>
                  <p className="font-semibold">
                    {formatCurrency(wallet.remainingLimit)}
                  </p>
                </div>
              </div>
              {/* Daily limit progress bar */}
              <div className="mt-4">
                <div className="w-full bg-brand-500/50 rounded-full h-1.5">
                  <div
                    className="bg-white rounded-full h-1.5 transition-all"
                    style={{
                      width: `${Math.min((wallet.todaySpent / wallet.dailyLimit) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-brand-200 text-xs mt-1">
                  Daily limit: {formatCurrency(wallet.dailyLimit)}
                </p>
              </div>
            </div>
          )
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/send-money"
            className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center gap-2 hover:border-brand-500 hover:shadow-sm transition group"
          >
            <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 text-xl group-hover:bg-brand-100 transition">
              ↑
            </div>
            <span className="text-sm font-medium text-gray-700">
              Send Money
            </span>
          </Link>

          <Link
            to="/add-money"
            className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center gap-2 hover:border-brand-500 hover:shadow-sm transition group"
          >
            <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 text-xl group-hover:bg-brand-100 transition">
              +
            </div>
            <span className="text-sm font-medium text-gray-700">Add Money</span>
          </Link>
        </div>

        {/* Recent Transactions Preview */}
        <RecentTransactions />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
