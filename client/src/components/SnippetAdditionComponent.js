import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

export function SnippetAdditionComponent({ onSubmitCode }){

    const [inputs, setInputs] = useState({title: "", input: ""});

    const handleChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value});
    }

    const onSubmit = (e) => {
        e.preventDefault();
        onSubmitCode(inputs);
    }
    
    return(
        <Box sx={{textAlign: 'center'}}>
            <h3>Add new snippet</h3>
            <form onSubmit={onSubmit}>
                <TextField onChange={handleChange} type="text" name="title" label="Title" placeholder="Title" sx={{width: 500, maxWidth: "90vw"}} required/><br/>
                <TextField onChange={handleChange} name="input" label="Snippet" placeholder="Code snippet" maxRows="20" sx={{ marginY: "20px", width: 500, maxWidth: "90vw"}} multiline required/><br/>
                <Button variant="outlined" onClick={onSubmit}>Add</Button><br/>
            </form>
        </Box>
    )
}