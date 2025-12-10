import React from 'react';

const Support = () => {
  return (
    <div className="min-h-screen bg-white w-full py-8 md:px-8 px-6 shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Support Center</h2>

      {/* Contact Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Get in Touch</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Email Us</h4>
            <p className="text-gray-900">support@payyou.com</p>
            <p className="text-sm text-gray-500 mt-1">
              We typically respond within 24 hours
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Call Us</h4>
            <p className="text-gray-900">8888855555</p>
            <p className="text-sm text-gray-500 mt-1">
              Available Mon-Fri, 9:00 AM - 6:00 PM IST
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="border-l-2 border-gray-200 pl-4">
            <h4 className="font-medium text-gray-900 mb-1">
              How do I add money to my wallet?
            </h4>
            <p className="text-sm text-gray-600">
              Navigate to the "Add Money" section and follow the instructions to
              deposit funds using your preferred payment method.
            </p>
          </div>
          <div className="border-l-2 border-gray-200 pl-4">
            <h4 className="font-medium text-gray-900 mb-1">
              Are transactions secure?
            </h4>
            <p className="text-sm text-gray-600">
              Yes, all transactions are encrypted and processed through secure
              payment gateways to ensure your financial data is protected.
            </p>
          </div>
          <div className="border-l-2 border-gray-200 pl-4">
            <h4 className="font-medium text-gray-900 mb-1">
              What are the transaction fees?
            </h4>
            <p className="text-sm text-gray-600">
              Transaction fees vary based on the payment method. Check our pricing
              page or contact support for detailed information.
            </p>
          </div>
          <div className="border-l-2 border-gray-200 pl-4">
            <h4 className="font-medium text-gray-900 mb-1">
              How long does it take to send money?
            </h4>
            <p className="text-sm text-gray-600">
              Most transfers are instant. Bank transfers may take 1-3 business days
              depending on your bank.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Help */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Quick Help</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Account Issues</h4>
            <p className="text-sm text-gray-600">
              Having trouble logging in or accessing your account? Reset your
              password or contact support.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Payment Problems</h4>
            <p className="text-sm text-gray-600">
              If a payment failed or is pending, check your transaction history or
              reach out to our team.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Wallet Management</h4>
            <p className="text-sm text-gray-600">
              Learn how to manage your wallet, view balance, and track your
              transaction history.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Security Tips</h4>
            <p className="text-sm text-gray-600">
              Keep your account secure by enabling two-factor authentication and
              never sharing your password.
            </p>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div>
        <h3 className="text-lg font-medium mb-3">Business Hours</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
          <p>Saturday: 10:00 AM - 4:00 PM IST</p>
          <p>Sunday: Closed</p>
        </div>
      </div>
    </div>
  );
};

export default Support;
