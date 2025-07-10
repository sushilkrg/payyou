import api from "./api";

export const signupUser = async (data) => api.post("/auth/register", data);
export const loginUser = async (data) => api.post("/auth/login", data);
export const verifyOTP = async (data) => api.post("/auth/verify", data);
export const logoutUser = async () => api.post("/auth/logout");
