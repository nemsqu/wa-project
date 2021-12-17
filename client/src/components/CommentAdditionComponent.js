import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

export function CommentAdditionComponent({onSubmit, placeholder }){
    const [comment, setComment] = useState("");

    const handleChange = (e) => {
        setComment(e.target.value);
    }

    const onClick = () => {
        onSubmit(comment);
        document.getElementById("comment").value = "";
    }

    return(
        <Box>
            <h3>Add new comment</h3>
            <TextField id="comment" onChange={handleChange} type="text" name="input" placeholder={placeholder} minRows={3} maxRows={3} multiline sx={{margin: "10px", width: "300px"}}></TextField><br/>
            <Button variant="outlined" onClick={onClick}>Submit</Button>
        </Box>
    )
}