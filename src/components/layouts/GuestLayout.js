import React from "react";
import { Link } from "react-router-dom";

const GuestLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Logo */}
      <div className="mb-6">
        <img src="/logo.png" alt="Logo" className="w-32 h-32" />
      </div>

      {/* Content */}
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default GuestLayout;
