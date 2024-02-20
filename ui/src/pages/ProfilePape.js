import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
const ProfilePage = () => {
  const [user, setUser] = useState([]);
  const [friendslist, setFriendslist] = useState([]);
  const [fetchedusers, setFetchedusers] = useState([]);
  const [searchuser, setSearchuser] = useState("");
  const [friendship_request, setFriendship_request] = useState([]);
  const headers = {
    headers: {
      "X-BetaSeries-Key": "c4ea406b60a9",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

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

  useEffect(() => {
    async function friends() {
      try {
        const params = {
          id: user.id,
        };
        headers.params = params;
        const response = await axios.get(
          `https://api.betaseries.com/friends/list`,
          headers
        );
        console.log(response.data.users);
        setFriendslist(response.data.users);
      } catch (error) {
        console.log(error);
      }
    }
    if (user.id) {
      friends();
    }
  }, [user]);

  const delete_friend = async (data) => {
    try {
      const params = {
        id: data,
      };
      headers.params = params;
      const response = await axios.delete(
        `https://api.betaseries.com/friends/friend`,
        headers
      );
    } catch (error) {
      console.log(error);
    }
  };

  const block_friend = async (data) => {
    try {
      const params = {
        id: data,
      };
      headers.params = params;
      const response = await axios.post(
        `https://api.betaseries.com/friends/block`,
        params,
        headers
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getuser = async (ev) => {
    ev.preventDefault();
    const params = {
      login: searchuser,
    };
    headers.params = params;
    try {
      const response = await axios.get(
        `https://api.betaseries.com/members/search`,
        headers
      );
      console.log(response.data.users);
      setFetchedusers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const add_user = async (data) => {
    try {
      const params = {
        id: data,
      };
      const response = await axios.post(
        `https://api.betaseries.com/friends/friend`,
        params,
        headers
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const request = async () => {
        try {
            const params = {
                received: true
            };
            headers.params = params;
           
            const response = await axios.get(`https://api.betaseries.com/friends/requests`,headers);
            console.log(response);
            setFriendship_request(response.data.users);
        } catch (error) {
            console.log(error);
        }
    };
    if (user.id) {
        request();
    }
}, [user]);

  return (
    <>
      <Header />

      <div className="grid grid-cols-2 gap-4 mt-12 ml-10">
        <div className="mt-12 ml-10">
          <h1 className="text-[#e8e9f5] text-lg mb-4 font-bold">My friends</h1>
          {friendslist.length !== 0 ? (
            <>
              {friendslist.map((friend) => (
                <div
                  key={friend.id}
                  className="flex justify-between bg-[#e2ebff] py-3 px-2 items-center rounded mb-1"
                >
                  <p className="mx-4 text-[#2b2d42] font-bold">
                    {friend.login}
                  </p>
                  <div>
                    <button
                      className="bg-[#EFF6E0] font-bold px-5 py-1 mr-1 ml-1 text-[#2b2d42] rounded-3xl"
                      onClick={() => delete_friend(friend.id)}
                    >
                      DELETE
                    </button>
                    <button
                      className="bg-[#EFF6E0] font-bold px-5 py-1 mr-1 ml-1 text-[#2b2d42] rounded-3xl"
                      onClick={() => block_friend(friend.id)}
                    >
                      BLOCK
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <h1 className="text-white">
                hey you dont have friends, start making some friends!
              </h1>
            </>
          )}
        </div>

        <div className="flex justify-center flex-col mt-4 ml-7 px-7 py-7">
          <p className="text-[#e8e9f5] pb-3 ml-2">search Friend</p>
          <form onSubmit={getuser}>
            <input
              type="text"
              className="input"
              placeholder="Search the internet..."
              value={searchuser}
              onChange={(ev) => setSearchuser(ev.target.value)}
            />
            <button
              type="submit"
              className="bg-[#EFF6E0] font-bold px-5 py-3 mr-1 ml-1 text-[#2b2d42] rounded-2xl"
            >
              search
            </button>
          </form>

          <div className="mt-9">
            {fetchedusers.length !== 0 ? (
              <div className="h-40 mb-1 overflow-scroll">

                {fetchedusers.map(function (user) {
                  return (
                    <div
                      className="flex justify-between bg-[#e2ebff] py-3 px-2 items-center rounded"
                      key={user.id}
                    >
                      <p className="mx-4 text-[#2b2d42] font-bold">
                        {user.login}
                      </p>
                      <button
                        className="bg-[#EFF6E0] font-bold px-3 py-3 mr-1 ml-1 text-[#2b2d42] text-xs rounded-2xl"
                        onClick={() => add_user(user.id)}
                      >
                        add friend
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="bg-white overflow-scroll h-32 rounded p-3">
            <h1 className="flex justify-center items-center m-auto">requests</h1>
            {friendship_request.length !== 0 ? (
              <div className="h-40 mb-1 overflow-scroll">

                {friendship_request.map(function (user) {
                  return (
                    <div
                      className="flex justify-between bg-[#e2ebff] py-3 px-2 items-center rounded"
                      key={user.id}
                    >
                      <p className="mx-4 text-[#2b2d42] font-bold">
                        {user.login}
                      </p>
                      <button
                        className="bg-[#EFF6E0] font-bold px-3 py-3 mr-1 ml-1 text-[#2b2d42] text-xs rounded-2xl"
                        onClick={() => add_user(user.id)}
                      >
                        add friend
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
