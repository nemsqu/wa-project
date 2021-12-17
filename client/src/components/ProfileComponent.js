import { useEffect, useState, useContext } from "react";
import jwt_decode from "jwt-decode";
import { Box } from "@mui/system";
import { Button, Divider, TextField, Avatar, Stack } from "@mui/material";
import { useUpdateUser, useUser } from "../context/AuthContext";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

//TODO: add authentication check
export function ProfileComponent(){
    const [userData, setUserData] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [confirmError, setConfirmError] = useState(null);
    const [avatarSrc, setAvatarSrc] = useState("");
    const user = useUser();
    const updateUser = useUpdateUser();
    if(localStorage.getItem("token") === null){
        updateUser();
    }

    useEffect(() => {
        if(!user){
            return;
        }
        console.log(user);
        fetch("/users/api/" + user.name)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setUserData(data);
        })
    }, [user])

    const updateUserData = (e) => {
        e.preventDefault();
        console.log(e.target.avatarUpload.files[0]);
        const formData = new FormData();
        formData.append("name", e.target.name.value);
        formData.append("email", e.target.email.value);
        formData.append("bio", e.target.bio.value);
        formData.append("avatar", e.target.avatarUpload.files[0]);
        console.log(formData);
        fetch("/users/api/" + userData._id, {
            method: "POST",
            body: formData,
            mode: 'cors'
          }).then((response) => response.json())
          .then(data => {
              console.log(data);
              setSuccess(data);
            fetch("/users/api/profile/" + userData.name)
            .then(response => response.blob())
            .then(data => {
                console.log(data);
                setAvatarSrc(URL.createObjectURL(data));
                setUserData({...userData, "email": e.target.email.value, "bio": e.target.bio.value});
                updateUser();
            })
        })
    }

    const changePassword = (e) => {
        setConfirmError(false);
        setError(false);
        e.preventDefault();
        console.log(userData._id);
        fetch("/users/api/check/password", {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({"id": userData._id, "password": e.target.oldpassword.value}),
            mode: 'cors'
          }).then((response) => response.json())
          .then(data => {
              if(data.error){
                  setError(data.error);
              } else {
                  const newPassword = e.target.newpassword.value;
                  if(newPassword.localeCompare(e.target.confirmpassword.value) != 0){
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
                    <TextField id="name" label="Username" margin="normal" defaultValue={userData.name} required></TextField><br/>
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