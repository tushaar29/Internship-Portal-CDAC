import { MapPin, Calendar, Users, Mail, Phone, Globe, ExternalLink, Camera } from 'lucide-react';
import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./Company.module.css";
import { Link } from 'react-router-dom';

const CompanyProfile = () => {
  const [profile, setProfile] = useState({
    companyName: "",
    industry: "",
    website: "",
    description: "",
    logo: "",
    headquarters: "",
    founded: "",
    companySize: "",
    email: "",
    phone: ""
  });

  const iconHeaderStyle = {
  fontSize: '11px',
  color: '#6B7280',
  fontWeight: '600',
  marginBottom: '8px',
  textTransform: 'uppercase',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  letterSpacing: '0.5px'
  };

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const socialLinks = [
    { name: "LinkedIn", icon: "💼", url: "#" },
    { name: "Twitter", icon: "𝕏", url: "#" },
    { name: "GitHub", icon: "🐙", url: "#" },
    { name: "Website", icon: "🌐", url: "#" }
  ];

  useEffect(() => {
    api.get("/companies/profile")
      .then(res => {
        setProfile(res.data);
      })
      .catch(() => {
        setMessage("Failed to load profile");
      });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoUploading(true);
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await api.post("/companies/profile/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile(prev => ({ ...prev, logo: res.data.logoUrl }));
      setMessage("✓ Logo updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("✗ Failed to upload logo");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/companies/profile", profile);
      setMessage("✓ Company profile updated successfully");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("✗ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Company Profile</h1>
            <p className={styles.pageSubtitle}>Manage your company information and presence</p>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? styles.buttonSecondary : styles.buttonPrimary}
            >
              {isEditing ? "Cancel Editing" : "✏️ Edit Profile"}
            </button>
          </div>
        </div>

        {message && (
          <div style={{
            padding: '16px',
            marginBottom: '24px',
            borderRadius: '8px',
            background: message.includes('✓') ? '#DCFCE7' : '#FEE2E2',
            color: message.includes('✓') ? '#16A34A' : '#DC2626',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {message}
          </div>
        )}

        {/* Company Header Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0A65CC 0%, #003D7A 100%)',
          borderRadius: '12px',
          padding: '48px 32px',
          marginBottom: '32px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(10, 101, 204, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ position: 'relative' }}>
              {profile.logo ? (
                <img 
                  src={profile.logo} 
                  alt="Company Logo" 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '4px solid rgba(255,255,255,0.3)',
                    backgroundColor: '#fff'
                  }} 
                />
              ) : (
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: '700',
                  border: '4px solid rgba(255,255,255,0.3)'
                }}>
                  {profile.companyName?.charAt(0)?.toUpperCase() || "C"}
                </div>
              )}
              
              {isEditing && (
                <label style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  background: '#fff',
                  color: '#0A65CC',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                  <Camera size={18} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload} 
                    style={{ display: 'none' }}
                    disabled={logoUploading}
                  />
                </label>
              )}
            </div>

            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>
                {profile.companyName || "Your Company Name"}
              </h2>
              <div style={{ display: 'flex', gap: '16px', opacity: '0.9', fontSize: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={14} />
                  {profile.website || "Add website"}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} />
                  {profile.companySize || "Add size"}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} />
                  {profile.headquarters || "Add location"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.mainColumn}>
            {/* About Section */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>About Company</h3>
              </div>
              <div className={styles.cardContent}>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={profile.description}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Tell us about your company..."
                    rows={6}
                  />
                ) : (
                  <p className={styles.text}>{profile.description || "No description provided."}</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            {/* Details Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Company Details</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.detailList}>
                  <div className={styles.detailItem}>
                    <div style={iconHeaderStyle}>
                      <Users size={14} /> FOUNDED
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        name="founded"
                        value={profile.founded}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="e.g. 2010"
                      />
                    ) : (
                      <div className={styles.detailValue}>{profile.founded || "Not set"}</div>
                    )}
                  </div>

                  <div className={styles.detailItem}>
                    <div style={iconHeaderStyle}>
                      <Users size={14} /> COMPANY SIZE
                    </div>
                    {isEditing ? (
                      <select
                        name="companySize"
                        value={profile.companySize}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    ) : (
                      <div className={styles.detailValue}>{profile.companySize || "Not set"}</div>
                    )}
                  </div>

                  <div className={styles.detailItem}>
                    <div style={iconHeaderStyle}>
                      <Globe size={14} /> WEBSITE
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        name="website"
                        value={profile.website}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="https://example.com"
                      />
                    ) : (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {profile.website || "Not set"} <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  
                  <div className={styles.detailItem}>
                    <div style={iconHeaderStyle}>
                      <MapPin size={14} /> INDUSTRY
                    </div>
                    {isEditing ? (
                       <input
                       type="text"
                       name="industry"
                       value={profile.industry}
                       onChange={handleChange}
                       className={styles.input}
                       placeholder="e.g. Technology"
                     />
                    ) : (
                      <div className={styles.detailValue}>{profile.industry || "Not set"}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Contact Information</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.detailList}>
                  <div className={styles.detailItem}>
                    <div style={iconHeaderStyle}>
                      <Mail size={14} /> EMAIL
                    </div>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="contact@company.com"
                      />
                    ) : (
                      <div className={styles.detailValue}>{profile.email || "Not set"}</div>
                    )}
                  </div>

                  <div className={styles.detailItem}>
                    <div style={iconHeaderStyle}>
                      <Phone size={14} /> PHONE
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="+1 (555) 000-0000"
                      />
                    ) : (
                      <div className={styles.detailValue}>{profile.phone || "Not set"}</div>
                    )}
                  </div>
                  
                  <div className={styles.detailItem}>
                     <div style={iconHeaderStyle}>
                      <Globe size={14} /> SOCIAL PROFILES
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      {socialLinks.map((link, i) => (
                        <a key={i} href={link.url} className={styles.socialLink} title={link.name}>
                          {link.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
