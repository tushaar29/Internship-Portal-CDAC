import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi, sendOTPApi, verifyOTPApi, loginApi } from "../../api/authApi";
import { uploadProfilePic } from "../../api/studentApi";
import { useAuth } from "../../auth/AuthContext";
import styles from "./Auth.module.css";

const Register = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Details
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    otp: ""
  });
  const [profileImage, setProfileImage] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
        await sendOTPApi({ email: form.email });
        setSuccess("OTP sent to your email.");
        setStep(2);
    } catch (err) {
        setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
        setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
        await verifyOTPApi({ email: form.email, otpCode: form.otp });
        setSuccess("Email verified successfully.");
        setTimeout(() => {
          setSuccess("");
          setStep(3);
        }, 1000);
    } catch (err) {
        setError(err.response?.data?.message || "Invalid OTP");
    } finally {
        setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // 1. Register
      await registerApi(form);
      setSuccess("Registration successful. Logging in...");

      // 2. Auto Login
      const loginRes = await loginApi({ email: form.email, password: form.password });
      const token = loginRes.data.jwt;
      login(token);

      // 3. Upload Profile Pic (if selected and role is STUDENT)
      if (profileImage && form.role === "STUDENT") {
        setSuccess("Uploading profile picture...");
        try {
           await uploadProfilePic(profileImage);
        } catch (uploadErr) {
           console.error("Profile pic upload failed", uploadErr);
           // Don't block registration success, just warn
           setError("Registration success, but profile picture upload failed.");
        }
      }

      setSuccess("Welcome! Redirecting...");
      setTimeout(() => {
         if (form.role === "STUDENT") navigate("/student/dashboard");
         else if (form.role === "COMPANY") navigate("/company/dashboard");
         else navigate("/admin/dashboard");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
        setIsLoading(false);
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
          <h2 className={styles.formTitle}>Create Account</h2>
          <p className={styles.formSubtitle}>
            {step === 1 && "Enter email to verify"}
            {step === 2 && "Enter OTP sent to email"}
            {step === 3 && "Complete your profile"}
          </p>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          {step === 1 && (
             <form onSubmit={handleSendOTP}>
               <div className={styles.formGroup}>
                 <label className={styles.label}>Email Address</label>
                 <input
                   type="email"
                   name="email"
                   placeholder="Enter your email"
                   className={styles.input}
                   required
                   value={form.email}
                   onChange={handleChange}
                 />
               </div>
               <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                 {isLoading ? "Sending..." : "Send OTP"}
               </button>
             </form>
          )}

          {step === 2 && (
             <form onSubmit={handleVerifyOTP}>
               <div className={styles.formGroup}>
                 <label className={styles.label}>Enter OTP</label>
                 <input
                   name="otp"
                   placeholder="Enter 6-digit OTP"
                   className={styles.input}
                   required
                   value={form.otp}
                   onChange={handleChange}
                   maxLength={6}
                 />
               </div>
               <div className={styles.buttonGroup}>
                   <button type="button" className={styles.secondaryBtn} onClick={() => setStep(1)} disabled={isLoading}>
                       Back
                   </button>
                   <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                     {isLoading ? "Verifying..." : "Verify OTP"}
                   </button>
               </div>
             </form>
          )}

          {step === 3 && (
            <form onSubmit={handleRegister}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  name="name"
                  placeholder="Enter your full name"
                  className={styles.input}
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className={styles.input}
                    value={form.email}
                    disabled
                  />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  className={styles.input}
                  required
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Register As</label>
                <div className={styles.roleToggle}>
                  <button
                    type="button"
                    className={`${styles.roleOption} ${form.role === 'STUDENT' ? styles.roleOptionActive : ''}`}
                    onClick={() => setForm({ ...form, role: 'STUDENT' })}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`${styles.roleOption} ${form.role === 'COMPANY' ? styles.roleOptionActive : ''}`}
                    onClick={() => setForm({ ...form, role: 'COMPANY' })}
                  >
                    Company
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {form.role === "COMPANY" ? "Company Logo (Optional)" : "Profile Picture (Optional)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.input}
                  onChange={handleImageChange}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                 {isLoading ? "Registering..." : "Register & Login"}
              </button>
            </form>
          )}

          <p className={styles.toggleText}>
            Already have an account? 
            <button type="button" onClick={() => navigate('/login')} className={styles.toggleLink}>
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
