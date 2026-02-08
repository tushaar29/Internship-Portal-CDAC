import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import JobCard from "../../components/JobCard";
import Hero from "../../components/Hero";
import styles from "./Home.module.css";

// TODO: Hardcoded categories - match with backend when available
const CATEGORIES = [
  { id: 1, icon: "💼", name: "Digital Marketing", count: "350 Jobs" },
  { id: 2, icon: "💻", name: "Software Development", count: "480 Jobs" },
  { id: 3, icon: "🎨", name: "Design & UX", count: "250 Jobs" },
  { id: 4, icon: "📊", name: "Data Science", count: "180 Jobs" },
];

const WHY_US = [
  { icon: "✓", title: "Verified Companies", description: "Apply to internships from verified and trusted companies" },
  { icon: "⚡", title: "Quick Apply", description: "Apply to jobs with one click and track your applications" },
  { icon: "🎯", title: "Career Growth", description: "Gain real experience and build your professional portfolio" },
];

const Home = () => {
  const [internships, setInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/internships/public")
      .then((res) => setInternships(res.data.slice(0, 6)))
      .catch((err) => console.error("Error fetching internships:", err));
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/internships?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/internships");
    }
  };

  return (
    <>
      {/* Hero Section - New Premium Design */}
      <Hero />

      {/* Featured Jobs Section - Bootstrap Grid */}
      <section className={styles.featuredSection}>
        <div className="container-lg">
          <div className="row mb-5">
            <div className="col-12">
              <h2 className={styles.sectionTitle}>Featured Jobs</h2>
              <p className={styles.sectionSubtitle}>Top opportunities from leading companies</p>
            </div>
          </div>
          <div className="row g-4">
            {internships.map((job) => (
              <div key={job.internshipId} className="col-lg-3 col-md-6 col-sm-12">
                <JobCard job={job} onClick={() => navigate(`/internships/${job.internshipId}`)} />
              </div>
            ))}
          </div>
          <div className="row mt-5">
            <div className="col-12 text-center">
              <button className={styles.viewAllBtn} onClick={() => navigate("/internships")}>
                View All Jobs →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Bootstrap Grid */}
      <section className={styles.categoriesSection}>
        <div className="container-lg">
          <div className="row mb-5">
            <div className="col-12">
              <h2 className={styles.sectionTitle}>Browse by Category</h2>
              <p className={styles.sectionSubtitle}>Find internships in your area of interest</p>
            </div>
          </div>
          <div className="row g-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="col-lg-3 col-md-6 col-sm-12" style={{margin:"10px"}}>
                <div
                  className={styles.categoryCard}
                  onClick={() => navigate(`/internships?category=${cat.name}`)}
                >
                  <div className={styles.categoryIcon}>{cat.icon}</div>
                  <h3 className={styles.categoryName}>{cat.name}</h3>
                  <p className={styles.categoryCount}>{cat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section - Bootstrap Grid */}
      <section className={styles.whyUsSection}>
        <div className="container-lg">
          <div className="row mb-5">
            <div className="col-12">
              <h2 className={styles.sectionTitle}>Why Intersify?</h2>
              <p className={styles.sectionSubtitle}>The best platform for internship seekers</p>
            </div>
          </div>
          <div className="row g-4">
            {WHY_US.map((item, idx) => (
              <div key={idx} className="col-lg-4 col-md-6 col-sm-12" style={{margin:"10px"}}>
                <div className={styles.whyUsCard}>
                  <div className={styles.whyUsIcon}>{item.icon}</div>
                  <h3 className={styles.whyUsTitle}>{item.title}</h3>
                  <p className={styles.whyUsDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
