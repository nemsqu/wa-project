import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box } from "@mui/system";
import { Button, Divider, TextField, Avatar, Stack } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import jwt_decode from 'jwt-decode';


export function ProfileComponent(){
    const { name } = useParams();
    const [userData, setUserData] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [confirmError, setConfirmError] = useState(null);
    const [avatarSrc, setAvatarSrc] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        if(localStorage.getItem("token") != null){
            setUser(jwt_decode(localStorage.getItem("token")));
        }
        fetch("/users/api/avatar/" + name)
            .then(response => response.blob())
            .then(data => {
                if(!data.error){
                    setAvatarSrc(URL.createObjectURL(data));
                }
            }
        )
    }, [name])

    useEffect(() => {
        if(!user){
            return;
        }
        fetch("/users/api/" + user.name)
        .then(response => response.json())
        .then(data => {
            setUserData(data);
        })
    }, [user])

    const updateUserData = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("name", e.target.name.value);
        formData.append("email", e.target.email.value);
        formData.append("bio", e.target.bio.value);
        formData.append("avatar", e.target.avatarUpload.files[0]);
        
        fetch("/users/api/" + userData._id, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": "Bearer " + token
            },
            mode: 'cors'
          })
            .then((response) => response.json())
            .then(data => {
            setSuccess(data);
            fetch("/users/api/avatar/" + userData.name)
                .then(response => response.blob())
                .then(data => {
                    setAvatarSrc(URL.createObjectURL(data));
                    setUserData({...userData, "email": e.target.email.value, "bio": e.target.bio.value});
                }
            )
        })
    }

    const changePassword = (e) => {
        setConfirmError(false);
        setError(false);
        e.preventDefault();
        const token = localStorage.getItem("token");
        fetch("/users/api/check/password", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({"id": userData._id, "password": e.target.oldpassword.value}),
            mode: 'cors'
          }).then((response) => response.json())
          .then(data => {
              if(data.error){
                  setError(data.error);
              } else {
                  const newPassword = e.target.newpassword.value;
                  if(newPassword.localeCompare(e.target.confirmpassword.value) !== 0){
                      setConfirmError(true);
                  } else {
                    fetch("/users/api/update/password/" + userData._id, {
                        method: "POST",
                        headers: {
                          "Content-type": "application/json"
                        },
                        body: JSON.stringify({"password": newPassword}),
                        mode: 'cors'
                      }).then((response) => response.json())
                      .then(data => {
                          setError(data);
                      }
                    );
                  }
                  
              }
        })
    }


    return(<>
        {userData && <>
            <Stack direction="column" textAlign="center" sx={{alignItems: "center", my: 3}}>
                <h2>Profile information</h2>
                <p>{success}</p>
                <form onSubmit={updateUserData} >
                    <TextField id="name" label="Username" margin="normal" defaultValue={userData.name} required disabled></TextField><br/>
                    <TextField id="email" type="email" label="Email" margin="normal" helperText="Not visible to other users" defaultValue={userData.email} required></TextField><br/>
                    <Avatar component="div" src={avatarSrc} sx={{ width: "100px", height: "100px", mx: "auto"}} variant="circular">
                        <AccountCircleIcon sx={{ width: "100px", height: "100px"}} />
                    </Avatar><br/>
                    <input type="file" name="avatarUpload" label="Avatar" margin="normal" ></input><br/>
                    <TextField id="bio" label="Bio" margin="normal" multiline minRows="5" maxRows="5" width="110%" defaultValue={userData.bio}></TextField><br/>
                    <Button type="submit" margin="normal" variant="outlined">Save</Button><br/>
                </form>
                <br/>
               <Button variant="outlined" onClick={() => window.location.href = "/user/" + userData.name}>View profile</Button> 
            </Stack>
            <Divider variant="middle"/>
            <Box textAlign="center">
                <h4>Change Password</h4>
                <p>{error}</p>
                <form onSubmit={changePassword}>
                    <TextField id="oldpassword" label="Old Password" type="password" margin="normal" required ></TextField><br/>
                    <TextField id="newpassword" label="New Password" type="password" margin="normal" required ></TextField><br/>
                    {confirmError && <p>Passwords don't match.</p>}
                    <TextField id="confirmpassword" label="Confirm Password" type="password" margin="normal" required ></TextField><br/>
                    <Button type="submit" margin="normal" variant="outlined">Save password</Button><br/>
                </form>
            </Box>
        </>}
        </>
    )
}