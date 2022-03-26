import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginContext from "./Context/LoginContext";
import useLogin from "./Hook/UseLoginHook";
import LoginPage from "./Page/LoginPage";
import GamesList from "./Component/GamesList";
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import FormulaPage from "./Page/FormulaPage";

const App: React.FC = () => {
  const [userData, login, logout] = useLogin(null);

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const navigate = useNavigate();

  const navigateToGame = (gameId: number, gameTypeId: number) => {
    switch (gameTypeId) {
      // @todo Move hard-coded value into common enums
      case 2:
        navigate(`/formula/${gameId}`);
        break;
      default:
        throw new ReferenceError(
          `GameType with id ${gameTypeId} not recognized`
        );
        break;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LoginContext.Provider value={[userData, login, logout]}>
        <CssBaseline>
          <Container>
            {userData == null ? (
              <LoginPage />
            ) : (
              <Routes>
                <Route
                  index
                  element={
                    <GamesList
                      onJoinGame={({
                        gameId,
                        gameTypeId,
                      }: {
                        gameId: number;
                        gameTypeId: number;
                      }) => navigateToGame(gameId, gameTypeId)}
                    />
                  }
                />
                <Route path="/formula/:gameId" element={<FormulaPage />} />
              </Routes>
            )}
          </Container>
        </CssBaseline>
      </LoginContext.Provider>
    </ThemeProvider>
  );
};

export default App;
