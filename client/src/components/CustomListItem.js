import { ListItemText, Typography, ListItem, ListItemAvatar, Divider, TextField, Button, Tooltip} from '@mui/material';
import { CodeHiglightComponent } from './CodeHighlightComponent';
import { VoteCounter} from './VoteCounter';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import jwt_decode from 'jwt-decode';

export function CustomListItem({ listElement, onClick, type, previousVotes, onVote, toggleEditIcons, editIcons}){
    const [canEdit, setCanEdit] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [comment, setComment] = useState(listElement.content);
    const [element, setElement] = useState(listElement);
    const [edited, setEdited] = useState(listElement.edited);
    const [avatarSrc, setAvatarSrc] = useState("");
    const [canVote, setCanVote] = useState(false);
    const user = jwt_decode(localStorage.getItem("token"));
    console.log(canVote);

    useEffect(() => {
        let mounted = true;
        fetch("/users/api/profile/" + element.authorName)
            .then(response => response.blob())
            .then(data => {
                if(!data.error){
                    if(mounted){
                        setAvatarSrc(URL.createObjectURL(data));
                    }
                }
            })
        return () => {
            mounted = false;
        }
    }, [])

    useEffect(() => {
        console.log(user.id);
        console.log(element);
        if(user.name === element.authorName){
            setCanEdit(true);
        } else {
            setCanEdit(false);
        }
    }, [editMode])


    const openForEditing = () => {
        setEditMode(true);
        toggleEditIcons();
    }

    const handleChange = (e) => {
        setComment(e.target.value);
    }

    const saveComment = () => {
        const token = localStorage.getItem("token");
        fetch("/api/edit/comment/" + element._id, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({"content": comment}),
            mode: 'cors'
        }).then((response) => response.json())
        .then(data => {
            setElement(data.result);
            setEdited(data.result.edited);
            setEditMode(false);
            toggleEditIcons();
        })
    }

    useEffect(() => {
        console.log(canVote);
        if(!previousVotes){
            console.log("hep");
            setCanVote(true);
        }else{
            console.log(previousVotes);
            if(type === "comment"){
                if(previousVotes.commentVotes.filter(v => v === element._id).length === 0){
                    setCanVote(true);
                } else {
                    setCanVote(false);
                }
                console.log(canVote);
            }else{
                if(previousVotes.snippetVotes.filter(v => v === element._id).length === 0){
                    setCanVote(true);
                }else {
                    setCanVote(false);
                }
                console.log(canVote);
            }
        }
    }, [previousVotes])

    const updatePreviousVotes = () => {
        console.log("updating");
        onVote();
            if(!previousVotes){
                setCanVote(true);
            }else{
                console.log(previousVotes);
                if(type === "comment"){
                    if(previousVotes.commentVotes.filter(v => v === element._id).length === 0){
                        setCanVote(true);
                    } else {
                        setCanVote(false);
                    }
                }else{
                    if(previousVotes.snippetVotes.filter(v => v === element._id).length === 0){
                        setCanVote(true);
                    }else {
                        setCanVote(false);
                    }
                }
            }
            console.log(previousVotes);
    }

    console.log(previousVotes);

    if(type === "comment" && !editMode){
        return(<>
        <ListItem sx={{borderBottom: "black", marginBottom: "10px"}}>
            <ListItemAvatar sx={{alignItems: "flex-start"}}>
                <Avatar src={avatarSrc} variant="circular">
                    <AccountCircleIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={
                <>
                    <Typography sx={{ display: 'block', whiteSpace: "pre-wrap", wordWrap: "break-word" }} component="span" variant="body2" color="text.primary">{comment}</Typography>
                </>
                } secondary={
                    <Tooltip title="View profile" position="absolute">
                        <Typography component="span" onClick={() => window.location.href = "/user/" + element.authorName} sx={{ fontSize: "small"}}>{"By " + element.authorName}</Typography>
                    </Tooltip>}/>
            {element.edited && <Typography component="span" color="#A9A9A9" sx={{ fontSize: "0.6em", marginRigth: "20vw"}}>Edited {edited}</Typography>}
            {canEdit && editIcons && <EditIcon onClick={openForEditing} />}
            <VoteCounter votes={element.votes} id={element._id} canVote={canVote} onVote={updatePreviousVotes} type={type} setCanVote={setCanVote} />
        </ListItem >
        <Divider variant="inset" />
        </>)
    } else if(type === "comment" && editMode){
        return(<>
            <ListItem sx={{borderBottom: "black", marginBottom: "5px", textAlign: "center"}}>
                <TextField id="comment" onChange={handleChange} type="text" name="input" defaultValue={element.content} minRows={3} maxRows={3} multiline sx={{margin: "10px", width: "300px"}}></TextField>
                <span/>
                <Button variant="outlined" onClick={saveComment}>Save</Button>
            </ListItem >
            <Divider variant="inset" />
            </>)
    }else {
        return(<Box sx={{my:1, borderBottom: '1px solid grey'}}>
            <ListItem sx={{borderBottom: "black", marginBottom: "5px"}} divider>
                <ListItemAvatar sx={{alignItems: "flex-start"}}>
                    <Avatar src={avatarSrc} variant="circular">
                        <AccountCircleIcon />
                    </Avatar>
                </ListItemAvatar>
               <ListItemText primary={<>
                    <CodeHiglightComponent onClick={() => onClick(element._id)} code={element.content} /> 
                </>} />
                <Typography component="span"/>
                <VoteCounter votes={element.votes} id={element._id} canVote={canVote} onVote={updatePreviousVotes} type={type} setCanVote={setCanVote}/>
            </ListItem >
            {element.edited && <Typography color="#A9A9A9" sx={{ fontSize: "small"}}>Edited {edited}</Typography>}
            </Box>)
    }
}