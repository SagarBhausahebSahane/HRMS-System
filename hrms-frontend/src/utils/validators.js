
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateEmployeeData = (data) => {
  const errors = {};

  if (!data.full_name?.trim()) {
    errors.full_name = 'Full name is required';
  } else if (data.full_name.trim().length < 2) {
    errors.full_name = 'Full name must be at least 2 characters';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email.trim())) {
    errors.email = 'Invalid email format';
  }

  if (!data.department?.trim()) {
    errors.department = 'Department is required';
  } else if (data.department.trim().length < 2) {
    errors.department = 'Department must be at least 2 characters';
  }

  return errors;
};

export const validateAttendanceData = (data) => {
  const errors = {};

  if (!data.employee_id?.trim()) {
    errors.employee_id = 'Employee ID is required';
  }

  if (!data.date) {
    errors.date = 'Date is required';
  }

  if (!data.status) {
    errors.status = 'Status is required';
  } else if (!['present', 'absent'].includes(data.status)) {
    errors.status = 'Status must be either Present or Absent';
  }

  return errors;
};
