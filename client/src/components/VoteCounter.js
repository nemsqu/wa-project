import { useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import jwt_decode from "jwt-decode";
import { useUser } from "../context/AuthContext";

//TODO Everyone can vote only once
export function VoteCounter({votes, id, canVote, onVote, type, setCanVote }){
    const [voteCount, setVoteCount] = useState(votes ? votes : 0);
    let red = voteCount < 0;
    const user = jwt_decode(localStorage.getItem("token"));
    const [userCanVote, setUserCanVote] = useState(canVote);
    console.log(userCanVote);
    

    const handleVote = (amount) => {
        const token = localStorage.getItem("token");
        if(!userCanVote) {
            return;
        }
        setUserCanVote(false);
        if(type === "comment"){
            fetch("/api/comment/vote/" + user.id + "/" + id + "/" + amount, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                mode: 'cors'
            }).then((response) => response.json())
            .then(data => {
                console.log(data);
                setVoteCount(data.votes);
                setCanVote(false);
                onVote();
            })
        } else {
            console.log("/api/snippet/vote/" + user.id + "/" + id + "/" + amount);
            fetch("/api/snippet/vote/" + user.id + "/" + id + "/" + amount, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                mode: 'cors'
            }).then((response) => response.json())
            .then(data => {
                console.log(data);
                setVoteCount(data.votes);
                console.log(data.previousVotes);
                setCanVote(false);
                onVote();
            })
        }
    }

    return(
        <>
            <Tooltip title="Upvote">
                <ArrowUpwardRoundedIcon color={userCanVote ? "action" : "disabled"} onClick={() => handleVote(parseInt(voteCount)+1)}/>
            </Tooltip>
            <Tooltip title="Downvote">
                <ArrowDownwardRoundedIcon color={userCanVote ? "action" : "disabled"} onClick={() => handleVote(voteCount-1)} />
            </Tooltip>
        <p style={{color: red ? "red" : "black"}}>{voteCount}</p>
    </>
    );
}