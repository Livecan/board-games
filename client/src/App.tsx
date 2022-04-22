import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import LoginContext from "./Context/LoginContext";
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
  const [userData] = useContext(LoginContext);

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  //  useEffect(() => {login({jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJMaXZlY2FuIiwiaWF0IjoxNjQ4MDUyMzYyLCJleHAiOjE2NDkyNjE5NjJ9.6KLChLM1J_mHHEg5LHDlWlGcnLbR3GqHAfTsQpYaP0Y", user: {name: "Livecan", id: 1}})}, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
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
      </CssBaseline>
    </ThemeProvider>
  );
};

export default App;
