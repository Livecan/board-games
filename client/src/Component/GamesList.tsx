import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import axios from "axios";
import React, { useContext, useState } from "react";
import commonConfig from "../../../common/src/config/config";
import loginContext from "../Context/LoginContext";
import useWebSocket from "../Hook/UseWebSocketHook";

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "type", headerName: "Game", width: 150 },
  { field: "playersCount", headerName: "Players", width: 70 },
  {
    field: "actions",
    headerName: "Actions",
    renderCell: (params: GridRenderCellParams<React.Component>) => params.value,
    width: 150,
  },
];

const GamesList = (props: {
  onJoinGame?({ gameId, gameTypeId }: { gameId: number; gameTypeId: number });
}): JSX.Element => {
  const [games, setGames] = useState([]);
  const [userData] = useContext(loginContext);
  useWebSocket(
    // @todo move the url elsewhere???
    `ws://localhost:5000/${commonConfig.apiBaseUrl}game`,
    (msg: Object[]) => setGames(msg),
    {
      token: userData.jwt,
    }
  );

  const joinGame = (gameId, gameTypeId) => {
    props.onJoinGame?.({ gameId: gameId, gameTypeId: gameTypeId });
  };

  return (
    <DataGrid
      columns={columns}
      rows={games.map((game) => {
        return {
          id: game.id,
          name: game.name,
          type: game.type,
          playersCount: `${game.minPlayers ?? "-"}/${game.maxPlayers ?? "-"}`,
          actions: (
            <Button
              variant="contained"
              onClick={() => {
                axios
                  .post(
                    `/${commonConfig.apiBaseUrl}game/${game.id}/join`,
                    {}
                  )
                  .then((response) =>
                    joinGame(response.data.id, response.data.gameTypeId)
                  );
              }}
            >
              Join
            </Button>
          ),
        };
      })}
    />
  );
};

export default GamesList;
