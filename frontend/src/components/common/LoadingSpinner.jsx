
import React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import './common.css';

const LoadingSpinner = ({ size = 40, color = "#3b82f6" }) => {
  return (
    <div className="loading-container">
      <ThreeDots
        height={size}
        width={size}
        radius={9}
        color={color}
        ariaLabel="loading"
        visible={true}
      />
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
