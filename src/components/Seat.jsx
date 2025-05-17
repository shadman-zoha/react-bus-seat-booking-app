import React from "react";

function Seat({ seatNumber, isBooked, isSelected, onClick, isAisle }) {
  if (isAisle) {
    return <div className="seat aisle"></div>;
  }

  return (
    <div
      className={`seat ${
        isBooked
          ? "seat-booked"
          : isSelected
          ? "seat-selected"
          : "seat-available"
      }`}
      onClick={() => onClick(seatNumber)}
    >
      {seatNumber}
    </div>
  );
}

export default Seat;
