import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./StudentDashboard.module.css";

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
  api.get("/applications/student")
    .then(res => {
      const apps = res.data;
      setApplications(apps);
      
      setStats({
        total: apps.length,
        // Match 'APPLIED' instead of 'Pending'
        pending: apps.filter(a => a.status === 'APPLIED').length,
        // Match 'SHORTLISTED' instead of 'Approved' (or 'ACCEPTED' if you use that)
        approved: apps.filter(a => a.status === 'SHORTLISTED' || a.status === 'ACCEPTED').length,
        // Match 'REJECTED' (All caps)
        rejected: apps.filter(a => a.status === 'REJECTED').length,
      });
    })
    .catch(err => console.error(err));
      }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>Welcome back! Here's your application overview</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Applications</div>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statChange}>Applications submitted</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Pending</div>
            <div className={styles.statValue}>{stats.pending}</div>
            <div className={styles.statChange}>Under review</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Approved</div>
            <div className={styles.statValue} style={{ color: '#10B981' }}>{stats.approved}</div>
            <div className={styles.statChange}>Great opportunities</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Rejected</div>
            <div className={styles.statValue} style={{ color: '#EF4444' }}>{stats.rejected}</div>
            <div className={styles.statChange}>Keep applying</div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Applications</h2>
            <button 
              className={styles.buttonPrimary}
              onClick={() => window.location.href = "/student/applications"}
            >
              View All →
            </button>
          </div>

          {applications.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <div className={styles.emptyTitle}>No applications yet</div>
              <div className={styles.emptySubtitle}>Start applying to internships to see them here</div>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Internship</th>
                  <th>CompanyName</th> {/* Added this for a better look */}
                  <th>Status</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.applicationId}> {/* JSON uses applicationId, not id */}
                    {/* Accessing title from the nested internship object */}
                    <td>{ app.internship?.title.toUpperCase() || "N/A"}</td>
                    
                    {/* Accessing location from the nested internship object */}
                    <td>{app.internship?.company.companyName.toUpperCase() || "N/A"}</td>
                    
                    <td>
                      {/* 4. Use a template literal to handle the CSS class */}
                      <span className={`${styles.statusBadge} ${styles[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    
                    {/* Using appliedDate instead of createdAt */}
                    <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

