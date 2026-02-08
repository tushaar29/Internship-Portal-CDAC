import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./JobCard.module.css";

const JobCard = ({ job, onClick }) => {
  const navigate = useNavigate();

  // Guard against undefined job
  if (!job) return null;

  // Fallback values for missing backend data
  const companyName = job.company?.companyName || job.companyName || "Company Name";
  const companyLogo = job.company?.companyLogo || job.companyLogo || `https://via.placeholder.com/56x56?text=${companyName?.[0] || 'C'}`;
  const jobType = job.jobType || "Full Time";
  const location = job.location || "Remote";
  const title = job.title || "Job Title";
  const salary = job.stipend ? `₹${job.stipend}` : "Unpaid";
  const internshipId = job._id || job.internshipId || job.id;
  const deadline = job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "Apply Soon";

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/internships/${internshipId}`);
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/internships/${internshipId}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.header}>
        <img
          src={companyLogo}
          alt={companyName}
          className={styles.logo}
          onError={(e) => (e.target.src = `https://via.placeholder.com/56x56?text=${companyName?.[0] || 'C'}`)}
        />
        <div className={styles.headerInfo}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.company}>{companyName}</p>
        </div>
      </div>

      <div className={styles.badges}>
        <span className={styles.badge}>{jobType}</span>
        <span className={styles.badge}>{location}</span>
        <span className={styles.badge}>Apply by {deadline}</span>
      </div>

      <div className={styles.footer}>
        <span className={styles.salary}>{salary}</span>
        <button className={styles.viewBtn} onClick={handleDetailsClick}>
          View Details
        </button>
      </div>
    </div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    internshipId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    companyName: PropTypes.string,
    companyLogo: PropTypes.string,
    location: PropTypes.string,
    jobType: PropTypes.string,
    stipend: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    deadline: PropTypes.string,
    company: PropTypes.shape({
      companyName: PropTypes.string,
      companyLogo: PropTypes.string
    })
  }),
  onClick: PropTypes.func,
};

export default JobCard;
