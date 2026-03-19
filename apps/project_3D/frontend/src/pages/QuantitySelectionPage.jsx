// filepath: /src/pages/QuantitySelectionPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import QuantitySelection from "../components/QuantitySelection";

import useAutoSnapshot, { getSessionId } from "../hooks/useAutoSnapshot"; 
// ^ import the hook and session ID

const QuantitySelectionPage = ({ selectedAreas, quantities, setQuantities }) => {
    const navigate = useNavigate();

    const sessionId = getSessionId(); // get browser session ID

    // ✅ Automatically save after 60s or tab close
    useAutoSnapshot(sessionId, {
        selected_areas: selectedAreas,
        quantities: quantities,
    });

    return (
        <div>
            <QuantitySelection
                selectedAreas={selectedAreas}
                quantities={quantities}
                setQuantities={setQuantities}
            />

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button onClick={() => navigate("/form/areas")}>
                    ⬅ Previous
                </button>

                <button onClick={() => navigate("/form/details")}>
                    Next ➡
                </button>
            </div>
        </div>
    );
};

export default QuantitySelectionPage;
