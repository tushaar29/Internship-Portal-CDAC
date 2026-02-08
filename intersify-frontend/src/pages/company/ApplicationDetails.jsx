import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import styles from "./Company.module.css";

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/applications/${applicationId}`)
      .then(res => {
        setAppData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [applicationId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status?status=${newStatus}`);
      setAppData(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert("Failed to update status on server");
    }
  };

  const handleIssueCertificate = async () => {
    try {
      await api.post(`/certificates/issue/${applicationId}`);
      alert("Certificate issued successfully!");
    } catch (err) {
      alert("Failed to issue certificate: " + (err.response?.data?.message || err.message));
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'APPLIED': 'badgePending',
      'SHORTLISTED': 'badgeActive',
      'REJECTED': 'badgeRejected',
      'ACCEPTED': 'badgeApproved',
      'COMPLETED': 'badgeApproved'
    };
    return statusMap[status] || 'badgePending';
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>Loading application details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!appData) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>❌</div>
            <div className={styles.emptyTitle}>Application not found</div>
            <button 
              onClick={() => navigate(-1)}
              className={styles.buttonSecondary}
              style={{ marginTop: '16px' }}
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const resumeUrl = `http://localhost:8080/uploads/${appData.resumeUrl}`;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Application Details</h1>
            <p className={styles.pageSubtitle}>Application #{appData.applicationId}</p>
          </div>
          <div className={styles.headerActions}>
            <button 
              onClick={() => navigate(-1)}
              className={styles.buttonSecondary}
            >
              ← Back
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', margin: '24px 0' }}>
          
          {/* Left: Application Details */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Applicant Information</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Applicant Profile Card */}
              <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Student Name</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                  {appData.studentName || 'Not provided'}
                </div>
              </div>

              <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Email Address</div>
                <div style={{ fontSize: '16px', color: '#111827' }}>
                  {appData.studentEmail || 'Not provided'}
                </div>
              </div>

              <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Professional Bio</div>
                <div style={{ fontSize: '15px', color: '#111827', lineHeight: '1.5' }}>
                  {appData.studentBio || 'No bio provided'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>Application Status</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span className={styles[getStatusBadgeClass(appData.status)]}>
                  {appData.status}
                </span>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Update Status</label>
                <select
                  value={appData.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={styles.select}
                >
                  <option value="APPLIED">Applied</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {appData.status === 'COMPLETED' && (
                <div style={{ marginTop: '16px' }}>
                  <button 
                    onClick={handleIssueCertificate}
                    className={styles.buttonPrimary}
                    style={{ width: '100%' }}
                  >
                    Issue Certificate
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Resume Preview */}
          <div style={{
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1.5px solid #E5E7EB',
            background: '#FFFFFF',
            minHeight: '600px'
          }}>
            {appData.resumeUrl ? (
              <iframe
                src={`${resumeUrl}#toolbar=0`}
                width="100%"
                height="100%"
                title="Resume Preview"
                style={{ border: 'none', minHeight: '600px' }}
              />
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '600px',
                background: '#F9FAFB'
              }}>
                <div style={{ textAlign: 'center', color: '#6B7280' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>No Resume Available</div>
                  <div style={{ fontSize: '14px', marginTop: '4px' }}>The applicant has not uploaded a resume</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;