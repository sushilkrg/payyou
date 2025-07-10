import api from "./api";

export const getMyTransactions = async () => api.get("/transactions/my");
export const getWeeklyTransactions = async () => api.get("/transactions/weekly");
