import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { FaUpload, FaList, FaBars, FaTimes } from "react-icons/fa";

const AuthLayout = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile Hamburger Menu */}
      <button
        onClick={toggleDrawer}
        className={`md:hidden p-4 text-white bg-blue-700 fixed top-0 ${
          isDrawerOpen ? "left-64" : "left-0"
        } z-50`}
      >
        {isDrawerOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar / Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-blue-700 text-white flex flex-col p-4 transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:relative md:translate-x-0`}
      >
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <img src="/logo.png" alt="Logo" className="w-12 h-12" />
          <div className="text-white flex items-center">
            <span className="mr-4">Welcome, {username}</span>
          </div>
        </div>

        <nav className="flex flex-col gap-4">
          <NavLink
            to="/dashboard/upload"
            className={({ isActive }) =>
              `p-2 rounded-md flex items-center gap-2 ${
                isActive ? "bg-blue-500" : ""
              }`
            }
            onClick={toggleDrawer}
          >
            <FaUpload />
            Upload Files
          </NavLink>
          <NavLink
            to="/dashboard/list"
            className={({ isActive }) =>
              `p-2 rounded-md flex items-center gap-2 ${
                isActive ? "bg-blue-500" : ""
              }`
            }
            onClick={toggleDrawer}
          >
            <FaList />
            File List
          </NavLink>

          <button
            onClick={handleLogout}
            className="mt-auto bg-red-500 px-4 py-2 rounded-md text-white"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 max-w-full">
        {/* Main Content Rendered by Routes */}
        <Outlet />

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
      </div>
    </div>
  );
};

export default AuthLayout;
