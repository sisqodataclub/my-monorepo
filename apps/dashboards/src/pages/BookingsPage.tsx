import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { CalendarDays, AlertCircle, FileText, Search } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

export default function BookingsPage() {
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://core.franciscodes.com';
        
        // We ask Django specifically for Chart ID 3
        const queryParams = new URLSearchParams({ chart_ids: '3' });
        
        const response = await axios.get(`${API_BASE}/api/v1/dashboard/overview/?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Extract the data array specifically for chart '3'
        const chart3Data = response.data.superset_charts?.['3'];
        
        if (chart3Data && Array.isArray(chart3Data)) {
          setTableData(chart3Data);
        } else {
          setTableData([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching table data:', err);
        setError('Failed to load table data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [getToken]);

  // Extract dynamic headers from the first row of data
  const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  // --- Animation Variants ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // --- Smart Cell Formatter ---
  const renderCell = (key: string, value: any) => {
    if (value === null || value === undefined) return <span className="text-slate-400">-</span>;
    
    const lowerKey = key.toLowerCase();

    // 1. Status Badges
    if (lowerKey.includes('status') || lowerKey.includes('state')) {
      const statusStr = String(value).toLowerCase();
      let colorClass = 'bg-slate-100 text-slate-700';
      
      if (['paid', 'confirmed', 'completed', 'active', 'success'].some(s => statusStr.includes(s))) {
        colorClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';
      } else if (['pending', 'requested', 'processing'].some(s => statusStr.includes(s))) {
        colorClass = 'bg-amber-50 text-amber-700 border border-amber-200/50';
      } else if (['failed', 'cancelled', 'refunded'].some(s => statusStr.includes(s))) {
        colorClass = 'bg-rose-50 text-rose-700 border border-rose-200/50';
      }

      return (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${colorClass}`}>
          {value}
        </span>
      );
    }

    // 2. Dates
    if (lowerKey.includes('date') || lowerKey.includes('time') || lowerKey.includes('created') || lowerKey.includes('updated')) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return (
          <div className="flex items-center text-slate-600">
            <CalendarDays className="w-3.5 h-3.5 mr-2 text-slate-400" />
            {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        );
      }
    }

    // 3. Currency / Prices
    if (lowerKey.includes('price') || lowerKey.includes('total') || lowerKey.includes('amount')) {
      const num = Number(value);
      if (!isNaN(num)) {
        return <span className="font-semibold text-slate-900">${num.toFixed(2)}</span>;
      }
    }

    // 4. Default Text
    return <span className="text-slate-600 font-medium">{String(value)}</span>;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100/50 to-slate-50 pt-6">
      <motion.div 
        className="max-w-[90rem] mx-auto pb-16 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* --- PAGE HEADER --- */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Records Registry</h1>
            </div>
            <p className="text-sm font-medium text-slate-500">Live data synchronized from Superset</p>
          </div>

          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 w-full placeholder:text-slate-400"
            />
          </div>
        </motion.div>

        {/* --- MAIN TABLE AREA --- */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          
          {loading ? (
            // Premium Skeleton Loader
            <div className="p-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center space-x-4 mb-6 last:mb-0 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error State
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="bg-rose-50 p-4 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Failed to load data</h3>
              <p className="text-sm font-medium text-slate-500 max-w-sm">{error}</p>
            </div>
          ) : tableData.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No records found</h3>
              <p className="text-sm font-medium text-slate-500 max-w-sm">There is no data available in this Superset chart yet.</p>
            </div>
          ) : (
            // Data Table
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    {headers.map((header, idx) => (
                      <th 
                        key={idx} 
                        className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest whitespace-nowrap"
                      >
                        {header.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tableData.map((row, rowIndex) => (
                    <tr 
                      key={rowIndex} 
                      className="hover:bg-slate-50/50 transition-colors duration-150 group"
                    >
                      {headers.map((header, colIndex) => (
                        <td 
                          key={colIndex} 
                          className="px-6 py-4 whitespace-nowrap text-sm"
                        >
                          {renderCell(header, row[header])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Table Footer / Pagination Area */}
          {!loading && tableData.length > 0 && (
            <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Showing {tableData.length} records
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
