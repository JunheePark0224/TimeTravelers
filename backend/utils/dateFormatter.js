// utils/dateFormatter.js
// Utility function to format dates into YYYY-MM-DD format

exports.formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };