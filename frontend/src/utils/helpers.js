
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'present':
      return 'bg-green-100 text-green-800';
    case 'absent':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const calculateAttendanceStats = (attendanceRecords) => {
  const total = attendanceRecords.length;
  const present = attendanceRecords.filter(record => record.status === 'present').length;
  const absent = total - present;

  return {
    total,
    present,
    absent,
    presentPercentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0
  };
};
