import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import styles from "./Company.module.css";

const CreateInternship = () => {
  const [isApproved, setIsApproved] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "",
    stipend: "",
    skillsRequired: "",
    duration: "",
    deadline: "",
    description: "",
    category: "",
    requirements: "",
    status:"active"
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await api.get("/companies/profile");
        setIsApproved(response.data.status === "APPROVED");
      } catch (err) {
        setIsApproved(false);
      }
    };
    checkStatus();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
    ...form,
    stipend: form.salary // Map 'salary' to 'stipend'
    };
    
    try {
      await api.post("/internships", payload);
      navigate("/company/internships");
    } catch (err) {
      const message = err.response?.data?.message || "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (isApproved === null) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔒</div>
            <div className={styles.emptyTitle}>Access Denied</div>
            <div className={styles.emptySubtitle}>Your account is pending approval. You cannot post internships yet.</div>
            <button 
              onClick={() => navigate("/company/dashboard")}
              className={styles.buttonPrimary}
              style={{ marginTop: '16px' }}
            >
              Go Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Post New Internship</h1>
            <p className={styles.pageSubtitle}>Create an internship listing to attract talented candidates</p>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '16px',
            marginBottom: '24px',
            borderRadius: '8px',
            background: '#FEE2E2',
            color: '#DC2626',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formSection}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Internship Title <span className={styles.required}>*</span></label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Full Stack Developer Intern"
                className={styles.input}
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category <span className={styles.required}>*</span></label>
              <select
                name="category"
                className={styles.select}
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Design">Design</option>
                <option value="HR">HR</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Location <span className={styles.required}>*</span></label>
              <input
                type="text"
                name="location"
                placeholder="e.g., New York, NY / Remote"
                className={styles.input}
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Salary / Stipend (Monthly)</label>
              <input
                type="text"
                name="stipend"
                placeholder="e.g., 15000"
                className={styles.input}
                value={form.stipend}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Duration <span className={styles.required}>*</span></label>
              <input
                type="text"
                name="duration"
                placeholder="e.g., 6 months, 3-6 months"
                className={styles.input}
                value={form.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Application Deadline <span className={styles.required}>*</span></label>
              <input
                type="date"
                name="deadline"
                className={styles.input}
                value={form.deadline}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description <span className={styles.required}>*</span></label>
            <textarea
              name="description"
              placeholder="Describe the internship role, responsibilities, and what students will learn..."
              className={styles.textarea}
              value={form.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Skills Required</label>
            <textarea
              name="skillsRequired"
              placeholder="e.g., React, Node.js, MongoDB, problem solving..."
              className={styles.textarea}
              value={form.skillsRequired}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Additional Requirements</label>
            <textarea
              name="requirements"
              placeholder="Any additional requirements or preferences..."
              className={styles.textarea}
              value={form.requirements}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button 
              type="submit" 
              className={styles.buttonPrimary}
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? "Creating..." : "Post Internship"}
            </button>
            <button 
              type="button" 
              className={styles.buttonSecondary}
              onClick={() => navigate("/company/internships")}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInternship;
