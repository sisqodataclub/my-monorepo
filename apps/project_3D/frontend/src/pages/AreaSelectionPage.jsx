// filepath: /src/pages/AreaSelectionPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AreaSelection from "../components/AreaSelection";

import useAutoSnapshot, { getSessionId } from "../hooks/useAutoSnapshot"; 
// ^ both exported from the same file

const AreaSelectionPage = ({ selectedAreas, setSelectedAreas }) => {
  const navigate = useNavigate();

  const sessionId = getSessionId(); // gets browser session ID

  // ✅ Automatically save after 60s or tab close
  useAutoSnapshot(sessionId, {
    selected_areas: selectedAreas,
  });

  const handleNext = () => {
    navigate("/form/quantities");
  };

  return (
    <div>
      <AreaSelection
        selectedAreas={selectedAreas}
        setSelectedAreas={setSelectedAreas}
      />
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default AreaSelectionPage;
