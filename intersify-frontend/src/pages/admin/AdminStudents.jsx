import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import styles from "./AdminDashboard.module.css";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "" });
  const [message, setMessage] = useState({ text: "", type: "" });

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
      setMessage({ text: "Failed to load students", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const processedStudents = useMemo(() => {
    let result = [...students];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(s => 
        (s.user?.name || "").toLowerCase().includes(term) ||
        (s.user?.email || "").toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => (a.user?.name || "").localeCompare(b.user?.name || ""));

    return result;
  }, [students, filters]);

  const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;

      try {
          await api.delete(`/admin/users/${id}`);
          setMessage({ text: "Student deleted successfully", type: "success" });
          setStudents(prev => prev.filter(s => s.user.userId !== id));
          setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } catch (err) {
          setMessage({ text: "Delete failed", type: "error" });
      }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Student Management</h1>
            <p className={styles.pageSubtitle}>Manage registered students</p>
          </div>
          <div className={styles.headerActions}>
            <span style={{ fontSize: '14px', color: '#6B7280' }}>
              Showing {processedStudents.length} of {students.length} students
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
              placeholder="Search by name or email..." 
              className={styles.input}
              style={{ flex: 1, margin: 0, padding:"12px"}}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.section}>
            <div className={styles.emptyState}>
              <div className={styles.emptyTitle}>Loading students...</div>
            </div>
          </div>
        ) : processedStudents.length === 0 ? (
          <div className={styles.section}>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎓</div>
              <div className={styles.emptyTitle}>No students found</div>
              <div className={styles.emptySubtitle}>Try adjusting your search term</div>
            </div>
          </div>
        ) : (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Students</h2>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Education</th>
                  <th>Skills</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {processedStudents.map(s => (
                  <tr key={s.user?.userId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {s.profilePicUrl ? (
                            <img 
                                src={s.profilePicUrl} 
                                alt={s.user?.name} 
                                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '50%', 
                                background: '#E5E7EB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#6B7280'
                            }}>
                                {(s.user?.name || "?").charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span style={{ fontWeight: '500', color: '#111827' }}>
                            {s.user?.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td>{s.user?.email}</td>
                    <td>{s.education || "-"}</td>
                    <td>
                        {s.skills ? (
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {s.skills.split(',').slice(0, 3).map((skill, idx) => (
                                    <span key={idx} style={{ 
                                        fontSize: '11px', 
                                        padding: '2px 6px', 
                                        background: '#F3F4F6', 
                                        borderRadius: '4px',
                                        color: '#4B5563'
                                    }}>
                                        {skill.trim()}
                                    </span>
                                ))}
                                {s.skills.split(',').length > 3 && (
                                    <span style={{ fontSize: '11px', color: '#6B7280' }}>
                                        +{s.skills.split(',').length - 3} more
                                    </span>
                                )}
                            </div>
                        ) : "-"}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDelete(s.user.userId)}
                        className={styles.buttonSmall}
                        style={{ background: '#FEE2E2', color: '#DC2626', border: 'none' }}
                      >
                        Delete
                      </button>
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

export default AdminStudents;
