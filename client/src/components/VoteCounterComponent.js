import { useState, useEffect } from "react";
import Tooltip from '@mui/material/Tooltip';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';



export function VoteCounterComponent({votes, id, canVote, onVote, type, user }){
    const [voteCount, setVoteCount] = useState(votes ? votes : 0);
    let red = voteCount < 0;
    const [userCanVote, setUserCanVote] = useState(canVote ? true : false);

    useEffect(() => {
        setUserCanVote(canVote);
    }, [canVote])
    

    const handleVote = (amount) => {
        const token = localStorage.getItem("token");
        if(!userCanVote) {
            return;
        }
        //deny further voting & add vote to snippet and user
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
                setVoteCount(data.votes);
                onVote();
            })
        } else {
            fetch("/api/snippet/vote/" + user.id + "/" + id + "/" + amount, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                mode: 'cors'
            }).then((response) => response.json())
            .then(data => {
                setVoteCount(data.votes);
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