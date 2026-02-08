import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./AdminDashboard.module.css";

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: "ALL", search: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/companies");
      setCompanies(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const processedCompanies = useMemo(() => {
    let result = [...companies];

    if (filters.status !== "ALL") {
      result = result.filter(c => c.status === filters.status);
    }

    if (filters.search) {
      result = result.filter(c => 
        c.companyName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    console.log(result);
    
    result.sort((a, b) => a.companyName.localeCompare(b.companyName));

    return result;
  }, [companies, filters]);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/companies/${id}/status?status=${newStatus}`);
      setMessage({ text: `Status updated to ${newStatus}`, type: "success" });
      
      setCompanies(prev => prev.map(c => 
        c.companyId === id ? { ...c, status: newStatus } : c
      ));

      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setMessage({ text: "Update failed", type: "error" });
    }
  };

  const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this company? This action cannot be undone.")) return;

      try {
          await api.delete(`/admin/users/${id}`);
          setMessage({ text: "Company deleted successfully", type: "success" });
          setCompanies(prev => prev.filter(c => c.companyId !== id));
          setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } catch (err) {
          setMessage({ text: "Delete failed", type: "error" });
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Company Management</h1>
            <p className={styles.pageSubtitle}>Review and approve company registrations</p>
          </div>
          <div className={styles.headerActions}>
            <span style={{ fontSize: '14px', color: '#6B7280' }}>
              Showing {processedCompanies.length} of {companies.length} companies
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
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input 
              placeholder="Search company name..." 
              className={styles.input}
              style={{ flex: 2, margin: 0 , padding:"12px"}}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select 
              className={styles.select}
              style={{ flex: 1, margin: 0 }}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Only</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className={styles.section}>
            <div className={styles.emptyState}>
              <div className={styles.emptyTitle}>Loading companies...</div>
            </div>
          </div>
        ) : processedCompanies.length === 0 ? (
          <div className={styles.section}>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏢</div>
              <div className={styles.emptyTitle}>No companies found</div>
              <div className={styles.emptySubtitle}>Try adjusting your filters or search term</div>
            </div>
          </div>
        ) : (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Companies</h2>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Industry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {processedCompanies.map(c => (
                  <tr key={c.companyId}>
                    <td 
                        onClick={() => navigate(`/admin/company/${c.companyId}`)} 
                        style={{ cursor: 'pointer' }}
                    >
                      <div style={{ fontWeight: '600', color: '#0A65CC' }}>
                        {c.companyName}
                      </div>
                      {c.website && (
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
                          {c.website}
                        </div>
                      )}
                    </td>
                    <td>{c.industry}</td>
                    <td>
                      <span className={styles[getStatusBadgeClass(c.status)]}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {c.status !== "APPROVED" && (
                          <button 
                            onClick={() => updateStatus(c.companyId, "APPROVED")}
                            className={styles.buttonSmall}
                            style={{ background: '#DCFCE7', color: '#16A34A', border: 'none' }}
                          >
                            Approve
                          </button>
                        )}
                        {c.status !== "REJECTED" && (
                          <button 
                            onClick={() => updateStatus(c.companyId, "REJECTED")}
                            className={styles.buttonSmall}
                            style={{ background: '#FEE2E2', color: '#DC2626', border: 'none' }}
                          >
                            Reject
                          </button>
                        )}
                         <button 
                            onClick={() => handleDelete(c.companyId)}
                            className={styles.buttonSmall}
                            style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #DC2626' }}
                          >
                            Delete
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

export default AdminCompanies;
