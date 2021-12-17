import { TextField } from "@mui/material";
import { Box } from "@mui/system";

export function SnippetAdditionComponent({ onSubmit }){
    
    return(
        <Box sx={{textAlign: 'center'}}>
            <h3>Add new snippet</h3>
            <form onSubmit={onSubmit}>
                <TextField type="text" name="title" label="Title" placeholder="Title" sx={{width: 500, maxWidth: "90vw"}}/><br/>
                <TextField id="input" label="Snippet" placeholder="Code snippet" maxRows="20" sx={{ marginY: "20px", width: 500, maxWidth: "90vw"}} multiline/><br/>
                <input type="submit" /><br/>
            </form>
        </Box>
    )
}