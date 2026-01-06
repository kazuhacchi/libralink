// forgot.js - Forgot Password functionality (jQuery version)

// API_BASE is defined in config.js
var API_URL = API_BASE;

// Global variables to store data
var userEmail = '';
var verifiedOtp = '';
var resetToken = '';

$(document).ready(function() {
  // Check for token and email in URL parameters
  var urlParams = new URLSearchParams(window.location.search);
  var token = urlParams.get('token');
  var email = urlParams.get('email');
  
  if (token && email) {
    // Verify token and auto-fill email
    resetToken = token;
    userEmail = decodeURIComponent(email);
    
    // Verify token is valid
    $.ajax({
      url: API_URL + '/forgot-password/verify-token/' + token,
      method: 'GET'
    })
    .done(function(response) {
      // Token is valid, pre-fill email and show OTP step
      $('#forgotEmail').val(userEmail).prop('disabled', true);
      if (window.showStep) {
        window.showStep('step-otp');
      } else {
        $('#step-email').hide();
        $('#step-otp').show();
      }
      showMessage($('#emailMsg'), 'Please enter the OTP sent to your email.', 'success');
    })
    .fail(function(jqXHR) {
      var errorMsg = 'Invalid or expired link. Please request a new OTP.';
      if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
        errorMsg = jqXHR.responseJSON.error;
      }
      showMessage($('#emailMsg'), errorMsg, 'error');
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    });
  }
  // DOM elements using jQuery
  var $stepEmail = $('#step-email');
  var $stepOtp = $('#step-otp');
  var $stepReset = $('#step-reset');

  var $forgotEmailInput = $('#forgotEmail');
  var $otpInput = $('#otpInput');
  var $newPasswordInput = $('#newPassword');
  var $confirmPasswordInput = $('#confirmPassword');

  var $sendOtpBtn = $('#sendOtpBtn');
  var $verifyOtpBtn = $('#verifyOtpBtn');
  var $resetPasswordBtn = $('#resetPasswordBtn');

  var $emailMsg = $('#emailMsg');
  var $otpMsg = $('#otpMsg');
  var $resetMsg = $('#resetMsg');

  // Step 1: Send OTP
  $sendOtpBtn.on('click', function() {
    var email = $forgotEmailInput.val().trim();
    
    if (!email) {
      showMessage($emailMsg, 'Please enter your email address.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage($emailMsg, 'Please enter a valid email address.', 'error');
      return;
    }

    $sendOtpBtn.prop('disabled', true).text('Sending...');
    
    $.ajax({
      url: API_URL + '/forgot-password/send-otp',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email: email })
    })
    .done(function(response) {
      // Store email BEFORE showing success message
      userEmail = email;
      console.log('Email stored:', userEmail);
      showMessage($emailMsg, response.message, 'success');
      
      // Move to step 2 after 1 second
      setTimeout(function() {
        if (window.showStep) {
          window.showStep('step-otp');
        } else {
          $stepEmail.hide();
          $stepOtp.show();
        }
      }, 1000);
    })
    .fail(function(jqXHR) {
      console.error('Send OTP Error:', jqXHR);
      var errorMsg = 'Network error. Please try again.';
      if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
        errorMsg = jqXHR.responseJSON.error;
      }
      showMessage($emailMsg, errorMsg, 'error');
    })
    .always(function() {
      $sendOtpBtn.prop('disabled', false).text('Send OTP');
    });
  });

  // Step 2: Verify OTP
  $verifyOtpBtn.on('click', function() {
    var otp = $otpInput.val().trim();
    
    if (!otp) {
      showMessage($otpMsg, 'Please enter the OTP.', 'error');
      return;
    }

    if (otp.length !== 6) {
      showMessage($otpMsg, 'OTP must be 6 digits.', 'error');
      return;
    }

    $verifyOtpBtn.prop('disabled', true).text('Verifying...');
    
    var verifyData = { 
      email: userEmail, 
      otp: otp 
    };
    
    // Include token if available (from email link)
    if (resetToken) {
      verifyData.token = resetToken;
    }
    
    $.ajax({
      url: API_URL + '/forgot-password/verify-otp',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(verifyData)
    })
    .done(function(response) {
      // Store the OTP BEFORE showing success message
      verifiedOtp = otp;
      console.log('OTP verified and stored:', verifiedOtp);
      console.log('Email is:', userEmail);
      showMessage($otpMsg, response.message, 'success');
      
      // Move to step 3 after 1 second
      setTimeout(function() {
        if (window.showStep) {
          window.showStep('step-reset');
        } else {
          $stepOtp.hide();
          $stepReset.show();
        }
      }, 1000);
    })
    .fail(function(jqXHR) {
      console.error('Verify OTP Error:', jqXHR);
      var errorMsg = 'Network error. Please try again.';
      if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
        errorMsg = jqXHR.responseJSON.error;
      }
      showMessage($otpMsg, errorMsg, 'error');
    })
    .always(function() {
      $verifyOtpBtn.prop('disabled', false).text('Verify OTP');
    });
  });

  // Step 3: Reset Password
  $resetPasswordBtn.on('click', function() {
    var newPassword = $newPasswordInput.val();
    var confirmPassword = $confirmPasswordInput.val();
    
    // Add debug logging
    console.log('Reset attempt with:');
    console.log('- Email:', userEmail);
    console.log('- OTP:', verifiedOtp);
    console.log('- New password length:', newPassword.length);
    
    if (!newPassword || !confirmPassword) {
      showMessage($resetMsg, 'Please fill in all fields.', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showMessage($resetMsg, 'Password must be at least 6 characters.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage($resetMsg, 'Passwords do not match.', 'error');
      return;
    }

    // Verify we have email and OTP
    if (!userEmail || !verifiedOtp) {
      showMessage($resetMsg, 'Session expired. Please start over.', 'error');
      setTimeout(function() {
        window.location.href = 'forgot.html';
      }, 2000);
      return;
    }

    $resetPasswordBtn.prop('disabled', true).text('Resetting...');
    
    $.ajax({
      url: API_URL + '/forgot-password/reset',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ 
        email: userEmail, 
        otp: verifiedOtp,
        new_password: newPassword
      })
    })
    .done(function(response) {
      showMessage($resetMsg, response.message, 'success');
      
      // Clear stored data
      userEmail = '';
      verifiedOtp = '';
      
      // Redirect to login after 2 seconds
      setTimeout(function() {
        window.location.href = 'login.html';
      }, 2000);
    })
    .fail(function(jqXHR) {
      console.error('Reset Password Error:', jqXHR);
      var errorMsg = 'Network error. Please try again.';
      if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
        errorMsg = jqXHR.responseJSON.error;
      }
      showMessage($resetMsg, errorMsg, 'error');
    })
    .always(function() {
      $resetPasswordBtn.prop('disabled', false).text('Reset Password');
    });
  });

  // Allow only numbers in OTP input
  $otpInput.on('input', function() {
    $(this).val($(this).val().replace(/[^0-9]/g, ''));
  });

  // Auto-focus next input after email
  $forgotEmailInput.on('keypress', function(e) {
    if (e.key === 'Enter') {
      $sendOtpBtn.click();
    }
  });

  // Auto-focus next input after OTP
  $otpInput.on('keypress', function(e) {
    if (e.key === 'Enter') {
      $verifyOtpBtn.click();
    }
  });

  // Auto-submit on Enter in password fields
  $confirmPasswordInput.on('keypress', function(e) {
    if (e.key === 'Enter') {
      $resetPasswordBtn.click();
    }
  });
});

// Utility functions
function showMessage($element, message, type) {
  $element.text(message);
  $element.removeClass('success-message error-message')
          .addClass(type === 'success' ? 'success-message' : 'error-message')
          .show();
  
  // Hide message after 5 seconds
  setTimeout(function() {
    $element.hide();
  }, 5000);
}

function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
