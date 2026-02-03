import React from 'react';
import { FiX } from 'react-icons/fi';
import './common.css';

const Modal = ({ isOpen, onClose, title, children, size = 'md', fullScreen = false }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
    full: 'modal-full'
  };

  return (
    <div className={`modal-overlay ${fullScreen ? 'modal-fullscreen' : ''}`} onClick={onClose}>
      <div
        className={`modal-content ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button onClick={onClose} className="modal-close-btn">
            <FiX size={24} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
