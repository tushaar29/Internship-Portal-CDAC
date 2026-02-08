import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import styles from "./Company.module.css";

const EditInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ 
    title: "", 
    location: "", 
    stipend: "",
    category: "",
    description: "",
    skillsRequired: "", 
    duration: "", 
    deadline: "" ,
    status:""
  });

  useEffect(() => {
    api.get(`/internships/public/${id}`)
      .then(res => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load internship details");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.put(`/internships/${id}`, form);
      navigate("/company/internships");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update internship");
    }
  };

  if (loading) {
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Edit Internship</h1>
            <p className={styles.pageSubtitle}>Update your internship listing details</p>
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
                className={styles.input}
                placeholder="e.g., Full Stack Developer Intern"
                value={form.title} 
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select
                name="category"
                className={styles.select}
                value={form.category}
                onChange={handleChange}
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
              <label className={styles.label}>Location</label>
              <input 
                type="text"
                name="location" 
                className={styles.input}
                placeholder="e.g., New York, NY / Remote"
                value={form.location} 
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Salary / Stipend (Monthly)</label>
              <input 
                type="text" // Change from number to text
                name="stipend" 
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} // Only allow digits
                className={styles.input}
                value={form.stipend} 
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Duration</label>
              <input 
                type="text"
                name="duration" 
                className={styles.input}
                placeholder="e.g., 6 months"
                value={form.duration} 
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Application Deadline</label>
              <input 
                type="date"
                name="deadline" 
                className={styles.input}
                value={form.deadline} 
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea 
              name="description" 
              className={styles.textarea}
              placeholder="Describe the internship role and responsibilities..."
              value={form.description} 
              onChange={handleChange}
              rows="5"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Skills Required</label>
            <textarea 
              name="skillsRequired" 
              className={styles.textarea}
              placeholder="List required skills..."
              value={form.skillsRequired} 
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Internship Status</label>
            <select 
              className={styles.select}
              value={form.status} 
              onChange={(e) => setForm({...form, status: e.target.value})}
            >
              <option value="active">Active (Visible to Students)</option>
              <option value="inactive">Inactive (Hidden/Closed)</option>
            </select>
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
              Setting to inactive will hide this post from the public job board.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button type="submit" className={styles.buttonPrimary} style={{ flex: 1 }}>
              Save Changes
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

export default EditInternship;