import React, { useEffect, useState } from "react";
import {
  Container,
  ListGroup,
  Button,
  Card,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import kingBooksData from "./stephen-king.json";

function KingBooks() {
  const [books, setBooks] = useState([]);

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
  });

  /* настройка фильтрации */
  const uniqueYears = [...new Set(books.map((book) => book.Year))];
  const uniquePublishers = [...new Set(books.map((book) => book.Publisher))];
  console.log(uniqueYears);
  console.log(uniquePublishers);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSelectYear = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleSelectPublisher = (event) => {
    setSelectedPublisher(event.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredBooks = books.filter((book) => {
    if (
      (selectedYear === "" || book.Year.toString() === selectedYear) &&
      (selectedPublisher === "" || book.Publisher === selectedPublisher)
    ) {
      return true;
    }
    return false;
  });

  return (
    <Container className="custom-container">
      <h1 className="text-with-outline benguiat-font mt-5 mb-4">
        Stephen King books
      </h1>
      <Button
        onClick={toggleFilters}
        className="ms-2 bg-dark"
        style={{
          "--bs-bg-opacity": 0.7,
          border: "none",
          padding: "5px",
        }}
      >
        Filters
      </Button>
      {showFilters && (
        <div>
          <Form.Select className="mt-3" onChange={handleSelectYear}>
            <option value="">Year</option>
            {uniqueYears.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </Form.Select>
          <Form.Select className="mt-3" onChange={handleSelectPublisher}>
            <option value="">Publisher</option>
            {uniquePublishers.map((publisher) => (
              <option key={publisher}>{publisher}</option>
            ))}
          </Form.Select>
        </div>
      )}
      <ListGroup className="circular-font my-3">
        <Row>
          {filteredBooks.map((book, index) => (
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
          ))}
        </Row>
      </ListGroup>
    </Container>
  );
}

export default KingBooks;
