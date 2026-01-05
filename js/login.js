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
  headers: {
    'Accept': 'application/json'
  },
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
      .fail(function(jqXHR) {
        console.error('Login error:', jqXHR);
        var errorMsg = 'Network error. Please try again later.';
        if (jqXHR.responseJSON) {
          if (jqXHR.responseJSON.message) {
            errorMsg = jqXHR.responseJSON.message;
          } else if (jqXHR.responseJSON.error) {
            errorMsg = jqXHR.responseJSON.error;
          }
        }
        alert(errorMsg);
      });
    });
  }
});
