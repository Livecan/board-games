import { useState } from "react";

interface UserData {
  jwt: string;
  user: string;
}

const useLogin = ({defaultValue = null, onLogin}: {defaultValue?: UserData | null, onLogin?: (userData: UserData) => void}) => {
  const [userData, setUserData]: [
    UserData | null,
    React.Dispatch<UserData | null>
  ] = useState(defaultValue);

  const login = (userData: UserData) => { setUserData(userData); onLogin?.(userData) };
  const logout = () => setUserData(null);
  return [userData, login, logout];
};

export default useLogin;
