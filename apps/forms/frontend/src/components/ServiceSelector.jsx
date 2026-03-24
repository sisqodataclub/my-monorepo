import GlassLayout from "./ui/GlassLayout";

const ServiceSelector = ({ value, setValue }) => {
  const services = [
    "Moving in/out Cleaning / End Of Tenancy",
    "One Off / Deep Cleaning",
    "After Building Cleaning",
    "Carpet, Upholstery & Appliances Cleaning ONLY",
    "Other Enquiries",
  ];

  return (
    <GlassLayout
      title="Choose Your Service"
      subtitle="Select the cleaning service you need to get started."
    >
      <div className="flex flex-col gap-4">
        {services.map((service) => {
          const active = value === service;

          return (
            <label
              key={service}
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
              <span className="flex-1 text-sm sm:text-lg font-medium">
                {service}
              </span>

              <input
                type="radio"
                checked={active}
                onChange={() => setValue(service)}
                className="mt-1 w-5 h-5 accent-blue-400"
              />

              {active && (
                <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl" />
              )}
            </label>
          );
        })}
      </div>
    </GlassLayout>
  );
};

export default ServiceSelector;
