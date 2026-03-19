import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import Logout from "./components/Logout";
import BlogPost from "./pages/BlogPost";

import AreaSelectionPage from "./pages/AreaSelectionPage";
import QuantitySelectionPage from "./pages/QuantitySelectionPage";
import PersonalDetailsPage from "./pages/PersonalDetailsPage";
import ReviewAndSubmit from "./pages/ReviewAndSubmit";
import BookingWizard from "./pages/BookingWizard";
import PerfumeAnalyticsDashboard from "./pages/Dashboard";
import ManVanAnalyticsDashboard from "./pages/ManVanAnalyticsDashboard";

import {
  About,
  Contact,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
} from "./components";

// Optional: Register wrapper that clears any existing tokens
function RegisterAndLogout() {
  localStorage.clear(); // Clear token if someone manually goes to /register
  return <Register />;
}

function Home() {
  return (
    <div className="relative z-0 bg-primary min-h-screen">
      
      {/* Top Section: Navbar and Button grouped together */}
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center pb-32">
        
        {/* The Button sits right under the Navbar now */}
        <div className="flex justify-center items-center pt-24 relative z-10">
          <Link
            to="/form"
            className="bg-[#915EFF] hover:bg-[#7a4aea] text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-all text-xl"
          >
            Book a cleaning Service
          </Link>
        </div>
      </div>

      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
      </div>
    </div>
  );
}

const App = () => {
  // State for the multi-page form
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [details, setDetails] = useState({ name: "", email: "", phone: "" });

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public + Home */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* Multi-Page Form Routes */}
          <Route
            path="/form/areass"
            element={
              <AreaSelectionPage
                selectedAreas={selectedAreas}
                setSelectedAreas={setSelectedAreas}
              />
            }
          />
          <Route
            path="/form/quantities"
            element={
              <QuantitySelectionPage
                selectedAreas={selectedAreas}
                quantities={quantities}
                setQuantities={setQuantities}
              />
            }
          />

          <Route
            path="/form/details"
            element={
              <PersonalDetailsPage
                details={details}
                setDetails={setDetails}
              />
            }
          />

          <Route
            path="/form/submit"
            element={
              <ReviewAndSubmit
                selectedAreas={selectedAreas}
                quantities={quantities}
                details={details}
              />
            }
          />

          <Route path="/form" element={<BookingWizard />} />
          <Route path="/dashboard" element={<PerfumeAnalyticsDashboard />} />
          <Route path="/manvan" element={<ManVanAnalyticsDashboard />} />

          {/* Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Navbar />
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/blog" element={
            <ProtectedRoute>
              <div className="bg-primary z-0 min-h-screen text-white">
                <Navbar />
                <Blog />
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
