const express = require('express');
const bookApp = express.Router();
const expressAsyncHandler = require("express-async-handler");
const { ObjectId } = require('mongodb');
require("dotenv").config();

// Extract body of request object
bookApp.use(express.json());
bookApp.use(express.urlencoded({ extended: true }));

// Route to get all books
bookApp.get('/books', 
  expressAsyncHandler(async (request, response) => {
    // Get bookCollectionObject
    let bookCollectionObject = request.app.get("bookCollectionObject");
    // Get all books
    let books = await bookCollectionObject.find().toArray();
    // Send response
    response.send({ message: "Books list", payload: books });
  })
);

// Route to search books by criteria
bookApp.get('/books/search', 
  expressAsyncHandler(async (request, response) => {
    // Get bookCollectionObject
    let bookCollectionObject = request.app.get("bookCollectionObject");
    const { query, criteria } = request.query;

    let searchQuery = {};
    if (criteria === "title") {
      searchQuery.title = { $regex: query, $options: 'i' };
    } else if (criteria === "author") {
      searchQuery.author = { $regex: query, $options: 'i' };
    } else if (criteria === "year") {
      searchQuery.year = { $regex: query, $options: 'i' };
    } else if (criteria === "genre") {
      searchQuery.genre = { $regex: query, $options: 'i' };
    }

    try {
      console.log("Search Query:", searchQuery); // Log the search query for debugging
      let books = await bookCollectionObject.find(searchQuery).toArray();
      response.send({ message: "Books list", payload: books });
    } catch (error) {
      response.status(500).send("Error fetching books");
    }
  })
);

// Route to download a book by ID
bookApp.get('/books/download/:id', 
  expressAsyncHandler(async (request, response) => {
    // Get bookCollectionObject
    let bookCollectionObject = request.app.get("bookCollectionObject");
    try {
      const bookId = request.params.id;
      const book = await bookCollectionObject.findOne({ _id: new ObjectId(bookId) });
      if (!book) {
        return response.status(404).send("Book not found");
      }
      const filePath = path.resolve(__dirname, 'path/to/your/books', `${book.filePath}`); 
      response.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${book.title}.pdf"`,
      });
      response.sendFile(filePath);
    } catch (error) {
      response.status(500).send("Server error");
    }
  })
);

module.exports = bookApp;
