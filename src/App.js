


import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MovieList from "./components/MovieList";
import MovieListHeading from "./components/MovieListHeading";
import SearchBox from "./components/SearchBox";
import AddFavourites from "./components/AddFavourites";
import RemoveFavourites from "./components/RemoveFavourites";
import Pagination from "react-bootstrap/Pagination";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFavouritePage, setCurrentFavouritePage] = useState(1);
  const [moviesPerPage] = useState(5);

  const getMovieRequest = async (searchValue) => {
    const url = `https://www.omdbapi.com/?s=${searchValue}&apikey=232382f4`;

    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
      setMovies(responseJson.Search);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    getMovieRequest(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const movieFavourites = JSON.parse(
      localStorage.getItem("react-movie-app-favourites")
    );

    if (movieFavourites) {
      setFavourites(movieFavourites);
    }
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem("react-movie-app-favourites", JSON.stringify(items));
  };

  const addFavouriteMovie = (movie) => {
    if (favourites.find((fav) => fav.imdbID === movie.imdbID)) {
      alert("This movie is already in your favourites!");
    } else {
      const newFavouriteList = [...favourites, movie];
      setFavourites(newFavouriteList);
      saveToLocalStorage(newFavouriteList);
    }
  };

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter(
      (favourite) => favourite.imdbID !== movie.imdbID
    );

    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalMoviePages = Math.ceil(movies.length / moviesPerPage);

  const indexOfLastFavourite = currentFavouritePage * moviesPerPage;
  const indexOfFirstFavourite = indexOfLastFavourite - moviesPerPage;
  const currentFavourites = favourites.slice(
    indexOfFirstFavourite,
    indexOfLastFavourite
  );
  const totalFavouritePages = Math.ceil(favourites.length / moviesPerPage);

  const paginate = (pageNumber, section) => {
    if (section === "movies") {
      setCurrentPage(pageNumber);
    } else if (section === "favourites") {
      setCurrentFavouritePage(pageNumber);
    }
  };

  return (
    <div className="container-fluid movie-app">
      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading="Movies" />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <div className="row justify-content-center">
        <MovieList
          movies={currentMovies}
          handleFavouritesClick={addFavouriteMovie}
          favouriteComponent={AddFavourites}
        />
      </div>
      <div className="row d-flex justify-content-center mt-4">
		<div className="pagination-container">
        <Pagination>
          <Pagination.First
            onClick={() => paginate(1, "movies")}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => paginate(currentPage - 1, "movies")}
            disabled={currentPage === 1}
          />
          {Array.from(Array(totalMoviePages).keys()).map((pageNumber) => (
            <Pagination.Item
              key={pageNumber + 1}
              active={pageNumber + 1 === currentPage}
              onClick={() => paginate(pageNumber + 1, "movies")}
            >
              {pageNumber + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => paginate(currentPage + 1, "movies")}
            disabled={currentPage === totalMoviePages}
          />
          <Pagination.Last
            onClick={() => paginate(totalMoviePages, "movies")}
            disabled={currentPage === totalMoviePages}
          />
        </Pagination>
		</div>
      </div>
      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading="Favourites" />
      </div>
      <div className="row justify-content-center">
        <MovieList
          movies={currentFavourites}
          handleFavouritesClick={removeFavouriteMovie}
          favouriteComponent={RemoveFavourites}
        />
      </div>
      <div className="row d-flex justify-content-center mt-4">
		<div className="pagination-container">
        <Pagination>
          <Pagination.First
            onClick={() => paginate(1, "favourites")}
            disabled={currentFavouritePage === 1}
          />
          <Pagination.Prev
            onClick={() => paginate(currentFavouritePage - 1, "favourites")}
            disabled={currentFavouritePage === 1}
          />
          {Array.from(Array(totalFavouritePages).keys()).map((pageNumber) => (
            <Pagination.Item
              key={pageNumber + 1}
              active={pageNumber + 1 === currentFavouritePage}
              onClick={() => paginate(pageNumber + 1, "favourites")}
            >
              {pageNumber + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => paginate(currentFavouritePage + 1, "favourites")}
            disabled={currentFavouritePage === totalFavouritePages}
          />
          <Pagination.Last
            onClick={() => paginate(totalFavouritePages, "favourites")}
            disabled={currentFavouritePage === totalFavouritePages}
          />
        </Pagination>
		</div>
      </div>
    </div>
  );
};

export default App;
