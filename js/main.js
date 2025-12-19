// main.js - Registration and Logout handlers (jQuery version)

$(document).ready(function() {
  var $registerForm = $('#registerForm');

  if ($registerForm.length) {
    // Clear error messages on input
    $registerForm.find('input').on('input', function() {
      var $input = $(this);
      var fieldName = $input.attr('name');
      $input.removeClass('error');
      $('#' + fieldName + '-error').hide().text('');
    });

    $registerForm.on('submit', function(e) {
      e.preventDefault();

      // Clear previous errors
      $registerForm.find('input').removeClass('error');
      $registerForm.find('.error-message').hide().text('');

      var $submitButton = $registerForm.find('button[type="submit"]');
      var originalText = $submitButton.text();
      
      // Basic client-side validation
      var isValid = true;
      $registerForm.find('input[required]').each(function() {
        var $input = $(this);
        var value = $input.val().trim();
        var fieldName = $input.attr('name');
        
        if (!value) {
          isValid = false;
          $input.addClass('error');
          $('#' + fieldName + '-error').text('This field is required').show();
        }
      });

      // Email validation
      var email = $registerForm.find('input[name="email"]').val().trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        isValid = false;
        $registerForm.find('input[name="email"]').addClass('error');
        $('#email-error').text('Please enter a valid email address').show();
      }

      // Password validation
      var password = $registerForm.find('input[name="password"]').val();
      if (password && password.length < 6) {
        isValid = false;
        $registerForm.find('input[name="password"]').addClass('error');
        $('#password-error').text('Password must be at least 6 characters').show();
      }

      if (!isValid) {
        return;
      }

      $submitButton.prop('disabled', true).text('Registering...');

      var data = {
        firstname: $registerForm.find('input[name="firstname"]').val().trim(),
        lastname: $registerForm.find('input[name="lastname"]').val().trim(),
        username: $registerForm.find('input[name="username"]').val().trim(),
        email: email,
        password: password
      };

      $.ajax({
        url: API_BASE + '/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        timeout: 30000
      })
      .done(function(response) {
        // Success - show clear message about email activation
        var successMessage = response.message || 'Registration successful! Please check your email to activate your account.';
        alert(successMessage + '\n\nYou will be redirected to the login page.');
        $registerForm[0].reset();
        // Small delay before redirect to let user see the message
        setTimeout(function() {
          window.location.href = 'login.html';
        }, 500);
      })
      .fail(function(jqXHR) {
        console.error('Registration error:', jqXHR);
        
        // Clear previous errors
        $registerForm.find('input').removeClass('error');
        $registerForm.find('.error-message').hide().text('');
        
        var errorMsg = 'Registration failed. Please try again.';
        var hasFieldErrors = false;
        
        if (jqXHR.responseJSON) {
          // Handle validation errors from Laravel
          if (jqXHR.responseJSON.errors) {
            var errors = jqXHR.responseJSON.errors;
            hasFieldErrors = true;
            
            // Display field-specific errors
            for (var field in errors) {
              var $input = $registerForm.find('input[name="' + field + '"]');
              if ($input.length) {
                $input.addClass('error');
                var errorText = Array.isArray(errors[field]) ? errors[field][0] : errors[field];
                $('#' + field + '-error').text(errorText).show();
              }
            }
            
            // Also show general message
            errorMsg = 'Please correct the errors below.';
          } else if (jqXHR.responseJSON.message) {
            errorMsg = jqXHR.responseJSON.message;
          }
        } else if (jqXHR.status === 0) {
          errorMsg = 'Network error. Please check your connection and try again.';
        } else if (jqXHR.status >= 500) {
          errorMsg = 'Server error. Please try again later.';
        }
        
        if (!hasFieldErrors) {
          alert(errorMsg);
        } else {
          // Scroll to first error
          var $firstError = $registerForm.find('input.error').first();
          if ($firstError.length) {
            $('html, body').animate({
              scrollTop: $firstError.offset().top - 100
            }, 500);
          }
        }
      })
      .always(function() {
        $submitButton.prop('disabled', false).text(originalText);
      });
    });
  }

  // Logout Handler
  var $logoutBtn = $('#logoutBtn');

  if ($logoutBtn.length) {
    $logoutBtn.on('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
});

function logout() {
  var token = localStorage.getItem('authToken');

  if (!token) {
    alert('No token found, please log in again.');
    window.location.href = 'login.html';
    return;
  }

  $.ajax({
    url: API_BASE + '/logout',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    data: {}
  })
  .done(function(response) {
    console.log('Logout response:', response);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userInfo');
    alert('Logged out successfully!');
    window.location.href = 'login.html';
  })
  .fail(function(jqXHR) {
    console.error('Network error during logout:', jqXHR);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userInfo');
    
    var errorMsg = 'Network error, but you\'ve been logged out locally.';
    if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
      errorMsg = jqXHR.responseJSON.error;
    }
    alert(errorMsg);
    window.location.href = 'login.html';
  });
}
