import api from "./api";

export const getMyTransactions = async () => api.get("/transactions/my");
