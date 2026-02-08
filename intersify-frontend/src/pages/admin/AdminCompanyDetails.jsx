import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./AdminDashboard.module.css";

const AdminCompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, internshipsRes] = await Promise.all([
          api.get(`/admin/companies/${id}`),
          api.get(`/admin/companies/${id}/internships`)
        ]);
        setCompany(companyRes.data);
        setInternships(internshipsRes.data);
      } catch (err) {
        console.error("Fetch failed", err);
        setMessage({ text: "Failed to load company details", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      await api.put(`/admin/companies/${id}/status?status=${newStatus}`);
      setMessage({ text: `Status updated to ${newStatus}`, type: "success" });
      setCompany(prev => ({ ...prev, status: newStatus }));
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setMessage({ text: "Update failed", type: "error" });
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'APPROVED': 'badgeApproved',
      'REJECTED': 'badgeRejected',
      'PENDING': 'badgePending'
    };
    return statusMap[status] || 'badgePending';
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.section}>
            <div className={styles.emptyState}>Loading details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.section}>
             <button onClick={() => navigate('/admin/companies')} className={styles.buttonSecondary} style={{marginBottom: '20px'}}>
                ← Back to Companies
            </button>
            <div className={styles.emptyState}>Company not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
            <button onClick={() => navigate('/admin/companies')} className={styles.buttonSecondary} style={{marginRight: '20px'}}>
                ← Back
            </button>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>{company.companyName}</h1>
            <p className={styles.pageSubtitle}>Company Details</p>
          </div>
          <div className={styles.headerActions}>
             <span className={styles[getStatusBadgeClass(company.status)]}>
                {company.status}
             </span>
          </div>
        </div>

        {message.text && (
          <div className={styles.section} style={{ marginBottom: '16px' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '6px',
              backgroundColor: message.type === 'success' ? '#DCFCE7' : '#FEE2E2',
              color: message.type === 'success' ? '#16A34A' : '#DC2626',
              fontSize: '14px'
            }}>
              {message.text}
            </div>
          </div>
        )}

        <div className={styles.section} style={{ marginBottom: '24px' }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Overview</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>Industry</p>
                    <p style={{ fontWeight: '500' }}>{company.industry}</p>
                </div>
                <div>
                    <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px' }}>Website</p>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: '#0A65CC', textDecoration: 'none' }}>
                        {company.website || "N/A"}
                    </a>
                </div>
            </div>
             <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                {company.status !== "APPROVED" && (
                    <button 
                    onClick={() => updateStatus("APPROVED")}
                    className={styles.buttonPrimary}
                    style={{ background: '#16A34A', border: 'none' }}
                    >
                    Approve Company
                    </button>
                )}
                {company.status !== "REJECTED" && (
                    <button 
                    onClick={() => updateStatus("REJECTED")}
                    className={styles.buttonSecondary}
                    style={{ color: '#DC2626', borderColor: '#DC2626' }}
                    >
                    Reject Company
                    </button>
                )}
            </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Posted Internships ({internships.length})</h2>
          </div>
          
          {internships.length === 0 ? (
               <div className={styles.emptyState}>
                <div className={styles.emptyTitle}>No internships posted yet</div>
              </div>
          ) : (
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Applicants</th>
                    <th>Deadline</th>
                </tr>
                </thead>
                <tbody>
                {internships.map(internship => (
                    <tr key={internship.internshipId}>
                    <td style={{ fontWeight: '500' }}>{internship.title}</td>
                    <td>{internship.location}</td>
                    <td>{internship.isRemote ? "Remote" : "On-site"}</td>
                    <td>{internship.applicationsCount || 0}</td>
                    <td>{new Date(internship.deadline).toLocaleDateString()}</td>
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

export default AdminCompanyDetails;
