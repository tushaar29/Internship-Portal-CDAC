import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pendingCompanies: 0,
    totalCompanies: 0,
    totalInternships: 0,
    totalStudents: 0
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const pending = await api.get("/admin/companies?status=PENDING");
        const companies = await api.get("/admin/companies");
        const internships = await api.get("/admin/internships");
        const students = await api.get("/admin/students");

        setStats({
          pendingCompanies: pending.data.length,
          totalCompanies: companies.data.length,
          totalInternships: internships.data.length,
          totalStudents: students.data.length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Admin Dashboard</h1>
            <p className={styles.pageSubtitle}>Overview of system metrics and management</p>
          </div>
          <div className={styles.headerActions}>
            <button 
              className={styles.buttonPrimary}
              onClick={() => navigate("/admin/companies")}
            >
              Manage Companies
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Pending Companies</div>
            <div className={styles.statValue}>{stats.pendingCompanies}</div>
            <div className={styles.statChange}>Awaiting review</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Companies</div>
            <div className={styles.statValue}>{stats.totalCompanies}</div>
            <div className={styles.statChange}>Active companies</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Internships</div>
            <div className={styles.statValue}>{stats.totalInternships}</div>
            <div className={styles.statChange}>Available positions</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Students</div>
            <div className={styles.statValue}>{stats.totalStudents}</div>
            <div className={styles.statChange}>Registered students</div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <button 
              className={styles.buttonPrimary}
              onClick={() => navigate("/admin/companies")}
              style={{ width: '100%' }}
            >
              Review Companies
            </button>
            <button 
              className={styles.buttonSecondary}
              onClick={() => navigate("/admin/students")}
              style={{ width: '100%' }}
            >
              Manage Students
            </button>
            <button 
              className={styles.buttonSecondary}
              style={{ width: '100%' }}
            >
              Manage Internships
            </button>
            <button 
              className={styles.buttonSecondary}
              style={{ width: '100%' }}
            >
              System Settings
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Pending Companies</h2>
          {stats.pendingCompanies === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✓</div>
              <div className={styles.emptyTitle}>All caught up!</div>
              <div className={styles.emptySubtitle}>No pending companies to review</div>
            </div>
          ) : (
            <p style={{ color: '#6B7280' }}>You have {stats.pendingCompanies} pending company applications.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
