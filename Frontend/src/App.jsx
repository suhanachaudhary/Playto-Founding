
import { useState } from "react";
import Login from "./pages/Login";
import MerchantForm from "./pages/MerchantForm";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import {
  getUser, logout1
} from "./auth";
import { Toaster } from "react-hot-toast";

import MerchantDashboard from "./pages/MerchantDashboard";


import Navbar from "./pages/Navbar";

export default function App() {

  const [user, setUser] = useState(getUser());

  const handleLogout = () => {
    logout1();
    setUser(null);
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="h-screen flex mb-28">
        {user.role === "merchant" ? (
          <div className="w-full 
          bg-white 
          shadow-lg 
          p-6 
          border-b 
          lg:border-b-0 
          lg:border-r">
            <MerchantDashboard user={user} />
          </div>
        ) : (
          <div className="
          w-full 
          p-6 
          md:p-20
          mb-24
        ">
            <ReviewerDashboard user={user} />
          </div>
        )}
      </div>
    </>
  );
}
