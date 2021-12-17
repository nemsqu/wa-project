import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function EditCodeSnippetComponent(){
    const { id } = useParams();
    const [snippet, setSnippet] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const getSnippet = async () =>{
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
            setLoading(false);
        }
        getSnippet();
    }, [id])

    const handleChange = (e) => {
        setSnippet({...snippet, [e.target.name]: e.target.value});
    }

    const onSubmit = () => {
        const token = localStorage.getItem("token");
        fetch("/api/snippet/" + id, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({"content": snippet.content, "title": snippet.title}),
            mode: 'cors'
          }).then((response) => response.json())
          .then(data => {
              if(data.success){
                  setMessage(data.success);
                  window.scrollTo(0, 0);
              } else {
                  setMessage("Something went wrong.");
                  window.scrollTo(0, 0);
              }
          })
    }

    return(<>
        <ArrowBackIcon onClick={() => window.location.href = "/snippet/" + id} />
            <Box sx={{textAlign: 'center'}}>
                <h3>Edit snippet</h3>
                {!loading && <form onChange={handleChange}>
                    <p>{message}</p>
                    <TextField type="text" name="title" label="Title" sx={{width: 500, maxWidth: "90vw"}}  defaultValue={snippet.title} margin="normal"/><br/>
                    <TextField name="content" label="snippet" defaultValue={snippet.content} maxRows="20" sx={{ width: 500, maxWidth: "90vw"}} margin="normal" multiline></TextField><br/>
                    <Button variant="outlined" onClick={onSubmit}>Save</Button>
                </form>}
            </Box>
        </>
    )
}