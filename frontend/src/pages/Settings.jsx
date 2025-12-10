import React, { useState } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  });
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="min-h-screen bg-white w-full py-8 md:px-8 px-6 shadow rounded-lg">
      {/* Account & Profile */}
      <section className="mb-8 pb-6 border-b">
        <h3 className="text-xl font-semibold mb-4">Account & Profile</h3>
        <div className="space-y-3">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Update Profile Information
          </button>
          <button className="block text-blue-600 hover:text-blue-700 text-sm font-medium">
            Change Profile Picture
          </button>
          <button className="block text-blue-600 hover:text-blue-700 text-sm font-medium">
            Manage Email Address
          </button>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="mb-8 pb-6 border-b">
        <h3 className="text-xl font-semibold mb-4">Security & Privacy</h3>
        <div className="space-y-4">
          <div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Change Password
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Last changed 30 days ago
            </p>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500">
                Add extra security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Login History
            </button>
          </div>
        </div>
      </section>

      {/* Transaction Settings */}
      <section className="mb-8 pb-6 border-b">
        <h3 className="text-xl font-semibold mb-4">Transaction Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Daily Transaction Limit
            </label>
            <select className="w-full md:w-auto rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="10000">₹10,000</option>
              <option value="25000">₹25,000</option>
              <option value="50000">₹50,000</option>
              <option value="100000">₹1,00,000</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Maximum amount you can send per day
            </p>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8 pb-6 border-b">
        <h3 className="text-xl font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-gray-500">
                Receive updates via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications({ ...notifications, email: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-gray-500">
                Get notified on your device
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) =>
                  setNotifications({ ...notifications, push: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">SMS Alerts</p>
              <p className="text-xs text-gray-500">
                Receive transaction alerts via SMS
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) =>
                  setNotifications({ ...notifications, sms: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="mb-8 pb-6 border-b">
        <h3 className="text-xl font-semibold mb-4">Appearance</h3>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <label
            htmlFor="theme"
            className="text-sm font-medium text-gray-700"
          >
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            className="w-full md:w-auto rounded-md border border-gray-300 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setTheme(e.target.value)}
            value={theme}
          >
            <option value="light">🌞 Light</option>
            <option value="dark">🌚 Dark</option>
            <option value="auto">🔄 Auto</option>
          </select>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="mb-8 pb-6 border-b">
        <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
        <div className="space-y-3">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Manage Bank Accounts
          </button>
          <button className="block text-blue-600 hover:text-blue-700 text-sm font-medium">
            Manage Cards
          </button>
          <button className="block text-blue-600 hover:text-blue-700 text-sm font-medium">
            UPI Settings
          </button>
        </div>
      </section>

      {/* Legal & About */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Legal & About</h3>
        <div className="space-y-3">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Terms of Service
          </button>
          <button className="block text-blue-600 hover:text-blue-700 text-sm font-medium">
            Privacy Policy
          </button>
          <button className="block text-blue-600 hover:text-blue-700 text-sm font-medium">
            About PayYou
          </button>
          <p className="text-xs text-gray-500 mt-4">Version 1.0.0</p>
        </div>
      </section>
    </div>
  );
};

export default Settings;
