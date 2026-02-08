import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import JobCard from '../../components/JobCard';
import styles from './Internships.module.css';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  // State for filters
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedStipend, setSelectedStipend] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(window.innerWidth > 768);

  // Fetch internships
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await api.get('/internships/public');
        setInternships(res.data);
      } catch (err) {
        console.error('Error fetching internships:', err);
      }
    };

    fetchInternships();
  }, []);

  // Handle window resize to update filter visibility
  useEffect(() => {
    const handleResize = () => {
      setShowFilters(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply filters and search
  useEffect(() => {
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';
    const finalSearch = searchQuery || searchInput.toLowerCase();

    let filtered = internships;

    // Search filter
    if (finalSearch) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(finalSearch) ||
          job.company?.companyName?.toLowerCase().includes(finalSearch) ||
          job.location?.toLowerCase().includes(finalSearch)
      );
    }

    // Job type filter
    if (selectedJobType !== 'all') {
      filtered = filtered.filter((job) => job.jobType === selectedJobType);
    }

    // Duration filter
    if (selectedDuration !== 'all') {
      filtered = filtered.filter((job) => job.duration === selectedDuration);
    }

    // Stipend filter
    if (selectedStipend !== 'all') {
      const [min, max] = selectedStipend.split('-').map(Number);
      filtered = filtered.filter((job) => {
        const stipend = parseInt(job.stipend);
        return max ? stipend >= min && stipend <= max : stipend >= min;
      });
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'stipend-high') {
      filtered.sort((a, b) => parseInt(b.stipend) - parseInt(a.stipend));
    } else if (sortBy === 'stipend-low') {
      filtered.sort((a, b) => parseInt(a.stipend) - parseInt(b.stipend));
    }

    setFilteredInternships(filtered);
    
    // Calculate pagination
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [internships, selectedJobType, selectedDuration, selectedStipend, sortBy, searchInput, searchParams, itemsPerPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/internships?search=${encodeURIComponent(searchInput)}`);
    }
  };

  const clearAllFilters = () => {
    setSelectedJobType('all');
    setSelectedDuration('all');
    setSelectedStipend('all');
    setSortBy('newest');
    setSearchInput('');
    navigate('/internships');
  };

  const activeFiltersCount =
    (selectedJobType !== 'all' ? 1 : 0) +
    (selectedDuration !== 'all' ? 1 : 0) +
    (selectedStipend !== 'all' ? 1 : 0);

  // Pagination logic
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInternships.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        className={`${styles.paginationBtn} ${currentPage === 1 ? styles.paginationBtnDisabled : ''}`}
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Previous
      </button>
    );

    // Page numbers
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className={`${styles.paginationBtn} ${currentPage === 1 ? styles.paginationBtnActive : ''}`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className={styles.paginationEllipsis}>...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.paginationBtn} ${currentPage === i ? styles.paginationBtnActive : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className={styles.paginationEllipsis}>...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.paginationBtnActive : ''}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.paginationBtnDisabled : ''}`}
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    );

    return (
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInternships.length)} of {filteredInternships.length} internships
        </div>
        <div className={styles.paginationControls}>
          {pages}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      {/* Top Bar with Search and Sort */}
      <div className={styles.topBar}>
        <div className={styles.topBarContainer}>
          <form className={styles.searchContainer} onSubmit={handleSearch}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by title, company, location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>
              🔍 Search
            </button>
          </form>

          <div className={styles.sortContainer}>
            <label htmlFor="sort" className={styles.sortLabel}>
              Sort By:
            </label>
            <select
              id="sort"
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="stipend-high">Highest Stipend</option>
              <option value="stipend-low">Lowest Stipend</option>
            </select>
          </div>

          <button
            className={styles.toggleFilters}
            onClick={() => setShowFilters(!showFilters)}
            title={showFilters ? 'Hide filters' : 'Show filters'}
          >
            {showFilters ? '✕ Hide' : '☰ Show'} Filters
          </button>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className={styles.mainContent}>
        {/* LEFT COLUMN: Filter Panel */}
        {showFilters && (
          <aside className={`${styles.filterPanel} ${showFilters ? styles.visible : ''}`}>
            <div className={styles.filterHeader}>
              <h2 className={styles.filterTitle}>Filters</h2>
              <div className={styles.filterHeaderActions}>
                {activeFiltersCount > 0 && (
                  <button className={styles.clearFiltersBtn} onClick={clearAllFilters}>
                    Clear All ({activeFiltersCount})
                  </button>
                )}
                <button
                  className={styles.closeFilterBtn}
                  onClick={() => setShowFilters(false)}
                  title="Close filters"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Job Type Filter */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterGroupTitle}>Job Type</h3>
              <div className={styles.filterOptions}>
                {['all', 'Full Time', 'Part Time', 'Contract', 'Temporary'].map((type) => (
                  <label key={type} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="jobType"
                      value={type}
                      checked={selectedJobType === type}
                      onChange={(e) => setSelectedJobType(e.target.value)}
                    />
                    <span className={styles.filterLabel}>
                      {type === 'all' ? 'All Types' : type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterGroupTitle}>Duration</h3>
              <div className={styles.filterOptions}>
                {['all', '1-3 months', '3-6 months', '6+ months'].map((duration) => (
                  <label key={duration} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="duration"
                      value={duration}
                      checked={selectedDuration === duration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                    />
                    <span className={styles.filterLabel}>
                      {duration === 'all' ? 'Any Duration' : duration}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stipend Filter */}
            <div className={styles.filterGroup}>
              <h3 className={styles.filterGroupTitle}>Stipend Range</h3>
              <div className={styles.filterOptions}>
                {['all', '0-10000', '10000-25000', '25000-50000', '50000-'].map((range) => (
                  <label key={range} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="stipend"
                      value={range}
                      checked={selectedStipend === range}
                      onChange={(e) => setSelectedStipend(e.target.value)}
                    />
                    <span className={styles.filterLabel}>
                      {range === 'all'
                        ? 'Any Amount'
                        : range === '50000-'
                        ? '₹50,000+'
                        : `₹${range.replace('-', '-₹')}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* RIGHT COLUMN: Cards Grid */}
        <div className={styles.cardsContainer}>
          {filteredInternships.length > 0 ? (
            <>
              <div className={styles.cardsGrid}>
                {getCurrentPageItems().map((internship) => (
                  <JobCard
                    key={internship._id || internship.id}
                    job={internship}
                    onClick={() => navigate(`/internships/${internship.internshipId || internship.internshipId}`)}
                  />
                ))}
              </div>
              {renderPagination()}
            </>
          ) : (
            <div className={styles.noResults}>
              <p className={styles.noResultsTitle}>No internships found</p>
              <p className={styles.noResultsText}>Try adjusting your filters or search terms</p>
              <button className={styles.resetBtn} onClick={clearAllFilters}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Internships;
