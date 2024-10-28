import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import GuestLayout from "./components/layouts/GuestLayout";
import AuthLayout from "./components/layouts/AuthLayout";

// Route guard for protected routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Non-authenticated routes wrapped with GuestLayout */}
        <Route
          path="/login"
          element={
            <GuestLayout>
              <Login />
            </GuestLayout>
          }
        />
        <Route
          path="/register"
          element={
            <GuestLayout>
              <Register />
            </GuestLayout>
          }
        />

        {/* Authenticated routes wrapped with AuthLayout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AuthLayout />
            </PrivateRoute>
          }
        >
          {/* Nested routes for dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<FileUpload />} />
          <Route path="list" element={<FileList />} />
        </Route>

        {/* Redirect to dashboard if already authenticated */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navigate to="/dashboard" />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
