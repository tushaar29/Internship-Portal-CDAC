import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import styles from "./Auth.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess("OTP sent to your email!");
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.centeredLayout}>
      <div className={styles.centeredCard}>
        <div className={styles.centeredHeader}>
          <div className={styles.brandLogo} style={{ width: '60px', height: '60px', fontSize: '32px', margin: '0 auto 20px', color: '#fff', background: '#0A65CC' }}>I</div>
          <h2 className={styles.centeredTitle}>Forgot Password</h2>
          <p className={styles.centeredSubtitle}>
            Enter your email address to receive a one-time password (OTP) to reset your password.
          </p>
        </div>

        {error && (
          <div className={`${styles.message} ${styles.errorMessage}`}>
            {error}
          </div>
        )}
        
        {success && (
          <div className={`${styles.message} ${styles.successMessage}`}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className={styles.input}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <div className={styles.formFooter}>
          <p className={styles.footerText}>
            Remember your password? <Link to="/login" className={styles.toggleLink}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
