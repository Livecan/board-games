import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginContext from "./Context/LoginContext";
import useLogin from "./Hook/UseLoginHook";
import LoginPage from "./Page/LoginPage";
import GamesList from "./Component/GamesList";
import FormulaPage from "./Page/FormulaPage";

const App: React.FC = () => {
  const [userData, login, logout] = useLogin(null);
  const navigate = useNavigate();

  const navigateToGame = (gameId: number, gameTypeId: number) => {
    switch (gameTypeId) {
      // @todo Move hard-coded value into common enums
      case (2):
        navigate(`/formula/${gameId}`);
        break;
      default:
        throw new ReferenceError(`GameType with id ${gameTypeId} not recognized`);
        break;
    }
  }

  return (
    <LoginContext.Provider value={[userData, login, logout]}>
      {userData == null ? (
        <LoginPage />
      ) : (
        <Routes>
          <Route index element={
            <GamesList onJoinGame={
              ({gameId, gameTypeId}: {gameId: number, gameTypeId: number}) =>
                navigateToGame(gameId, gameTypeId)
            }
          />} />
          <Route path="/formula/:gameId" element={<FormulaPage />} />
        </Routes>
      )}
    </LoginContext.Provider>
  );
};

export default App;
