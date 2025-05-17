import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Seat from "./Seat";
import { DEFAULT_BUSES } from "./constants";

function SeatUI({ isAdmin = false }) {
  const { busId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const toastShownRef = useRef(false);

  // Reset selectedSeats when navigating to this component
  useEffect(() => {
    const initialSeats =
      location.state?.selectedSeats?.map((id) => String(id).trim()) || [];
    setSelectedSeats(initialSeats);
    console.log("Initialized Selected Seats in SeatUI:", initialSeats);
  }, [location.state]);

  // Load bus data
  useEffect(() => {
    let allBuses = JSON.parse(localStorage.getItem("buses"));
    if (!allBuses) {
      allBuses = DEFAULT_BUSES;
      localStorage.setItem("buses", JSON.stringify(allBuses));
    }

    const currentBusId = Number(busId) || 1;
    const bus = allBuses.find((b) => b.id === currentBusId) || allBuses[0];

    const transformedSeats = bus.seats.map((seat, index) => {
      const row = Math.floor(index / 3);
      const col = (index % 3) + 1;
      const rowLabel = String.fromCharCode(65 + row);
      const newSeatNumber = `${rowLabel}${col}`;
      return { ...seat, number: newSeatNumber };
    });
    setSeats(transformedSeats);
    console.log("Transformed Seats:", transformedSeats);
  }, [busId]);

  // Handle seat click
  const handleSeatClick = (seatNumber) => {
    const seat = seats.find((s) => s.number === String(seatNumber));
    if (!seat) {
      toast.error(`Seat ${seatNumber} not found!`, {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (seat.booked) {
      if (isAdmin) {
        console.log("Admin viewing booked seat:", seatNumber);
        try {
          navigate(`/book/${busId}/${seatNumber}`, {
            state: {
              selectedSeats: [String(seatNumber)],
              isViewingBooked: true,
              isAdmin: true,
            },
          });
          console.log("Navigation to booking form triggered successfully");
        } catch (error) {
          console.error("Navigation to booking form failed:", error);
          window.location.assign(`/book/${busId}/${seatNumber}`);
        }
      } else {
        toast.info(`Seat ${seat.number} is already booked.`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
      return;
    }

    setSelectedSeats((prev) => {
      const newSelection = prev.includes(String(seatNumber))
        ? prev.filter((s) => s !== String(seatNumber))
        : [...prev, String(seatNumber)];
      if (newSelection.length > 4) {
        if (!toastShownRef.current) {
          toast.warn("You can select up to 4 seats only!", {
            position: "top-center",
            autoClose: 3000,
          });
          toastShownRef.current = true;
          setTimeout(() => {
            toastShownRef.current = false;
          }, 3000);
        }
        return prev;
      }
      return newSelection;
    });
  };

  // Handle "Continue to Booking"
  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      toast.warn("Please select at least one seat!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    console.log("Navigating to booking form with seats:", selectedSeats);
    try {
      navigate(`/book/${busId}/${selectedSeats.join(",")}`, {
        state: { selectedSeats, isAdmin },
      });
      console.log("Navigation to booking form triggered successfully");
    } catch (error) {
      console.error("Navigation to booking form failed:", error);
      window.location.assign(`/book/${busId}/${selectedSeats.join(",")}`);
    }
  };

  // Render the bus layout
  const renderBusLayout = () => {
    const elements = [];
    const rows = 5;
    const seatsPerRow = 3;

    elements.push(
      <div key="driver-seat" className="driver-seat modern-driver-seat">
        <img
          src="/driver.png"
          alt="Driver Seat"
          style={{ width: "40px", height: "40px" }}
        />
      </div>
    );

    for (let row = 0; row < rows; row++) {
      const startIdx = row * seatsPerRow;
      const rowSeats = seats.slice(startIdx, startIdx + seatsPerRow);

      const filledRowSeats = [...rowSeats];
      while (filledRowSeats.length < seatsPerRow) {
        filledRowSeats.push({ number: "", booked: false, details: null });
      }

      const leftSeat = filledRowSeats[0];
      const rightSeats = filledRowSeats.slice(1, 3);

      elements.push(
        <Seat
          key={`left-${row}`}
          seatNumber={String(leftSeat.number)}
          isBooked={leftSeat.booked}
          isSelected={selectedSeats.includes(String(leftSeat.number))}
          onClick={() => leftSeat.number && handleSeatClick(leftSeat.number)}
          isAisle={false}
          className="modern-seat"
        />
      );

      elements.push(
        <Seat key={`aisle-${row}`} isAisle={true} className="modern-aisle" />
      );

      rightSeats.forEach((seat, idx) => {
        elements.push(
          <Seat
            key={`right-${row}-${idx}`}
            seatNumber={String(seat.number)}
            isBooked={seat.booked}
            isSelected={selectedSeats.includes(String(seat.number))}
            onClick={() => seat.number && handleSeatClick(seat.number)}
            isAisle={false}
            className="modern-seat"
          />
        );
      });
    }

    return elements;
  };

  return (
    <div className="modern-seat-ui-wrapper">
      <style>
        {`
          .custom-button-container {
            display: flex;
            justify-content: center;
            margin-top: 1.5rem;
          }
          .custom-button {
            background: linear-gradient(to right, #00c6ff, #0072ff);
            color: white;
            border: 2px solid #00cc00;
            border-radius: 50px;
            padding: 0.5rem 1.5rem;
            font-size: 1rem;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0;
          }
          .custom-button:hover {
            background: linear-gradient(to right, #00b4e6, #0066e6);
            color: white;
            text-decoration: none;
          }
          .custom-button + .custom-button {
            margin-left: -2px; /* Overlap borders to remove gap */
          }
        `}
      </style>
      <div className="container mt-4 modern-container">
        <h2 className="text-center mb-4 modern-title">
          Bus {busId} - {isAdmin ? "Seat Selection" : "Pick a Seat"}
        </h2>

        <div className="seat-ui-content">
          <div className="bus-container shadow-sm bg-white rounded modern-bus-container">
            {renderBusLayout()}
          </div>
          <div className="seat-legend-card">
            <h3 className="legend-title">Seat Status</h3>
            <div className="legend-item">
              <div className="legend-color legend-available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-booked"></div>
              <span>Booked</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-selected"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
        <div className="custom-button-container">
          <Link to="/" className="custom-button">
            Homepage
          </Link>
          <button className="custom-button" onClick={handleContinue}>
            Continue to Booking
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default SeatUI;
