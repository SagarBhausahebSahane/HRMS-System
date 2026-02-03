
import React, { useState } from 'react';
import { DEPARTMENTS } from '../../utils/constants';
import { validateEmployeeData } from '../../utils/validators';

const EmployeeForm = ({ onSubmit, initialData = {}, loading = false }) => {
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || '',
    email: initialData.email || '',
    department: initialData.department || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const validationErrors = validateEmployeeData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form if successful
      if (!initialData.employee_id) {
        setFormData({
          full_name: '',
          email: '',
          department: '',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <div className="form-group">
        <label className="form-label">
          Full Name *
        </label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className={`form-input ${errors.full_name ? 'error' : ''}`}
          placeholder="Enter full name"
          disabled={loading || isSubmitting}
        />
        {errors.full_name && (
          <span className="error-text">{errors.full_name}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="Enter email address"
          disabled={loading || isSubmitting}
        />
        {errors.email && (
          <span className="error-text">{errors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Department *
        </label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className={`form-input ${errors.department ? 'error' : ''}`}
          disabled={loading || isSubmitting}
        >
          <option value="">Select Department</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && (
          <span className="error-text">{errors.department}</span>
        )}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData.employee_id ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
