import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginContext from "./Context/LoginContext";
import useLogin from "./Hook/UseLoginHook";
import LoginPage from "./Page/LoginPage";
import GamesList from "./Widget/GamesList";

const App: React.FC = () => {
  const [userData, login, logout] = useLogin(null);

  return (
    <LoginContext.Provider value={[userData, login, logout]}>
      {userData == null ? (
        <LoginPage />
      ) : (
        <Routes>
          <Route index element={<GamesList />} />
          <Route path="/formula" element={<p>Formula</p>} />
        </Routes>
      )}
    </LoginContext.Provider>
  );
};

export default App;
