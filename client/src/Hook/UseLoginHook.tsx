import { useState } from "react";

const useLogin = (defaultValue) => {
  const [userData, setUserData] = useState(defaultValue);

  const login = (userData) => setUserData(userData);
  const logout = () => setUserData(null);
  return [
    userData,
    login,
    logout
  ]
}

export default useLogin;
