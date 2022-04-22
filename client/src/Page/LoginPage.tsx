import { Button, Container, TextField } from "@mui/material";
import axios from "../Utils/customAxios";
import React, { useContext, useState } from "react";
import LoginContext from "../Context/LoginContext";
import config from "../../../common/src/config/config";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, login] = useContext(LoginContext);

  const hasCredentials = username.length > 0 || password.length > 0;

  const userLogin = (username, password) => {
    axios(null)
      .post(`/${config.apiBaseUrl}login`, {
        username: username,
        password: password,
      })
      .then((response) => login(response.data));
  };

  return (
    <Container>
      <TextField
        sx={{ display: "block" }}
        title="Username"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.currentTarget.value)}
      />
      <TextField
        sx={{ display: "block" }}
        title="Password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <Button
        variant="contained"
        disabled={!hasCredentials}
        sx={{ display: "block" }}
        onClick={() => userLogin(username, password)}
      >
        Login
      </Button>
    </Container>
  );
};

export default LoginPage;
