
import React from 'react';
import { FiInbox } from 'react-icons/fi';
import './common.css';

const EmptyState = ({
  message = "No data found",
  subMessage = "Add some data to get started",
  icon: Icon = FiInbox,
  action = null
}) => {
  return (
    <div className="empty-state">
      <Icon className="empty-icon" />
      <h3 className="empty-title">{message}</h3>
      <p className="empty-subtitle">{subMessage}</p>
      {action && (
        <div className="empty-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
