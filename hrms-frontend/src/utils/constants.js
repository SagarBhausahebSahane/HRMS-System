export const API_BASE_URL ="https://hms-lite.onrender.com/api" || process.env.REACT_APP_API_BASE_URL;

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

export const STATUS_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' }
];

export const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'IT',
  'Customer Support',
  'Product',
  'Design'
];

export const RESPONSE_FORMAT = {
  result: 200,
  status: true,
  msg: '',
  data: null
};

export const APP_NAME = process.env.REACT_APP_APP_NAME || 'HRMS Lite';
