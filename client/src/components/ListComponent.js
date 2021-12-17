import { List, Pagination, Box, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomListItem } from './CustomListItem';
import jwt_decode from "jwt-decode";
import { SearchFieldComponent } from './SearchFieldComponent';


export function ListComponent({ list, title, onClick, loading, type, placeholder }){
    const [fullList, setFullList] = useState(list);
    const [filteredList, setFilteredList] = useState(list);
    const [page, setPage] = useState({current: 1, max: Math.ceil(list.length/10)});
    const [subList, setSubList] = useState(list.slice(0,10));
    const [paginationNeeded, setPaginationNeeded] = useState(false);
    const [previousVotes, setPreviousVotes] = useState();
    const [editIcons, setEditIcons] = useState(true);
    const [newVotes, setNewVotes] = useState(true);
    const user = jwt_decode(localStorage.getItem("token"));

    const handleChange = (e, value) => {
        setPage({...page, current: value});
        setSubList(filteredList.slice(0+value*10-10, 10+value*10-10));
    }
    useEffect(() =>{
        setPage({...page, max: Math.ceil(list.length/10)});
        setSubList(filteredList.slice(0+(page.current-1)*10, 9+(page.current-1)*10));
    }, [loading])

    useEffect(() => {
        console.log("FIRED");
        console.log(user);
        if(user){
            fetch("/api/" + user.id + "/votes")
            .then(response => response.json())
            .then(data => {
                console.log("new list haettu ");
                setPreviousVotes(data);
            })
        }
        setFilteredList(list);
        setFullList(list);
    }, [newVotes])

    const onVote = () => {
        setNewVotes(true);
    }

    useEffect(() => {
        if(filteredList.length > 10){
            setPaginationNeeded(true);
        }else{
            setPaginationNeeded(false);
        }
        setSubList(filteredList.slice(0+(page.current-1)*10, 9+(page.current-1)*10));
    }, [filteredList])

    const toggleEditIcons = () => {
        setEditIcons(!editIcons);
    }

    const search = (text) => {
        if(text.length == 0){
            console.log("moi");
            setFilteredList(fullList);
        } else {
            text = new RegExp(text, 'i');
            setFilteredList(filteredList.filter(element => {
                console.log(element);
                return element.content.match(text)}));
        }
    }


    return(
        <>
            <Stack direction="row" sx={{justifyContent: "flex-end", }}>
                <SearchFieldComponent searchContents={search} placeholder={placeholder}/>
            </Stack>
            <h4>{title}</h4>
            <Box sx={{ width: '100%', bgcolor: 'background.paper', textAlign: 'center' }}>
                {paginationNeeded && <Pagination count={page.max} page={page.current} onChange={handleChange} sx={{textAlign: 'center', width:'100%', justifyContent: 'center', display:'flex'}}/>}
                {!loading && <List >
                    {subList.map((element) => {
                    return <CustomListItem key={element._id} onClick={onClick} listElement={element} type={type} previousVotes={previousVotes} onVote={onVote} user={user} toggleEditIcons={toggleEditIcons} editIcons={editIcons} />;
                    })}
                {type === "code" && list.length === 0 && <p>No snippets yet.</p>}
                </List>}
            </Box>
        </>
    )
}