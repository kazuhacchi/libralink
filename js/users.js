// users.js - User management functions (Admin only) - jQuery version

// API_BASE is defined in config.js
var USERS_API_BASE = API_BASE;

// Load all users
function loadUsers() {
  return authAxios({
    method: 'GET',
    url: USERS_API_BASE + '/users'
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error loading users:', err);
    throw err;
  });
}

// Add a new user
function addUser(userData) {
  return authAxios({
    method: 'POST',
    url: USERS_API_BASE + '/users',
    data: userData
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error adding user:', err);
    throw err;
  });
}

// Update a user
function updateUser(id, userData) {
  return authAxios({
    method: 'PUT',
    url: USERS_API_BASE + '/users/' + id,
    data: userData
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error updating user:', err);
    throw err;
  });
}

// Delete a user
function deleteUser(id) {
  return authAxios({
    method: 'DELETE',
    url: USERS_API_BASE + '/users/' + id
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error deleting user:', err);
    throw err;
  });
}
