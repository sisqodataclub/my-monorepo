

import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboard, MessageSquare, Settings, Bell, Search } from 'lucide-react';

import OverviewPage from './pages/OverviewPage';
import InquiriesPage from './pages/InquiriesPage';
import LoginPage from './pages/LoginPage';
import BookingsPage from './pages/BookingsPage';

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Bookings', path: '/bookings', icon: Calendar },
    { name: 'Inquiries', path: '/inquiries', icon: MessageSquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-wider">DDEEP<span className="text-blue-500">HQ</span></h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Topbar() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center text-gray-400 focus-within:text-gray-600">
        <Search className="w-5 h-5 absolute ml-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search bookings, clients..."
          className="pl-10 pr-4 py-2 border-none rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 md:w-96"
        />
      </div>
      <div className="flex items-center space-x-6">
        <button className="text-gray-400 hover:text-gray-600 relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* CLERK: Drop-in User Profile & Settings Menu */}
        <div className="h-8 w-8 flex items-center justify-center">
          <UserButton afterSignOutUrl="/login" />
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTE: The Login Screen */}
        <Route 
          path="/login" 
          element={
            <SignedOut>
              <LoginPage />
            </SignedOut>
          } 
        />

        {/* SECURE ROUTES: Protected Dashboard */}
        <Route
          path="/*"
          element={
            <>
              {/* Security Wall: Kick unauthenticated users back to login */}
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>

              {/* Secure Area: Only renders if Clerk verifies the user */}
              <SignedIn>
                <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
                  <Sidebar />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Topbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                      <Routes>
                        <Route path="/" element={<OverviewPage />} />
			<Route path="bookings" element={<BookingsPage />} />

                        <Route path="/inquiries" element={<InquiriesPage />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </SignedIn>
            </>
          }
        />
      </Routes>
    </Router>
  );
}
