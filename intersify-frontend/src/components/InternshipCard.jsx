import { useNavigate } from "react-router-dom";
import styles from "./InternshipCard.module.css";

const InternshipCard = ({ internship }) => {
  const navigate = useNavigate();

  // Handle company logo logic
  // Use UI Avatars if no logo is provided, instead of via.placeholder
  const companyLogo = internship.company?.companyLogo || 
                      internship.companyLogo || 
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(internship.company?.companyName || internship.companyName || 'C')}&background=random`;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img 
          src={companyLogo} 
          alt={internship.company?.companyName || "Company"} 
          className={styles.logo}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(internship.company?.companyName || 'C')}&background=random`;
          }}
        />
        <div className={styles.headerInfo}>
          <h3 className={styles.title} title={internship.title}>{internship.title}</h3>
          <p className={styles.company}>{internship.company?.companyName || internship.companyName || "Company Name"}</p>
        </div>
      </div>

      <div className={styles.tags}>
        <span className={styles.tag}>📍 {internship.location || "Remote"}</span>
        <span className={styles.tag}>⏱️ {internship.duration || "N/A"}</span>
        <span className={styles.tag}>💼 {internship.jobType || "Internship"}</span>
      </div>

      <div className={styles.footer}>
        <div className={styles.stipend}>
          {internship.stipend ? `₹${internship.stipend}/mo` : "Unpaid"}
        </div>
        <button 
          className={styles.button}
          onClick={() => navigate(`/internships/${internship.internshipId}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default InternshipCard;
