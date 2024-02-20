import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MovieHeaders from "./MovieHeaders"; // Import the MovieHeaders component

const MoviesPages = ({ access_token }) => {
    const [series, setSeries] = useState([]);
    const [user, setUser] = useState(null);
    const [limit] = useState(33); // Limit for each page
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // Search term state
    const [sortOrder, setSortOrder] = useState("popularity"); // Sorting order state
    const [page, setPage] = useState(1); // Page number state
  
    // Fetch series data based on search term, sorting order, and pagination
    const fetchSeriesData = async () => {
      setLoading(true);
  
      try {
        const response = await axios.get(
          "https://api.betaseries.com/shows/list",
          {
            params: {
              start: (page - 1) * limit,
              limit,
              order: sortOrder,
              terms: searchTerm, // Add search term to query parameters
            },
            headers: {
              "X-BetaSeries-Key": "8e58101d26ef",
            },
          }
        );
  
        if (page === 1) {
          setSeries(response.data.shows);
        } else {
          setSeries((prevSeries) => [...prevSeries, ...response.data.shows]);
        }
  
        // Sort the series based on title
        const sortedSeries = response.data.shows.sort((a, b) => {
          const titleA = a.title.toUpperCase();
          const titleB = b.title.toUpperCase();
  
          // Custom sorting logic to place numbers and special characters at the end
          if (sortOrder === "title_asc") {
            if (/^[0-9@#$]/.test(titleA) && !/^[0-9@#$]/.test(titleB)) {
              return 1;
            }
            if (!/^[0-9@#$]/.test(titleA) && /^[0-9@#$]/.test(titleB)) {
              return -1;
            }
            return titleA.localeCompare(titleB);
          } else if (sortOrder === "title_desc") {
            if (/^[0-9@#$]/.test(titleB) && !/^[0-9@#$]/.test(titleA)) {
              return 1;
            }
            if (!/^[0-9@#$]/.test(titleB) && /^[0-9@#$]/.test(titleA)) {
              return -1;
            }
            return titleB.localeCompare(titleA);
          }
  
          return 0;
        });
  
        if (page === 1) {
          setSeries(sortedSeries);
        } else {
          setSeries((prevSeries) => [...prevSeries, ...sortedSeries]);
        }
  
        if (response.data.shows.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (error) {
        console.error("Error fetching series data: ", error);
      } finally {
        setLoading(false);
      }
    };
  
    // Use useEffect to fetch series data when the component mounts and when pagination changes
    useEffect(() => {
      fetchSeriesData(sortOrder); // Initial data fetch
    }, [page, sortOrder]);
  
    // Function to handle load more button click
    const handleLoadMore = () => {
      if (!loading && hasMore) {
        setPage((prevPage) => prevPage + 1); // Increment page number
      }
    };
  
    // Function to handle sorting order change
    const handleSortOrderChange = (newSortOrder) => {
      let orderParam = "popularity"; // Default sorting order
  
      if (newSortOrder === "title_asc") {
        orderParam = "title";
      } else if (newSortOrder === "title_desc") {
        orderParam = "title";
      }
  
      setSortOrder(newSortOrder);
      setPage(1); // Reset to the first page when changing sorting order
      fetchSeriesData(orderParam); // Pass the sorting order to the fetch function
    };
  
    // Function to handle search term change
    const handleSearchTermChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    // Function to handle form submission (search)
    const handleSearchSubmit = (event) => {
      event.preventDefault();
      setPage(1); // Reset to the first page when searching
      fetchSeriesData(sortOrder); // Fetch data with the updated search term
    };
  
    // Render the series cards
    const renderSeriesCards = () => {
      import React, { useState, useEffect } from "react";
  import axios from "axios";
  import { Link } from "react-router-dom";
  import PropTypes from "prop-types";
  import MovieHeaders from "./MovieHeaders"; // Import the MovieHeaders component
  
  const MoviesPages = ({ access_token }) => {
    // ... Existing code for MoviesPages
  

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-4">Liste des séries</h1>

      {/* MovieHeaders component for headers */}
      <MovieHeaders
        searchTerm={searchTerm}
        sortOrder={sortOrder}
        onSearchTermChange={handleSearchTermChange}
        onSortOrderChange={handleSortOrderChange}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Series cards */}
      {renderSeriesCards()}

      {/* Load more button */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={handleLoadMore}
            className="bg-zinc-200 hover:bg-zinc0 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-zinc active:bg-zinc-800"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

MoviesPages.propTypes = {
  access_token: PropTypes.string,
};

export default MoviesPages;


