import React from "react";
import LoginContext from "./Context/LoginContext";
import useLogin from "./Hook/UseLoginHook";
import LoginPage from "./Page/LoginPage";
import MainPage from "./Page/MainPage";

const App: React.FC = () => {
  const [userData, login, logout] = useLogin(null);

  return (
    <LoginContext.Provider value={[userData, login, logout]}>
      {userData == null ? <LoginPage /> : <MainPage />}
    </LoginContext.Provider>
  );
};

export default App;
