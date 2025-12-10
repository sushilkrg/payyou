import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccessful = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
            <div className="w-full max-w-md text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Payment Successful
                </h1>
                <p className="text-gray-600 mb-8">
                    Your transaction has been completed successfully
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link to={"/"}>
                        <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg cursor-pointer font-medium hover:bg-gray-50 transition">
                            Back to Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessful;
