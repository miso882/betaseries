import React, { useState, useEffect } from "react";
import { BiSolidUser } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";

import axios from 'axios';
const Header = ()=>{
    const [user, setUser] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handlePopupClick = () => {
        setOpen(!open);
    };
    const headers = {
        headers: {
            "X-BetaSeries-Key": "c4ea406b60a9",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    };

    useEffect(()=>{
        const getuser = async() =>{
            try {
                const response = await axios.get(`https://api.betaseries.com/members/infos`,headers);
                setUser(response.data.member);
            } catch (error) {
                console.log(error);
            }
        }
        getuser();
        
    }, [])

    const profile = ()=>{
        navigate('/profile')
    }
    const shows = ()=>{
        navigate('/show')
    }

    return(
        <>
        <div className="bg-[#bbd0ff] h-20 flex justify-between items-center m-auto px-12">
            <div className="text-white text-6xl">⚈⚈</div>
            <div className="text-white flex flex-col justify-center items-center">
                <button onClick={()=> handlePopupClick()} className=""><BiSolidUser className="text-5xl"/></button> 
                <p className="text-xs">{user.login}</p>
            </div>

        </div>
        {open && (
                <div className="absolute bg-[#e3e6ee] text-[#2b2d42] right-8 flex flex-col h-24 w-32 p-2 rounded z-10">
                    <button className="header-btn p-1 mt-2 ease-in-out duration-300" onClick={()=>profile()}>Profile</button>
                    <button className="header-btn p-1 mt-2 ease-in-out duration-300" onClick={()=>shows()}> MY Shows</button>
                </div>
            )}
        </>

    )
}
export default Header;