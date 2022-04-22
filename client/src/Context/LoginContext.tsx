import React, { useState } from "react";
import { createContext } from "react";

interface UserData {
  jwt: string;
  user: {
    name: string;
    id: number;
  };
}

const LoginContext =
  createContext<
    [
      userData: UserData,
      login: (userData: UserData) => void,
      logout: () => void
    ]
  >(null);

const LoginContextProvider = (props: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(null);
  const login = (userData) => setUserData(userData);
  const logout = () => setUserData(null);

  return (
    <LoginContext.Provider value={[userData, login, logout]}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
export { LoginContextProvider };
