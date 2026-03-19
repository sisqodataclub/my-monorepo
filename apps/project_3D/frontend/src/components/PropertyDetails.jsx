// filepath: /src/components/PropertyDetails.jsx
import React, { useRef, useEffect } from "react";
import GlassLayout from "./ui/GlassLayout";

// ---------------------------
// Reusable Input Component
// ---------------------------
const InputField = ({ label, name, value, onChange, type = "text", options, inputRef }) => (
  <div className="flex flex-col mb-4">
    <label className="text-white font-medium mb-2">{label}</label>

    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="bg-gray-800/60 text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500 transition"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="bg-gray-800/60 text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500 transition"
      />
    )}
  </div>
);

// ---------------------------
// MAIN COMPONENT
// ---------------------------
const PropertyDetails = ({ details, setDetails }) => {
  const addressRef = useRef(null);

  // OPTIONAL GOOGLE AUTOCOMPLETE
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
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <GlassLayout title="Property Details">
      {/* Address */}
      <InputField
        label="Full Address"
        name="address"
        value={details.address || ""}
        onChange={handleChange}
        inputRef={addressRef}
      />

      {/* Postcode */}
      <InputField
        label="Postcode"
        name="postcode"
        value={details.postcode || ""}
        onChange={handleChange}
      />

      {/* Furnished status */}
      <InputField
        label="Is the property furnished or empty?"
        name="furnished_status"
        type="select"
        value={details.furnished_status || ""}
        onChange={handleChange}
        options={[
          { value: "furnished", label: "Furnished" },
          { value: "unfurnished", label: "Unfurnished / Empty" },
        ]}
      />

      {/* Parking */}
      <InputField
        label="Parking situation at your property"
        name="parking"
        type="select"
        value={details.parking || ""}
        onChange={handleChange}
        options={[
          { value: "driveway", label: "Private Driveway" },
          { value: "garage", label: "Garage" },
          { value: "on-street-free", label: "On-street (Free)" },
          { value: "on-street-paid", label: "On-street (Paid)" },
          { value: "permit", label: "Permit Parking" },
          { value: "no-parking", label: "No Parking Available" },
        ]}
      />

      {/* Biohazard */}
      <InputField
        label="Is there any human faeces, animal faeces, or blood present?"
        name="biohazard"
        type="select"
        value={details.biohazard || ""}
        onChange={handleChange}
        options={[
          { value: "no", label: "No" },
          { value: "yes-human", label: "Yes – Human faeces" },
          { value: "yes-animal", label: "Yes – Animal faeces" },
          { value: "yes-blood", label: "Yes – Blood" },
        ]}
      />
    </GlassLayout>
  );
};

export default PropertyDetails;
