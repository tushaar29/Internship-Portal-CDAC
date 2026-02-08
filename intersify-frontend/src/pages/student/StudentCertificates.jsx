import React, { useState, useEffect } from 'react';
import api from "../../api/axios";
import { Download, Award, Calendar, User, Briefcase } from 'lucide-react';
import styles from './StudentCertificates.module.css';

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await api.get('/certificates/my');
      if (Array.isArray(response.data)) {
        setCertificates(response.data);
      } else {
        console.warn("Unexpected response format:", response.data);
        setCertificates([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch certificates", err);
      setError("Failed to load certificates");
      setLoading(false);
    }
  };

  /**
   * Transforms a standard Cloudinary URL to force a download
   * by injecting the 'fl_attachment' flag.
   */
  const getDownloadUrl = (url) => {
    if (!url) return "";
    if (url.includes('cloudinary.com')) {
      return url.replace("/upload/", "/upload/fl_attachment/");
    }
    return url;
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    
    if (Array.isArray(dateInput)) {
      const [year, month, day] = dateInput;
      return new Date(year, month - 1, day).toLocaleDateString();
    }
    
    return new Date(dateInput).toLocaleDateString();
  };

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Award className={styles.headerIcon} />
          <h1 className={styles.pageTitle}>My Certificates</h1>
        </div>

        {error && (
          <div className={styles.error}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {certificates.length === 0 ? (
          <div className={styles.emptyState}>
            <Award className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No certificates yet</h3>
            <p className={styles.emptyText}>Complete internships to earn certificates.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {certificates.map((cert) => (
              <div key={cert.certificateId} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardHeaderTitle}>Certificate of Completion</span>
                  <Award className={styles.cardIcon} />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.internshipTitle}>{cert.internshipTitle}</h3>
                  <div className={styles.infoRow}>
                    <Briefcase className={styles.infoIcon} />
                    <span>{cert.companyName}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <User className={styles.infoIcon} />
                    <span>{cert.studentName}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <Calendar className={styles.infoIcon} />
                    <span>Issued: {formatDate(cert.issueDate)}</span>
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <span className={styles.certId}>ID: {cert.certificateId}</span>
                    {cert.fileUrl ? (
                      <a 
                        href={getDownloadUrl(cert.fileUrl)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        download={`Certificate_${cert.certificateId}.pdf`}
                        className={styles.downloadBtn}
                      >
                        <Download className={styles.downloadIcon} />
                        Download
                      </a>
                    ) : (
                      <span className={styles.certId}>Digital Copy Only</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCertificates;