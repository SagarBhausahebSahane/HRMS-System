import React, { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employeeService';
import { attendanceService } from '../services/attendanceService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiUsers, FiCalendar, FiCheckCircle, FiXCircle, FiTrendingUp, FiChevronDown } from 'react-icons/fi';
import { formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalAttendance: 0,
    todayPresent: 0,
    todayAbsent: 0
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [limit, setLimit] = useState(5); // Single limit for both

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch statistics and recent data in parallel
      // Using skip=0 and same limit for both
      const [
        employeeStatsRes,
        attendanceStatsRes,
        recentEmployeesRes,
        recentAttendanceRes
      ] = await Promise.all([
        employeeService.getEmployeeStats(),
        attendanceService.getAttendanceStats(),
        employeeService.getEmployees(0, limit),  // skip=0, limit=limit
        attendanceService.getAttendance(0, limit) // skip=0, limit=limit
      ]);

      // Update statistics from stats endpoints
      setStats({
        totalEmployees: employeeStatsRes.data?.total_employees || 0,
        totalAttendance: attendanceStatsRes.data?.total_attendance || 0,
        todayPresent: attendanceStatsRes.data?.today_present || 0,
        todayAbsent: attendanceStatsRes.data?.today_absent || 0
      });

      // Update recent data (extract from paginated response)
      setRecentEmployees(recentEmployeesRes.data?.employees || []);
      setRecentAttendance(recentAttendanceRes.data?.attendance || []);

    } catch (err) {
      setError(err.msg || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle limit change
  const handleLimitChange = (value) => {
    setLimit(parseInt(value) || 5);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} retry={fetchDashboardData} />;

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">HRMS Lite Overview</p>
        </div>

        <div className="header-actions">
          <div className="limit-control">
            <label className="limit-label">
              <FiChevronDown className="limit-icon" />
              Show Recent:
            </label>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(e.target.value)}
              className="limit-select"
            >
              <option value="3">3 Items</option>
              <option value="5">5 Items</option>
              <option value="10">10 Items</option>
              <option value="15">15 Items</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">
            <FiUsers className="text-blue-600" size={24} />
          </div>
          <div className="stat-info">
            <h3 className="stat-value">{stats.totalEmployees}</h3>
            <p className="stat-label">Total Employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-green-100">
            <FiCalendar className="text-green-600" size={24} />
          </div>
          <div className="stat-info">
            <h3 className="stat-value">{stats.totalAttendance}</h3>
            <p className="stat-label">Total Attendance</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-green-100">
            <FiCheckCircle className="text-green-600" size={24} />
          </div>
          <div className="stat-info">
            <h3 className="stat-value">{stats.todayPresent}</h3>
            <p className="stat-label">Today Present</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-red-100">
            <FiXCircle className="text-red-600" size={24} />
          </div>
          <div className="stat-info">
            <h3 className="stat-value">{stats.todayAbsent}</h3>
            <p className="stat-label">Today Absent</p>
          </div>
        </div>
      </div>

      {/* Recent Data */}
      <div className="dashboard-sections">
        <div className="recent-section">
          <div className="section-header">
            <div className="section-title-with-icon">
              <FiTrendingUp className="section-icon" />
              <h2 className="section-title">Recent Employees</h2>
            </div>
            <Link to="/employees" className="view-all-link">
              View All →
            </Link>
          </div>

          {recentEmployees.length === 0 ? (
            <p className="empty-text">No recent employees</p>
          ) : (
            <div className="recent-list">
              {recentEmployees.map(emp => (
                <div key={emp.employee_id} className="recent-item">
                  <div className="recent-item-main">
                    <span className="recent-item-title">{emp.full_name}</span>
                    <span className="recent-item-subtitle">{emp.employee_id}</span>
                  </div>
                  <div className="recent-item-right">
                    <span className="recent-item-meta">{emp.department}</span>
                    <span className="recent-item-date">{formatDate(emp.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="section-footer">
            <p className="section-count">
              Showing {recentEmployees.length} recent employees
            </p>
          </div>
        </div>

        <div className="recent-section">
          <div className="section-header">
            <div className="section-title-with-icon">
              <FiCalendar className="section-icon" />
              <h2 className="section-title">Recent Attendance</h2>
            </div>
            <Link to="/attendance" className="view-all-link">
              View All →
            </Link>
          </div>

          {recentAttendance.length === 0 ? (
            <p className="empty-text">No recent attendance records</p>
          ) : (
            <div className="recent-list">
              {recentAttendance.map(record => (
                <div key={record.id} className="recent-item">
                  <div className="recent-item-main">
                    <span className="recent-item-title">{record.employee_name}</span>
                    <span className="recent-item-subtitle">{formatDate(record.date)}</span>
                  </div>
                  <div className="recent-item-right">
                    <span className={`status-badge ${record.status}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                    <span className="recent-item-date">{formatDate(record.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="section-footer">
            <p className="section-count">
              Showing {recentAttendance.length} recent records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
