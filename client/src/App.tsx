import React from "react";
import LoginContext from "./Context/LoginContext";
import useLogin from "./Hook/UseLoginHook";
import LoginPage from "./Page/LoginPage";

const App: React.FC = () => {
  const [userData, login, logout] = useLogin(null);

  return (
    userData == null &&
    <LoginContext.Provider value={[userData, login, logout]}>
      <LoginPage />
    </LoginContext.Provider>
  );
}

export default App;
