// src/components/ServiceSelector.jsx
import React from "react";
import GlassLayout from "./ui/GlassLayout";

const ServiceSelector = ({ value, setValue, cleaningServices }) => {
  return (
    <GlassLayout
      title="Choose Your Service"
      subtitle="Select the cleaning service you need to get started."
    >
      <div className="flex flex-col gap-4">
        {cleaningServices.map((service) => {
          const active = value === service.name;
          return (
            <label
              key={service.id}
              className={`relative cursor-pointer select-none p-4 sm:p-5 rounded-2xl flex items-start gap-3 transition-all duration-300 ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800/60 text-gray-200 hover:bg-gray-700"
              }`}
            >
              <div className="flex flex-col flex-1 justify-center">
                <span className="text-sm sm:text-lg font-medium">{service.name}</span>
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
