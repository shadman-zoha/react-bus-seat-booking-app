import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SeatBookingForm() {
  const { busId, seatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Viewing a booked seat or if user is admin
  const isViewingBooked = location.state?.isViewingBooked || false;
  const isAdmin =
    location.state?.isAdmin ?? location.pathname.startsWith("/admin");

  // All state for form fields and bus data
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [busDestinations, setBusDestinations] = useState([]);
  const [busTimes, setBusTimes] = useState([]);
  const seatIds = seatId
    ? seatId.split(",").map((id) => String(id).trim())
    : [];

  const hasLoadedBusData = useRef(false);

  useEffect(() => {
    console.log("SeatBookingForm mounted with:", {
      busId,
      seatId,
      isViewingBooked,
      isAdmin,
      locationState: location.state,
      pathname: location.pathname,
    });
  }, []);

  useEffect(() => {
    if (hasLoadedBusData.current) {
      console.log("Bus data already loaded, skipping useEffect");
      return;
    }

    console.log("Loading bus data for busId:", busId);
    const allBuses = JSON.parse(localStorage.getItem("buses")) || [];
    const bus = allBuses.find((b) => b.id === Number(busId));
    if (bus) {
      const destinations = bus.routes
        ? bus.routes.split(", ").map((item) => item.trim())
        : [];
      const times = bus.times
        ? bus.times.split(", ").map((item) => item.trim())
        : [];
      setBusDestinations(destinations);
      setBusTimes(times);
      console.log("Bus found:", { destinations, times });

      if (isViewingBooked && seatIds.length === 1) {
        const seat = bus.seats.find((s) => s.number === seatIds[0]);
        if (seat && seat.booked && seat.details) {
          setName(seat.details.name || "");
          setDestination(seat.details.destination || "");
          setTime(seat.details.time || "");
          console.log(
            "Populated booking details for admin view:",
            seat.details
          );
        } else {
          console.warn("No valid booking details found for seat:", seatIds[0]);
          toast.warn("No booking details available for this seat.", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      }
    } else {
      console.error("Bus not found for busId:", busId);
      toast.error("Bus not found!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
    hasLoadedBusData.current = true;
  }, [busId, seatIds, isViewingBooked]);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted with:", { name, destination, time, seatIds });

    const allBuses = JSON.parse(localStorage.getItem("buses")) || [];
    const bus = allBuses.find((b) => b.id === Number(busId));

    if (!bus) {
      console.error("Bus not found during submission:", busId);
      toast.error("Bus not found!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Validate form fields
    if (!name.trim()) {
      console.warn("Validation failed: Missing passenger name");
      toast.warn("Please enter a passenger name!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (!destination) {
      console.warn("Validation failed: Missing destination");
      toast.warn("Please select a destination!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (!time) {
      console.warn("Validation failed: Missing departure time");
      toast.warn("Please select a departure time!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Validate seats
    let allSeatsValid = true;
    seatIds.forEach((sId) => {
      const seat = bus.seats.find((s) => s.number === sId);
      if (!seat) {
        console.error(`Seat ${sId} not found`);
        toast.error(`Seat ${sId} not found!`, {
          position: "top-center",
          autoClose: 3000,
        });
        allSeatsValid = false;
      } else if (seat.booked && !isViewingBooked) {
        console.error(`Seat ${sId} is already booked`);
        toast.error(`Seat ${sId} is already booked!`, {
          position: "top-center",
          autoClose: 3000,
        });
        allSeatsValid = false;
      }
    });

    if (!allSeatsValid) {
      console.warn("Seat validation failed, aborting booking");
      return;
    }

    // Book the seats
    seatIds.forEach((sId) => {
      const seat = bus.seats.find((s) => s.number === sId);
      seat.booked = true;
      seat.details = { name, destination, time };
    });

    localStorage.setItem("buses", JSON.stringify(allBuses));
    console.log("Booking successful, seats updated:", seatIds);
    toast.success("Seats booked successfully!", {
      position: "top-center",
      autoClose: 1500,
    });

    // Reset form fields
    setName("");
    setDestination("");
    setTime("");

    console.log("Attempting to navigate to main page (/)");
    setTimeout(() => {
      try {
        navigate("/", { replace: false });
        console.log("Navigation to main page triggered successfully");
      } catch (error) {
        console.error("Navigation to main page failed:", error);
        window.location.assign("/");
      }
    }, 1500);
  };

  // Handle navigation back to seat selection
  const handleBackToSeats = () => {
    const path = isAdmin ? `/admin/seats/${busId}` : `/seats/${busId}`;
    console.log("Attempting navigation to:", path, { isAdmin });
    try {
      navigate(path, { state: { selectedSeats: [], isAdmin } });
      console.log("Navigation to seat selection triggered successfully");
    } catch (error) {
      console.error("Navigation to seat selection failed:", error);
      window.location.assign(path);
    }
  };

  return (
    <div className="seat-booking-container">
      <div className="row justify-content-center">
        <div>
          <div className="card shadow rounded-4 border-0 p-1">
            <h3 className="text-center fw-bold mb-4 text-primary">
              {isViewingBooked ? "View Booking Details" : "Book Your Seat"}
            </h3>

            <button
              className="btn btn-outline-primary mb-4 modern-btn"
              onClick={handleBackToSeats}
            >
              Back to Seat Selection
            </button>

            <form
              onSubmit={handleSubmit}
              className="needs-validation"
              noValidate
            >
              <div className="form-group">
                <label className="form-label fw-semibold text-dark">
                  Passenger Name
                </label>
                <input
                  type="text"
                  className="form-control rounded-3 shadow-sm"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  readOnly={isViewingBooked}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">
                  Bus Number
                </label>
                <input
                  type="text"
                  className="form-control rounded-3 bg-light"
                  value={`Bus ${busId}`}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">
                  Seat Number
                </label>
                <input
                  type="text"
                  className="form-control rounded-3 bg-light"
                  value={seatIds.join(", ")}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">
                  Destination
                </label>
                <select
                  className="form-select rounded-3 shadow-sm"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  disabled={isViewingBooked}
                >
                  <option value="">Choose Destination</option>
                  {busDestinations.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-dark">
                  Departure Time
                </label>
                <select
                  className="form-select rounded-3 shadow-sm"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  disabled={isViewingBooked}
                >
                  <option value="">Choose Time</option>
                  {busTimes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {!isViewingBooked && (
                <button type="submit" className="btn btn-primary btn-submit">
                  Confirm Booking
                </button>
              )}
            </form>

            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatBookingForm;
