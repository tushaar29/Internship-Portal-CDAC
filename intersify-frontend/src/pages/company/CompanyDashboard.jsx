import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import styles from './Company.module.css';

const CompanyDashboard = () => {
  const [stats, setStats] = useState({
    totalInternships: 0,
    totalApplicants: 0,
    openPositions: 0,
    acceptedOffers: 0
  });
  const [recentInternships, setRecentInternships] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const internships = await api.get('/internships/company');
        const data = internships.data;
        console.log(data);
        setRecentInternships(data.slice(0, 5));

        // Your React Stats Calculation now finds the data!
        setStats({
          totalInternships: internships.data.length,
          totalApplicants: internships.data.reduce((sum, i) => sum + (i.applicantsCount || 0), 0),
          openPositions: internships.data.filter(i => i.status === 'active').length,
          acceptedOffers: 0
        });
      } catch (err) {
        console.error(err);
      }
    };

    loadStats();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Company Dashboard</h1>
            <p className={styles.pageSubtitle}>Manage your internship postings and applications</p>
          </div>
          <div className={styles.headerActions}>
            <button 
              onClick={() => navigate("/company/internships/new")}
              className={styles.buttonPrimary}
              >
              <a href="/company/create-internship" style={{color:"white"}}>
              + New Internship
            </a>
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Internships</div>
            <div className={styles.statValue}>{stats.totalInternships}</div>
            <div className={styles.statChange}>Posted positions</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Applicants</div>
            <div className={styles.statValue}>{stats.totalApplicants}</div>
            <div className={styles.statChange}>Across all positions</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Open Positions</div>
            <div className={styles.statValue}>{stats.openPositions}</div>
            <div className={styles.statChange}>Currently active</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Accepted Offers</div>
            <div className={styles.statValue}>{stats.acceptedOffers}</div>
            <div className={styles.statChange}>This quarter</div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Internships</h2>
            <div className={styles.sectionActions}>
              <a href="/company/internships" className={styles.buttonSecondary}>
                View All →
              </a>
            </div>
          </div>

          {recentInternships.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <div className={styles.emptyTitle}>No internships posted yet</div>
              <div className={styles.emptySubtitle}>Create your first internship posting to get started</div>
              <a href="/company/create-internship" className={styles.buttonPrimary} style={{ marginTop: '16px', display: 'inline-block' }}>
                Create Internship
              </a>
            </div>
          ) : (
            <div>
              {recentInternships.map((internship) => (
                <div key={internship.id} className={styles.internshipCard}>
                  <div className={styles.internshipCardContent}>
                    <h3 className={styles.jobTitle}>{internship.title}</h3>
                    <span className={`${styles.jobCategory} ${styles[`category${internship.category}`]}`}>
                      {internship.category}
                    </span>
                    <div className={styles.cardMeta}>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Applicants:</span>
                        <span className={styles.metaValue}>{internship.applicantsCount || 0}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Duration:</span>
                        <span className={styles.metaValue}>{internship.duration}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Salary:</span>
                        <span className={styles.metaValue}>${internship.salary}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <span className={`${styles.cardStatus} ${internship.status === 'active' ? styles.statusActive : styles.statusInactive}`}>
                      {internship.status === 'active' ? '● Active' : '● Inactive'}
                    </span>
                    <a 
                      href={`/company/internships/${internship.internshipId}/edit`} 
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151', // Dark gray
                        backgroundColor: '#ffffff',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        marginRight: '8px',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                    >
                      Edit
                    </a>

                    <a 
                      href={`/company/internships/${internship.internshipId}/applications`} 
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#ffffff',
                        backgroundColor: '#2563eb', // Nice Blue
                        border: '1px solid #2563eb',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                    >
                      View Applicants
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;