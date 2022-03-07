import { Button, Container, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const LoginPage : React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const hasCredentials = username.length == 0 || password.length == 0;

  const login = (username, password) => {
    console.log('logging in');
    axios.post('/login', {username: username, password: password})
      .then(response => console.log(response.data));
  }

  return (
    <Container>
      <TextField sx={{display: "block"}} title="Username" placeholder="username" value={username} onChange={(e) => setUsername(e.currentTarget.value)} />
      <TextField sx={{display: "block"}} title="Password" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
      <Button disabled={hasCredentials} sx={{display: "block"}} onClick={() => login(username, password)}>Login</Button>
    </Container>
  );
}

export default LoginPage;
