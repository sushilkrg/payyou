import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axiosInstance";
import axios from "axios";

// Load Stripe outside component — avoids recreating on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Amount Form Schema

const amountSchema = z.object({
  amount: z
    .number("Enter a valid amount")
    .min(10, "Minimum ₹10")
    .max(100000, "Maximum ₹1,00,000"),
});

type AmountFormData = z.infer<typeof amountSchema>;

// Step 1: Amount Entry

interface AmountFormProps {
  onConfirm: (
    clientSecret: string,
    paymentIntentId: string,
    amount: number,
  ) => void;
}

const AmountForm = ({ onConfirm }: AmountFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AmountFormData>({ resolver: zodResolver(amountSchema) });

  const onSubmit = async (data: AmountFormData) => {
    setIsLoading(true);
    setServerError("");

    try {
      const response = await api.post("/payment/create-intent", {
        amount: data.amount,
      });
      onConfirm(
        response.data.clientSecret,
        response.data.paymentIntentId,
        data.amount,
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(
          err.response?.data?.message || "Failed to initialize payment",
        );
      } else {
        setServerError("Failed to initialize payment");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Add Money</h2>
      <p className="text-gray-500 text-sm mb-6">
        Securely add money to your wallet using your card.
      </p>

      {serverError && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <input
            {...register("amount", { valueAsNumber: true })}
            type="number"
            placeholder="Enter amount"
            min="10"
            step="1"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 text-lg"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>

        {/* Quick preset buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[100, 500, 1000, 5000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() =>
                setValue("amount", preset, { shouldValidate: true })
              }
              className="text-sm border border-gray-200 rounded-lg py-2 hover:border-brand-500 hover:text-brand-600 transition"
            >
              ₹{preset.toLocaleString("en-IN")}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {isLoading ? "Preparing..." : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
};

//  Step 2: Stripe Payment Form

interface PaymentFormProps {
  amount: number;
  paymentIntentId: string;
  onSuccess: () => void;
  onBack: () => void;
}

const PaymentForm = ({
  amount,
  paymentIntentId,
  onSuccess,
  onBack,
}: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError("");

    // confirmPayment sends card details directly to Stripe —
    // our server NEVER sees raw card numbers
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/add-money`,
      },
      // Only redirect for 3D Secure, otherwise stay on page
      redirect: "if_required",
    });

    if (error) {
      setPaymentError(error.message ?? "Payment failed");
      setIsProcessing(false);
      return;
    }

    // Poll backend to confirm wallet was credited via webhook
    await pollPaymentStatus(paymentIntentId);
    onSuccess();
    setIsProcessing(false);
  };

  // Poll until webhook has processed (max 10 attempts, 2s apart = 20s)
  const pollPaymentStatus = async (intentId: string) => {
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const { data } = await api.get(`/payment/status/${intentId}`);
        if (data.status === "succeeded") return;
      } catch {
        // continue polling
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 transition text-xl"
        >
          ←
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Payment Details
          </h2>
          <p className="text-sm text-gray-500">
            Adding ₹{amount.toLocaleString("en-IN")} to your wallet
          </p>
        </div>
      </div>

      {paymentError && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          {paymentError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Stripe pre-built PCI-compliant card UI */}
        <PaymentElement />

        <p className="text-xs text-gray-400 flex items-center gap-1">
          <span>🔒</span>
          Your payment is secured by Stripe. We never store card details.
        </p>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {isProcessing
            ? "Processing..."
            : `Pay ₹${amount.toLocaleString("en-IN")}`}
        </button>
      </form>
    </div>
  );
};

//  Step 3: Success Screen

const SuccessScreen = ({
  amount,
  onDone,
}: {
  amount: number;
  onDone: () => void;
}) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
      ✓
    </div>
    <h2 className="text-xl font-bold text-gray-900 mb-2">Money Added!</h2>
    <p className="text-gray-500 mb-6">
      ₹{amount.toLocaleString("en-IN")} has been added to your wallet
      successfully.
    </p>
    <button
      onClick={onDone}
      className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-lg transition"
    >
      Go to Dashboard
    </button>
  </div>
);

//  Step indicator

type Step = "amount" | "payment" | "success";
const STEPS: Step[] = ["amount", "payment", "success"];

const StepIndicator = ({ current }: { current: Step }) => {
  const currentIdx = STEPS.indexOf(current);
  return (
    <div className="flex items-center gap-2 mb-6">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold
            ${
              current === step
                ? "bg-brand-600 text-white"
                : i < currentIdx
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            {i < currentIdx ? "✓" : i + 1}
          </div>
          {i < 2 && (
            <div
              className={`h-0.5 w-8 ${i < currentIdx ? "bg-green-500" : "bg-gray-200"}`}
            />
          )}
        </div>
      ))}
      <span className="text-xs text-gray-500 ml-1 capitalize">{current}</span>
    </div>
  );
};

//  Main Page

const AddMoney = () => {
  const [step, setStep] = useState<Step>("amount");
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [confirmedAmount, setConfirmedAmount] = useState(0);

  const handleAmountConfirm = (
    secret: string,
    intentId: string,
    amount: number,
  ) => {
    setClientSecret(secret);
    setPaymentIntentId(intentId);
    setConfirmedAmount(amount);
    setStep("payment");
  };

  return (
    <DashboardLayout title="Add Money">
      <div className="max-w-md mx-auto">
        <StepIndicator current={step} />

        {step === "amount" && <AmountForm onConfirm={handleAmountConfirm} />}

        {step === "payment" && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: { colorPrimary: "#4F46E5", borderRadius: "8px" },
              },
            }}
          >
            <PaymentForm
              amount={confirmedAmount}
              paymentIntentId={paymentIntentId}
              onSuccess={() => setStep("success")}
              onBack={() => setStep("amount")}
            />
          </Elements>
        )}

        {step === "success" && (
          <SuccessScreen
            amount={confirmedAmount}
            onDone={() => (window.location.href = "/dashboard")}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AddMoney;
