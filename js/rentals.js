// rentals.js - Rental management functions (jQuery version)

// Use a module-specific base constant to avoid global name conflicts
// API_BASE is defined in config.js
var RENTALS_API_BASE = API_BASE;

// Load all rentals (Admin)
function loadAllRentals() {
  return authAxios({
    method: 'GET',
    url: RENTALS_API_BASE + '/rentals'
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error loading rentals:', err);
    throw err;
  });
}

// Load librarian rentals
function loadLibrarianRentals() {
  return authAxios({
    method: 'GET',
    url: RENTALS_API_BASE + '/librarian/rentals'
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error loading librarian rentals:', err);
    throw err;
  });
}

// Load client rentals
function loadMyRentals() {
  return authAxios({
    method: 'GET',
    url: RENTALS_API_BASE + '/my-rentals'
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error loading my rentals:', err);
    throw err;
  });
}

// Create a rental (Client)
function createRental(rentalData) {
  return authAxios({
    method: 'POST',
    url: RENTALS_API_BASE + '/rentals',
    data: rentalData
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error creating rental:', err);
    throw err;
  });
}

// Approve rental (Admin)
function approveRental(id, librarianId) {
  var config = {
    method: 'POST',
    url: RENTALS_API_BASE + '/rentals/' + id + '/approve'
  };

  if (librarianId) {
    config.data = { librarian_id: librarianId };
  }

  return authAxios(config).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error approving rental:', err);
    throw err;
  });
}

// Decline rental (Admin)
function declineRental(id) {
  return authAxios({
    method: 'POST',
    url: RENTALS_API_BASE + '/rentals/' + id + '/decline'
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error declining rental:', err);
    throw err;
  });
}

// Extend rental (Client)
function extendRental(id, additionalDays) {
  return authAxios({
    method: 'POST',
    url: RENTALS_API_BASE + '/rentals/' + id + '/extend',
    data: { additional_days: additionalDays }
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error extending rental:', err);
    throw err;
  });
}

// Cancel rental (Client)
function cancelRental(id) {
  return authAxios({
    method: 'POST',
    url: RENTALS_API_BASE + '/rentals/' + id + '/cancel'
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error cancelling rental:', err);
    throw err;
  });
}

// Release rental (Librarian) - Mark approved as active
function releaseRental(id) {
  return authAxios({
    method: 'POST',
    url: RENTALS_API_BASE + '/rentals/' + id + '/release'
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error releasing rental:', err);
    throw err;
  });
}

// Mark rental as returned (Librarian)
function markRentalReturned(id) {
  return authAxios({
    method: 'POST',
    url: RENTALS_API_BASE + '/rentals/' + id + '/mark-returned'
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error marking rental as returned:', err);
    throw err;
  });
}

// Mark rental as penalty (Librarian)
function markRentalPenalty(id) {
  var url = RENTALS_API_BASE + '/rentals/' + id + '/penalty';
  console.log('Calling penalty API:', url);
  return authAxios({
    method: 'POST',
    url: url
  }).then(function(response) {
    console.log('Penalty API success:', response);
    return response.data;
  }).catch(function(err) {
    console.error('Error marking rental as penalty:', err);
    console.error('Error details:', {
      message: err.message,
      status: err.response ? err.response.status : 'N/A',
      data: err.response ? err.response.data : 'N/A',
      url: url
    });
    throw err;
  });
}
