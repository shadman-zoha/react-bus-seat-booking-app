import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import BusSelection from "./components/BusSelection";
import AdminPanel from "./components/AdminPanel";
import SeatUI from "./components/SeatUI";
import SeatBookingForm from "./components/SeatBookingForm";

// Error Boundary to catch thee unhandled errors
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong: {this.state.error?.message}</h1>;
    }
    return this.props.children;
  }
}

function App() {
  console.log("App rendered with BrowserRouter");

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/buses" element={<BusSelection />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/seats/:busId" element={<SeatUI isAdmin={false} />} />
          <Route
            path="/admin/seats/:busId"
            element={<SeatUI isAdmin={true} />}
          />
          <Route path="/book/:busId/:seatId" element={<SeatBookingForm />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
