import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./StudentPages.module.css";

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/applications/student")
      .then(res => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'APPLIED': 'statusPending',
      'SHORTLISTED': 'statusShortlisted',
      'INTERVIEW_SCHEDULED': 'statusShortlisted',
      'INTERVIEW_COMPLETED': 'statusShortlisted',
      'OFFER_MADE': 'statusOffer',
      'ACCEPTED': 'statusApproved',
      'REJECTED': 'statusRejected',
      'WITHDRAWN': 'statusRejected',
      'COMPLETED': 'statusApproved'
    };
    return statusMap[status] || 'statusPending';
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ');
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    
    // Handle array format [YYYY, MM, DD] common in Spring Boot
    if (Array.isArray(dateInput)) {
      const [year, month, day] = dateInput;
      return new Date(year, month - 1, day).toLocaleDateString();
    }
    
    // Handle standard string format
    return new Date(dateInput).toLocaleDateString();
  };

  const filteredApplications = applications
    .filter(app => filter === 'all' || app.status === filter)
    .filter(app => search === '' || app.internship?.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>Loading applications...</div>
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
            <h1 className={styles.pageTitle}>My Applications</h1>
            <p className={styles.pageSubtitle}>Track and manage your internship applications</p>
          </div>
        </div>

        <div className={styles.filterBar}>
          <input
            type="text"
            placeholder="Search applications..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className={styles.select}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="INTERVIEW_COMPLETED">Interview Completed</option>
            <option value="OFFER_MADE">Offer Made</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {filteredApplications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <div className={styles.emptyTitle}>
              {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
            </div>
            <div className={styles.emptySubtitle}>
              {applications.length === 0 
                ? 'Start applying to internships to see them here' 
                : 'Try adjusting your filters or search'}
            </div>
          </div>
        ) : (
          <div>
            {filteredApplications.map((app) => (
              <div key={app.applicationId} className={styles.applicationCard}>
                <div className={styles.applicationHeader}>
                  <h3 className={styles.jobTitle}>
                    {app.internship?.title.toUpperCase() || "Internship Position"}
                  </h3>
                  <span className={`${styles.statusBadge} ${styles[getStatusBadgeClass(app.status)]}`}>
                    {formatStatus(app.status)}
                  </span>
                </div>
                <div className={styles.companyName}>
                  {app.internship?.companyName || "Company Name"}
                </div>
                <div className={styles.applicationMeta}>
                  <span>📅 Applied: {formatDate(app.appliedDate)}</span>
                  {app.notes && (
                    <div className={styles.notes}>
                      📝 Note: {app.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentApplications;
