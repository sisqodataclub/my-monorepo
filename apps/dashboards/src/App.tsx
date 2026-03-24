import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OverviewPage from './pages/OverviewPage';
import InquiriesPage from './pages/InquiriesPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow p-4">
          <div className="container mx-auto flex space-x-6">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              Overview
            </Link>
            <Link to="/inquiries" className="text-blue-600 hover:text-blue-800 font-medium">
              Inquiries
            </Link>
          </div>
        </nav>
        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/inquiries" element={<InquiriesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
