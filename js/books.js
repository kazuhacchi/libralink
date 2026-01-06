// books.js - Book management functions (jQuery version)

// API_BASE is defined in config.js

// Load all books
function loadBooks() {
  return authAxios({
    method: 'GET',
    url: API_BASE + '/books'
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error loading books:', err);
    throw err;
  });
}

// Add a new book
// Accepts either FormData directly or a bookData object
function addBook(bookDataOrFormData) {
  var formData;
  
  if (bookDataOrFormData instanceof FormData) {
    // If FormData is passed directly, use it
    formData = bookDataOrFormData;
  } else {
    // Otherwise, create FormData from object
    formData = new FormData();
    formData.append('title', bookDataOrFormData.title || '');
    formData.append('author', bookDataOrFormData.author || '');
    formData.append('category', bookDataOrFormData.category || '');
    formData.append('rental_price', bookDataOrFormData.rental_price || 0);
    if (bookDataOrFormData.image && bookDataOrFormData.image instanceof File && bookDataOrFormData.image.size > 0) {
      formData.append('image', bookDataOrFormData.image);
    }
  }

  return authAxios({
    method: 'POST',
    url: API_BASE + '/books',
    data: formData
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error adding book:', err);
    throw err;
  });
}

// Update a book
// Accepts either FormData directly or a bookData object
function updateBook(id, bookDataOrFormData) {
  var formData;
  
  if (bookDataOrFormData instanceof FormData) {
    // If FormData is passed directly, use it
    formData = bookDataOrFormData;
  } else {
    // Otherwise, create FormData from object
    formData = new FormData();
    formData.append('title', bookDataOrFormData.title || '');
    formData.append('author', bookDataOrFormData.author || '');
    formData.append('category', bookDataOrFormData.category || '');
    formData.append('rental_price', bookDataOrFormData.rental_price || 0);
    if (bookDataOrFormData.image && bookDataOrFormData.image instanceof File && bookDataOrFormData.image.size > 0) {
      formData.append('image', bookDataOrFormData.image);
    }
  }

  return authAxios({
    method: 'POST',
    url: API_BASE + '/books/' + id + '/update',
    data: formData
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error updating book:', err);
    throw err;
  });
}

// Delete a book
function deleteBookById(id) {
  return authAxios({
    method: 'DELETE',
    url: API_BASE + '/books/' + id
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error deleting book:', err);
    throw err;
  });
}
