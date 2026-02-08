import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import styles from './InternshipDetail.module.css';

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/internships/public/${id}`);
        setInternship(res.data);

        if (auth && auth.role === 'STUDENT') {
          try {
            const statusRes = await api.get(`/applications/check/${id}`);
            setApplied(statusRes.data.isApplied);
          } catch (statusErr) {
            console.error('Status check failed', statusErr);
          }
        }
        setLoading(false);
      } catch (err) {
        setError('Internship not found');
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, auth]);

  const handleApply = async () => {
    if (!auth) {
      navigate('/login');
      return;
    }

    if (auth.role !== 'STUDENT') return;

    try {
      // Logic for application - sending internshipId and a default resume as per your snippet
      await api.post(`/applications/${id}/apply`, null, { 
          params: { 
              resumeUrl: 'default_resume.pdf' 
          } 
      });
      setApplied(true);
    } catch (err) {
      console.error('Application failed:', err);
      setError(err.response?.data?.message || 'Failed to apply. Please try again.');
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = internship?.title || 'Check out this internship';
    const company = internship?.company?.companyName || internship?.companyName || 'Company';
    
    const messages = {
      facebook: `Check out this ${title} internship at ${company}!`,
      twitter: `Exciting ${title} internship opportunity at ${company}! Apply now:`,
      linkedin: `Great ${title} internship opportunity at ${company}. Perfect for students looking to gain experience!`,
      copy: 'Link copied to clipboard!'
    };

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(messages.facebook)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(messages.twitter)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert(messages.copy);
        break;
      default:
        break;
    }
  };

  const getDeadlineStatus = () => {
    if (!internship?.deadline) return null;
    const deadline = new Date(internship.deadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { text: 'Expired', urgent: true };
    if (daysLeft === 0) return { text: 'Ends Today', urgent: true };
    if (daysLeft <= 3) return { text: `${daysLeft} days left`, urgent: true };
    if (daysLeft <= 7) return { text: `${daysLeft} days left`, urgent: false };
    return { text: deadline.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), urgent: false };
  };

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingShimmer} style={{width: '200px', height: '20px', marginBottom: '16px'}}></div>
        <div className={styles.loadingShimmer} style={{width: '300px', height: '16px', marginBottom: '12px'}}></div>
        <div className={styles.loadingShimmer} style={{width: '250px', height: '16px'}}></div>
        <p style={{marginTop: '24px', fontSize: '14px', color: '#6B7280'}}>Loading internship details...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={() => navigate('/internships')}>Back to Internships</button>
      </div>
    );

  const jobType = internship.jobType || 'Full Time';
  const companyLogo =
    internship.companyLogo ||
    `https://via.placeholder.com/96x96?text=${internship.company?.companyName?.[0] || 'C'}`;

  return (
    <div className={styles.page}>
      {/* Deadline Banner */}
      {getDeadlineStatus() && (
        <div className={`${styles.deadlineBanner} ${getDeadlineStatus().urgent ? styles.deadlineUrgent : ''}`}>
          <div className={styles.sectionContainer}>
            <div className={styles.bannerContent}>
              <span className={styles.bannerIcon}>⏰</span>
              <span className={styles.bannerText}>{getDeadlineStatus().text}</span>
              {getDeadlineStatus().urgent && <span className={styles.bannerCta}>Apply Now!</span>}
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.sectionContainer}>
          <button className={styles.backBtn} onClick={() => navigate('/internships')}>
            ← Back
          </button>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.contentWrapper}>
            {/* LEFT: Main Content */}
            <div className={styles.mainContent}>
              <div className={styles.jobHeader}>
                <div className={styles.headerLeft}>
                  <img src={companyLogo} alt={internship.company?.companyName} className={styles.companyLogo} />
                  <div className={styles.headerInfo}>
                    <div className={styles.titleWrapper}>
                      <h1 className={styles.jobTitle}>{internship.title}</h1>
                      {internship.isFeatured && <span className={styles.featuredBadge}>Featured</span>}
                    </div>
                    <p className={styles.companyName}>{internship.company?.companyName || 'Company Name'}</p>
                    <div className={styles.metaBadges}>
                      <span className={`${styles.badge} ${styles.badgePrimary}`}>{jobType}</span>
                      <span className={`${styles.badge} ${styles.badgeSecondary}`}>{internship.location || 'Remote'}</span>
                      {internship.stipend && <span className={`${styles.badge} ${styles.badgeSecondary}`}>₹{internship.stipend}/mo</span>}
                      {internship.duration && <span className={`${styles.badge} ${styles.badgeSecondary}`}>{internship.duration}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {internship.skillsRequired && (
                <div className={styles.contentSection}>
                  <h2 className={styles.sectionTitle}>Required Skills</h2>
                  <div className={styles.skillsGrid}>
                    {internship.skillsRequired.split(',').map((skill, idx) => (
                      <span key={idx} className={styles.skillTag}>{skill.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {internship.description && (
                <div className={styles.contentSection}>
                  <h2 className={styles.sectionTitle}>About the Role</h2>
                  <p className={styles.sectionContent}>{internship.description}</p>
                </div>
              )}

              {internship.responsibilities && (
                <div className={styles.contentSection}>
                  <h2 className={styles.sectionTitle}>What You'll Do</h2>
                  <div className={styles.responsibilitiesList}>
                    {internship.responsibilities.split('\n').map((item, idx) => (
                      <div key={idx} className={styles.responsibilityItem}>
                        <span className={styles.responsibilityBullet}>•</span>
                        <span className={styles.responsibilityText}>{item.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Action Sidebar */}
            <aside className={styles.actionSidebar}>
              <div className={styles.sidebarCard}>
                {!auth ? (
                  <button className={`${styles.applyBtn} ${styles.applyBtnPrimary}`} onClick={handleApply}>
                    Login to Apply
                  </button>
                ) : auth.role === 'STUDENT' ? (
                  <button
                    className={`${styles.applyBtn} ${applied ? styles.applyBtnApplied : styles.applyBtnPrimary}`}
                    disabled={applied}
                    onClick={handleApply}
                  >
                    {applied ? '✓ Applied' : 'Apply Now'}
                  </button>
                ) : (
                  <button className={`${styles.applyBtn} ${styles.applyBtnDisabled}`} disabled>
                    Students Only
                  </button>
                )}
              </div>

              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Key Details</h3>
                <div className={styles.detailsList}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Stipend</span>
                    <span className={styles.detailValue}>₹{internship.stipend || 'TBD'}/month</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Location</span>
                    <span className={styles.detailValue}>{internship.location || 'Remote'}</span>
                  </div>
                  {internship.deadline && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Deadline</span>
                      <span className={styles.detailValue}>{new Date(internship.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Share</h3>
                <div className={styles.shareButtons}>
                  <button className={styles.shareBtn} onClick={() => handleShare('facebook')}>📘</button>
                  <button className={styles.shareBtn} onClick={() => handleShare('twitter')}>𝕏</button>
                  <button className={styles.shareBtn} onClick={() => handleShare('linkedin')}>💼</button>
                  <button className={styles.shareBtn} onClick={() => handleShare('copy')}>🔗</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetail;