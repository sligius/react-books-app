import React, { useEffect, useState } from "react";
import { Container, ListGroup, Button, Card, Row, Col } from "react-bootstrap";
import kingBooksData from "./stephen-king.json";

function KingBooks() {
  const [books, setBooks] = useState([]);
  const [showVillains, setShowVillains] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleVillains = (bookId) => {
    setShowVillains((prevState) => ({
      ...prevState,
      [bookId]: !prevState[bookId],
    }));
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          "https://cors-anywhere.herokuapp.com/https://stephen-king-api.onrender.com/api/books"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const updatedBooks = data.data.map((apiBook) => {
          const matchingJsonBook = kingBooksData.find(
            (jsonBook) => jsonBook.name === apiBook.Title
          );
          if (matchingJsonBook && matchingJsonBook.image) {
            return {
              ...apiBook,
              image: matchingJsonBook.image,
            };
          } else {
            return apiBook;
          }
        });

        setBooks(updatedBooks);
      } catch (error) {
        console.error("Произошла ошибка:", error);
      }
    };
    console.log(books);
    fetchBooks();
  }, []);

  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniquePublishers, setUniquePublishers] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    // Получение уникальных значений года выпуска и издателя
    const uniqueYears = [...new Set(books.map((book) => book.Year))];
    const uniquePublishers = [...new Set(books.map((book) => book.Publisher))];

    setUniqueYears(uniqueYears);
    setUniquePublishers(uniquePublishers);
  }, [books]);

  const handleYearFilter = (selectedYear) => {
    const filteredBooks = books.filter((book) => book.Year === selectedYear);
    setFilteredBooks(filteredBooks);
  };

  const handlePublisherFilter = (selectedPublisher) => {
    const filteredBooks = books.filter(
      (book) => book.Publisher === selectedPublisher
    );
    setFilteredBooks(filteredBooks);
  };

  const handlePagesFilter = (selectedPages) => {
    const filteredBooks = books.filter((book) => book.Pages <= selectedPages);
    setFilteredBooks(filteredBooks);
  };

  return (
    <Container className="custom-container">
      <h1 className="text-with-outline benguiat-font mt-5 mb-4">
        Stephen King books
      </h1>
      <Button onClick={toggleFilters} className="my-3">
        Фильтры
      </Button>
      <div style={{ display: showFilters ? "block" : "none" }}>
        {/* Ваши фильтры здесь */}
        <div>
          <label>Filter by Year:</label>
          <select onChange={(e) => handleYearFilter(e.target.value)}>
            <option value="">All</option>
            {uniqueYears.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
          <label>Filter by Publisher:</label>
          <select onChange={(e) => handlePublisherFilter(e.target.value)}>
            <option value="">All</option>
            {uniquePublishers.map((publisher, index) => (
              <option key={index} value={publisher}>
                {publisher}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Filter by Number of Pages:</label>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            onChange={(e) => handlePagesFilter(e.target.value)}
          />
        </div>
      </div>
      <ListGroup className="circular-font my-3">
        <Row>
          {(filteredBooks.length > 0 ? filteredBooks : books).map(
            (book, index) => (
              <Col md={6} key={index}>
                <Card className="px-5 py-3 m-2 custom-card">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* Левая часть с информацией */}
                    <div style={{ flex: 1 }}>
                      <h2>{book.Title}</h2>
                      <p>Original Title: {book.Title}</p>
                      <p>Release Date: {book.Year}</p>
                      <p>Publisher: {book.Publisher}</p>
                      <p>ISBN: {book.ISBN}</p>
                      <p>Pages: {book.Pages}</p>
                      {/* {book.Notes && book.Notes.length > 0 && (
        <p>Notes: {book.Notes.join(", ")}</p>
      )} 
                    {book.villains && book.villains.length > 0 && (
                      <div>
                        <Button
                          onClick={() => toggleVillains(book.id)}
                          className="bg-dark"
                          style={{
                            "--bs-bg-opacity": 0.7,
                            border: "none",
                            padding: "5px",
                          }}
                        >
                          Villains:
                        </Button>
                        {showVillains[book.id] && (
                          <ul>
                            {book.villains.map((villain, idx) => (
                              <li className="mt-2" key={idx}>
                                {villain.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    */}
                    </div>
                    {/* Правая часть с обложкой */}
                    <div>
                      <img
                        src={book.image}
                        alt={book.Title}
                        style={{ maxHeight: "250px", maxWidth: "100%" }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            )
          )}
        </Row>
      </ListGroup>
    </Container>
  );
}

export default KingBooks;
