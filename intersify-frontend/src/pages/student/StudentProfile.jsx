import { useEffect, useState } from "react";
import api from "../../api/axios";
import { uploadProfilePic } from "../../api/studentApi";
import styles from "./StudentPages.module.css";
import { Camera } from "lucide-react";

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "", email: "", education: "", skills: "", bio: "", resumeUrl: "", profilePicUrl: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    api.get("/students/profile")
      .then(res => setProfile(res.data))
      .catch(err => console.error("Fetch error", err));
  };

  const handleSave = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // 1. Update text data
    await api.put("/students/profile", profile);

    // 2. If a new file is selected, upload it
    if (resumeFile) {
      const formData = new FormData();
      formData.append("file", resumeFile);
      await api.post("/students/profile/resume", formData);
      setResumeFile(null); // Clear the selection after success
    }

    if (profilePicFile) {
       await uploadProfilePic(profilePicFile);
       setProfilePicFile(null);
    }

    // 3. IMPORTANT: Success message and toggle
    setIsEditing(false);
    fetchProfile(); 
    alert("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Update failed. Make sure the file is under 5MB.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>My Profile</h1>
            <p className={styles.pageSubtitle}>Manage your professional information</p>
          </div>
          <div className={styles.headerActions}>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? styles.buttonSecondary : styles.buttonPrimary}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.profileHeader}>
            <div className={styles.profileImage} style={{ position: 'relative', overflow: 'hidden' }}>
              {profile.profilePicUrl ? (
                <img 
                  src={profile.profilePicUrl} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                profile.fullName?.charAt(0)?.toUpperCase()
              )}
              
              {isEditing && (
                <label style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '100%',
                  height: '30%',
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white'
                }}>
                  <Camera size={20} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setProfilePicFile(e.target.files[0])} 
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{profile.fullName || 'Your Name'}</h2>
              <p className={styles.profileEmail}>{profile.email || 'email@example.com'}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className={styles.formSection}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={profile.fullName} 
                    onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                    className={styles.input}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className={styles.fieldText}>{profile.fullName || 'Add your name'}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                {isEditing ? (
                  <input 
                    type="email"
                    value={profile.email} 
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className={styles.input}
                    placeholder="your@email.com"
                  />
                ) : (
                  <p className={styles.fieldText}>{profile.email || 'Add your email'}</p>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Education</label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={profile.education} 
                    onChange={(e) => setProfile({...profile, education: e.target.value})}
                    className={styles.input}
                    placeholder="e.g., B.Tech Computer Science"
                  />
                ) : (
                  <p className={styles.fieldText}>{profile.education || 'Add your education'}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Skills</label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={profile.skills} 
                    onChange={(e) => setProfile({...profile, skills: e.target.value})}
                    className={styles.input}
                    placeholder="e.g., React, JavaScript, Python"
                  />
                ) : (
                  <p className={styles.fieldText}>{profile.skills || 'Add your skills'}</p>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Professional Bio</label>
              {isEditing ? (
                <textarea 
                  value={profile.bio} 
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className={styles.textarea}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              ) : (
                <p className={styles.fieldText}>{profile.bio || 'Add your professional bio'}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Resume / CV</label>
              {isEditing ? (
                <div className={styles.fileUpload}>
                  <input 
                      type="file" 
                      id="resumeInput" // Add an ID
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                    />
                    <label htmlFor="resumeInput" style={{ cursor: 'pointer', display: 'block', width: '100%' }}>
                      <p className={styles.fileUploadText}>
                        {resumeFile ? `✅ Selected: ${resumeFile.name}` : "Drop your resume here or click to select"}
                      </p>
                    </label>
                </div>
              ) : (
                <div>
                  {profile.resumeUrl ? (
                    <a 
                      href={`http://localhost:8080/uploads/${profile.resumeUrl}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className={styles.resumeLink}
                    >
                      📄 View Current Resume
                    </a>
                  ) : (
                    <p className={styles.fieldText} style={{ color: '#9CA3AF' }}>No resume uploaded</p>
                  )}
                </div>
              )}
            </div>

            {isEditing && (
              <button type="submit" disabled={loading} className={styles.buttonPrimary} style={{ width: '100%', marginTop: '24px' }}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;