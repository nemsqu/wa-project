import { createContext, useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext(); //context to keep values
export const AuthContextDispatch = createContext(); //context for functions that modify values


export function AuthContextProvider({ children }){

    const [user, setUser] = useState("");
    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token){
            const userID = jwt_decode(token).name;
            console.log(userID);
            fetch("/users/api/" + userID)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setUser(data);
            })
        }
    }, [])
    

    const updateUser = () => {
        console.log("haetaan");
        const token = localStorage.getItem("token");
        console.log(token);
        if(token){
            const userID = jwt_decode(token).name;
            console.log(userID);
            fetch("/users/api/" + userID)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setUser(data);
                })
        } else {
            setUser(null);
        }
    }

    
    return (
        <AuthContextDispatch.Provider value={updateUser}>
            <AuthContext.Provider value={user}>
                {children}
            </AuthContext.Provider>
        </AuthContextDispatch.Provider>
    );
};


//provide user to all the components
export function useUser() {
    const user = useContext(AuthContext);
    return user;
};

//provide update user function to all the components
export function useUpdateUser() {
    const updateUser = useContext(AuthContextDispatch);
    return updateUser;
}
