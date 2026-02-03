import React, { useState, useEffect, useCallback, useRef } from 'react';
import { employeeService } from '../../services/employeeService';
import { FiFilter, FiCalendar, FiUser, FiSearch, FiChevronDown, FiX } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';

const AttendanceFilter = ({
  onFilter,
  initialFilters = {}
}) => {
  const filterRef = useRef();

  const [filters, setFilters] = useState({
    employee_id: initialFilters.employee_id || '',
    date: initialFilters.date || '',
  });

  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10,
    total: 0,
    hasMore: true
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Get today's date in correct format YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch employees with pagination
  const fetchEmployees = useCallback(async (skip = 0, limit = 10, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoadingEmployees(true);
      } else {
        setLoadingMore(true);
      }

      const response = await employeeService.getEmployees(skip, limit);
      const newEmployees = response.data?.employees || [];
      const paginationData = response.data?.pagination || {};

      if (isLoadMore) {
        setEmployees(prev => [...prev, ...newEmployees]);
      } else {
        setEmployees(newEmployees);
      }

      setPagination({
        skip: paginationData.skip || skip,
        limit: paginationData.limit || limit,
        total: paginationData.total || 0,
        hasMore: paginationData.has_more || false
      });

    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoadingEmployees(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load when filter opens
  useEffect(() => {
    if (isOpen) {
      fetchEmployees(0, 10);
    }
  }, [isOpen, fetchEmployees]);

  // Load more employees
  const loadMoreEmployees = async () => {
    if (loadingMore || !pagination.hasMore) return;

    const newSkip = pagination.skip + pagination.limit;
    await fetchEmployees(newSkip, pagination.limit, true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setFilters(prev => ({
      ...prev,
      date: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({
      employee_id: '',
      date: '',
    });
    onFilter({});
    setIsOpen(false);
  };

  // Quick actions for date
  const handleTodayClick = () => {
    const today = getTodayDate();
    setFilters(prev => ({
      ...prev,
      date: today
    }));
  };

  const handleYesterdayClick = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');

    setFilters(prev => ({
      ...prev,
      date: `${year}-${month}-${day}`
    }));
  };

  const handleClearDate = () => {
    setFilters(prev => ({
      ...prev,
      date: ''
    }));
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="filter-container" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary filter-toggle-btn"
      >
        <FiFilter className="filter-icon" />
        Filter
        {(filters.employee_id || filters.date) && (
          <span className="filter-indicator"></span>
        )}
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-header">
            <h3 className="filter-title">Filter Attendance</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="filter-close-btn"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="filter-form">
            <div className="form-section">
              <h3 className="form-section-title">
                <FiUser className="inline-icon" />
                Filter by Employee
              </h3>

              {/* Employee Search */}
              <div className="form-group">
                <div className="search-container small">
                  <FiSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              {/* Employee Selection */}
              <div className="employee-filter-grid">
                {loadingEmployees ? (
                  <div className="loading-employees">
                    <LoadingSpinner size={20} />
                    <p>Loading employees...</p>
                  </div>
                ) : filteredEmployees.length === 0 ? (
                  <div className="no-employees">
                    <p>No employees found</p>
                  </div>
                ) : (
                  <>
                    {filteredEmployees.map(employee => (
                      <div
                        key={employee.employee_id}
                        className={`employee-filter-option ${filters.employee_id === employee.employee_id ? 'selected' : ''}`}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, employee_id: employee.employee_id }));
                          setSearchTerm('');
                        }}
                      >
                        <div className="employee-filter-avatar">
                          {employee.full_name.charAt(0)}
                        </div>
                        <div className="employee-filter-info">
                          <span className="employee-filter-name">{employee.full_name}</span>
                          <span className="employee-filter-id">{employee.employee_id}</span>
                        </div>
                      </div>
                    ))}

                    {/* Load More Button */}
                    {pagination.hasMore && !searchTerm && (
                      <div className="load-more-filter">
                        <button
                          type="button"
                          onClick={loadMoreEmployees}
                          disabled={loadingMore}
                          className="btn btn-outline btn-small"
                        >
                          {loadingMore ? (
                            <>
                              <LoadingSpinner size={14} />
                              <span>Loading...</span>
                            </>
                          ) : (
                            <>
                              <FiChevronDown className="btn-icon" />
                              <span>Load More</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Clear Selection Button */}
              {filters.employee_id && (
                <button
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, employee_id: '' }))}
                  className="btn btn-outline btn-small btn-clear"
                >
                  Clear Employee Selection
                </button>
              )}
            </div>

            <div className="form-section">
              <h3 className="form-section-title">
                <FiCalendar className="inline-icon" />
                Filter by Date
              </h3>

              {/* Quick Date Buttons */}
              <div className="quick-date-buttons">
                <button
                  type="button"
                  onClick={handleTodayClick}
                  className={`btn-quick-date ${filters.date === getTodayDate() ? 'active' : ''}`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={handleYesterdayClick}
                  className="btn-quick-date"
                >
                  Yesterday
                </button>
              </div>

              {/* Date Input */}
              <div className="form-group">
                <label className="form-label">Select Date</label>
                <div className="date-input-container">
                  <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleDateChange}
                    className="form-input"
                    max={getTodayDate()}
                  />
                  {filters.date && (
                    <button
                      type="button"
                      onClick={handleClearDate}
                      className="date-clear-btn"
                      title="Clear date"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>
                <p className="form-help-text">
                  Select a date to filter attendance records
                </p>
              </div>

              {/* Selected Date Display */}
              {filters.date && (
                <div className="selected-date-display">
                  <span className="selected-date-label">Selected Date:</span>
                  <span className="selected-date-value">
                    {new Date(filters.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Active Filters Summary */}
            <div className="active-filters-section">
              <h4 className="active-filters-title">Active Filters:</h4>
              <div className="active-filters-list">
                {!filters.employee_id && !filters.date ? (
                  <div className="no-filters">
                    <p>No filters applied</p>
                  </div>
                ) : (
                  <>
                    {filters.employee_id && (
                      <div className="active-filter-item">
                        <span className="active-filter-label">
                          <FiUser size={12} />
                          Employee:
                        </span>
                        <span className="active-filter-value">
                          {employees.find(e => e.employee_id === filters.employee_id)?.full_name || filters.employee_id}
                        </span>
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, employee_id: '' }))}
                          className="active-filter-remove"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    )}
                    {filters.date && (
                      <div className="active-filter-item">
                        <span className="active-filter-label">
                          <FiCalendar size={12} />
                          Date:
                        </span>
                        <span className="active-filter-value">
                          {new Date(filters.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <button
                          onClick={handleClearDate}
                          className="active-filter-remove"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="filter-actions">
              <button type="submit" className="btn btn-primary">
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
              >
                Clear All
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AttendanceFilter;
