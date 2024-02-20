import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../components/Header";

const TestPage = () => {
    const { code } = useParams();
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState({});
    const [head, setHead] = useState({});
    const [searchuser, setSearchuser] = useState("");
    const [fetchedusers, setFetchedusers] = useState([]);
    const [friendslist, setFriendslist] = useState([]);
    const [friendship_request, setFriendship_request] = useState([]);
    const requestHeaders = { headers: {}, params: {} };
    const [movies, setMovies] = useState([]);
    const [shows, setShows] = useState([]);

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

 

    return (
        <>
            <Header />
        </>
    );
};

export default TestPage;