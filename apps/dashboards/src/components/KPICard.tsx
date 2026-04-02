import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export interface KPI {
  id?: string;
  title: string;
  value: string | number;
  change: number;
  prefix?: string;
}

interface KPICardProps {
  kpi: KPI;
  index?: number; // We use this to stagger the animations!
}

export default function KPICard({ kpi, index = 0 }: KPICardProps) {
  const isPositive = kpi.change > 0;
  const isNegative = kpi.change < 0;
  
  return (
    <motion.div
      // 1. The Entrance Animation (Fades in and slides up)
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1, // Each card waits slightly longer than the last
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      // 2. The Hover Animation (Floats up slightly and casts a softer, wider shadow)
      whileHover={{ 
        y: -4,
        scale: 1.01,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)"
      }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden cursor-default"
    >
      <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">{kpi.title}</h3>
      
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-bold text-gray-900 tracking-tight">
          {kpi.prefix}{kpi.value}
        </p>
        
        {/* 3. The Badge Animation (A subtle spring pop) */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: (index * 0.1) + 0.2, 
            type: "spring", 
            stiffness: 250, 
            damping: 15 
          }}
          className={`flex items-center text-sm font-medium px-2.5 py-1 rounded-full ${
            isPositive ? 'bg-emerald-50 text-emerald-700' : 
            isNegative ? 'bg-rose-50 text-rose-700' : 'bg-gray-50 text-gray-700'
          }`}
        >
          {isPositive && <ArrowUpRight className="w-4 h-4 mr-1" />}
          {isNegative && <ArrowDownRight className="w-4 h-4 mr-1" />}
          {!isPositive && !isNegative && <Minus className="w-4 h-4 mr-1" />}
          {Math.abs(kpi.change)}%
        </motion.div>
      </div>
      
      <p className="text-xs text-gray-400 mt-4 font-medium">vs. previous 30 days</p>
    </motion.div>
  );
}
