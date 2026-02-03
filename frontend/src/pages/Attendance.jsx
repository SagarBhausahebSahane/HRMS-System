import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { attendanceService } from '../services/attendanceService';
import AttendanceForm from '../components/attendance/AttendanceForm';
import AttendanceFilter from '../components/attendance/AttendanceFilter';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiCalendar, FiPlus, FiDownload, FiChevronDown } from 'react-icons/fi';
import { formatDate, calculateAttendanceStats } from '../utils/helpers';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 15,
    total: 0,
    hasMore: true
  });

  // Fetch attendance with pagination
  const fetchAttendance = useCallback(async (skip = 0, limit = 15, isLoadMore = false, filterParams = {}) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);
      const response = await attendanceService.getAttendance(skip, limit, filterParams);
      const newAttendance = response.data?.attendance || [];
      const paginationData = response.data?.pagination || {};

      if (isLoadMore) {
        setAttendance(prev => [...prev, ...newAttendance]);
      } else {
        setAttendance(newAttendance);
      }

      setPagination({
        skip: paginationData.skip || skip,
        limit: paginationData.limit || limit,
        total: paginationData.total || 0,
        hasMore: paginationData.has_more || false
      });

    } catch (err) {
      setError(err.msg || 'Failed to load attendance');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAttendance(0, 15);
  }, []);

  // Load more attendance
  const loadMoreAttendance = async () => {
    if (loadingMore || !pagination.hasMore) return;

    const newSkip = pagination.skip + pagination.limit;
    await fetchAttendance(newSkip, pagination.limit, true, filters);
  };

  // Handle filter changes
  const handleFilter = (filterParams) => {
    setFilters(filterParams);
    fetchAttendance(0, pagination.limit, false, filterParams);
  };

  const handleMarkAttendance = async (attendanceData) => {
    try {
      const response = await attendanceService.markAttendance(attendanceData);
      setAttendance(prev => [response.data, ...prev]);
      setPagination(prev => ({
        ...prev,
        total: prev.total + 1
      }));
      setShowMarkModal(false);
      toast.success('Attendance marked successfully');
    } catch (err) {
      throw err;
    }
  };

  const exportAttendance = () => {
    const csvContent = [
      ['Employee ID', 'Employee Name', 'Date', 'Status', 'Department', 'Marked At'],
      ...attendance.map(record => [
        record.employee_id,
        record.employee_name,
        record.date,
        record.status,
        record.employee_department,
        formatDate(record.created_at)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Attendance exported successfully');
  };

  const stats = calculateAttendanceStats(attendance);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} retry={() => fetchAttendance(0, 15, false, filters)} />;

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Track and manage employee attendance</p>
        </div>

        <div className="header-actions">
          <AttendanceFilter
            onFilter={handleFilter}
            initialFilters={filters}
          />

          <button
            onClick={exportAttendance}
            className="btn btn-secondary"
            disabled={attendance.length === 0}
          >
            <FiDownload className="btn-icon" />
            Export CSV
          </button>

          <button
            onClick={() => setShowMarkModal(true)}
            className="btn btn-primary"
          >
            <FiPlus className="btn-icon" />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {attendance.length > 0 && (
        <div className="attendance-stats">
          <div className="stat-summary">
            <div className="stat-item">
              <div className="stat-icon">
                <FiCalendar />
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{stats.total}</h3>
                <p className="stat-label">Total Records</p>
              </div>
            </div>
            <div className="stat-item present">
              <div className="stat-icon">
                ✓
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{stats.present}</h3>
                <p className="stat-label">Present</p>
              </div>
            </div>
            <div className="stat-item absent">
              <div className="stat-icon">
                ✗
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{stats.absent}</h3>
                <p className="stat-label">Absent</p>
              </div>
            </div>
            <div className="stat-item percentage">
              <div className="stat-icon">
                %
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{stats.presentPercentage}%</h3>
                <p className="stat-label">Present %</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {attendance.length === 0 ? (
        <EmptyState
          message="No Attendance Records Found"
          subMessage={filters.date || filters.employee_id
            ? "No records match your filters"
            : "Mark your first attendance record to get started"
          }
          icon={FiCalendar}
          action={
            <button
              onClick={() => setShowMarkModal(true)}
              className="btn btn-primary"
            >
              <FiPlus className="btn-icon" />
              Mark Attendance
            </button>
          }
        />
      ) : (
        <>
          <div className="attendance-list-container">
            <div className="attendance-list">
              <div className="attendance-header">
                <div className="header-cell">Employee</div>
                <div className="header-cell">Date</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Department</div>
                <div className="header-cell">Marked At</div>
              </div>

              {attendance.map(record => (
                <div key={record.id} className="attendance-row">
                  <div className="cell">
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {record.employee_name.charAt(0)}
                      </div>
                      <div className="employee-details">
                        <span className="employee-name">{record.employee_name}</span>
                        <span className="employee-id">{record.employee_id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="cell">
                    <span className="date">{formatDate(record.date)}</span>
                  </div>
                  <div className="cell">
                    <span className={`status-badge ${record.status}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                  <div className="cell">
                    <span className="department">{record.employee_department}</span>
                  </div>
                  <div className="cell">
                    <span className="timestamp">{formatDate(record.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Load More Button */}
          {pagination.hasMore && (
            <div className="load-more-container">
              <button
                onClick={loadMoreAttendance}
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
                    <span>Load More ({pagination.total - attendance.length} remaining)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Total Count */}
          <div className="total-count">
            Showing {attendance.length} of {pagination.total} attendance records
          </div>

          {/* No More Results Message */}
          {!pagination.hasMore && attendance.length > 0 && (
            <div className="no-more-results">
              <p>All {pagination.total} attendance records loaded</p>
            </div>
          )}
        </>
      )}

      {/* Mark Attendance Modal - Full Screen */}
      <Modal
        isOpen={showMarkModal}
        onClose={() => setShowMarkModal(false)}
        title="Mark Attendance"
        size="full"
        fullScreen={true}
      >
        <AttendanceForm
          onSubmit={handleMarkAttendance}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default Attendance;
