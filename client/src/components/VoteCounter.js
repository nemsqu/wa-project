import { useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import jwt_decode from "jwt-decode";

//TODO Everyone can vote only once
export function VoteCounter({votes, id, previousVotes, onVote, type }){
    const [voteCount, setVoteCount] = useState(votes ? votes : 0);
    let red = voteCount < 0;
    let user = (localStorage.getItem("token"));
    let canVote = false;
    if(user){
        if(!previousVotes){
            canVote = true;
        }else{
            console.log(previousVotes);
            if(type === "comment"){
                if(previousVotes.commentVotes.filter(v => v === id).length === 0){
                    canVote = true;
                }    
            }else{
                if(previousVotes.snippetVotes.filter(v => v === id).length === 0){
                    canVote = true;
                }
            }
        }
    }
    //console.log(previousVotes.filter(v => v.id === id));
    if(user){
        user = jwt_decode(user).id;
    }

    //siirrä tää appiin, että snippet lista päivittyy äänestyksen yhteydessä
    const handleVote = (amount) => {
        console.log(canVote);
        if(!canVote) {
            return;
        }
        if(type === "comment"){
            fetch("/api/comment/vote/" + user + "/" + id + "/" + amount, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                mode: 'cors'
            }).then((response) => response.json())
            .then(data => {
                console.log(data);
                setVoteCount(data.votes);
                onVote(data.previousVotes);
            })
        } else {
            console.log("/api/snippet/vote/" + user + "/" + id + "/" + amount);
            fetch("/api/snippet/vote/" + user + "/" + id + "/" + amount, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                mode: 'cors'
            }).then((response) => response.json())
            .then(data => {
                console.log(data);
                setVoteCount(data.votes);
                console.log(data.previousVotes);
                onVote(data.previousVotes);
            })
        }
    }

    return(
        <>
            <Tooltip title="Upvote">
                <ArrowUpwardRoundedIcon color={canVote ? "action" : "disabled"} onClick={() => handleVote(parseInt(voteCount)+1)}/>
            </Tooltip>
            <Tooltip title="Downvote">
                <ArrowDownwardRoundedIcon color={canVote ? "action" : "disabled"} onClick={() => handleVote(voteCount-1)} />
            </Tooltip>
        <p style={{color: red ? "red" : "black"}}>{voteCount}</p>
    </>
    );
}