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
function addBook(bookData) {
  var formData = new FormData();
  formData.append('title', bookData.title);
  formData.append('author', bookData.author);
  formData.append('category', bookData.category);
  formData.append('rental_price', bookData.rental_price);
  if (bookData.image && bookData.image.size > 0) {
    formData.append('image', bookData.image);
  }

  return authAxios({
    method: 'POST',
    url: API_BASE + '/books',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(function(response) {
    return response.data;
  }).catch(function(err) {
    console.error('Error adding book:', err);
    throw err;
  });
}

// Update a book
function updateBook(id, bookData) {
  var formData = new FormData();
  formData.append('title', bookData.title);
  formData.append('author', bookData.author);
  formData.append('category', bookData.category);
  formData.append('rental_price', bookData.rental_price);
  if (bookData.image && bookData.image.size > 0) {
    formData.append('image', bookData.image);
  }

  return authAxios({
    method: 'POST',
    url: API_BASE + '/books/' + id + '/update',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
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
