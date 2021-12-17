import { createContext, useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext(); //context to keep values
export const AuthContextDispatch = createContext(); //context for functions that modify values


export function AuthContextProvider({ children }){

    const [user, setUser] = useState("");

    //set user at the beginning if still logged in
    /*useEffect(() => {
        const token = localStorage.getItem("token");
        if(token){
            const userID = jwt_decode(token).name;
            fetch("/users/api/" + userID)
                .then(response => response.json())
                .then(data => {
                    setUser(data);
            })
        }
    }, [])*/
    

    const updateUser = () => {
        const token = localStorage.getItem("token");
        if(token){
            const userID = jwt_decode(token).name;
            console.log(userID);
            fetch("/users/api/" + userID)
                .then(response => response.json())
                .then(data => {
                    setUser(data);
                })
        } else {
            setUser(null);
        }
    }

    //provide a way for other components to access methods and values
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
