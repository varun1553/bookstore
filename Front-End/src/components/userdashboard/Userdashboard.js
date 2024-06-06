import React, { useState, useEffect } from "react";
import './Userdashboard.css';
import { useSelector } from "react-redux";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const apiUrl = process.env.REACT_APP_URL;

function Userdashboard() {
  const { userObj } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("title");
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    year: '',
    genre: '',
    summary: ''
  });
  const booksPerPage = 5;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${apiUrl}/book-api/books`);
        setBooks(response.data.payload);
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${apiUrl}/book-api/books/search`, {
        params: {
          query: searchQuery,
          criteria: searchCriteria
        }
      });
      setBooks(response.data.payload);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleDownload = (title) => {
    const pdfFilePath = `${process.env.REACT_APP_URL}/${title}.pdf`;
    const fileName = `${title}.pdf`;

    console.log(`Downloading file from: ${pdfFilePath}`);

    const aTag = document.createElement("a");
    aTag.href = pdfFilePath;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    document.body.removeChild(aTag);
  };

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`${apiUrl}/book-api/removebook/${bookId}`);
      setBooks(books.filter(book => book._id !== bookId));
      alert('Book deleted successfully');
    } catch (error) {
      console.error('Error deleting the book', error);
    }
  };

  const handleAddBook = async () => {
    try {
      const response = await axios.post(`${apiUrl}/book-api/addbook`, newBook);
      setBooks([...books, response.data.payload]);
      setShowAddModal(false);
      alert("Added new book")
      setNewBook({ title: '', author: '', year: '', genre: '', summary: '' });
    } catch (error) {
      console.error('Error adding new book', error);
    }
  };

  // Get current books
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <h3>Hello, {userObj.username}!</h3>
            {userObj.type === 'admin' && (
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                Add New Book
              </Button>
            )}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 d-flex align-items-center mb-3">
            <select 
              className="form-select me-2" 
              value={searchCriteria} 
              onChange={(e) => setSearchCriteria(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="title">Title</option>
              <option value="year">Year</option>
              <option value="author">Author</option>
              <option value="genre">Genre</option>
            </select>
            <input 
              type="text" 
              className="form-control me-2" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder={`Search by ${searchCriteria}`} 
            />
            <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div className="row">
          {currentBooks.map(book => (
            <div key={book._id} className="col-12 mb-4">
              <div className="card flex-row h-100">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
                  <p className="card-text"><strong>Year:</strong> {book.year}</p>
                  <p className="card-text"><strong>Genre:</strong> {book.genre}</p>
                  <p className="card-text">{book.summary}</p>
                  <button className="btn btn-success me-2" onClick={() => handleDownload(book.title)}>Download</button>
                  {userObj.type === 'admin' && (
                    <button className="btn btn-danger" onClick={() => handleDelete(book._id)}>Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-12">
            <nav>
              <ul className="pagination justify-content-center">
                {Array.from({ length: Math.ceil(books.length / booksPerPage) }, (_, index) => (
                  <li key={index + 1} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter title" 
                value={newBook.title} 
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formAuthor" className="mt-3">
              <Form.Label>Author</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter author" 
                value={newBook.author} 
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formYear" className="mt-3">
              <Form.Label>Year</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter year" 
                value={newBook.year} 
                onChange={(e) => setNewBook({ ...newBook, year: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formGenre" className="mt-3">
              <Form.Label>Genre</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter genre" 
                value={newBook.genre} 
                onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formSummary" className="mt-3">
              <Form.Label>Summary</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Enter summary" 
                value={newBook.summary} 
                onChange={(e) => setNewBook({ ...newBook, summary: e.target.value })} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddBook}>
            Add Book
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Userdashboard;
