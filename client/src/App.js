import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FrontPage }from './components/FrontPage'
import { My404Component } from './components/My404Component';
import { ListComponent } from './components/ListComponent';
import { Header } from './components/Header';
import { useState, useEffect } from 'react';
import { CodeSnippet } from './components/CodeSnippet';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { SnippetAdditionComponent } from './components/SnippetAdditionComponent';
import jwt_decode from "jwt-decode";
import { ProfileComponent } from './components/ProfileComponent';
import { ViewProfileComponent } from './components/ViewProfileComponent';
import { EditCodeSnippetComponent } from './components/EditCodeSnippetComponent';
import { useUpdateUser, useUser } from './context/AuthContext';

function App() {
  //const {token, setToken} = useContext(AuthContext);
  //const setToken = useToggleLoggedIn;
  const [snippets, setSnippets] = useState([]);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const updateUser = useUpdateUser();
  const [loggedin, setLoggedin] = useState(false);
  let user = useUser(); 

  useEffect(() => {
    setLoggedin(user);
  }, [user])

  const logout = () => {
    console.log("loging out");
    if(window.location.href = "/edit/profile"){
      window.location.href = "/"
    }
    localStorage.removeItem("token");
    updateUser();
  }


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
        const response = await fetch("/api/snippets");
        let data;
        try{
            data = await response.json();
        } catch (e) {
            console.log(e);
            return;
        }
        console.log(data);
        setSnippets(data);
        setLoading(false);
    }
    fetchData();
}, [])

  const onSubmitCode = (e) => {
    e.preventDefault();
    console.log(e.target.input.value);
    console.log("submitting")
    fetch("/api/snippet", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({"authorID": user.id, "authorName": user.name, "content": e.target.input.value, "title": e.target.title.value}),
      mode: 'cors'
    }).then((response) => {
      console.log(response)
      setAmount(amount + 1);})
      window.location.href = "/";
  }


  return (
    <Router>
      <Header title={"Code snippet app"} onLogout={logout} loggedin={loggedin} />
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/add_snippet" element={<SnippetAdditionComponent onSubmit={onSubmitCode} loading={loading}/>} />
        <Route path="/list" element={<ListComponent list={snippets} />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/snippet/:id" element={<CodeSnippet user={user} />} />
        <Route path="/snippet/:id/edit" element={<EditCodeSnippetComponent user={user} />} />
        <Route path="/edit/profile" element={<ProfileComponent />}/>
        <Route path="/user/:name" element={<ViewProfileComponent />}/>
        <Route path="*" element={<My404Component />} />
      </Routes>
    </Router>
  );
}

export default App;
