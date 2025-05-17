import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { DESTINATIONS, TIMES, DEFAULT_BUSES } from "./constants";

// Admin panel to select bus and the seat detials
function AdminPanel() {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState("");

  // Load buses from localStorage
  useEffect(() => {
    let allBuses = JSON.parse(localStorage.getItem("buses"));
    if (!allBuses) {
      allBuses = DEFAULT_BUSES;
    } else {
      allBuses = allBuses.map((bus) => ({
        ...bus,
        routes: bus.routes || DESTINATIONS.join(", "),
        times: bus.times || TIMES.join(", "),
      }));
    }
    localStorage.setItem("buses", JSON.stringify(allBuses));
    setBuses(allBuses);
    if (busId && busId !== selectedBusId) {
      setSelectedBusId(busId);
    }
  }, [busId, selectedBusId]);

  // handle the bus selection
  const handleBusChange = useCallback((event) => {
    const newBusId = event.target.value;
    setSelectedBusId(newBusId);
    console.log(`Bus selected: ${newBusId}`);
  }, []);

  // handle continue to seat selection
  const handleContinue = useCallback(() => {
    if (selectedBusId) {
      console.log(`Navigating to /admin/seats/${selectedBusId}`);
      navigate(`/admin/seats/${selectedBusId}`, { replace: false });
    } else {
      console.warn("No bus selected for navigation");
    }
  }, [navigate, selectedBusId]);

  // selected bus info
  const selectedBus = buses.find((b) => b.id === Number(selectedBusId));
  const totalSeats = selectedBus?.seats.length || 0;
  const bookedSeats = selectedBus?.seats.filter((s) => s.booked).length || 0;
  const availableSeats = totalSeats - bookedSeats;

  return (
    <div className="admin-panel-container">
      <div className="card shadow border-0 rounded-4">
        <div className="card-header bg-gradient-primary text-white py-3 px-4 rounded-top-4">
          <h3 className="mb-0 fw-bold">🚌 Admin Panel Bus Booking</h3>
          <p className="mb-0 small text-light-emphasis">
            Manage seat bookings by selecting a bus
          </p>
        </div>
        <div className="card-body px-4 pb-4">
          <div className="mb-4">
            <label className="form-label fw-semibold">Select a Bus:</label>
            <select
              className="form-select shadow-sm rounded-pill"
              value={selectedBusId}
              onChange={handleBusChange}
            >
              <option value="">-- Choose a Bus --</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  Bus {bus.id}
                </option>
              ))}
            </select>
          </div>

          {selectedBus && (
            <div className="mb-4 p-3 border rounded shadow-sm bg-light">
              <h5 className="fw-bold mb-2">{selectedBus.name}</h5>
              <p className="mb-1">
                <strong>Routes:</strong> {selectedBus.routes || "Not set"}
              </p>
              <p className="mb-1">
                <strong>Times:</strong> {selectedBus.times || "Not set"}
              </p>
              <p className="mb-1">
                <strong>Total Seats:</strong> {totalSeats}
              </p>
              <p className="mb-1">
                <strong>Booked Seats:</strong> {bookedSeats}
              </p>
              <p className="mb-0">
                <strong>Available Seats:</strong> {availableSeats}
              </p>
            </div>
          )}

          {selectedBusId && (
            <button
              className="btn btn-outline-primary mb-4"
              onClick={handleContinue}
            >
              Continue to Seat Selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
