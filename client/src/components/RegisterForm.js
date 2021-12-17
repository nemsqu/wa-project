import { useState } from "react";
import { Button, TextField, Box } from "@mui/material";

export function RegisterForm(){
    const [error, setError] = useState(null);
    const [inputs, setInputs] = useState({name: "", email: "", password: ""});

    const handleChange = (e) => {
      setError(null);
      setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const userRegister = (e) => {
        e.preventDefault();
        setError(null);
        
        fetch("/users/api/register", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(inputs),
          mode: 'cors'
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.passwordError);
          if(data.nameError) {
            setError(data.nameError);
          }else if(data.passwordError){
            setError(data.passwordError);
          }else if(data.emailError){
            setError(data.uniqueError);
          }else {
              window.location.href = '/login';
          }
        })
      }
    console.log(error);
    return(
        <Box sx={{m: "10px"}}>
            <h3>Register</h3>
            <p>{error}</p>
            <form onSubmit={userRegister}>
                <TextField type="text" onChange={handleChange} placeholder="username" name="name" sx={{mx: "10px", my: "5px"}} required></TextField>
                <TextField type="email" onChange={handleChange} placeholder="Email" name="email" sx={{mx: "10px", my: "5px"}} required></TextField>
                <TextField type="password" onChange={handleChange} placeholder="Password" name="password" sx={{mx: "10px", my: "5px"}} required></TextField>
                <Button variant="outlined" sx={{mx: "10px", my: "15px"}} onClick={userRegister}>Register</Button>
            </form>
        </Box>
    );
}