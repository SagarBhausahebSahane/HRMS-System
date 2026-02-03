import React, { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../../services/employeeService';
import { STATUS_OPTIONS } from '../../utils/constants';
import { validateAttendanceData } from '../../utils/validators';
import LoadingSpinner from '../common/LoadingSpinner';
import { FiChevronDown, FiSearch } from 'react-icons/fi';

const AttendanceForm = ({
  onSubmit,
  initialData = {},
  loading = false
}) => {
  const [formData, setFormData] = useState({
    employee_id: initialData.employee_id || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    status: initialData.status || 'present',
  });

  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10,
    total: 0,
    hasMore: true
  });

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

  // Initial load
  useEffect(() => {
    fetchEmployees(0, 10);
  }, [fetchEmployees]);

  // Load more employees
  const loadMoreEmployees = async () => {
    if (loadingMore || !pagination.hasMore) return;

    const newSkip = pagination.skip + pagination.limit;
    await fetchEmployees(newSkip, pagination.limit, true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateAttendanceData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form if successful
      if (!initialData.id) {
        setFormData({
          employee_id: '',
          date: new Date().toISOString().split('T')[0],
          status: 'present',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="attendance-form">
      <div className="form-section">
        <h3 className="form-section-title">Select Employee</h3>

        {/* Employee Search */}
        <div className="form-group">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search employees by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Employee Selection Grid */}
        <div className="employee-selection-grid">
          {loadingEmployees ? (
            <div className="loading-employees">
              <LoadingSpinner size={30} />
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
                  className={`employee-option ${formData.employee_id === employee.employee_id ? 'selected' : ''}`}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, employee_id: employee.employee_id }));
                    setErrors(prev => ({ ...prev, employee_id: '' }));
                  }}
                >
                  <div className="employee-option-avatar">
                    {employee.full_name.charAt(0)}
                  </div>
                  <div className="employee-option-info">
                    <h4 className="employee-option-name">{employee.full_name}</h4>
                    <p className="employee-option-id">{employee.employee_id}</p>
                    <p className="employee-option-dept">{employee.department}</p>
                  </div>
                  {formData.employee_id === employee.employee_id && (
                    <div className="employee-option-check">
                      ✓
                    </div>
                  )}
                </div>
              ))}

              {/* Load More Button */}
              {pagination.hasMore && !searchTerm && (
                <div className="load-more-employees">
                  <button
                    type="button"
                    onClick={loadMoreEmployees}
                    disabled={loadingMore}
                    className="btn btn-outline"
                  >
                    {loadingMore ? (
                      <>
                        <LoadingSpinner size={16} />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <FiChevronDown className="btn-icon" />
                        <span>Load More ({pagination.total - employees.length} remaining)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {errors.employee_id && (
          <span className="error-text">{errors.employee_id}</span>
        )}
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Attendance Details</h3>

        <div className="form-group">
          <label className="form-label">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`form-input ${errors.date ? 'error' : ''}`}
            disabled={loading || isSubmitting}
          />
          {errors.date && (
            <span className="error-text">{errors.date}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Status
          </label>
          <div className="status-options-grid">
            {STATUS_OPTIONS.map(option => (
              <div
                key={option.value}
                className={`status-option-card ${formData.status === option.value ? 'selected' : ''} ${option.value}`}
                onClick={() => {
                  setFormData(prev => ({ ...prev, status: option.value }));
                  setErrors(prev => ({ ...prev, status: '' }));
                }}
              >
                <div className="status-option-icon">
                  {option.value === 'present' ? '✓' : '✗'}
                </div>
                <div className="status-option-text">
                  <h4>{option.label}</h4>
                  <p>{option.value === 'present' ? 'Employee is present' : 'Employee is absent'}</p>
                </div>
              </div>
            ))}
          </div>
          {errors.status && (
            <span className="error-text">{errors.status}</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading || isSubmitting || loadingEmployees}
        >
          {isSubmitting ? 'Marking Attendance...' : 'Mark Attendance'}
        </button>
      </div>
    </form>
  );
};

export default AttendanceForm;
