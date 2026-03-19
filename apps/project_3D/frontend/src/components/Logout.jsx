import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Logout = () => {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    logout(); // updates context and clears token
    window.location.reload(); // optional: refresh to reset all state
  }, [logout]);

  return <Navigate to="/login" />;
};

export default Logout;
