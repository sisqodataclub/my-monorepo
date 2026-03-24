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
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="relative z-0 bg-primary min-h-screen text-white">
      {/* Top Section: Selection Menu */}
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center min-h-[80vh] flex flex-col items-center justify-center pb-20 pt-24">
        
        {!showContact ? (
          <>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center px-4">
              What type of service do you need?
            </h1>

            <div className="flex flex-col gap-6 max-w-4xl px-6 w-full">
              {/* Option 1: Domestic -> Links to /form */}
              <Link
                to="/form"
                className="w-full bg-[#1d1836] border-[2px] border-[#915EFF] hover:bg-[#915EFF] hover:bg-opacity-20 transition-all duration-300 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between text-left cursor-pointer shadow-[0_0_20px_rgba(145,94,255,0.15)] hover:shadow-[0_0_30px_rgba(145,94,255,0.4)]"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Domestic Cleaning</h2>
                  <ul className="text-gray-300 text-base md:text-lg leading-relaxed list-disc list-inside marker:text-[#915EFF] space-y-2">
                    <li>Home/House Cleaning services</li>
                    <li>Carpet Cleaning</li>
                    <li>Appliances Cleaning</li>
                  </ul>
                </div>
                <div className="mt-6 md:mt-0 flex-shrink-0">
                  <span className="inline-block bg-[#915EFF] text-white font-bold py-3 px-8 rounded-xl shadow-lg">
                    Book Now
                  </span>
                </div>
              </Link>

              {/* Option 2: Commercial -> Shows Contact */}
              <div
                onClick={() => setShowContact(true)}
                className="w-full bg-[#1d1836] border-[2px] border-[#00C6FF] hover:bg-[#00C6FF] hover:bg-opacity-20 transition-all duration-300 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between text-left cursor-pointer shadow-[0_0_20px_rgba(0,198,255,0.15)] hover:shadow-[0_0_30px_rgba(0,198,255,0.4)]"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Commercial Cleaning</h2>
                  <ul className="text-gray-300 text-base md:text-lg leading-relaxed list-disc list-inside marker:text-[#00C6FF] space-y-2">
                    <li>Commercial & Offices</li>
                    <li>Bars & Restaurants</li>
                    <li>Retail Spaces</li>
                  </ul>
                </div>
                <div className="mt-6 md:mt-0 flex-shrink-0">
                  <span className="inline-block bg-[#00C6FF] text-white font-bold py-3 px-8 rounded-xl shadow-lg">
                    Get a Quote
                  </span>
                </div>
              </div>

              {/* Option 3: Additional Services -> Shows Contact */}
              <div
                onClick={() => setShowContact(true)}
                className="w-full bg-[#1d1836] border-[2px] border-[#10B981] hover:bg-[#10B981] hover:bg-opacity-20 transition-all duration-300 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between text-left cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Additional Services</h2>
                  <ul className="text-gray-300 text-base md:text-lg leading-relaxed list-disc list-inside marker:text-[#10B981] space-y-2">
                    <li>Man and Van</li>
                    <li>Rubbish Removal</li>
                    <li>Other inquiries</li>
                  </ul>
                </div>
                <div className="mt-6 md:mt-0 flex-shrink-0">
                  <span className="inline-block bg-[#10B981] text-white font-bold py-3 px-8 rounded-xl shadow-lg">
                    Get a Quote
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Contact Section - Replaces the cards entirely when shown */
          <div className="w-full max-w-6xl px-4 flex flex-col items-center">
            <button 
              onClick={() => setShowContact(false)}
              className="self-start mb-6 text-gray-300 hover:text-white flex items-center gap-2 transition-colors text-lg font-bold bg-white/5 px-6 py-2 rounded-full border border-white/10 shadow-lg hover:bg-white/10 z-10"
            >
              ← Back to Services
            </button>
            
            <div className="relative z-0 w-full bg-[#100d25] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <Contact />
              <StarsCanvas />
            </div>
          </div>
        )}
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
