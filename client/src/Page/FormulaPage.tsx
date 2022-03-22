import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "../Hook/UseWebSocketHook";
import commonConfig from "../../../common/src/config/config";
import loginContext from "../Context/LoginContext";
import { Typography } from "@mui/material";
import { gamesAttributes } from "../../../common/src/models/generated/games";

const FormulaPage: React.FC = () => {
  const [userData] = useContext(loginContext);
  const { gameId } = useParams();
  const [game, setGame]: [gamesAttributes, (game: gamesAttributes) => any] = useState(null);
  useWebSocket(
    // @todo Move the url elsewhere???
    // @todo Change server routes - don't use setup, but use auto-routing
    // on server and the client decides how to display the data
    `ws://localhost:5000/${commonConfig.apiBaseUrl}formula/${gameId}/setup`,
    (msg: gamesAttributes) => setGame(msg),
    {
      token: userData.jwt
    }
  );
console.log(game);
  return (
    game != null &&
      <Typography variant="h3">{game.name}</Typography>
  );
};

export default FormulaPage;
