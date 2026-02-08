import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../../api/authApi";
import { useAuth } from "../../auth/AuthContext";
import styles from "./Auth.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({ email, password });

      const token = res.data.jwt;
      login(token);

      const role = JSON.parse(atob(token.split(".")[1])).role;

      if (role === "STUDENT") navigate("/student/dashboard");
      else if (role === "COMPANY") navigate("/company/dashboard");
      else if (role === "ADMIN") navigate("/admin/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.brandSection}>
        <div className={styles.brandContent}>
          <div className={styles.brandLogo}>
            <img src="Gemini_Generated_Image_1vjv9m1vjv9m1vjv.png" alt="Internsify Logo" />
          </div>
          <h1 className={styles.brandTitle}>Internsify</h1>
          <p className={styles.brandText}>Connect with top internship opportunities</p>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Welcome Back</h2>
          <p className={styles.formSubtitle}>Sign in to your account</p>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.input}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className={styles.input}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                Remember me
              </label>
              <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <div className={styles.socialButtons}>
          <button
            type="button"
            className={styles.socialBtn}
            onClick={() => {
              window.location.assign(
                "http://localhost:8080/oauth2/authorization/google"
              );
            }}
          >
            <img
              src="https://www.gstatic.com/images/branding/product/1x/gsa_64dp.png"
              alt="Google"
            />
            Google
          </button>

          <button
            type="button"
            className={styles.socialBtn}
            onClick={() =>
              window.location.href = "http://localhost:8080/oauth2/authorization/facebook"
            }
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" />
            Facebook
          </button>
        </div>


          <p className={styles.toggleText}>
            Don't have an account?{" "}
            <button type="button" onClick={() => navigate('/register')} className={styles.toggleLink}>
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

