import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { employeeService } from '../services/employeeService';
import EmployeeCard from '../components/employees/EmployeeCard';
import EmployeeForm from '../components/employees/EmployeeForm';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiUserPlus, FiSearch, FiChevronDown } from 'react-icons/fi';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10,
    total: 0,
    hasMore: true
  });

  // Fetch employees with current pagination
  const fetchEmployees = useCallback(async (skip = 0, limit = 10, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);
      const response = await employeeService.getEmployees(skip, limit);
      const newEmployees = response.data?.employees || [];
      const paginationData = response.data?.pagination || {};

      console.log('API Response:', response.data); // Debug log
      console.log('Pagination data:', paginationData); // Debug log

      if (isLoadMore) {
        // Append new employees when loading more
        setEmployees(prev => [...prev, ...newEmployees]);
      } else {
        // Replace employees when first load or search
        setEmployees(newEmployees);
      }

      // Update pagination info - handle both has_more and hasMore
      const hasMoreValue = paginationData.has_more !== undefined
        ? paginationData.has_more
        : paginationData.hasMore || false;

      setPagination({
        skip: paginationData.skip || skip,
        limit: paginationData.limit || limit,
        total: paginationData.total || 0,
        hasMore: hasMoreValue
      });

      console.log('Updated pagination:', {
        skip: paginationData.skip || skip,
        limit: paginationData.limit || limit,
        total: paginationData.total || 0,
        hasMore: hasMoreValue
      }); // Debug log

      if (isLoadMore) {
        toast.success(`Loaded ${newEmployees.length} more employees`);
      }
    } catch (err) {
      setError(err.msg || 'Failed to load employees');
      if (isLoadMore) {
        toast.error(err.msg || 'Failed to load more employees');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchEmployees(0, 10);
  }, []);

  // Load more employees
  const loadMoreEmployees = async () => {
    console.log('Load More Clicked:', {
      loadingMore,
      hasMore: pagination.hasMore,
      searchTerm,
      skip: pagination.skip,
      limit: pagination.limit
    }); // Debug log

    if (loadingMore || !pagination.hasMore || searchTerm) {
      console.log('Cannot load more:', {
        loadingMore,
        hasMore: pagination.hasMore,
        searchTerm
      });
      return;
    }

    const newSkip = pagination.skip + pagination.limit;
    console.log('Loading more from skip:', newSkip); // Debug log
    await fetchEmployees(newSkip, pagination.limit, true);
  };

  // Handle search - reset to first page
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      // Reset to first page when search is cleared
      fetchEmployees(0, 10);
    }
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      const response = await employeeService.createEmployee(employeeData);
      // Add new employee to beginning and increase total count
      setEmployees(prev => [response.data, ...prev]);
      setPagination(prev => ({
        ...prev,
        total: prev.total + 1
      }));
      setShowAddModal(false);
      toast.success('Employee added successfully');
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      await employeeService.deleteEmployee(employeeId);
      setEmployees(prev => prev.filter(emp => emp.employee_id !== employeeId));
      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1)
      }));
      toast.success('Employee deleted successfully');
    } catch (err) {
      toast.error(err.msg || 'Failed to delete employee');
    }
  };

  // Filter employees based on search term (client-side filtering)
  const filteredEmployees = employees.filter(employee =>
    employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Debug log to check current state
  console.log('Current State:', {
    employeesCount: employees.length,
    filteredCount: filteredEmployees.length,
    pagination,
    searchTerm,
    canLoadMore: pagination.hasMore && !searchTerm && !loadingMore
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} retry={() => fetchEmployees(0, 10)} />;

  return (
    <div className="employees-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage employee records</p>
        </div>

        <div className="header-actions">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <FiUserPlus className="btn-icon" />
            Add Employee
          </button>
        </div>
      </div>

      {employees.length === 0 ? (
        <EmptyState
          message="No Employees Found"
          subMessage="Add your first employee to get started"
          action={
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              <FiUserPlus className="btn-icon" />
              Add Employee
            </button>
          }
        />
      ) : (
        <>
          {/* Show filtered count when searching */}
          {searchTerm && filteredEmployees.length > 0 && (
            <div className="search-info">
              <p className="search-info-text">
                Found {filteredEmployees.length} employee(s) matching "{searchTerm}"
              </p>
            </div>
          )}

          {/* Show no results message when search has no matches */}
          {searchTerm && filteredEmployees.length === 0 ? (
            <EmptyState
              message="No matching employees found"
              subMessage="Try adjusting your search criteria"
            />
          ) : (
            <>
              <div className="employees-grid">
                {(searchTerm ? filteredEmployees : employees).map(employee => (
                  <EmployeeCard
                    key={employee.employee_id}
                    employee={employee}
                    onDelete={handleDeleteEmployee}
                  />
                ))}
              </div>

              {/* Load More Button - only show when not searching */}
              {pagination.hasMore && !searchTerm && (
                <div className="load-more-container">
                  <button
                    onClick={loadMoreEmployees}
                    disabled={loadingMore}
                    className="btn btn-secondary load-more-btn"
                  >
                    {loadingMore ? (
                      <>
                        <LoadingSpinner size={16} color="#fff" />
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

              {/* Total Count */}
              <div className="total-count">
                Showing {searchTerm ? filteredEmployees.length : employees.length}
                {pagination.total > 0 && ` of ${pagination.total}`} employees

                {searchTerm && (
                  <span className="filtered-count">
                    (filtered from {employees.length} loaded)
                  </span>
                )}
              </div>

              {/* No More Results Message */}
              {!pagination.hasMore && !searchTerm && employees.length > 0 && (
                <div className="no-more-results">
                  <p>All {pagination.total} employees loaded</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Employee"
        size="md"
      >
        <EmployeeForm
          onSubmit={handleAddEmployee}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default Employees;
