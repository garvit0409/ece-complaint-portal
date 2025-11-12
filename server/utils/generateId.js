const { v4: uuidv4 } = require('uuid');

// Generate unique complaint ID
const generateComplaintId = () => {
  const year = new Date().getFullYear();
  const randomId = uuidv4().split('-')[0].toUpperCase();
  return `ECE-COMP-${year}-${randomId}`;
};

// Generate employee ID for teachers/mentors/hod
const generateEmployeeId = (role) => {
  const year = new Date().getFullYear();
  const randomId = uuidv4().split('-')[0].toUpperCase();
  const rolePrefix = role === 'hod' ? 'HOD' : role === 'mentor' ? 'MEN' : 'TEC';
  return `${rolePrefix}-${year}-${randomId}`;
};

module.exports = {
  generateComplaintId,
  generateEmployeeId,
};
