import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Stack } from '@mui/material';
import { useState } from 'react';

export function SearchFieldComponent({ searchContents, placeholder }){

    const [searchInput, setSearchInput] = useState("");

    //TODO: check if enter was pressed
    const handleChange = (e) => {
        setSearchInput(e.target.value);
    }
    const onClick = (e) => {
        e.preventDefault();
        searchContents(searchInput);
        setSearchInput("");
    }

    const checkKeyDown = (e) => {
        if(e.key === 'Enter'){
            searchContents(searchInput);
            document.getElementById("search-input").value = "";
            setSearchInput("");
        }
    }

    return(
        <Stack direction="row" width={{xs: "90vw", sm: '30vw'}} margin={{xs: "auto"}} sx={{border: "1px solid grey", justifyContent: "space-between", display: 'flex'}} >
            <InputBase id="search-input" placeholder={placeholder} onChange={handleChange} onKeyDown={checkKeyDown} sx={{fontSize: "0.8em", mx: 1, width: "100%"}} />
            <SearchIcon onClick={onClick} sx={{position: "aboslute", height: "100%"}} />
        </Stack>
    )

}