import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendOTPApi, verifyOTPApi } from "../../api/authApi";
import styles from "./Auth.module.css";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Start countdown timer
  const startCountdown = (seconds) => {
    setCountdown(seconds);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsSending(true);
    try {
      await sendOTPApi({ email });
      setOtpSent(true);
      setSuccess("OTP sent successfully! Please check your email.");
      startCountdown(300); // 5 minutes countdown
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    try {
      await verifyOTPApi({ email, otpCode: otp });
      setSuccess("OTP verified successfully! Redirecting...");
      setTimeout(() => {
        // Redirect to login or dashboard based on context
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.brandSection}>
        <div className={styles.brandContent}>
          <div className={styles.brandLogo}>
            <img src="Gemini_Generated_Image_1vjv9m1vjv9m1vjv.png" alt="Internsify Logo" />
          </div>
          <h1 className={styles.brandTitle}>Internsify</h1>
          <p className={styles.brandText}>Secure your account with email verification</p>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Email Verification</h2>
          <p className={styles.formSubtitle}>Verify your email address with OTP</p>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          {!otpSent ? (
            <form onSubmit={handleSendOTP}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={styles.input}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSending}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSending}>
                {isSending ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  disabled
                  readOnly
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Enter 6-digit OTP</label>
                <input
                  type="text"
                  placeholder="123456"
                  className={styles.input}
                  maxLength="6"
                  pattern="[0-9]{6}"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  disabled={isVerifying}
                />
              </div>

              {countdown > 0 && (
                <div className={styles.countdown}>
                  OTP expires in: {formatTime(countdown)}
                </div>
              )}

              <button type="submit" className={styles.submitBtn} disabled={isVerifying || countdown === 0}>
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                className={styles.resendBtn}
                onClick={handleSendOTP}
                disabled={isSending || countdown > 0}
                style={{ marginTop: '10px' }}
              >
                {countdown > 0 ? `Resend OTP (${formatTime(countdown)})` : "Resend OTP"}
              </button>
            </form>
          )}

          <div className={styles.formFooter}>
            <p>
              Already verified?{" "}
              <a href="#" onClick={() => navigate("/login")} className={styles.link}>
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;