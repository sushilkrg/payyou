import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyOtpSchema, type VerifyOtpFormData } from "../lib/schemas";
import { setAuth } from "../store/slices/authSlice";
import { setUser } from "../store/slices/userSlice";
import api from "../api/axiosInstance";
import axios from "axios";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Email was passed via navigate state from Signup page
  const email = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const onSubmit = async (data: VerifyOtpFormData) => {
    setIsLoading(true);
    setServerError("");

    try {
      const response = await api.post("/auth/verify-otp", {
        email,
        otp: data.otp,
      });

      dispatch(setAuth({ accessToken: response.data.accessToken }));
      dispatch(setUser(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Verification failed");
      } else {
        setServerError("Verification failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h1>
        <p className="text-gray-500 mb-8">
          We sent a 6-digit OTP to <strong>{email}</strong>
        </p>

        {serverError && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OTP Code
            </label>
            <input
              {...register("otp")}
              placeholder="123456"
              maxLength={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
