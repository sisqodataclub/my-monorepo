import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import {
  LayoutDashboard, MessageSquare, Settings, Bell, Search,
  Calendar, FileText, Menu, X
} from 'lucide-react';

import OverviewPage from './pages/OverviewPage';
import InquiriesPage from './pages/InquiriesPage';
import LoginPage from './pages/LoginPage';
import BookingsPage from './pages/BookingsPage';
import InvoicesPage from './pages/InvoicesPage';

// -------------------------------------------------------------------
// Type definitions for component props
// -------------------------------------------------------------------
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface TopbarProps {
  toggleSidebar: () => void;
}

// -------------------------------------------------------------------
// Sidebar Component
// -------------------------------------------------------------------
function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Bookings', path: '/bookings', icon: Calendar },
    { name: 'Invoices', path: '/invoices', icon: FileText },
    { name: 'Inquiries', path: '/inquiries', icon: MessageSquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out shadow-2xl
        md:relative md:translate-x-0 md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Branding & Mobile Close */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <h1 className="text-xl font-bold tracking-wider">
            DDEEP<span className="text-blue-500">HQ</span>
          </h1>
          <button
            className="md:hidden p-1 -mr-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* System Status Indicator */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-800/50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-sm font-medium text-slate-400">System Online</span>
          </div>
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------------
// Topbar Component
// -------------------------------------------------------------------
function Topbar({ toggleSidebar }: TopbarProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Hamburger Menu */}
        <button
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-md items-center text-slate-400 focus-within:text-slate-600 relative group">
          <Search className="w-5 h-5 absolute left-3 pointer-events-none transition-colors group-focus-within:text-blue-500" />
          <input
            type="text"
            placeholder="Search operations..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Mobile Search */}
        <button className="sm:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="h-9 w-9 flex items-center justify-center ring-2 ring-slate-100 rounded-full hover:ring-blue-100 transition-all cursor-pointer ml-2">
          <UserButton afterSignOutUrl="/login" />
        </div>
      </div>
    </header>
  );
}

// -------------------------------------------------------------------
// Main App Component
// -------------------------------------------------------------------
export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={
            <SignedOut>
              <LoginPage />
            </SignedOut>
          }
        />

        {/* Secure Routes */}
        <Route
          path="/*"
          element={
            <>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>

              <SignedIn>
                <div className="flex h-screen bg-slate-50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                  <div className="flex-1 flex flex-col overflow-hidden relative">
                    <Topbar toggleSidebar={() => setIsSidebarOpen(true)} />

                    {/* Main Content */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                      <div className="max-w-7xl mx-auto pb-12">
                        <Routes>
                          <Route path="/" element={<OverviewPage />} />
                          <Route path="bookings" element={<BookingsPage />} />
                          <Route path="invoices" element={<InvoicesPage />} />
                          <Route path="inquiries" element={<InquiriesPage />} />
                        </Routes>
                      </div>
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
