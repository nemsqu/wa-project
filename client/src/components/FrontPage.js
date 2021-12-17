import { Button } from '@mui/material';
import { Box } from '@mui/system';
import '../App.css';
import { Addition } from './SnippetAdditionComponent';
import { ListComponent } from './ListComponent';
import { useState, useEffect } from 'react';


export function FrontPage({login}){

    const token = localStorage.getItem("token");
    const [snippets, setSnippets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if(localStorage.getItem("token")){
            login(true);
        }
        fetch("/api/snippets")
        .then(response => {
            console.log(response);
            return response.json()})
        .then(data => {
            console.log(data);
            setSnippets(data);
            setLoading(false);
        })
    }, [])

    console.log(loading);

    const onSampleClick = async (id) => {
        window.location.href="/snippet/" + id;
    }
    
    return(
        <Box sx={{textAlign: 'center'}}>
            {token && <Button sx={{marginBottom: "10px"}} variant="contained" onClick={() => window.location.href = "/add_snippet"}>Add new snippet</Button>}
            {loading && <p>Loading...</p>}
            {!loading && <ListComponent list={snippets} title="Browse code snippets" onClick={onSampleClick} loading={loading} type={"code"} placeholder="Search through snippets" />}
        </Box>
    )
}