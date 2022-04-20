import { Grid, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  fullFormulaGame,
  fullTrack,
  moveOption,
} from "../../../common/src/models/interfaces/formula";
import commonConfig from "../../../common/src/config/config";
import LoginContext from "../Context/LoginContext";
import FormulaGameBoard from "./FormulaGameBoard";

const FormulaTrackPanel = ({ game }: { game: fullFormulaGame }) => {
  const [userData] = useContext(LoginContext);
  const [track, setTrack] = useState<fullTrack>(null);
  const [availableMOs, setAvailableMOs] = useState(null);

  useEffect(() => {
    axios
      .get(`/${commonConfig.apiBaseUrl}formula/${game.id}/track`)
      .then((res) => setTrack(res.data));
  }, [game.foTrackId]);

  useEffect(() => {
    const nextCar = game.foCars.find((car) => car.id == game.lastTurn.foCarId);
    if (nextCar.userId == userData.user.id && game.lastTurn.roll != null) {
      axios
        .get(
          `/${commonConfig.apiBaseUrl}formula/${game.id}/car/${nextCar.id}/moveOptions`
        )
        .then((response) => setAvailableMOs(response.data));
    } else {
      setAvailableMOs(null);
    }
  }, [game.foCars]);

  const selectMo = (moveOption: moveOption) => {
    const nextCar = game.foCars.find((car) => car.id == game.lastTurn.foCarId);
    axios.post(
      `/${commonConfig.apiBaseUrl}formula/${game.id}/car/${nextCar.id}/position`,
      // @todo Change MOs - remove the original car position from MOs when they come from server already and then no need to use filter here
      moveOption.traverse.filter(
        (positionId) => positionId != nextCar.foPositionId
      )
    );
  };

  return (
    track != null && (
      <FormulaGameBoard
        game={game}
        track={track}
        availableMOs={availableMOs}
        onSelectMO={selectMo}
      />
    )
  );
};

const FormulaGamePlay = ({
  gameId,
  game,
}: {
  gameId: number;
  game: fullFormulaGame;
}) => (
  <Grid container>
    <Grid item xs={12} sm={9} height="100vh" overflow="auto">
      <FormulaTrackPanel game={game} />
    </Grid>
    <Grid item xs={12} sm={3}>
      {/* @todo Move the following into a separate Game Panel info component */}
      <Stack>
        {game.foCars.map((car) => (
          <React.Fragment key={car.id}>
            <Typography>
              {game.gamesUsers.find((u) => (u.id = car.userId)).user.name}
            </Typography>
            <Stack direction="row">
              {[
                car.wpTire,
                car.wpGearbox,
                car.wpBrakes,
                car.wpEngine,
                car.wpChassis,
                car.wpShocks,
              ].map((wp, index) => (
                <TextField
                  key={index}
                  // @todo This much styling here in code looks like an antipattern and might clash with other styling, think of some single source of truth
                  inputProps={{
                    style: {
                      paddingLeft: 0,
                      paddingRight: 0,
                      textAlign: "center",
                    },
                  }}
                  value={wp}
                />
              ))}
            </Stack>
          </React.Fragment>
        ))}
      </Stack>
    </Grid>
  </Grid>
);

export default FormulaGamePlay;
