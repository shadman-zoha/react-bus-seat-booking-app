import React from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate("/buses");
  };

  const handleAdminClick = () => {
    navigate("/admin");
  };

  return (
    <div className="modern-main-page-container min-h-screen flex items-center justify-center">
      <div className="modern-main-card shadow border-0 rounded-4 p-6">
        <h2 className="text-center fw-bold mb-4 modern-main-title">
          Selise Employee Bus Seat Booking App
        </h2>
        <p className="text-center mb-6 modern-main-subtitle">
          Choose your role to proceed
        </p>
        <div className="modern-main-buttons d-flex justify-content-center gap-4">
          <button
            className="modern-main-btn modern-user-btn rounded-full"
            onClick={handleUserClick}
          >
            <span className="modern-btn-icon">👤</span>
            <span>User</span>
          </button>
          <button
            className="modern-main-btn modern-admin-btn rounded-full"
            onClick={handleAdminClick}
          >
            <span className="modern-btn-icon">🛡️</span>
            <span>Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
