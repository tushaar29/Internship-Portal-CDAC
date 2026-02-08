import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import styles from "./Company.module.css";

const CompanyInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/internships/company")
      .then(res => {
        setInternships(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>My Internship Listings</h1>
            <p className={styles.pageSubtitle}>Manage and track all your internship postings</p>
          </div>
          <div className={styles.headerActions}>
            <button 
              onClick={() => navigate("/company/internships/new")}
              className={styles.buttonPrimary}
            >
              + Post New Internship
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>Loading...</div>
          </div>
        ) : internships.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <div className={styles.emptyTitle}>No internships posted yet</div>
            <div className={styles.emptySubtitle}>Start by creating your first internship posting</div>
            <button 
              onClick={() => navigate("/company/internships/new")}
              className={styles.buttonPrimary}
              style={{ marginTop: '16px' }}
            >
              + Create Internship
            </button>
          </div>
        ) : (
          <div>
            {internships.map(i => (
              <div key={i.internshipId} className={styles.internshipCard}>
                <div className={styles.internshipCardContent}>
                  <h3 className={styles.jobTitle}>{i.title}</h3>
                  <span className={styles.jobCategory}>{i.category || 'Full-time'}</span>
                  
                  <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Location:</span>
                      <span className={styles.metaValue}>{i.location}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Salary:</span>
                      <span className={styles.metaValue}>${i.salary || i.stipend}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Duration:</span>
                      <span className={styles.metaValue}>{i.duration}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Deadline:</span>
                      <span className={styles.metaValue}>{new Date(i.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <span className={`${styles.cardStatus} ${i.status === 'inactive' ? styles.statusInactive : styles.statusActive}`}>
                    ● {i.status === 'inactive' ? 'Inactive' : 'Active'}
                  </span>
                  <button 
                    onClick={() => navigate(`/company/internships/${i.internshipId}/edit`)}
                    className={styles.buttonSecondary}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => navigate(`/company/internships/${i.internshipId}/applications`)}
                    className={styles.buttonPrimary}
                  >
                    View Applicants
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInternships;
