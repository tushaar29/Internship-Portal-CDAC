import { useState, useEffect } from 'react';
import { ArrowRight, Briefcase, Building2, Users, TrendingUp } from 'lucide-react';
import styles from './Hero.module.css';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(2); // Default to index 2 like your original code

const handleSuggestionClick = (suggestion, index) => {
  setSearchQuery(suggestion);
  setActiveIndex(index); // This updates the active state to the clicked item
};

  // Trigger animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const suggestions = [
    'Designer',
    'Programming',
    'Digital Marketing',
    'Video Production',
    'UI/UX Design',
  ];

  const stats = [
    {
      icon: Briefcase,
      number: '175,324',
      label: 'Live Jobs',
      bgColor: '#E7F0FA',
      highlight: false,
    },
    {
      icon: Building2,
      number: '97,354',
      label: 'Companies',
      bgColor: '#0A65CC',
      highlight: true,
    },
    {
      icon: Users,
      number: '38,47,154',
      label: 'Candidates',
      bgColor: '#E7F0FA',
      highlight: false,
    },
    {
      icon: TrendingUp,
      number: '7,532',
      label: 'New Jobs',
      bgColor: '#E7F0FA',
      highlight: false,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', { searchQuery, locationQuery });
  };

  return (
    <section className={styles.hero}>
      <div className={styles['hero-container']}>
        {/* Content - Left Side */}
        <div className={`${styles['hero-content']} ${isVisible ? styles['fade-in-up'] : ''}`}>
          <div className={styles['hero-info']}>
            <h1 className={styles['hero-title']}>
              Find a job that suits your interest <span className={styles.highlight}>&</span> skills.
            </h1>
            <p className={styles['hero-description']}>
              Discover your perfect career opportunity among thousands of listings from top companies. Connect with employers and advance your professional journey.
            </p>
          </div>

          {/* Search Box */}
          <form className={styles['hero-search']} onSubmit={handleSearch}>
            <div className={styles['hero-search-box']}>
              <div className={styles['search-fields']}>
                {/* Job Title Field */}
                <div className={styles['search-field']}>
                  <svg
                    className={styles['field-icon']}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Job title, Keyword..."
                    className={styles['field-input']}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Divider */}
                <div className={styles['search-divider']}></div>

                {/* Location Field */}
                <div className={styles['search-field']}>
                  <svg
                    className={styles['field-icon']}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <input
                    type="text"
                    placeholder="Your Location"
                    className={styles['field-input']}
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Search Button */}
              <button type="submit" className={styles['hero-search-btn']}>
                Find Job
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Suggestions */}
            <div className={styles['search-suggestions']}>
              <span className={styles['suggestion-label']}>Suggestions:</span>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles['suggestion-item']} ${activeIndex === index ? styles['active'] : ''}`}
                  onClick={() => handleSuggestionClick(suggestion, index)}
                >
                  {suggestion}
                  {index < suggestions.length - 1 && ','}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Illustration - Right Side (Placeholder for SVG) */}
        <div className={`${styles['hero-illustration']} ${isVisible ? styles['fade-in-right'] : ''}`}>
          <div className={styles['illustration-placeholder']}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Decorative gradient background */}
              <defs>
                <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#0A65CC', stopOpacity: 0.1 }} />
                  <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0.1 }} />
                </linearGradient>
              </defs>
              <rect width="400" height="400" fill="url(#heroGradient)" rx="20" />
              
              {/* Placeholder content - using Briefcase icon concept */}
              <circle cx="200" cy="200" r="120" fill="#E7F0FA" opacity="0.5" />
              <circle cx="200" cy="200" r="100" fill="#F0F7FF" />
              
              {/* SVG Icon - Briefcase */}
              <g transform="translate(130, 130)">
                <rect x="10" y="20" width="60" height="50" rx="4" fill="none" stroke="#0A65CC" strokeWidth="2" />
                <rect x="20" y="0" width="40" height="20" rx="2" fill="#0A65CC" />
                <path d="M20 35 L60 35" stroke="#0A65CC" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Section - Bottom */}
      <div className={`${styles['fun-facts']} ${isVisible ? styles['fade-in-up'] : ''}`}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${styles['fun-fact-card']} ${stat.highlight ? styles['highlighted'] : ''}`}
            >
              <div
                className={styles['fun-fact-icon']}
                style={{
                  backgroundColor: stat.bgColor,
                  color: stat.highlight ? '#FFFFFF' : '#0A65CC',
                }}
              >
                <Icon size={28} />
              </div>
              <div className={styles['fun-fact-info']}>
                <h3 className={styles['fun-fact-number']}>{stat.number}</h3>
                <p className={styles['fun-fact-label']}>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative Elements */}
      <div className={styles['hero-decorations']}>
        <div className={`${styles['decoration-blob']} ${styles['blob-1']}`}></div>
        <div className={`${styles['decoration-blob']} ${styles['blob-2']}`}></div>
        <div className={`${styles['decoration-blob']} ${styles['blob-3']}`}></div>
      </div>
    </section>
  );
};

export default Hero;
