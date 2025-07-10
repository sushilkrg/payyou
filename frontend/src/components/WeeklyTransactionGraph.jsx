import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { getWeeklyTransactions } from "../services/transactionService";

const WeeklyTransactionGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const res = await getWeeklyTransactions();
        // Fill missing days with 0
        const days = getLast7Days();
        const filledData = days.map(date => {
          const match = res.data.find(item => item._id === date);
          return {
            date,
            amount: match ? match.totalAmount : 0,
          };
        });
        setData(filledData);
      } catch (err) {
        console.error("Error fetching graph data:", err);
      }
    };

    fetchGraphData();
  }, []);

  const getLast7Days = () => {
    const result = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      result.push(day.toISOString().split("T")[0]);
    }
    return result;
  };

  return (
    <div className="w-full h-100 p-4 bg-white my-8 rounded-xl shadow">
      <h2 className="text-2xl  font-bold text-gray-800 pl-8 mb-8">Weekly Transactions Graph</h2>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} style={{ outline: 'none' }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#888" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="amount" stroke="#4F46E5" fill="#6366F1" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyTransactionGraph;
