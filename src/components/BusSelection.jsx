import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_BUSES } from "./constants";

function BusSelection() {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);

  // Load buses from thee localStorage
  useEffect(() => {
    let allBuses = JSON.parse(localStorage.getItem("buses"));
    if (!allBuses) {
      allBuses = DEFAULT_BUSES;
      localStorage.setItem("buses", JSON.stringify(allBuses));
    }
    setBuses(allBuses);
  }, []);

  // handle the bus selection
  const handleBusSelect = (busId) => {
    navigate(`/seats/${busId}`);
  };

  return (
    <div className="modern-bus-selection-container min-h-screen flex items-center justify-center">
      <div className="modern-bus-selection-card shadow border-0 rounded-4 p-4">
        <h2 className="text-center fw-bold mb-4 modern-bus-selection-title">
          Select Your Bus
        </h2>
        <div className="modern-bus-selection-list mb-4">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className="modern-bus-selection-item mb-3 p-3 rounded-lg shadow-md bg-light"
            >
              <h5 className="fw-bold mb-2">{bus.name}</h5>
              <p className="mb-1">
                <strong>Routes:</strong> {bus.routes || "Not set"}
              </p>
              <p className="mb-1">
                <strong>Times:</strong> {bus.times || "Not set"}
              </p>
              <button
                className="modern-bus-selection-btn rounded-full mt-2"
                onClick={() => handleBusSelect(bus.id)}
              >
                <span className="modern-btn-icon">🚍</span>
                <span>Select Bus</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BusSelection;
