import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Stack } from "@mui/material";
import GamesList from "../Component/GamesList";
import commonConfig from "../../../common/src/config/config";
import LoginContext from "../Context/LoginContext";

const GamesOverviewPage = () => {
  const navigate = useNavigate();
  const [userData] = useContext(LoginContext);

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
    }
  };

  const createNewFormulaGame = () => {
    axios.post(
      `${commonConfig.apiBaseUrl}formula/add`,
      {},
      {
        headers: {
          Authorization: userData.jwt,
          accept: "application/json",
        },
      }

    ).then(response => navigateToGame(response.data.id, response.data.gameTypeId));
  }

  return (
    <Stack sx={{height: "100%"}}>
      {userData != null &&
        <Button onClick={createNewFormulaGame}>New Formula D Game</Button>
      }
      <GamesList
        onJoinGame={({
          gameId,
          gameTypeId,
        }: {
          gameId: number;
          gameTypeId: number;
        }) => navigateToGame(gameId, gameTypeId)}
      />
    </Stack>
  );
};

export default GamesOverviewPage;
