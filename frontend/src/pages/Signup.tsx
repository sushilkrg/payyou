import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signupSchema, type SignupFormData } from "../lib/schemas";
import { useDebounce } from "../hooks/useDebounce";
import api from "../api/axiosInstance";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const emailValue = watch("email");
  const usernameValue = watch("username");
  const debouncedEmail = useDebounce(emailValue, 500);
  const debouncedUsername = useDebounce(usernameValue, 500);

  //  Check email uniqueness 

  useEffect(() => {
    // check if the email passes Zod format validation
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail || "");
    if (!emailValid || !debouncedEmail) {
      setEmailStatus("idle");
      return;
    }

    setEmailStatus("checking");
    api
      .get(`/auth/check-email?email=${debouncedEmail}`)
      .then(({ data }) => {
        if (data.available) {
          setEmailStatus("available");
        } else {
          setEmailStatus("taken");
          setError("email", { message: "Email already registered" });
        }
      })
      .catch(() => setEmailStatus("idle"));
  }, [debouncedEmail, setError]);

  // Check username uniqueness 

  useEffect(() => {
    const usernameValid = /^[a-z0-9_]{3,20}$/.test(debouncedUsername || "");
    if (!usernameValid || !debouncedUsername) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");
    api
      .get(`/auth/check-username?username=${debouncedUsername}`)
      .then(({ data }) => {
        if (data.available) {
          setUsernameStatus("available");
        } else {
          setUsernameStatus("taken");
          setError("username", { message: "Username already taken" });
        }
      })
      .catch(() => setUsernameStatus("idle"));
  }, [debouncedUsername, setError]);

  const onSubmit = async (data: SignupFormData) => {
    if (emailStatus === "taken" || usernameStatus === "taken") return;

    setIsLoading(true);
    setServerError("");

    try {
    await api.post("/auth/signup", data);
    navigate("/verify-otp", { state: { email: data.email } });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      setServerError(err.response?.data?.message || "Something went wrong");
    } else {
      setServerError("Something went wrong");
    }
  } finally {
    setIsLoading(false);
  }
  };

  const StatusIcon = ({ status }: { status: typeof emailStatus }) => {
    if (status === "checking")
      return <span className="text-gray-400 text-sm">Checking...</span>;
    if (status === "available")
      return <span className="text-green-500 text-sm">✓ Available</span>;
    if (status === "taken")
      return <span className="text-red-500 text-sm">✗ Already taken</span>;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-500 mb-8">Join PayYou today</p>

        {serverError && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              {...register("fullName")}
              placeholder="Sushil Kumar"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              {...register("username")}
              placeholder="sushil123"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <div className="flex justify-between items-center mt-1">
              {errors.username ? (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              ) : (
                <span />
              )}
              <StatusIcon status={usernameStatus} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="sushil@gmail.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <div className="flex justify-between items-center mt-1">
              {errors.email ? (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              ) : (
                <span />
              )}
              <StatusIcon status={emailStatus} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              isLoading || emailStatus === "taken" || usernameStatus === "taken"
            }
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending OTP..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-brand-600 font-medium hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
