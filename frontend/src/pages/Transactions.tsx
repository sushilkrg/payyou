import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axiosInstance";
import axios from "axios";

type TxType = "SEND" | "RECEIVE" | "ADD" | "";
type TxStatus = "PENDING" | "SUCCESS" | "FAILED" | "";

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

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const statusColors: Record<string, string> = {
  SUCCESS: "bg-green-50 text-green-700",
  PENDING: "bg-yellow-50 text-yellow-700",
  FAILED: "bg-red-50 text-red-600",
};

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [typeFilter, setTypeFilter] = useState<TxType>("");
  const [statusFilter, setStatusFilter] = useState<TxStatus>("");
  const [page, setPage] = useState(1);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError("");

      // Build query string from active filters
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      if (typeFilter) params.set("type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);

      try {
        const { data } = await api.get(`/transactions?${params.toString()}`);
        setTransactions(data.transactions);
        setPagination(data.pagination);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Failed to load transactions",
          );
        } else {
          setError("Failed to load transactions");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [typeFilter, statusFilter, page]);

  // Reset to page 1 when filters change
  const handleTypeFilter = (val: TxType) => {
    setTypeFilter(val);
    setPage(1);
  };

  const handleStatusFilter = (val: TxStatus) => {
    setStatusFilter(val);
    setPage(1);
  };

  return (
    <DashboardLayout title="Transactions">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-wrap gap-3">
          <select
            value={typeFilter}
            onChange={(e) => handleTypeFilter(e.target.value as TxType)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Types</option>
            <option value="SEND">Send</option>
            <option value="RECEIVE">Receive</option>
            <option value="ADD">Add Money</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value as TxStatus)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>

          {(typeFilter || statusFilter) && (
            <button
              onClick={() => {
                setTypeFilter("");
                setStatusFilter("");
                setPage(1);
              }}
              className="text-sm text-brand-600 hover:underline"
            >
              Clear filters
            </button>
          )}

          {pagination && (
            <span className="text-sm text-gray-400 ml-auto self-center">
              {pagination.total} transaction{pagination.total !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-red-500 text-sm">{error}</div>
          ) : isLoading ? (
            <div className="divide-y divide-gray-50">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 mx-5 my-2 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              No transactions found
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${tx.direction === "IN" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
                    >
                      {tx.type === "ADD"
                        ? "+"
                        : tx.direction === "IN"
                          ? "↓"
                          : "↑"}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {tx.type === "ADD"
                          ? "Added to wallet"
                          : tx.direction === "IN"
                            ? `From @${tx.sender.username}`
                            : `To @${tx.receiver.username}`}
                      </p>
                      {tx.note && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {tx.note}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold
                      ${
                        tx.direction === "IN" || tx.type === "ADD"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {tx.direction === "IN" || tx.type === "ADD" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${statusColors[tx.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {tx.status.charAt(0) + tx.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-3">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!pagination.hasPrev}
              className="text-sm text-brand-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:underline"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNext}
              className="text-sm text-brand-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:underline"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
