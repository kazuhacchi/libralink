// auth.js - jQuery version

function requireAuth() {
  var token = localStorage.getItem('authToken');
  if (!token || typeof token !== 'string' || token.length < 10) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userInfo');
    alert('Session expired or invalid token. Please log in again.');
    window.location.href = 'login.html';
  }
}

function redirectIfLoggedIn() {
  var token = localStorage.getItem('authToken');
  var role = localStorage.getItem('userRole');
  if (token) {
    goToDashboardForRole(role);
  }
}

// Central helper: send user to the correct dashboard based on role
function goToDashboardForRole(role) {
  // Single unified dashboard; role-specific content handled inside dashboard.html
  window.location.href = 'dashboard.html';
}

// A helper function to wrap jQuery AJAX calls and handle 401 Unauthorized
function authAjax(options) {
  var token = localStorage.getItem('authToken');
  
  options.headers = options.headers || {};
  if (token) {
    options.headers['Authorization'] = 'Bearer ' + token;
  }
  
  // Return a promise-like object for compatibility
  return $.ajax(options).fail(function(jqXHR) {
    if (jqXHR.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userInfo');
      alert('Session expired or invalid token. Please log in again.');
      window.location.href = 'login.html';
    }
  });
}

// Legacy function for axios compatibility - wraps jQuery ajax in a promise
function authAxios(config) {
  var token = localStorage.getItem('authToken');
  config.headers = config.headers || {};
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  
  // Convert axios-style config to jQuery ajax config
  var ajaxConfig = {
    url: config.url,
    method: config.method || 'GET',
    headers: config.headers,
    contentType: config.headers['Content-Type'] === 'multipart/form-data' ? false : 'application/json',
    processData: config.headers['Content-Type'] === 'multipart/form-data' ? false : true
  };
  
  // Handle data
  if (config.data) {
    if (config.data instanceof FormData) {
      ajaxConfig.data = config.data;
      ajaxConfig.contentType = false;
      ajaxConfig.processData = false;
    } else if (typeof config.data === 'object') {
      ajaxConfig.data = JSON.stringify(config.data);
      ajaxConfig.contentType = 'application/json';
    } else {
      ajaxConfig.data = config.data;
    }
  }
  
  return new Promise(function(resolve, reject) {
    $.ajax(ajaxConfig)
      .done(function(data, textStatus, jqXHR) {
        resolve({
          data: data,
          status: jqXHR.status,
          statusText: textStatus
        });
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userInfo');
          alert('Session expired or invalid token. Please log in again.');
          window.location.href = 'login.html';
          reject(null);
          return;
        }
        
        var error = new Error(errorThrown || 'Request failed');
        error.response = {
          status: jqXHR.status,
          data: jqXHR.responseJSON || { message: errorThrown }
        };
        reject(error);
      });
  });
}
