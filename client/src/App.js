import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FrontPageComponent }from './components/FrontPageComponent'
import { My404Component } from './components/My404Component';
import { ListComponent } from './components/ListComponent';
import { HeaderComponent } from './components/HeaderComponent';
import { useState, useEffect } from 'react';
import { CodeSnippetComponent } from './components/CodeSnippetComponent';
import { LoginFormComponent } from './components/LoginFormComponent';
import { RegisterFormComponent } from './components/RegisterFormComponent';
import { SnippetAdditionComponent } from './components/SnippetAdditionComponent';
import { ProfileComponent } from './components/ProfileComponent';
import { ViewProfileComponent } from './components/ViewProfileComponent';
import { EditCodeSnippetComponent } from './components/EditCodeSnippetComponent';
import jwt_decode from 'jwt-decode';

function App() {

  const [snippets, setSnippets] = useState([]);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loggedin, setLoggedin] = useState(false);
  const [user, setUser] = useState(null); 

  const logout = () => {
    window.location.href = "/"
    localStorage.removeItem("token");
    setLoggedin(false);
    setUser(null);
  }

  useEffect(() => {
    if(localStorage.getItem("token")){
      setUser(jwt_decode(localStorage.getItem("token")));
    }
  }, [])


  //get snippets when app mounts and when snippets are added
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
        const response = await fetch("/api/snippets");
        let data;
        try{
            data = await response.json();
            setSnippets(data);
            setLoading(false);
            if(localStorage.getItem("token")){
              setLoggedin(true);
            }
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    }
    fetchData();
}, [amount])

  //getting data from form and sending to the database
  const onSubmitCode = (snippet) => {
    const token = localStorage.getItem("token");
    const user = jwt_decode(token);
    fetch("/api/snippet", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({"authorID": user.id, "authorName": user.name, "content": snippet.input, "title": snippet.title}),
      mode: 'cors'
    }).then((response) => {
      setAmount(amount + 1);})
      window.location.href = "/";
  }

  const updateUser = () => {
    setUser(jwt_decode(localStorage.getItem("token")));
  }


  return (
    <Router>
      <HeaderComponent title={"Code snippet app"} onLogout={logout} loggedin={loggedin} user={user} />
      <Routes>
        <Route path="/" element={<FrontPageComponent login={setLoggedin} />} />
        <Route path="/add_snippet" element={<SnippetAdditionComponent onSubmitCode={onSubmitCode} loading={loading}/>} />
        <Route path="/list" element={<ListComponent list={snippets} />} />
        <Route path="/login" element={<LoginFormComponent updateUser={updateUser} />} />
        <Route path="/register" element={<RegisterFormComponent />} />
        <Route path="/snippet/:id" element={<CodeSnippetComponent user={user} />} />
        <Route path="/snippet/:id/edit" element={<EditCodeSnippetComponent user={user} />} />
        <Route path="/edit/profile/:name" element={<ProfileComponent />}/>
        <Route path="/user/:name" element={<ViewProfileComponent />}/>
        <Route path="*" element={<My404Component />} />
      </Routes>
    </Router>
  );
}

export default App;
