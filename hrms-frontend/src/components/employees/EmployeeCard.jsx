
import React from 'react';
import { FiUser, FiMail, FiBriefcase, FiCalendar, FiTrash2 } from 'react-icons/fi';
import { formatDateTime } from '../../utils/helpers';

const EmployeeCard = ({ employee, onDelete }) => {
  return (
    <div className="employee-card">
      <div className="employee-header">
        <div className="employee-id">{employee.employee_id}</div>
        {onDelete && (
          <button
            onClick={() => onDelete(employee.employee_id)}
            className="delete-btn"
            title="Delete Employee"
          >
            <FiTrash2 size={16} />
          </button>
        )}
      </div>

      <div className="employee-body">
        <h3 className="employee-name">{employee.full_name}</h3>

        <div className="employee-details">
          <div className="detail-item">
            <FiMail className="detail-icon" />
            <span>{employee.email}</span>
          </div>

          <div className="detail-item">
            <FiBriefcase className="detail-icon" />
            <span>{employee.department}</span>
          </div>

          <div className="detail-item">
            <FiCalendar className="detail-icon" />
            <span>Joined: {formatDateTime(employee.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
