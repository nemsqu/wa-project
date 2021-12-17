import { Button } from '@mui/material';
import { Box } from '@mui/system';
import '../App.css';
import { ListComponent } from './ListComponent';
import { useState, useEffect } from 'react';


export function FrontPageComponent({login}){

    const token = localStorage.getItem("token");
    const [snippets, setSnippets] = useState([]);
    const [loading, setLoading] = useState(true);

    //get snippets the first time
    useEffect(() => {
        setLoading(true);
        if(localStorage.getItem("token")){
            login(true);
        }
        fetch("/api/snippets")
        .then(response => {
            return response.json()})
        .then(data => {
            if(!data.error){
                setSnippets(data);
                setLoading(false);
            }
        })
    }, [])


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