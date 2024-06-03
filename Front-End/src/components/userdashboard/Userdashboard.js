import React, { useState, useEffect } from "react";
import './Userdashboard.css';
import { useSelector } from "react-redux";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = process.env.REACT_APP_URL;

function Userdashboard() {
  const { userObj } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("title");
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleDownload = async (bookId) => {
    try {
      const response = await axios.get(`${apiUrl}/book-api/books/download/${bookId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'book.pdf'); // Optionally, you can set the actual file name here
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the book', error);
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
                  <button className="btn btn-success" onClick={() => handleDownload(book._id)}>Download</button>
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
    </>
  );
}

export default Userdashboard;
