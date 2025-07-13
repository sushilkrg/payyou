import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "dashboard" },
  { label: "Send Money", path: "send-money" },
  { label: "Add Money", path: "add-money" },
  // { label: "Wallet", path: "wallet" },
  { label: "Profile", path: "profile" },
  { label: "Transactions", path: "transactions" },
  { label: "Settings", path: "settings" },
  { label: "Support", path: "support" },
  // { label: "Generate", path: "generate" },
];

const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const user = useSelector(store => store.auth.user);

  const navigate = useNavigate();

  const handleToggle = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    if (!user || !user?.walletId) {
      navigate("generate");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen container mx-auto">
      {/* Top Navbar with Hamburger on mobile */}
      <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-700">
        <h1 className="text-lg font-semibold">{activeTab}</h1>
        <button onClick={handleToggle} aria-label="Toggle Sidebar" className="cursor-pointer">
          <FaBars className="text-2xl" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
        {/* Sidebar */}
        <aside
          className={`fixed md:static bg-white top-0 left-0 h-full z-50 w-[200px]  border-r border-gray-700 transform ${showSidebar ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="pt-16 md:pt-1 pl-4 text-sm font-semibold ">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  navigate(item.path)
                  setShowSidebar(false);
                }}
                className={`block w-full border-b border-gray-400 text-left px-2 py-3 cursor-pointer hover:bg-gray-200 ${activeTab === item.label ? "bg-gray-600 text-white hover:bg-gray-600" : ""
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
