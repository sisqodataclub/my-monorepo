// filepath: /src/components/FormNavigation.jsx
import React from "react";

const FormNavigation = ({ currentPage, setCurrentPage, totalPages }) => {
    return (
        <div>
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
            >
                Previous
            </button>
            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1}
            >
                Next
            </button>
        </div>
    );
};

export default FormNavigation;