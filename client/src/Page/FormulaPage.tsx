import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import loginContext from "../Context/LoginContext";
import useWebSocket from "../Hook/UseWebSocketHook";
import commonConfig from "../../../common/src/config/config";
import FormulaSetup from "../Component/FormulaSetup";
import FormulaGamePlay from "../Component/FormulaGamePlay";
import { gamesStateIdEnum as gameStateIdE } from "../../../common/src/models/enums/game";
import { fullFormulaGame } from "../../../common/src/models/interfaces/formula";

const FormulaPage = () => {
  const [userData] = useContext(loginContext);
  const gameId = new Number(useParams().gameId).valueOf();
  const [game, setGame] = useState<fullFormulaGame>(null);

  useWebSocket(
    // @todo Move the url elsewhere???
    // @todo Change server routes - don't use setup, but use auto-routing
    // on server and the client decides how to display the data
    `ws://localhost:5000/${commonConfig.apiBaseUrl}formula/${gameId}`,
    (msg: fullFormulaGame) => setGame(msg),
    {
      token: userData.jwt,
    }
  );

  return (
    game != null &&
    {
      [gameStateIdE.new]: <FormulaSetup gameId={gameId} game={game} />,
      [gameStateIdE.started]: <FormulaGamePlay gameId={gameId} game={game} />,
      [gameStateIdE.finished]: (
        <div>Game finished; need to close the WebSocket</div>
      ),
    }[game.gameStateId]
  );
};

export default FormulaPage;
