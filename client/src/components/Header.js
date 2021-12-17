import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { AppBar, Stack } from '@mui/material';

export function Header({ title, loggedin, onLogout }){
    
    return(
        <Box sx={{ flexGrow: 1, mb: 5}}>
            <AppBar position="static">
                <Toolbar>
                    <h1 onClick={() => window.location.href = "/"} >{title}</h1>
                    <Box sx={{ flexGrow: 1 }}/>
                    {loggedin != null &&
                        <Stack direction={{xs: "column", sm: "row"}}>
                            <Button sx={{margin: "2px"}}variant="contained" onClick={() => window.location.href = "/edit/profile"}>Profile</Button>
                            <Button sx={{margin: "2px"}} variant="contained" onClick={onLogout}>Logout</Button>
                        </Stack>
                    }
                    {!loggedin && 
                    <Stack>
                        <Button variant="contained" onClick={() => window.location.href = "/login"}>{loggedin ? "Logout" : "Login"}</Button>
                        <Button variant="contained" onClick={() => window.location.href = "/register"}>{loggedin ? "" : "Register"}</Button>
                    </Stack>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    )
}