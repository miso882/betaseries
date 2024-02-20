import React, { useState, useEffect } from "react";
function Home() {
    const login = () => {
        window.location.href = `https://www.betaseries.com/authorize?client_id=c4ea406b60a9&redirect_uri=http://localhost:3000/movies`;
    };

    return (
        <>
            <div className="child bg-[#bbd0ff] w-64 h-64 rounded absolute top-[50%] left-[50%] py-4 px-7 tracking-wider">
                <h1 className="text-[#1d3557] text-4xl uppercase flex justify-center items-center font-bold">
                    betaseries
                </h1>
                <button
                    className="flex justify-center items-center m-auto mt-9 bg-[#EFF6E0] text-[#1d3557] font-bold rounded-[24px] px-12 py-3"
                    onClick={() => login()}
                >
                    login
                </button>
            </div>
        </>
    );
}

export default Home;
