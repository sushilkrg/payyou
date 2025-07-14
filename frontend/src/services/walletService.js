import api from "./api";

export const generateWalletId = async () => api.post("/wallet/generate");
export const getMyWalletInfo = async () => api.get("/wallet/");
export const addMoney = async (data) => api.post("/wallet/add", data);
export const sendMoney = async (data) => api.post("/wallet/send", data);
