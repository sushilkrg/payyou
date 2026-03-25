import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { sendMoneySchema, type SendMoneyFormData } from "../lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "../hooks/useDebounce";
import api from "../api/axiosInstance";
import axios from "axios";

type RecipientStatus = "idle" | "checking" | "found" | "not_found" | "self";

const SendMoney = () => {
  const navigate = useNavigate();
  const [recipientStatus, setRecipientStatus] =
    useState<RecipientStatus>("idle");
  const [recipientFullName, setRecipientFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<SendMoneyFormData>({
    resolver: zodResolver(sendMoneySchema),
  });

  const usernameValue = watch("recipientUsername");
  const debouncedUsername = useDebounce(usernameValue, 500);

  //  Recipient lookup

  useEffect(() => {
    const isValid = /^[a-z0-9_]{3,}$/.test(debouncedUsername || "");
    if (!isValid || !debouncedUsername) {
      setRecipientStatus("idle");
      setRecipientFullName("");
      return;
    }

    setRecipientStatus("checking");
    api
      .get(`/transactions/check-recipient?username=${debouncedUsername}`)
      .then(({ data }) => {
        setRecipientStatus("found");
        setRecipientFullName(data.fullName);
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          const msg = err.response?.data?.message;
          if (msg === "Cannot send money to yourself") {
            setRecipientStatus("self");
            setError("recipientUsername", {
              message: "Cannot send to yourself",
            });
          } else {
            setRecipientStatus("not_found");
            setError("recipientUsername", { message: "User not found" });
          }
        } else {
          setRecipientStatus("idle");
        }
        setRecipientFullName("");
      });
  }, [debouncedUsername, setError]);

  const onSubmit = async (data: SendMoneyFormData) => {
    if (recipientStatus !== "found") return;

    setIsSubmitting(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await api.post("/transactions/send", data);
      setSuccessMessage(
        `Successfully sent ₹${data.amount} to ${response.data.recipient.fullName}`,
      );
      // Redirect to transactions after short delay
      setTimeout(() => navigate("/transactions"), 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Transfer failed");
      } else {
        setServerError("Transfer failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  //  Recipient status indicator

  const RecipientBadge = () => {
    if (recipientStatus === "checking") {
      return <p className="text-gray-400 text-sm mt-1">Looking up user...</p>;
    }
    if (recipientStatus === "found") {
      return (
        <p className="text-green-600 text-sm mt-1 font-medium">
          ✓ {recipientFullName}
        </p>
      );
    }
    return null;
  };

  return (
    <DashboardLayout title="Send Money">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Send Money
          </h2>

          {successMessage && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {successMessage}
            </div>
          )}

          {serverError && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Recipient Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Username
              </label>
              <input
                {...register("recipientUsername")}
                placeholder="e.g. john_doe"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.recipientUsername ? (
                <p className="text-red-500 text-sm mt-1">
                  {errors.recipientUsername.message}
                </p>
              ) : (
                <RecipientBadge />
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                placeholder="0.00"
                min="1"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Note (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                {...register("note")}
                placeholder="e.g. Rent, Dinner split..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.note && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.note.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || recipientStatus !== "found"}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Money"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SendMoney;
