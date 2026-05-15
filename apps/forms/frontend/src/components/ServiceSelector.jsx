// src/components/ServiceSelector.jsx
import React, { useEffect, useState } from "react";
import GlassLayout from "./ui/GlassLayout";
import { getServices } from "../lib/api"; 

const ServiceSelector = ({ value, setValue }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCleaningServices = async () => {
      try {
        // ✅ The backend now handles the filtering via the query string
        const data = await getServices("?category_name=cleaning_services");
        
        // Safely extract the array (handling DRF pagination if present)
        const servicesArray = Array.isArray(data) ? data : data.results || [];

        // No more frontend .filter() needed! We just set the state directly.
        setServices(servicesArray);
      } catch (err) {
        console.error("Failed to fetch cleaning services:", err);
        setError("Could not load services. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCleaningServices();
  }, []);

  if (loading) {
    return (
      <GlassLayout title="Choose Your Service" subtitle="Loading available services...">
        <div className="text-white text-center py-8 animate-pulse">Loading...</div>
      </GlassLayout>
    );
  }

  if (error) {
    return (
      <GlassLayout title="Choose Your Service" subtitle="Something went wrong">
        <div className="text-red-400 text-center py-8 bg-red-900/20 rounded-lg border border-red-500/30">
          {error}
        </div>
      </GlassLayout>
    );
  }

  if (services.length === 0) {
    return (
      <GlassLayout title="Choose Your Service" subtitle="No services found">
        <div className="text-yellow-400 text-center py-8">
          No cleaning services available at the moment.
        </div>
      </GlassLayout>
    );
  }

  return (
    <GlassLayout
      title="Choose Your Service"
      subtitle="Select the cleaning service you need to get started."
    >
      <div className="flex flex-col gap-4">
        {services.map((service) => {
          const active = value === service.name;

          return (
            <label
              key={service.id}
              className={`
                relative cursor-pointer select-none
                p-4 sm:p-5 rounded-2xl
                flex items-start gap-3
                transition-all duration-300
                ${
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-800/60 text-gray-200 hover:bg-gray-700"
                }
              `}
            >
              <div className="flex flex-col flex-1">
                <span className="text-sm sm:text-lg font-medium">
                  {service.name}
                </span>
                {/* Optional: Add price display here just like we did for AreaSelection */}
                {service.price_fixed && (
                  <span className={`text-xs mt-0.5 ${active ? 'text-blue-200' : 'text-gray-400'}`}>
                    From £{service.price_fixed}
                  </span>
                )}
              </div>

              <input
                type="radio"
                checked={active}
                onChange={() => setValue(service.name)}
                className="mt-1 w-5 h-5 accent-blue-400 relative z-10"
              />

              {active && (
                <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl animate-pulse pointer-events-none" />
              )}
            </label>
          );
        })}
      </div>
    </GlassLayout>
  );
};

export default ServiceSelector;
