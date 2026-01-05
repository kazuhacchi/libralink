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
          // Prioritize error field, then message field
          if (jqXHR.responseJSON.error) {
            errorMsg = jqXHR.responseJSON.error;
            // If there's also a message, append it
            if (jqXHR.responseJSON.message && jqXHR.responseJSON.message !== errorMsg) {
              errorMsg += '\n\n' + jqXHR.responseJSON.message;
            }
          } else if (jqXHR.responseJSON.message) {
            errorMsg = jqXHR.responseJSON.message;
          }
        } else if (jqXHR.responseText) {
          // Try to parse as JSON if responseText exists
          try {
            var parsed = JSON.parse(jqXHR.responseText);
            if (parsed.error) {
              errorMsg = parsed.error;
            } else if (parsed.message) {
              errorMsg = parsed.message;
            }
          } catch (e) {
            // If not JSON, use the raw response text
            errorMsg = jqXHR.responseText.substring(0, 200);
          }
        } else if (jqXHR.status === 404) {
          errorMsg = 'API endpoint not found. Please verify the backend URL is correct.';
        } else if (jqXHR.status === 500) {
          errorMsg = 'Server error (500). Check the console for details or contact support.';
          if (jqXHR.responseText) {
            errorMsg += '\n\nServer response: ' + jqXHR.responseText.substring(0, 200);
          }
        } else if (jqXHR.status === 0) {
          errorMsg = 'Network error: Unable to reach the server. Check your internet connection and verify the backend URL.';
        }
        
        alert(errorMsg);
      });
    });
  }
});
