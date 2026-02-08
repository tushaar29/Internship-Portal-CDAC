import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import styles from "./Company.module.css";

const InternshipApplicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/applications/internship/${id}`)
      .then(res => {
        setApplicants(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'PENDING': 'badgePending',
      'APPROVED': 'badgeApproved',
      'REJECTED': 'badgeRejected',
      'SHORTLISTED': 'badgeActive'
    };
    return statusMap[status] || 'badgePending';
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Applicants for Internship</h1>
            <p className={styles.pageSubtitle}>Review and manage applications for this position</p>
          </div>
          <div className={styles.headerActions}>
            <button 
              onClick={() => navigate("/company/internships")}
              className={styles.buttonSecondary}
            >
              ← Back to Listings
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.section}>
            <div className={styles.emptyState}>
              <div className={styles.emptyTitle}>Loading applicants...</div>
            </div>
          </div>
        ) : applicants.length === 0 ? (
          <div className={styles.section}>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>👥</div>
              <div className={styles.emptyTitle}>No applications yet</div>
              <div className={styles.emptySubtitle}>Applicants will appear here once they apply</div>
            </div>
          </div>
        ) : (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Applications ({applicants.length})</h2>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map(app => (
                  <tr key={app.applicationId}>
                    <td>
                      <div style={{ fontWeight: '600', color: '#111827' }}>
                        Applicant #{app.applicationId}
                      </div>
                      {app.studentName && (
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
                          {app.studentName}
                        </div>
                      )}
                    </td>
                    <td>{new Date(app.appliedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td>
                      <span className={styles[getStatusBadgeClass(app.status)]}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => navigate(`/company/applications/${app.applicationId}`)}
                          className={styles.buttonSmall}
                          style={{ background: '#DBEAFE', color: '#0369A1', border: 'none' }}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipApplicants;