import { Button, TextField, Box } from "@mui/material";
import { useState } from "react";


export function LoginFormComponent({ updateUser}){
    const [error, setError] = useState(null);
    const [inputs, setInputs] = useState({name: "", password: ""});

    const handleChange = (e) => {
      setError(null);
      setInputs({...inputs, [e.target.name]: e.target.value});
    }

    const userLogin = (e) => {
        e.preventDefault();
        setError(null);
        fetch("/users/api/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(inputs),
          mode: 'cors'
      })
      .then((response) => response.json())
      .then((data) => {
          if(data.token) {
              localStorage.setItem("token", data.token);
              updateUser();
              window.location.href = '/';
          } else {
              if(data.error) {
                setError("Invalid credentials");
              } else {
                setError("Something went wrong.");
              }
          }
        })
      }

    return(
        <Box sx={{m: "10px"}}>
            <h3>Login</h3>
            <p>{error ? error : ""}</p>
            <form onSubmit={userLogin}>
                <TextField type="text" onChange={handleChange} label="Username" sx={{mx: "10px", my: "5px"}}placeholder="Username" name="name"></TextField>
                <TextField type="password" onChange={handleChange} label="Password" sx={{mx: "10px", my: "5px"}} placeholder="Password" name="password"></TextField>
                <Button onClick={userLogin} sx={{mx: "10px", my: "15px"}} variant="outlined">Login</Button>
            </form>
        </Box>
    );
}