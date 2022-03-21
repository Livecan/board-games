import { useState } from "react";

interface UserData {
  jwt: string;
  user: string;
}

const useLogin = (defaultValue) => {
  const [userData, setUserData]: [
    UserData | null,
    React.Dispatch<UserData | null>
  ] = useState(defaultValue);

  const login = (userData: UserData) => setUserData(userData);
  const logout = () => setUserData(null);
  return [userData, login, logout];
};

export default useLogin;
