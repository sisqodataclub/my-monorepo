import React, { useRef, useEffect } from "react";
import GlassLayout from "./ui/GlassLayout";

/* ----------------------------------
   Reusable Input Field (Upgraded)
---------------------------------- */
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  options = [],
  required = false,
  autoComplete,
  placeholder,
  pattern,
  maxLength,
  className = "",
  inputRef, // ✅ Preserved for Google Maps Autocomplete
}) => {
  const inputId = `field-${name}`;

  const baseInputStyles =
    "bg-gray-800/60 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all w-full placeholder-gray-500";

  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <label htmlFor={inputId} className="text-white font-medium mb-2 text-sm tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-1" aria-hidden="true">*</span>}
      </label>

      {type === "select" ? (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={baseInputStyles}
        >
          <option value="" disabled>Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          ref={inputRef}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          rows="2"
          className={`${baseInputStyles} resize-none`}
        />
      ) : (
        <input
          ref={inputRef}
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          pattern={pattern}
          maxLength={maxLength}
          className={baseInputStyles}
        />
      )}
    </div>
  );
};

/* ----------------------------------
   MAIN COMPONENT
---------------------------------- */
const PropertyDetails = ({ details, setDetails }) => {
  const addressRef = useRef(null);

  // OPTIONAL GOOGLE AUTOCOMPLETE (Preserved)
  useEffect(() => {
    if (!window.google || !window.google.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
      types: ["address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      setDetails((prev) => ({
        ...prev,
        address: place.formatted_address || prev.address,
        postcode:
          place.address_components?.find(a =>
            a.types.includes("postal_code")
          )?.long_name || prev.postcode,
      }));
    });
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Auto-uppercase UK Postcodes as the user types
    if (name === "postcode") {
      value = value.toUpperCase();
    }
    
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <GlassLayout title="Property Details">
      
      {/* 1. Location Section */}
      <div className="mb-8 border-b border-gray-700/50 pb-8">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">1. Location Details</h3>
        
        {/* Full width textarea for address */}
        <InputField
          label="Full Property Address"
          name="address"
          type="textarea"
          autoComplete="street-address"
          placeholder="House number, street name, city..."
          value={details.address || ""}
          onChange={handleChange}
          inputRef={addressRef}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <InputField
            label="UK Postcode"
            name="postcode"
            autoComplete="postal-code"
            placeholder="e.g. M1 1AA"
            maxLength="8"
            pattern="^[A-Za-z]{1,2}[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}$" 
            value={details.postcode || ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* 2. Property Specifics Section */}
      <div>
        <h3 className="text-lg font-semibold text-blue-400 mb-4">2. Property Specifics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <InputField
            label="Is the property furnished or empty?"
            name="furnished_status"
            type="select"
            value={details.furnished_status || ""}
            onChange={handleChange}
            required
            options={[
              { value: "furnished", label: "Furnished" },
              { value: "unfurnished", label: "Unfurnished / Empty" },
            ]}
          />

          <InputField
            label="Parking situation at your property"
            name="parking"
            type="select"
            value={details.parking || ""}
            onChange={handleChange}
            required
            options={[
              { value: "driveway", label: "Private Driveway" },
              { value: "garage", label: "Garage" },
              { value: "on-street-free", label: "On-street (Free)" },
              { value: "on-street-paid", label: "On-street (Paid)" },
              { value: "permit", label: "Permit Parking" },
              { value: "no-parking", label: "No Parking Available" },
            ]}
          />

          {/* This input spans both columns because it's a long question */}
          <InputField
            label="Is there any human faeces, animal faeces, or blood present?"
            name="biohazard"
            type="select"
            value={details.biohazard || ""}
            onChange={handleChange}
            required
            className="md:col-span-2 mt-2"
            options={[
              { value: "no", label: "No" },
              { value: "yes-human", label: "Yes – Human faeces" },
              { value: "yes-animal", label: "Yes – Animal faeces" },
              { value: "yes-blood", label: "Yes – Blood" },
            ]}
          />
        </div>
      </div>

    </GlassLayout>
  );
};

export default PropertyDetails;
