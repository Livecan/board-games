import { Box, Grid, Theme, useMediaQuery } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  fullFormulaGame,
  fullTrack,
} from "../../../common/src/models/interfaces/formula";
import commonConfig from "../../../common/src/config/config";
import LoginContext from "../Context/LoginContext";

const getCarImageSrc = (carIndex: number) =>
  `${Math.trunc(carIndex / 2) + 1}${carIndex % 2 == 0 ? "a" : "b"}.png`;

const FormulaGamePlay = ({
  gameId,
  game,
}: {
  gameId: number;
  game: fullFormulaGame;
}) => {
  const [userData] = useContext(LoginContext);
  const [track, setTrack] = useState<fullTrack>(null);
  // @todo Create MO interface
  const [availableMOs, setAvailableMOs] = useState(null);
  const [selectedMO, setSelectedMO] = useState(null);

  useEffect(() => {
    axios
      .get(`/${commonConfig.apiBaseUrl}formula/${gameId}/track`)
      .then((res) => setTrack(res.data));
  }, [game.foTrackId]);

  useEffect(() => {
    // @todo If my car is next and it's my turn to pick next position,
    // first need, to load next available move options
    const nextCar = game.foCars.find((car) => car.id == game.lastTurn.foCarId);
    if (nextCar.userId == userData.user.id && game.lastTurn.roll != null) {
      axios
        .get(
          `/${commonConfig.apiBaseUrl}formula/${gameId}/car/${nextCar.id}/moveOptions`,
          {
            headers: {
              Authorization: userData.jwt,
              accept: "application/json",
            },
          }
        )
        .then((response) => setAvailableMOs(response.data));
    }
  }, [game.foCars]);

  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  return (
    <Grid container>
      <Grid item xs={12} sm={9} height="100vh" overflow="auto">
        {track != null && (
          <Box sx={{ position: "relative" }} width={isMd ? "300%" : "400%"}>
            <Box
              component="img"
              src="/resources/formula/tracks/monaco.jpg"
              width="100%"
            />
            {game.foCars.map((car, index) => {
              const position = track.foPositions.find(
                (position) => position.id == car.foPositionId
              );
              return (
                <Box
                  key={index}
                  component="img"
                  src={`/resources/formula/cars/${getCarImageSrc(index)}`}
                  width="0.8%"
                  height="2%"
                  position="absolute"
                  left={`${position.posX / 1000 - 0.4}%`}
                  top={`${position.posY / 1000 - 1}%`}
                  sx={{
                    transition: "opacity .5s",
                    transform: `rotate(${position.angle - Math.PI / 2}rad)`,
                    ":hover": {
                      opacity: 0.2,
                    },
                  }}
                />
              );
            })}
            {availableMOs?.map((mo, index) => {
              //@todo Refactor with the car icons and save space
              const position = track.foPositions.find(
                (position) => position.id == mo.foPositionId
              );
              return (
                <Box
                  key={index}
                  component="img"
                  src={`/resources/formula/move-options/car-outline-${
                    mo == selectedMO
                      ? "selected"
                      : mo.foDamages.some((damage) => damage.wearPoints > 0)
                      ? "damage"
                      : "nodamage"
                  }.svg`}
                  height="1.8%"
                  width="1.2%"
                  position="absolute"
                  left={`${position.posX / 1000 - 0.6}%`}
                  top={`${position.posY / 1000 - 0.9}%`}
                  sx={{
                    transform: `rotate(${position.angle}rad)`,
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedMO(mo)}
                />
              );
            })}
          </Box>
        )}
      </Grid>
      <Grid item xs={12} sm={3}>
        <div>Control panel</div>
      </Grid>
    </Grid>
  );
};

export default FormulaGamePlay;
