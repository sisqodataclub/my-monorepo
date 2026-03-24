// filepath: /src/pages/PersonalDetailsPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import PersonalDetails from "../components/PersonalDetails";

import useAutoSnapshot, { getSessionId } from "../hooks/useAutoSnapshot"; 
// import the hook and session ID

const PersonalDetailsPage = ({ details, setDetails }) => {
  const sessionId = getSessionId(); // get browser session ID

  // ✅ Automatically save personal details after 60s or tab close
  useAutoSnapshot(sessionId, { details });

  return (
    <div className="p-6 max-w-xl mx-auto">
      <PersonalDetails details={details} setDetails={setDetails} />

      {/* NEXT BUTTON → Go to Review/Submit Page */}
      <Link
        to="/form/submit"
        className="mt-6 inline-block bg-blue-600 text-white py-3 px-6 rounded-lg"
      >
        Review & Submit
      </Link>

      {/* OPTIONAL: Back to Quantities */}
      <Link
        to="/form/quantities"
        className="ml-4 mt-6 inline-block bg-gray-400 text-black py-3 px-6 rounded-lg"
      >
        Previous
      </Link>
    </div>
  );
};

export default PersonalDetailsPage;
