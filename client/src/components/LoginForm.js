import { useState } from "react";
import { useUpdateUser } from '../context/AuthContext';


export function LoginForm(){
    const [error, setError] = useState(null);
    const updateUser = useUpdateUser();

    const userLogin = (e) => {
        e.preventDefault();
        setError(null);
        fetch("/users/api/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({"email": e.target.email.value, "password": e.target.password.value}),
          mode: 'cors'
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
          if(data.token) {
              console.log("moi");
              //onSuccess(data.token);
              //setContext(currentValues => ({...currentValues, token: data.token}));
              localStorage.setItem("token", data.token);
              updateUser();
              //getIndex(data.token);
              //window.location.href = '/';
              //console.log(localStorage.getItem("token"));
              
          } else {
              console.log("wtf");
              if(data.error) {
                setError("Invalid credentials");
              } else {
                setError("Something went wrong.");
              }
          }
        })
      }

    return(
        <div>
            <h3>Login</h3>
            <p>{error ? error : ""}</p>
            <form onSubmit={userLogin}>
                <input type="email" placeholder="Email" name="email"></input>
                <input type="password" placeholder="Password" name="password"></input>
                <input type="submit" />
            </form>
        </div>
    );
}