import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useLongPress } from "use-long-press";

const ShowDetails = () => {
    const { id } = useParams();
    const [isFetched, setIsFetched] = useState(false);
    const [show, setShow] = useState({});
    const [episodes, setEpisodes] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [genres, setGenres] = useState({ array: [], object: {} });
    const [totalDuration, setTotalDuration] = useState(0);

    const [episode_detail, setEpisode_detail] = useState([]);
    const [modula, setModula] = useState(false);
    const [isShown, setIsShown] = useState(false);

    const headers = {
        headers: {
            "X-BetaSeries-Key": "c4ea406b60a9",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    };

    const archiveSeries = async () => {
        try {
            const response = await axios.post(
                "https://api.betaseries.com/shows/archive",
                {
                    id: id,
                },
                headers
            );
            console.log("Series archived successfully!", response.data);
        } catch (error) {
            console.error("Error archiving series: ", error);
        }
    };

    const fetchShowDetails = async () => {
        try {
            const params = {
                id: id,
            };
            const response = await axios.get(
                `https://api.betaseries.com/shows/display`,
                {
                    params: params,
                    ...headers,
                }
            );
            setShow(response.data.show);
            setIsFetched(true);
        } catch (error) {
            console.error("Error fetching show details: ", error);
        }
    };

    const fetchEpisodes = async () => {
        try {
            const response = await axios.get(
                "https://api.betaseries.com/shows/episodes",
                {
                    params: {
                        id: id,
                        season: selectedSeason,
                    },
                    ...headers,
                }
            );

            setEpisodes(response.data.episodes);

            const totalDurationInMinutes = response.data.episodes.reduce(
                (total, episode) => total + episode.length,
                0
            );

            setTotalDuration(totalDurationInMinutes);
        } catch (error) {
            console.error("Error fetching episodes: ", error);
        }
    };

    const fetchNote = async () => {
        try {
            const response = await axios.get(
                "https://api.betaseries.com/shows/note.maie",
                {
                    params: {
                        id: id,
                    },
                    ...headers,
                }
            );
        } catch (error) {
            console.error("Error fetching note: ", error);
        }
    };

    useEffect(() => {
        fetchShowDetails();
    }, [id]);

    useEffect(() => {
        fetchEpisodes();
    }, [id, selectedSeason]);

    useEffect(() => {
        fetchNote();
    }, [id]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(
                    `https://api.betaseries.com/shows/genres/${id}`,
                    headers
                );

                const genresArray = response.data.genres;

                const genresObject = {};
                genresArray.forEach((genre) => {
                    genresObject[genre.id] = genre.name;
                });

                setGenres({
                    array: genresArray,
                    object: genresObject,
                });
            } catch (error) {
                console.error("Error fetching genres: ", error);
            }
        };

        fetchGenres();
    }, [id]);

    const episode_details = async (data) => {
        try {
            const params = {
                id: data,
            };
            headers.params = params;
            const response = await axios.get(
                "https://api.betaseries.com/episodes/display",
                headers
            );
            console.log(response.data.episode);
            setEpisode_detail(response.data.episode);
            setModula(!modula);
        } catch (error) {
            console.error("Error fetching episodes details: ", error);
        }
    };

    const bind = useLongPress(() => {
        console.log(isShown);
        episode_details(isShown);
        // navigate(`/series/${isShown}`)
    });

    const handleChange = (e) => {
        setSelectedSeason(e.target.value);
    };

    const selectSeason = () => {
        if (show.seasons > 1) {
            let options = [];
            for (let i = 1; i <= show.seasons; i++) {
                options.push(
                    <option key={i} value={i}>
                        Season {i}
                    </option>
                );
            }
            return (
                <div className="column is-full-mobile is-2">
                    <div className="select is-fullwidth">
                        <select
                            value={selectedSeason}
                            onChange={handleChange}
                            id="season-select"
                        >
                            {options}
                        </select>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    };

    return (
        <>
            <Header />
            <div className="container mx-auto p-4">
                {isFetched ? (
                    <div>
                        <h1 className="text-3xl font-bold mb-4 text-[#EFF6E0]">
                            {show.title}
                        </h1>
                        <img
                            src={show.images.poster}
                            alt=""
                            className="mb-4 w-3/12"
                        />
                        <p className="text-gray-700 hover:text-white mb-4">
                            {show.description}
                        </p>
                        <p className="text-gray-700 hover:text-white ">
                            Seasons: {show.seasons}
                        </p>
                        <p className="text-gray-700 hover:text-white">
                            Episodes: {show.episodes}
                        </p>
                        <p className="text-gray-700 hover:text-white">
                            Total Duration: {show.length} minutes
                        </p>
                        <h1 className="text-[#d3d6f7] text-3xl font-bold mb-4">
                            {show.title}
                        </h1>
                        <p className="text-[#e8e9f5] mb-4">
                            {show.description}
                        </p>
                        <img
                            src={show.images.poster}
                            alt=""
                            className="mb-4 w-3/12"
                        />
                        <p className="text-gray-700">Seasons: {show.seasons}</p>
                        <p className="text-gray-700">
                            Episodes: {show.episodes}
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-700">Loading...</p>
                )}
                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#EFF6E0]">
                    Genres
                </h2>
                <ul className="list-disc ml-8">
                    {episodes
                        .filter((episode) => episode.season === selectedSeason)
                        .map((episode) => (
                            <li key={episode.id} className="text-gray-700">
                                Season {episode.season}, Episode{" "}
                                {episode.episode}:{" "}
                                <button
                                    {...bind()}
                                    onMouseOver={() => setIsShown(episode.id)}
                                >
                                    {episode.title}
                                </button>
                            </li>
                        ))}
                </ul>
                {modula && (
                    <div className="mt-10 mb-10v px-6 py-2 flex flex-col rounded bg-[#d3d6f7]">
                        <div className="flex">
                            <p className="text-[#2b2d42] font-bold pr-2">
                                Title :
                            </p>
                            <p>{episode_detail.title}</p>
                        </div>
                        <div className="flex">
                            <p className="text-[#2b2d42] font-bold pr-2">
                                Description :
                            </p>
                            <p>{episode_detail.description}</p>
                        </div>
                        <div className="flex">
                            <p className="text-[#2b2d42] font-bold pr-2">
                                Note :
                            </p>
                            <p>{episode_detail.note.mean}</p>
                        </div>
                        <div className="flex">
                            <p className="text-[#2b2d42] font-bold pr-2">
                                Released date :
                            </p>
                            <p>{episode_detail.date}</p>
                        </div>
                    </div>
                )}
                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#EFF6E0]">
                    Note
                </h2>
                <p className="text-gray-700  hover:text-white">
                    Note: {show.notes?.mean?.toFixed(2) || "N/A"}
                </p>
                <h2 className="text-2xl font-bold mt-8 mb-4 text-[#EFF6E0]">
                    Actions
                </h2>
                <button
                    onClick={archiveSeries}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Archive Series
                </button>
            </div>
        </>
    );
};

export default ShowDetails;
