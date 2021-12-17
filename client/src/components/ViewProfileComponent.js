import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export function ViewProfileComponent(){
    let { name } = useParams();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [avatarSrc, setAvatarSrc] = useState("");

    //get user infos
    useEffect(() => {
        setLoading(true);
        fetch("/users/api/avatar/" + name)
            .then(response => response.blob())
            .then(data => {
                if(!data.error){
                    setAvatarSrc(URL.createObjectURL(data));
                }
            }
        )
        fetch("/users/api/" + name)
            .then(response => response.json())
            .then(data => {
                if(!data.error){
                    setUser(data);
                }
                setLoading(false);
            }
        )

    }, [name])

    
    return (<>
    {!loading && <Stack direction="column" textAlign="center" sx={{ alignItems: "center", my: 3}}>
            <h2>{user.name}</h2>
            <Avatar component="div" src={avatarSrc} sx={{ width: "100px", height: "100px"}} variant="circular">
                <AccountCircleIcon sx={{ width: "100px", height: "100px"}} />
            </Avatar>
            <p>Member since {user.registerDate}</p>
            <p style={{whiteSpace: "pre-wrap", fontSize: "1.5em"}} margin="normal" >{user.bio}</p>
    </Stack>}
    </>)
}