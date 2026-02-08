import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      console.error("No token found in URL");
      navigate("/login");
      return;
    }

    console.log("OAuth Token received:", token);
    login(token);

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Token Payload:", payload);
      const role = payload.role;

      if (role === "STUDENT") navigate("/student/dashboard");
      else if (role === "COMPANY") navigate("/company/dashboard");
      else if (role === "ADMIN") navigate("/admin/dashboard");
      else navigate("/unauthorized");
      
    } catch (e) {
      console.error("Failed to parse token:", e);
      navigate("/login");
    }
  }, []);

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>Signing you in...</h2>
      <p>Please wait while we verify your credentials.</p>
    </div>
  );
};

export default OAuthSuccess;
