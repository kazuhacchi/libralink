// dashboard.js - Dashboard statistics (jQuery version)

// API_BASE is defined in config.js
var DASHBOARD_API_BASE = API_BASE;

// Load dashboard stats
function loadDashboardStats() {
  return authAxios({
    method: 'GET',
    url: DASHBOARD_API_BASE + '/dashboard'
  }).then(function(response) {
    if (response && response.data) {
      return response.data;
    }
    throw new Error('Invalid response from dashboard API');
  }).catch(function(err) {
    console.error('Error loading dashboard stats:', err);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
    throw err;
  });
}
