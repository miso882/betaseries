import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "../components/Header";
import { AiFillPlusCircle } from 'react-icons/ai';
import { useLongPress } from 'use-long-press';
import { useParams, useSearchParams } from "react-router-dom";

const MoviesPages = ({ access_token }) => {
  const [series, setSeries] = useState([]);
  const [user, setUser] = useState(null);
  const [limit] = useState(36);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [sortOrder, setSortOrder] = useState("popularity"); 
  const [page, setPage] = useState(1); 
  const requestHeaders = { headers: {}, params: {} };
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  // const [user, setUser] = useState({});
  const [head, setHead] = useState({});
  useEffect(() => {
    const getcode = async () => {
        try {
            const data = {
                client_id: "c4ea406b60a9",
                client_secret: "afb244f215412b679d3be88bef2e2acc",
                redirect_uri: "http://localhost:3000/testpage",
                code: searchParams.get("code"),
            };
            localStorage.setItem("access_token", data.code);

            const response = await axios.post(
                "https://api.betaseries.com/oauth/access_token",
                data
            );

            const headers = {
                "X-BetaSeries-Key": "c4ea406b60a9",
                Authorization: "Bearer " + response.data.access_token,
            };
            setHead(headers);
            localStorage.setItem("token", response.data.access_token);
            requestHeaders.headers = headers;

            try {
                const memberResponse = await axios.get(
                    `https://api.betaseries.com/members/infos`,
                    requestHeaders
                );

                setUser(memberResponse.data.member);
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    };
    getcode();
}, [searchParams]);
  const [isShown, setIsShown] = useState(false);
  const navigate = useNavigate();
  const headers = {
    headers: {
      "X-BetaSeries-Key": "c4ea406b60a9",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
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
            terms: searchTerm,
          },
          headers: {
            "X-BetaSeries-Key": "c4ea406b60a9",
          },
        }
      );

      if (page === 1) {
        // console.log(response.data.shows)
        setSeries(response.data.shows);
      } else {
        setSeries((prevSeries) => [...prevSeries, ...response.data.shows]);
      }

      const sortedSeries = response.data.shows.sort((a, b) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();

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

  useEffect(() => {
    fetchSeriesData(sortOrder); 
  }, [page, sortOrder]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1); 
    }
  };

  const handleSortOrderChange = (newSortOrder) => {
    let orderParam = "popularity"; 

    if (newSortOrder === "title_asc") {
      orderParam = "title";
    } else if (newSortOrder === "title_desc") {
      orderParam = "title";
    }

    setSortOrder(newSortOrder);
    setPage(1); 
    fetchSeriesData(orderParam);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    fetchSeriesData(sortOrder); 
  };

  const add_to_list = async(data)=>{
    console.log(data);
    try {
      const params = {
        id: data,
      };
      const response = await axios.post(
        `https://api.betaseries.com/shows/show`,
        params,
        headers
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }

  }


  const bind = useLongPress(() => {
    console.log(isShown)
    navigate(`/series/${isShown}`) 
  });

  const renderSeriesCards = () => {
    return (
      <>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {series.map((seriesItem) => (
          <div
            key={seriesItem.id}
            className="card-test relative group cursor-pointer "
          >
              <img
                alt=""
                src={seriesItem.images.poster || "cinema.png"} 
                className="w-full h-auto  transition-transform transform group-hover:scale-90"
              />
              <div
                className="absolute inset-0 bg-zinc opacity-50 hover:opacity-70 transition-opacity"
                style={{ width: "80%", height: "90%" }}
              ></div>
              <div className="flex justify-between items-center">

               <button {...bind()} onMouseOver={() => setIsShown(seriesItem.id)} >
                <span className="text-xl group-hover:text-white">
                  {seriesItem.title}
                </span>{" "}
              </button>
              <button className="" onClick={()=>add_to_list(seriesItem.id)}><AiFillPlusCircle /></button>
              </div>
          </div>

        ))}
      </div>
      </>
    );
  };

  const renderSortOptions = () => {
    return (
      <div className="flex justify-end mt-4">
        <label className="mr-2">Trier par :</label>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          onChange={(e) => handleSortOrderChange(e.target.value)}
          value={sortOrder}
        >
          <option value="popularity">Popularité</option>
          <option value="title_asc">Titre (A à Z)</option>
          <option value="title_desc">Titre (Z à A)</option>
        </select>
      </div>
    );
  };

  return (
    <>
      <Header />
    <div className="container mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Liste des séries</h1>

      {/* Search form */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Rechercher une série"
            className="border border-gray-300 rounded px-2 py-1 flex-grow"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          {/* <button
            type="submit"
            className="bg-blue-500 text-white rounded px-2 py-1 ml-2"
          >
            Rechercher
          </button> */}
        </div>
      </form>

      {renderSortOptions()}

      {renderSeriesCards()}

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
    </>
  );
};

MoviesPages.propTypes = {
  access_token: PropTypes.string,
};

export default MoviesPages;
