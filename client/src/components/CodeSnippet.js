import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { ListComponent } from "./ListComponent";
import { Box } from "@mui/system";
import { CommentAdditionComponent } from "./CommentAdditionComponent";
import { CodeHiglightComponent } from "./CodeHighlightComponent";
import EditIcon from '@mui/icons-material/Edit';
import { Tooltip, Typography } from "@mui/material";
import { useUser } from '../context/AuthContext';


export function CodeSnippet(){
    let { id } = useParams();
    const [snippet, setSnippet] = useState("");
    const [comments, setComments] = useState([{}]);
    const [loading, setLoading] = useState([true]);
    const token = localStorage.getItem("token");
    const [addingComment, setAddingComment] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const user = useUser();

    useEffect(() => {
        if(snippet){
            if(user.name === snippet.authorName){
                setCanEdit(true);
            } else {
                setCanEdit(false);
            }
        }
    }, [snippet, user])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const snippetsResponse = await fetch("/api/snippet/" + id);
            let data;
            try{
                data = await snippetsResponse.json();
            } catch (e) {
                console.log(e);
                return;
            }
            setSnippet(data);
            const commentsResponse = await fetch("/api/snippet/" + id + "/comments"); //siirrä tää listaan, että se haetaan aina sivua vaihtaessa tai siirrä sivuunvaihtoon liittyvä chekki tänne
            try{
                data = await commentsResponse.json();
            } catch (e) {
                console.log(e);
                return;
            }
            setComments(data);
            setLoading(false);
        }
        fetchData();
    }, [id])

    const onSubmit = (comment) => {
        setAddingComment(true);
        let newComment = {"authorID": user.id, "authorName": user.name, "content": comment, "snippet": id, "_id": ""};
        const token = localStorage.getItem("token");
        fetch("/api/comment/" + id, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(newComment),
            mode: 'cors'
        }).then((response) => response.json())
        .then(data => {
            setComments([...comments, {...newComment, "_id": data.id}]);
            setAddingComment(false);
        })
    }

    return(
        <>
                {!loading && <><Box sx={{ width: '100%', textAlign: 'center'}}>
                    <h3>{snippet.title}</h3>
                    <Tooltip title="View profile">
                        <p onClick={() => window.location.href = "/user/" + snippet.authorName}>Author: {snippet.authorName}</p>
                    </Tooltip>
                    <h3></h3>
                    </Box>
                    <Box sx={{maxWidth: '100vw', height: '100%', marginBottom: "50px"}}>
                       <CodeHiglightComponent code={snippet.content}/> 
                       {canEdit && <>
                       <Tooltip title="Edit snippet">
                            <EditIcon sx={{margin: "20px"}} onClick={() => window.location.href = "/snippet/" + id + "/edit"}/> 
                        </Tooltip>
                       </>}
                       {snippet.edited && <Typography color="#A9A9A9" sx={{ fontSize: "small"}}>Edited {snippet.edited}</Typography>}
                    </Box> 
                </>}
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                    {loading && <p>Loading...</p>}
                    {!loading && !addingComment &&<ListComponent loading={loading} list={comments} title="Comments" type={"comment"} placeholder="Search through comments"/>}
                    {token && <CommentAdditionComponent placeholder="Add new comment" onSubmit={onSubmit}/>}
                </Box>
        </>
        
    );
}