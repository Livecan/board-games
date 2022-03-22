import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "../Hook/UseWebSocketHook";
import commonConfig from "../../../common/src/config/config";
import loginContext from "../Context/LoginContext";
import { Box, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { gamesAttributes } from "../../../common/src/models/generated/games";
import { foCarsAttributes } from "../../../common/src/models/generated/foCars";
import { gamesUsersAttributes } from "../../../common/src/models/generated/gamesUsers";
import { foGamesAttributes } from "../../../common/src/models/generated/foGames";
import { foDamages } from "../../../common/src/models/generated/foDamages";
import { usersAttributes } from "../../../common/src/models/generated/users";

interface fullGame extends gamesAttributes, foGamesAttributes {
  foCars: (foCarsAttributes & {foDamages: foDamages[]})[];
  gamesUsers: (gamesUsersAttributes & {user: usersAttributes})[];
};

const FormulaSetupPage: React.FC = () => {
  const [userData] = useContext(loginContext);
  const { gameId } = useParams();
  const [game, setGame]: [fullGame, (game: fullGame) => any] = useState(null);
  useWebSocket(
    // @todo Move the url elsewhere???
    // @todo Change server routes - don't use setup, but use auto-routing
    // on server and the client decides how to display the data
    `ws://localhost:5000/${commonConfig.apiBaseUrl}formula/${gameId}/setup`,
    (msg: fullGame) => setGame(msg),
    {
      token: userData.jwt
    }
  );

  return (
    game != null &&
      <Grid container>
        <Grid item xs={12} padding={2}>
          <Typography variant="h3">{game.name}</Typography>
        </Grid>
        <Grid container item xs={12}>
          {/** Car damages panel */}
          <Grid item xs={12} sm={8} padding={2}>
            <Stack spacing={2}>
              {
                game.gamesUsers.map((gameUser) =>
                  <Paper key={gameUser.userId} elevation={4} sx={{padding: 2}}>
                    <Typography variant="h6">{`${gameUser.user.name}'s cars`}</Typography>
                    <Stack spacing={2} padding={2}>
                    {
                      game.foCars.filter(car => car.userId == gameUser.userId).slice(0, game.carsPerPlayer).map(car =>
                        <Paper key={car.id} elevation={8} sx={{padding: 2, width: "fit-content"}}>
                          <Box sx={{flexWrap: "wrap"}} >
                          {
                            car.foDamages.map(damage =>
                              // @todo Use validation rules to avoid invalid numbers, validation test on backend
                              // @todo Only allow the user to change his/her own cars' damages
                              <TextField key={damage.id} defaultValue={damage.wearPoints} disabled={gameUser.userId != userData.user.id}
                                sx={{margin: ".1rem"}}
                                inputProps={{style: {textAlign: "center"}}} style={{width: "4rem"}} />
                            )
                          }
                          </Box>
                        </Paper>
                      )
                    }
                    </Stack>
                  </Paper>
                )
              }
            </Stack>
          </Grid>
          {/** Game setup panel */}
          <Grid item xs={12} sm={4} padding={2}>
            <Paper sx={{padding: 2}}>
              <Stack spacing={2}>
                <Typography>Game Setup Panel</Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
  );
};

export default FormulaSetupPage;
