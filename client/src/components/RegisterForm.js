import { useState } from "react";

export function RegisterForm(){
    const [error, setError] = useState(null);

    const userRegister = (e) => {
        e.preventDefault();
        setError(null);
        let content = JSON.stringify({"name": e.target.name.value, "email": e.target.email.value, "password": e.target.password.value});
        console.log(content);
        fetch("/users/api/register", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: content,
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
        <div>
            <h3>Register</h3>
            <p>{error}</p>
            <form onSubmit={userRegister}>
                <input type="text" placeholder="username" name="name"></input>
                <input type="email" placeholder="Email" name="email"></input>
                <input type="password" placeholder="Password" name="password"></input>
                <input type="submit" />
            </form>
        </div>
    );
}