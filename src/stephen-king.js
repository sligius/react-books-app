import React, { useEffect, useState, useRef } from "react";

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
import { Box, Slider } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function KingBooks() {
  const [books, setBooks] = useState([]);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [range, setRange] = useState([]);
  const initialLoad = useRef(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          "https://stephen-king-api.onrender.com/api/books"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const updatedBooks = data.data.map((apiBook) => {
          const matchingJsonBook = kingBooksData.find(
            (jsonBook) => jsonBook.name === apiBook.Title
          );
          return matchingJsonBook && matchingJsonBook.image
            ? { ...apiBook, image: matchingJsonBook.image }
            : apiBook;
        });

        setBooks(updatedBooks);
        if (initialLoad.current) {
          const years = [
            ...new Set(updatedBooks.map((book) => parseInt(book.Year))),
          ];
          setUniqueYears(years);
          setRange([years[0], years[years.length - 1]]);
          initialLoad.current = false;
        }
      } catch (error) {
        console.error("Произошла ошибка:", error);
      }
    };

    fetchBooks();
  }, [books]);

  const uniquePublishers = [...new Set(books.map((book) => book.Publisher))];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleRangeChange = (e, newRange) => {
    if (newRange[0] > newRange[1]) {
      newRange.reverse();
    }
    setRange(newRange);
  };

  const handleSelectPublisher = (event) => {
    setSelectedPublisher(event.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredBooks = books.filter((book) => {
    if (
      book.Title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      ((range[0] === uniqueYears[0] &&
        range[1] === uniqueYears[uniqueYears.length - 1]) ||
        (book.Year >= range[0] && book.Year <= range[1])) &&
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
      <Container className="custom-search-container benguiat-font">
        <Form.Control
          type="text"
          placeholder="Search by title"
          className="mt-3 mb-3"
          onChange={handleSearch}
        />
        {searchTerm && (
          <Button
            variant="secondary"
            className="close-button"
            onClick={clearSearch}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        )}
        <Button
          onClick={toggleFilters}
          className="ms-2 py-1 px-4 benguiat-font bg-dark filters-button"
        >
          Filters
        </Button>
      </Container>
      {showFilters && (
        <div>
          <div className="slider-container">
            <Box sx={{ width: "100%" }}>
              <Slider
                sx={{ color: "#2f2d2d", height: 7 }}
                getAriaLabel={() => "Year range"}
                value={range}
                onChange={handleRangeChange}
                valueLabelDisplay="auto"
                min={uniqueYears[0]}
                max={uniqueYears[uniqueYears.length - 1]}
                step={1}
              />
              <p className="benguiat-font slider-text">Release Date</p>
            </Box>
          </div>
          <Form.Select
            className="mt-3 benguiat-font custom-background"
            onChange={handleSelectPublisher}
          >
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
            <Col lg={4} md={6} sm={12} key={index}>
              <Card className="px-4 py-3 m-2 custom-card">
                <h2 className="benguiat-font mb-3">{book.Title}</h2>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* Левая часть с информацией */}
                  <div className="mx-2" style={{ flex: 1 }}>
                    <p>
                      <strong>Original Title</strong>: {book.Title}
                    </p>
                    <p>
                      <strong>Release Date:</strong> {book.Year}
                    </p>
                    <p>
                      <strong>Publisher:</strong> {book.Publisher}
                    </p>
                    <p>
                      <strong>ISBN:</strong> {book.ISBN}
                    </p>
                    <p>
                      <strong>Pages:</strong> {book.Pages}
                    </p>
                  </div>
                  {/* Правая часть с обложкой */}
                  <div className="mx-2">
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
