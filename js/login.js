// login.js - Handle Login Form (jQuery version)

$(document).ready(function() {
  var $loginForm = $('#loginForm');

  if ($loginForm.length) {
    $loginForm.on('submit', function(e) {
      e.preventDefault();

      var data = {
        username: $loginForm.find('input[name="username"]').val(),
        password: $loginForm.find('input[name="password"]').val()
      };

      $.ajax({
        url: API_BASE + '/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data)
      })
      .done(function(response) {
        // Store token and user info
        localStorage.setItem('authToken', response.token);
        if (response.user) {
          localStorage.setItem('userRole', response.user.role);
          localStorage.setItem('userInfo', JSON.stringify(response.user));
        }

        alert('Login successful!');
        
        // Redirect to unified dashboard; it will show role-specific content
        window.location.href = 'dashboard.html';
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Login error:', {
          status: jqXHR.status,
          statusText: jqXHR.statusText,
          textStatus: textStatus,
          errorThrown: errorThrown,
          response: jqXHR.responseJSON,
          responseText: jqXHR.responseText,
          url: API_BASE + '/login'
        });
        
        var errorMsg = 'Network error. Please try again later.';
        
        // Handle CORS errors
        if (textStatus === 'error' && jqXHR.status === 0) {
          errorMsg = 'CORS Error: Unable to connect to the server. Please check if the backend is accessible and CORS is properly configured.';
        } else if (jqXHR.responseJSON) {
          if (jqXHR.responseJSON.message) {
            errorMsg = jqXHR.responseJSON.message;
          } else if (jqXHR.responseJSON.error) {
            errorMsg = jqXHR.responseJSON.error;
          }
        } else if (jqXHR.status === 404) {
          errorMsg = 'API endpoint not found. Please verify the backend URL is correct.';
        } else if (jqXHR.status === 500) {
          errorMsg = 'Server error. Please try again later or contact support.';
        } else if (jqXHR.status === 0) {
          errorMsg = 'Network error: Unable to reach the server. Check your internet connection and verify the backend URL.';
        }
        
        alert(errorMsg);
      });
    });
  }
});
