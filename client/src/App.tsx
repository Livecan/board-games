import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginContext, { LoginContextProvider } from "./Context/LoginContext";
import LoginPage from "./Page/LoginPage";
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import FormulaPage from "./Page/FormulaPage";
import GamesOverviewPage from "./Page/GamesOverviewPage";

const App: React.FC = () => {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <LoginContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <LoginContext.Consumer>
            {([userData]) => (
              <Container>
                {userData == null ? (
                  <LoginPage />
                ) : (
                  <Routes>
                    <Route index element={<GamesOverviewPage />} />
                    <Route path="/formula/:gameId" element={<FormulaPage />} />
                  </Routes>
                )}
              </Container>
            )}
          </LoginContext.Consumer>
        </CssBaseline>
      </ThemeProvider>
    </LoginContextProvider>
  );
};

export default App;
