
import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import './common.css';

const ErrorMessage = ({
  message = "An error occurred",
  retry = null
}) => {
  return (
    <div className="error-state">
      <FiAlertTriangle className="error-icon" />
      <h3 className="error-title">{message}</h3>
      {retry && (
        <button onClick={retry} className="btn btn-primary">
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
