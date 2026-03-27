import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import axios from "axios";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  direction: string;
  note: string | null;
  createdAt: string;
  sender: { fullName: string; username: string };
  receiver: { fullName: string; username: string };
}

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Explicitly pass both page and limit to avoid any parsing issues
    api
      .get("/transactions?page=1&limit=5")
      .then(({ data }) => {
        if (data.success) {
          setTransactions(data.transactions);
        }
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load");
        } else {
          setError("Failed to load");
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
        <Link
          to="/transactions"
          className="text-sm text-brand-600 hover:underline"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="p-5 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-500 text-sm">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-sm">
          No transactions yet
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium
                    ${
                      tx.direction === "IN"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-500"
                    }`}
                >
                  {tx.type === "ADD" ? "+" : tx.direction === "IN" ? "↓" : "↑"}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {tx.type === "ADD"
                      ? "Added to wallet"
                      : tx.direction === "IN"
                        ? `From @${tx.sender.username}`
                        : `To @${tx.receiver.username}`}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <span
                className={`text-sm font-semibold ${
                  tx.direction === "IN" ? "text-green-600" : "text-red-500"
                }`}
              >
                {tx.direction === "IN" ? "+" : "-"}
                {formatCurrency(tx.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentTransactions;
