import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Modal from "react-modal";
import { useNavigate, Link } from "react-router-dom";
import { useLongPress } from 'use-long-press';

Modal.setAppElement("#root"); // Set the app element for Modal

const Show = () => {
    const [user, setUser] = useState([]);
    const [shows, setShows] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [viewedEpisodes, setViewedEpisodes] = useState(
        JSON.parse(localStorage.getItem("viewedEpisodes")) || []
    );
    const [episodeComments, setEpisodeComments] = useState({});

    const [series, setSeries] = useState([]);
    const [isShown, setIsShown] = useState(false);
    const navigate = useNavigate();
    const headers = {
        headers: {
            "X-BetaSeries-Key": "c4ea406b60a9",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    };

    // useEffect for fetching user information
    useEffect(() => {
        const getuser = async () => {
            try {
                const response = await axios.get(
                    `https://api.betaseries.com/members/infos`,
                    headers
                );
                setUser(response.data.member);
            } catch (error) {
                console.log(error);
            }
        };

        getuser();
    }, []);

    // useEffect for fetching user shows
    useEffect(() => {
        async function showlist() {
            try {
                const params = {
                    id: user.id,
                };
                headers.params = params;
                const response = await axios.get(
                    `https://api.betaseries.com/shows/member`,
                    headers
                );
                setSeries(response.data.shows);
            } catch (error) {
                console.log(error);
            }
        }
        if (user.id) {
            showlist();
        }
    }, [user]);

    // useEffect for fetching user data and movies
    useEffect(() => {
        async function fetchData() {
            try {
                const userResponse = await axios.get(
                    "https://api.betaseries.com/members/infos",
                    headers
                );
                setUser(userResponse.data.member);

                const params = {
                    id: userResponse.data.member.id,
                };
                headers.params = params;

                const showsResponse = await axios.get(
                    "https://api.betaseries.com/shows/member",
                    headers
                );
                setShows(showsResponse.data.shows);

                const moviesResponse = await axios.get(
                    "https://api.betaseries.com/movies/member",
                    headers
                );
                setMovies(moviesResponse.data.movies);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        if (localStorage.getItem("token")) {
            fetchData();
        }
    }, []);

    // useEffect for fetching user movies
    useEffect(() => {
        async function showlist() {
            try {
                const params = {
                    id: user.id,
                };
                headers.params = params;
                const response = await axios.get(
                    `https://api.betaseries.com/movies/member`,
                    headers
                );
                setMovies(response.data.movies);
            } catch (error) {
                console.log(error);
            }
        }
        if (user.id) {
            showlist();
        }
    }, [user]);

    // Function to check if an episode is viewed
    const isEpisodeViewed = (episodeId) => viewedEpisodes.includes(episodeId);

    // useLongPress hook for handling long presses
    const bind = useLongPress(() => {
        console.log(isShown);
        navigate(`/series/${isShown}`);
    });

    // Function to mark an episode as viewed
    const markEpisodeAsViewed = async (episodeId) => {
        try {
            if (!isEpisodeViewed(episodeId)) {
                await axios.post(
                    "https://api.betaseries.com/episodes/watched",
                    {
                        id: episodeId,
                        bulk: true, // Mark all previous episodes as viewed
                    },
                    headers
                );

                // Update the episodes state to reflect the change
                const updatedEpisodes = episodes.map((episode) => {
                    if (episode.id === episodeId) {
                        return { ...episode, viewed: true };
                    }
                    return episode;
                });

                setEpisodes(updatedEpisodes);

                // Update the viewed episodes state
                setViewedEpisodes([...viewedEpisodes, episodeId]);

                // Save viewed episodes to localStorage
                localStorage.setItem(
                    "viewedEpisodes",
                    JSON.stringify([...viewedEpisodes, episodeId])
                );
            }
        } catch (error) {
            console.error("Error marking episode as viewed: ", error);
        }
    };

    // Function to mark all episodes before the current one as viewed
    const markAllEpisodesBeforeAsViewed = async (episodeId) => {
        try {
            const episodeIndex = episodes.findIndex(
                (episode) => episode.id === episodeId
            );
            if (episodeIndex !== -1) {
                const episodesToMark = episodes.slice(0, episodeIndex + 1);
                const episodeIdsToMark = episodesToMark.map(
                    (episode) => episode.id
                );

                await axios.post(
                    "https://api.betaseries.com/episodes/watched",
                    {
                        id: episodeIdsToMark.join(","),
                        bulk: true,
                    },
                    headers
                );

                // Update the episodes state to reflect the change
                const updatedEpisodes = episodes.map((episode) => {
                    if (episodeIdsToMark.includes(episode.id)) {
                        return { ...episode, viewed: true };
                    }
                    return episode;
                });

                setEpisodes(updatedEpisodes);

                // Update the viewed episodes state
                setViewedEpisodes([...viewedEpisodes, ...episodeIdsToMark]);

                // Save viewed episodes to localStorage
                localStorage.setItem(
                    "viewedEpisodes",
                    JSON.stringify([...viewedEpisodes, ...episodeIdsToMark])
                );
            }
        } catch (error) {
            console.error("Error marking episodes as viewed: ", error);
        }
    };

    // Function to handle comment change for a specific episode
    const handleCommentChange = (episodeId, newComment) => {
        setEpisodeComments({
            ...episodeComments,
            [episodeId]: newComment,
        });
    };

    // Function to add a comment to an episode
    const addCommentToEpisode = async (episodeId, commentText) => {
        try {
            if (episodeId && commentText.trim() !== "") {
                const response = await axios.post(
                    "https://api.betaseries.com/comments/comment",
                    {
                        type: "episode",
                        id: episodeId,
                        text: commentText, // Pass the comment text
                    },
                    headers
                );

                // Clear the comment input and update the episodeComments state
                setComment("");
                setEpisodeComments((prevEpisodeComments) => ({
                    ...prevEpisodeComments,
                    [episodeId]: [
                        ...(prevEpisodeComments[episodeId] || []),
                        response.data.comment,
                    ],
                }));
            }
        } catch (error) {
            console.error("Error adding comment to episode: ", error);
        }
    };

    const seasonOptions = [1, 2, 3];

    // Function to fetch episodes for a selected item and season
    const fetchEpisodes = async (item, season) => {
        try {
            const response = await axios.get(
                "https://api.betaseries.com/shows/episodes",
                {
                    params: {
                        id: item.id,
                        season: season,
                    },
                    ...headers,
                }
            );

            setEpisodes(response.data.episodes);
        } catch (error) {
            console.error("Error fetching episodes: ", error);
        }
    };

    // Function to handle season change
    const handleSeasonChange = (season) => {
        setSelectedSeason(season);
        if (selectedItem) {
            fetchEpisodes(selectedItem, season);
        }
    };

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Header />
            <h1 className="text-[#e8e9f5] text-4xl ml-5 mb-4 font-bold mt-3">
                My List
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="relative group cursor-pointer"
                        onClick={() => {
                            setSelectedItem(movie);
                            fetchEpisodes(movie, selectedSeason);
                            openModal(); // Open the modal when clicking on a movie
                        }}
                    >
                        <Link to={`/movie/${movie.id}`} className="block">
                            <img
                                alt=""
                                src={movie.images.poster || "cinema.png"}
                                className="w-full h-auto transition-transform transform group-hover:scale-105"
                            />
                        </Link>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {shows.map((show) => (
                    <div
                        key={show.id}
                        className="relative group cursor-pointer"
                        onClick={() => {
                            setSelectedItem(show);
                            fetchEpisodes(show, selectedSeason);
                            openModal();
                        }}
                    >
                        <Link to={`/series/${show.id}`} className="block">
                            <img
                                alt=""
                                src={show.images.poster || "cinema.png"}
                                className="w-full h-auto transition-transform transform group-hover:scale-105"
                            />
                        </Link>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Episodes Modal"
                ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                    },
                    content: {
                        width: "60%",
                        height: "80%",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        border: "none",
                        background: "#1e2139",
                        color: "#e8e9f5",
                        borderRadius: "8px",
                    },
                }}
            >
                <h3 className="text-[#585b7e] text-xl font-semibold mb-2">
                    {selectedItem && selectedItem.title}
                </h3>
                <div className="mb-4">
                    <label
                        htmlFor="seasonSelector"
                        className="text-[#585b7e] font-semibold block"
                    >
                        Select Season:
                    </label>
                    <select
                        id="seasonSelector"
                        name="seasonSelector"
                        value={selectedSeason}
                        onChange={(e) =>
                            handleSeasonChange(parseInt(e.target.value))
                        }
                        className="bg-[#585b7e] text-white py-1 px-2 rounded w-full"
                    >
                        {seasonOptions.map((season) => (
                            <option key={season} value={season}>
                                Season {season}
                            </option>
                        ))}
                    </select>
                </div>
                <h3 className="text-[#585b7e] text-xl font-semibold mt-2">
                    Episodes:
                </h3>
                <ul className="text-[#b9bffc] ml-4">
                    {episodes.map((episode) => (
                        <li
                            key={episode.id}
                            className="mb-4 border-t border-[#585b7e] pt-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    Season {episode.season}, Episode{" "}
                                    {episode.episode}: {episode.title}
                                </div>
                                <div>
                                    {isEpisodeViewed(episode.id) ? (
                                        <span className="text-green-500">
                                            Viewed
                                        </span>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() =>
                                                    markEpisodeAsViewed(
                                                        episode.id
                                                    )
                                                }
                                                className="text-sm bg-green-500 text-white py-1 px-2 rounded mr-2"
                                            >
                                                Mark as Viewed
                                            </button>
                                            <button
                                                onClick={() =>
                                                    markAllEpisodesBeforeAsViewed(
                                                        episode.id
                                                    )
                                                }
                                                className="text-sm bg-green-500 text-white py-1 px-2 rounded"
                                            >
                                                Mark All Before as Viewed
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div>
                                {Array.isArray(episodeComments[episode.id]) &&
                                    episodeComments[episode.id].map(
                                        (comment) => (
                                            <div key={comment.id}>
                                                <p>{comment.text}</p>
                                            </div>
                                        )
                                    )}
                            </div>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={episodeComments[episode.id] || ""}
                                onChange={(e) =>
                                    handleCommentChange(
                                        episode.id,
                                        e.target.value
                                    )
                                }
                                className="mt-2 p-2 w-full rounded border border-[#585b7e] bg-[#2c304b] text-white"
                            />
                            <button
                                onClick={() =>
                                    addCommentToEpisode(
                                        episode.id,
                                        episodeComments[episode.id]
                                    )
                                }
                                className="mt-2 bg-blue-500 text-white py-1 px-2 rounded"
                            >
                                Add Comment
                            </button>
                        </li>
                    ))}
                </ul>

                <button onClick={closeModal}>Close</button>
            </Modal>
        </>
    );
};

export default Show;
